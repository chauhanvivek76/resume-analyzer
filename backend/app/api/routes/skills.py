from fastapi import APIRouter

from app.models.schemas import SkillGapRequest, SkillGapResponse
from app.services.skill_analyzer import SkillAnalyzerService

router = APIRouter(prefix="/skills", tags=["Skill Gap"])
skill_service = SkillAnalyzerService()


@router.post("/gap-analysis", response_model=SkillGapResponse)
async def analyze_skill_gap(body: SkillGapRequest) -> SkillGapResponse:
    return skill_service.analyze(
        resume_text=body.resume_text,
        target_role=body.target_role,
        job_description=body.job_description,
        experience_level=body.experience_level,
    )
