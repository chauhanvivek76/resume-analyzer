from fastapi import APIRouter

from app.models.schemas import RoadmapRequest, RoadmapResponse
from app.services.roadmap_generator import RoadmapGeneratorService

router = APIRouter(prefix="/roadmap", tags=["Career Roadmap"])
roadmap_service = RoadmapGeneratorService()


@router.post("/generate", response_model=RoadmapResponse)
async def generate_career_roadmap(body: RoadmapRequest) -> RoadmapResponse:
    return roadmap_service.generate(
        target_role=body.target_role,
        timeline=body.timeline,
        current_level=body.current_level,
        resume_text=body.resume_text,
        skill_gaps=body.skill_gaps,
    )
