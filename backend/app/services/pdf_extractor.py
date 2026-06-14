import io
import uuid
from pathlib import Path

from pypdf import PdfReader

from app.core.exceptions import PDFExtractionError
from app.utils.text_utils import normalize_text


ALLOWED_EXTENSIONS = {".pdf", ".txt", ".docx"}
ALLOWED_MIME_TYPES = {
    "application/pdf",
    "text/plain",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}


class PDFExtractorService:
    def extract_text_from_bytes(self, content: bytes, filename: str) -> tuple[str, int | None]:
        ext = Path(filename).suffix.lower()

        if ext == ".txt":
            text = content.decode("utf-8", errors="replace")
            return normalize_text(text), None

        if ext == ".pdf":
            return self._extract_pdf(content)

        if ext == ".docx":
            raise PDFExtractionError(
                "DOCX support requires additional setup. Please upload PDF or paste text."
            )

        raise PDFExtractionError(f"Unsupported file type: {ext}")

    def _extract_pdf(self, content: bytes) -> tuple[str, int]:
        try:
            reader = PdfReader(io.BytesIO(content))
            pages: list[str] = []

            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    pages.append(page_text)

            if not pages:
                raise PDFExtractionError(
                    "No text could be extracted. The PDF may be image-based or encrypted."
                )

            return normalize_text("\n".join(pages)), len(reader.pages)
        except PDFExtractionError:
            raise
        except Exception as exc:
            raise PDFExtractionError(f"Failed to extract PDF text: {exc}") from exc


class ResumeUploadService:
    def __init__(self, upload_dir: Path) -> None:
        self.upload_dir = upload_dir
        self.pdf_extractor = PDFExtractorService()

    def save_and_extract(
        self,
        content: bytes,
        filename: str,
    ) -> dict:
        safe_name = f"{uuid.uuid4().hex}_{Path(filename).name}"
        file_path = self.upload_dir / safe_name
        file_path.write_bytes(content)

        text, page_count = self.pdf_extractor.extract_text_from_bytes(content, filename)

        return {
            "filename": filename,
            "stored_as": safe_name,
            "file_size": len(content),
            "extracted_text": text,
            "word_count": len(text.split()),
            "page_count": page_count,
        }
