from __future__ import annotations

import logging

logger = logging.getLogger(__name__)


def extract_text(file_path: str, mime_type: str) -> tuple[str, int, bool]:
    """Extract text from a document file.

    Returns (extracted_text, page_count, ocr_used).
    Runs synchronously -- the caller should wrap in asyncio.to_thread.
    """
    try:
        if mime_type == "application/pdf":
            return _extract_pdf(file_path)
        elif mime_type in ("image/jpeg", "image/png"):
            return _extract_image(file_path)
        elif mime_type == (
            "application/vnd.openxmlformats-officedocument"
            ".wordprocessingml.document"
        ):
            return _extract_docx(file_path)
        else:
            logger.warning("Unsupported mime type: %s", mime_type)
            return ("", 0, False)
    except Exception:
        logger.exception("Failed to extract text from %s", file_path)
        return ("", 0, False)


def _extract_pdf(file_path: str) -> tuple[str, int, bool]:
    import fitz  # pymupdf

    doc = fitz.open(file_path)
    page_count = len(doc)
    text_parts: list[str] = []

    for page in doc:
        text_parts.append(page.get_text())

    doc.close()
    text = "\n".join(text_parts).strip()

    if len(text) >= 50:
        return (text, page_count, False)

    # Fallback to OCR
    logger.info("PDF text too short (%d chars), falling back to OCR", len(text))
    return _ocr_pdf(file_path, page_count)


def _ocr_pdf(file_path: str, page_count: int) -> tuple[str, int, bool]:
    from pdf2image import convert_from_path

    images = convert_from_path(file_path)
    text_parts: list[str] = []

    for img in images:
        text_parts.append(_ocr_image(img))

    text = "\n".join(text_parts).strip()
    return (text, page_count, True)


def _extract_image(file_path: str) -> tuple[str, int, bool]:
    from PIL import Image

    img = Image.open(file_path)
    text = _ocr_image(img)
    return (text, 1, True)


def _ocr_image(img: object) -> str:
    from PIL import Image, ImageFilter
    import pytesseract

    if not isinstance(img, Image.Image):
        return ""

    # Preprocess: grayscale and sharpen
    processed = img.convert("L")
    processed = processed.point(lambda x: 0 if x < 128 else 255)
    processed = processed.filter(ImageFilter.SHARPEN)

    text: str = pytesseract.image_to_string(processed)
    return text.strip()


def _extract_docx(file_path: str) -> tuple[str, int, bool]:
    from docx import Document

    doc = Document(file_path)
    paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
    text = "\n".join(paragraphs).strip()
    # Approximate page count from paragraph count
    page_count = max(1, len(paragraphs) // 25)
    return (text, page_count, False)
