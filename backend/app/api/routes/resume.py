from fastapi import APIRouter, File, HTTPException, UploadFile, status

from app.config import settings
from app.core.exceptions import PDFExtractionError, pdf_extraction_http_error
from app.models.schemas import ResumeAnalysisRequest, ResumeAnalysisResponse, ResumeUploadResponse
from app.services.pdf_extractor import ALLOWED_EXTENSIONS, ResumeUploadService
from app.services.resume_analyzer import ResumeAnalyzerService

router = APIRouter(prefix="/resume", tags=["Resume"])

upload_service = ResumeUploadService(settings.upload_path)
analyzer_service = ResumeAnalyzerService()


@router.post("/upload", response_model=ResumeUploadResponse)
async def upload_resume(file: UploadFile = File(...)) -> ResumeUploadResponse:
    if not file.filename:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No filename provided")

    ext = "." + file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else ""
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type. Allowed: {', '.join(ALLOWED_EXTENSIONS)}",
        )

    content = await file.read()
    if len(content) > settings.max_upload_bytes:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File exceeds {settings.max_upload_size_mb}MB limit",
        )

    try:
        result = upload_service.save_and_extract(content, file.filename)
    except PDFExtractionError as exc:
        raise pdf_extraction_http_error(str(exc)) from exc

    return ResumeUploadResponse(
        filename=result["filename"],
        file_size=result["file_size"],
        extracted_text=result["extracted_text"],
        word_count=result["word_count"],
        page_count=result["page_count"],
    )


@router.post("/analyze", response_model=ResumeAnalysisResponse)
async def analyze_resume(body: ResumeAnalysisRequest) -> ResumeAnalysisResponse:
    return analyzer_service.analyze(
        resume_text=body.resume_text,
        target_role=body.target_role,
        job_description=body.job_description,
    )
