from fastapi import APIRouter

from app.models.schemas import ATSScoreRequest, ATSScoreResponse
from app.services.ats_scorer import ATSScorerService

router = APIRouter(prefix="/ats", tags=["ATS Score"])
scorer_service = ATSScorerService()


@router.post("/score", response_model=ATSScoreResponse)
async def calculate_ats_score(body: ATSScoreRequest) -> ATSScoreResponse:
    return scorer_service.calculate(
        resume_text=body.resume_text,
        job_title=body.job_title,
        job_description=body.job_description,
    )
