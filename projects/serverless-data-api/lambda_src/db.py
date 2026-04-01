from __future__ import annotations

from typing import Any

import boto3
from boto3.dynamodb.conditions import Key


class ItemsTable:
    """DynamoDB wrapper for the single-table items design."""

    def __init__(self, table_name: str) -> None:
        self._resource = boto3.resource("dynamodb")
        self._table = self._resource.Table(table_name)

    # ------------------------------------------------------------------
    # Write
    # ------------------------------------------------------------------

    def put_item(self, item: dict) -> None:
        """Write the item record and a collection entry in a single batch."""
        item_id = item["id"]
        category = item["category"]
        created_at = item["created_at"]

        self._table.meta.client.batch_write_item(
            RequestItems={
                self._table.name: [
                    {
                        "PutRequest": {
                            "Item": {
                                "PK": f"ITEM#{item_id}",
                                "SK": "METADATA",
                                "GSI1PK": f"CAT#{category}",
                                "GSI1SK": f"ITEM#{created_at}#{item_id}",
                                **item,
                            }
                        }
                    },
                    {
                        "PutRequest": {
                            "Item": {
                                "PK": "ITEMS",
                                "SK": f"ITEM#{item_id}",
                                "id": item_id,
                                "name": item["name"],
                            }
                        }
                    },
                ]
            }
        )

    # ------------------------------------------------------------------
    # Read
    # ------------------------------------------------------------------

    def get_item(self, item_id: str) -> dict | None:
        """Fetch a single item by id. Returns the item dict or None."""
        resp = self._table.get_item(
            Key={"PK": f"ITEM#{item_id}", "SK": "METADATA"}
        )
        item = resp.get("Item")
        if item is None:
            return None
        return self._strip_internal_keys(item)

    def list_items(
        self,
        limit: int = 50,
        last_key: dict | None = None,
    ) -> tuple[list[dict], dict | None]:
        """Return a page of items from the ITEMS collection."""
        kwargs: dict[str, Any] = {
            "KeyConditionExpression": Key("PK").eq("ITEMS")
            & Key("SK").begins_with("ITEM#"),
            "Limit": limit,
        }
        if last_key is not None:
            kwargs["ExclusiveStartKey"] = last_key

        resp = self._table.query(**kwargs)
        items = resp.get("Items", [])
        last_evaluated_key = resp.get("LastEvaluatedKey")
        return items, last_evaluated_key

    # ------------------------------------------------------------------
    # Update
    # ------------------------------------------------------------------

    def update_item(self, item_id: str, updates: dict) -> dict | None:
        """Apply partial updates to an existing item.

        Always sets ``updated_at``. Returns the full updated attributes
        or ``None`` if the item does not exist.
        """
        if not updates:
            return self.get_item(item_id)

        expr_names: dict[str, str] = {}
        expr_values: dict[str, Any] = {}
        set_clauses: list[str] = []

        for idx, (key, value) in enumerate(updates.items()):
            alias = f"#f{idx}"
            placeholder = f":v{idx}"
            expr_names[alias] = key
            expr_values[placeholder] = value
            set_clauses.append(f"{alias} = {placeholder}")

        update_expression = "SET " + ", ".join(set_clauses)

        try:
            resp = self._table.update_item(
                Key={"PK": f"ITEM#{item_id}", "SK": "METADATA"},
                UpdateExpression=update_expression,
                ExpressionAttributeNames=expr_names,
                ExpressionAttributeValues=expr_values,
                ConditionExpression="attribute_exists(PK)",
                ReturnValues="ALL_NEW",
            )
        except self._table.meta.client.exceptions.ConditionalCheckFailedException:
            return None

        attrs = resp.get("Attributes", {})
        return self._strip_internal_keys(attrs)

    # ------------------------------------------------------------------
    # Delete
    # ------------------------------------------------------------------

    def delete_item(self, item_id: str) -> None:
        """Remove both the item record and its collection entry."""
        self._table.meta.client.batch_write_item(
            RequestItems={
                self._table.name: [
                    {
                        "DeleteRequest": {
                            "Key": {
                                "PK": f"ITEM#{item_id}",
                                "SK": "METADATA",
                            }
                        }
                    },
                    {
                        "DeleteRequest": {
                            "Key": {
                                "PK": "ITEMS",
                                "SK": f"ITEM#{item_id}",
                            }
                        }
                    },
                ]
            }
        )

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------

    @staticmethod
    def _strip_internal_keys(item: dict) -> dict:
        """Remove single-table design keys before returning to callers."""
        return {
            k: v
            for k, v in item.items()
            if k not in {"PK", "SK", "GSI1PK", "GSI1SK"}
        }
