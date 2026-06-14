from fastapi import APIRouter

from app.models.schemas import InterviewRequest, InterviewResponse
from app.services.interview_generator import InterviewGeneratorService

router = APIRouter(prefix="/interview", tags=["Interview"])
interview_service = InterviewGeneratorService()


@router.post("/questions", response_model=InterviewResponse)
async def generate_interview_questions(body: InterviewRequest) -> InterviewResponse:
    return interview_service.generate(
        target_role=body.target_role,
        company=body.company,
        experience_level=body.experience_level,
        count=body.count,
        resume_text=body.resume_text,
    )
