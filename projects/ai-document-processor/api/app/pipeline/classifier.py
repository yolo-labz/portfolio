from __future__ import annotations

import asyncio
import json
import logging

logger = logging.getLogger(__name__)

CLASSIFICATION_SCHEMA = {
    "type": "object",
    "properties": {
        "document_type": {
            "type": "string",
            "enum": [
                "invoice",
                "contract",
                "receipt",
                "letter",
                "report",
                "unknown",
            ],
        },
        "confidence": {"type": "number"},
        "reasoning": {"type": "string"},
    },
    "required": ["document_type", "confidence", "reasoning"],
    "additionalProperties": False,
}

SYSTEM_PROMPT = (
    "You are a document classifier. Classify the document into exactly one "
    "category: invoice, contract, receipt, letter, report, or unknown. "
    "Provide your confidence as a number from 0 to 100."
)


async def classify_document(text: str, api_key: str) -> tuple[str, float]:
    """Classify a document using Claude.

    Returns (document_type, confidence 0-100).
    """
    if not api_key:
        return ("unknown", 0.0)

    import anthropic

    client = anthropic.Anthropic(api_key=api_key)
    truncated_text = text[:4000]

    last_error: Exception | None = None
    for attempt in range(3):
        try:
            response = client.messages.create(
                model="claude-haiku-4-5-20251001",
                max_tokens=512,
                system=SYSTEM_PROMPT,
                messages=[
                    {
                        "role": "user",
                        "content": (
                            f"Classify the following document:\n\n{truncated_text}"
                        ),
                    }
                ],
                output_config={
                    "format": {
                        "type": "json_schema",
                        "schema": CLASSIFICATION_SCHEMA,
                    }
                },
            )
            result = json.loads(response.content[0].text)
            return (result["document_type"], result["confidence"])
        except Exception as exc:
            last_error = exc
            logger.warning(
                "Classification attempt %d failed: %s", attempt + 1, exc
            )
            if attempt < 2:
                await asyncio.sleep(5)

    logger.error("Classification failed after 3 attempts: %s", last_error)
    return ("unknown", 0.0)
