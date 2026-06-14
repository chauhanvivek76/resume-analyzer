from fastapi import APIRouter

from app.api.routes import ats, interview, resume, roadmap, skills
from app.models.schemas import HealthResponse
from app.config import settings

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(resume.router)
api_router.include_router(ats.router)
api_router.include_router(skills.router)
api_router.include_router(interview.router)
api_router.include_router(roadmap.router)


@api_router.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check() -> HealthResponse:
    return HealthResponse(status="ok", app=settings.app_name)
