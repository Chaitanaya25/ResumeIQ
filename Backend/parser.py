import pdfplumber
from docx import Document
import re
import io


def extract_text_from_pdf(file_bytes: bytes) -> str:
    text = ""
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text


def extract_text_from_docx(file_bytes: bytes) -> str:
    text = ""
    doc = Document(io.BytesIO(file_bytes))
    for paragraph in doc.paragraphs:
        if paragraph.text.strip():
            text += paragraph.text + "\n"
    return text


def clean_text(text: str) -> str:
    text = re.sub(r'\n+', '\n', text)
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'[^\w\s\.\,\-\+\@\/\#]', '', text)
    text = text.strip()
    return text


def parse_document(file_bytes: bytes, filename: str) -> dict:
    filename_lower = filename.lower()

    try:
        if filename_lower.endswith('.pdf'):
            raw_text = extract_text_from_pdf(file_bytes)
            file_type = "pdf"

        elif filename_lower.endswith('.docx'):
            raw_text = extract_text_from_docx(file_bytes)
            file_type = "docx"

        else:
            return {
                "success": False,
                "error": "Unsupported file type. Please upload PDF or DOCX only.",
                "text": None
            }

        if not raw_text or len(raw_text.strip()) < 50:
            return {
                "success": False,
                "error": "Could not extract text. File might be scanned or image-based.",
                "text": None
            }

        clean = clean_text(raw_text)

        return {
            "success": True,
            "file_type": file_type,
            "raw_text": raw_text,
            "clean_text": clean,
            "word_count": len(clean.split()),
            "error": None
        }

    except Exception as e:
        return {
            "success": False,
            "error": f"Failed to parse document: {str(e)}",
            "text": None
        }