from __future__ import annotations

import json
import os
import uuid
from datetime import datetime, timezone

from aws_lambda_powertools import Logger, Metrics, Tracer
from aws_lambda_powertools.event_handler import (
    APIGatewayRestResolver,
    Response,
    content_types,
)
from aws_lambda_powertools.event_handler.exceptions import NotFoundError
from aws_lambda_powertools.metrics import MetricUnit
from aws_lambda_powertools.utilities.typing import LambdaContext
from pydantic import ValidationError

from db import ItemsTable
from models import ItemCreate, ItemResponse, ItemUpdate

# ---------------------------------------------------------------------------
# Powertools & application setup
# ---------------------------------------------------------------------------

logger = Logger()
tracer = Tracer()
metrics = Metrics(namespace="ServerlessDataAPI")
app = APIGatewayRestResolver()

TABLE_NAME = os.environ.get("TABLE_NAME", "serverless-data-api-demo")
table = ItemsTable(TABLE_NAME)

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,X-Api-Key",
}


def cors_response(status_code: int, body: dict) -> Response:
    return Response(
        status_code=status_code,
        content_type=content_types.APPLICATION_JSON,
        body=json.dumps(body, default=str),
        headers=CORS_HEADERS,
    )


# ---------------------------------------------------------------------------
# Exception handlers
# ---------------------------------------------------------------------------


@app.exception_handler(ValidationError)
def handle_validation_error(ex: ValidationError):
    return cors_response(
        422,
        {
            "error": "Validation Error",
            "details": ex.errors(),
        },
    )


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------


@app.post("/items")
@tracer.capture_method
def create_item():
    """Create a new item."""
    body = app.current_event.json_body
    validated = ItemCreate(**body)

    now = datetime.now(timezone.utc).isoformat()
    item_id = str(uuid.uuid4())

    item = {
        "id": item_id,
        "name": validated.name,
        "description": validated.description,
        "category": validated.category,
        "price": str(validated.price),
        "tags": validated.tags,
        "created_at": now,
        "updated_at": now,
    }

    table.put_item(item)
    metrics.add_metric(name="ItemCreated", unit=MetricUnit.Count, value=1)
    logger.info("Item created", extra={"item_id": item_id})

    return cors_response(201, item)


@app.get("/items")
@tracer.capture_method
def list_items():
    """Return a paginated list of items."""
    params = app.current_event.query_string_parameters or {}
    limit = int(params.get("limit", "50"))
    last_key_raw = params.get("last_key")
    last_key = json.loads(last_key_raw) if last_key_raw else None

    items, last_evaluated_key = table.list_items(limit=limit, last_key=last_key)

    body: dict = {"items": items, "count": len(items)}
    if last_evaluated_key:
        body["last_key"] = last_evaluated_key

    return cors_response(200, body)


@app.get("/items/<item_id>")
@tracer.capture_method
def get_item(item_id: str):
    """Fetch a single item by id."""
    item = table.get_item(item_id)
    if item is None:
        raise NotFoundError(f"Item {item_id} not found")
    return cors_response(200, item)


@app.put("/items/<item_id>")
@tracer.capture_method
def update_item(item_id: str):
    """Update an existing item (partial update)."""
    existing = table.get_item(item_id)
    if existing is None:
        raise NotFoundError(f"Item {item_id} not found")

    body = app.current_event.json_body
    validated = ItemUpdate(**body)

    updates: dict = {
        k: v
        for k, v in validated.model_dump(exclude_none=True).items()
    }
    # Convert price to string for DynamoDB if present
    if "price" in updates:
        updates["price"] = str(updates["price"])
    updates["updated_at"] = datetime.now(timezone.utc).isoformat()

    updated = table.update_item(item_id, updates)
    if updated is None:
        raise NotFoundError(f"Item {item_id} not found")

    metrics.add_metric(name="ItemUpdated", unit=MetricUnit.Count, value=1)
    logger.info("Item updated", extra={"item_id": item_id})

    return cors_response(200, updated)


@app.delete("/items/<item_id>")
@tracer.capture_method
def delete_item(item_id: str):
    """Delete an item."""
    table.delete_item(item_id)
    metrics.add_metric(name="ItemDeleted", unit=MetricUnit.Count, value=1)
    logger.info("Item deleted", extra={"item_id": item_id})

    return cors_response(204, {})


@app.get("/docs")
def docs():
    """Serve Swagger UI."""
    html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Serverless Data API - Docs</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css">
</head>
<body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
        SwaggerUIBundle({
            url: '/openapi.json',
            dom_id: '#swagger-ui',
            presets: [
                SwaggerUIBundle.presets.apis,
                SwaggerUIBundle.SwaggerUIStandalonePreset,
            ],
            layout: 'BaseLayout',
        });
    </script>
</body>
</html>"""
    return Response(
        status_code=200,
        content_type=content_types.TEXT_HTML,
        body=html,
        headers=CORS_HEADERS,
    )


@app.get("/openapi.json")
def openapi_spec():
    """Return the OpenAPI specification as JSON."""
    import yaml  # lazy import — only used on this cold path

    spec_path = os.path.join(os.path.dirname(__file__), "..", "openapi.yaml")
    try:
        with open(spec_path) as f:
            spec = yaml.safe_load(f)
    except FileNotFoundError:
        # Fallback: minimal inline spec
        spec = {
            "openapi": "3.1.0",
            "info": {"title": "Serverless Data API", "version": "1.0.0"},
            "paths": {},
        }

    return Response(
        status_code=200,
        content_type=content_types.APPLICATION_JSON,
        body=json.dumps(spec, default=str),
        headers=CORS_HEADERS,
    )


# ---------------------------------------------------------------------------
# Lambda entry point
# ---------------------------------------------------------------------------


@logger.inject_lambda_context
@tracer.capture_lambda_handler
@metrics.log_metrics(capture_cold_start_metric=True)
def handler(event: dict, context: LambdaContext) -> dict:
    return app.resolve(event, context)
