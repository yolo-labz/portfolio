from __future__ import annotations

import asyncio
import json
import logging

logger = logging.getLogger(__name__)

FIELD_SCHEMAS: dict[str, dict] = {
    "invoice": {
        "type": "object",
        "properties": {
            "vendor_name": {"type": "string"},
            "invoice_number": {"type": "string"},
            "invoice_date": {"type": "string"},
            "due_date": {"type": "string"},
            "subtotal": {"type": ["number", "null"]},
            "tax": {"type": ["number", "null"]},
            "total_amount": {"type": "string"},
            "currency": {"type": "string"},
            "line_items": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "description": {"type": "string"},
                        "quantity": {"type": "number"},
                        "unit_price": {"type": "number"},
                        "amount": {"type": "number"},
                    },
                    "required": [
                        "description",
                        "quantity",
                        "unit_price",
                        "amount",
                    ],
                    "additionalProperties": False,
                },
            },
        },
        "required": [
            "vendor_name",
            "invoice_number",
            "invoice_date",
            "due_date",
            "subtotal",
            "tax",
            "total_amount",
            "currency",
            "line_items",
        ],
        "additionalProperties": False,
    },
    "contract": {
        "type": "object",
        "properties": {
            "parties": {"type": "array", "items": {"type": "string"}},
            "effective_date": {"type": "string"},
            "expiration_date": {"type": "string"},
            "term": {"type": "string"},
            "governing_law": {"type": "string"},
        },
        "required": [
            "parties",
            "effective_date",
            "expiration_date",
            "term",
            "governing_law",
        ],
        "additionalProperties": False,
    },
    "receipt": {
        "type": "object",
        "properties": {
            "store": {"type": "string"},
            "total": {"type": "string"},
            "currency": {"type": "string"},
            "date": {"type": "string"},
            "payment_method": {"type": "string"},
            "items": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "description": {"type": "string"},
                        "amount": {"type": "number"},
                    },
                    "required": ["description", "amount"],
                    "additionalProperties": False,
                },
            },
        },
        "required": [
            "store",
            "total",
            "currency",
            "date",
            "payment_method",
            "items",
        ],
        "additionalProperties": False,
    },
    "letter": {
        "type": "object",
        "properties": {
            "sender": {"type": "string"},
            "recipient": {"type": "string"},
            "date": {"type": "string"},
            "subject": {"type": "string"},
            "summary": {"type": "string"},
        },
        "required": ["sender", "recipient", "date", "subject", "summary"],
        "additionalProperties": False,
    },
    "report": {
        "type": "object",
        "properties": {
            "sender": {"type": "string"},
            "recipient": {"type": "string"},
            "date": {"type": "string"},
            "subject": {"type": "string"},
            "summary": {"type": "string"},
        },
        "required": ["sender", "recipient", "date", "subject", "summary"],
        "additionalProperties": False,
    },
}

SYSTEM_PROMPT = (
    "Extract all requested fields from the document. "
    "If a field is not found, use null."
)


async def extract_fields(text: str, doc_type: str, api_key: str) -> dict:
    """Extract structured fields from document text based on its type.

    Returns a dict of extracted fields.
    """
    if not api_key or doc_type == "unknown":
        return {}

    schema = FIELD_SCHEMAS.get(doc_type)
    if schema is None:
        return {}

    import anthropic

    client = anthropic.Anthropic(api_key=api_key)
    truncated_text = text[:8000]

    last_error: Exception | None = None
    for attempt in range(3):
        try:
            response = client.messages.create(
                model="claude-sonnet-4-6-20250514",
                max_tokens=2048,
                system=SYSTEM_PROMPT,
                messages=[
                    {
                        "role": "user",
                        "content": (
                            f"Extract fields from this {doc_type} document:"
                            f"\n\n{truncated_text}"
                        ),
                    }
                ],
                output_config={
                    "format": {
                        "type": "json_schema",
                        "schema": schema,
                    }
                },
            )
            result = json.loads(response.content[0].text)
            return result
        except Exception as exc:
            last_error = exc
            logger.warning(
                "Field extraction attempt %d failed: %s", attempt + 1, exc
            )
            if attempt < 2:
                await asyncio.sleep(5)

    logger.error("Field extraction failed after 3 attempts: %s", last_error)
    return {}
