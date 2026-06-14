from enum import Enum

from pydantic import BaseModel, Field


class InterviewCategory(str, Enum):
    TECHNICAL = "technical"
    BEHAVIORAL = "behavioral"
    HR = "hr"


class Difficulty(str, Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"


class Priority(str, Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class RoadmapStatus(str, Enum):
    COMPLETED = "completed"
    IN_PROGRESS = "in-progress"
    UPCOMING = "upcoming"


# ── Resume ──────────────────────────────────────────────────────────────────

class ResumeUploadResponse(BaseModel):
    filename: str
    file_size: int
    extracted_text: str
    word_count: int
    page_count: int | None = None


class KeywordAnalysis(BaseModel):
    found: list[str]
    missing: list[str]


class ResumeAnalysisRequest(BaseModel):
    resume_text: str = Field(..., min_length=50)
    target_role: str = Field(default="Software Engineer", min_length=2)
    job_description: str | None = None


class ResumeAnalysisResponse(BaseModel):
    score: int
    strengths: list[str]
    improvements: list[str]
    keywords: KeywordAnalysis


# ── ATS ─────────────────────────────────────────────────────────────────────

class ATSScoreRequest(BaseModel):
    resume_text: str = Field(..., min_length=50)
    job_title: str = Field(..., min_length=2)
    job_description: str = Field(..., min_length=50)
    company: str | None = None


class ATSScoreResponse(BaseModel):
    overall: int
    formatting: int
    keywords: int
    readability: int
    suggestions: list[str]
    matched_keywords: list[str]
    missing_keywords: list[str]


# ── Skill Gap ─────────────────────────────────────────────────────────────────

class SkillGapRequest(BaseModel):
    resume_text: str = Field(..., min_length=50)
    target_role: str = Field(default="Software Engineer", min_length=2)
    job_description: str | None = None
    experience_level: str = Field(default="Fresher")


class SkillGapItem(BaseModel):
    skill: str
    required: bool
    current_level: int
    target_level: int
    priority: Priority


class SkillGapResponse(BaseModel):
    overall_match: int
    skills_matched: int
    total_skills: int
    high_priority_gaps: int
    skills: list[SkillGapItem]
    recommendations: list[str]


# ── Interview ─────────────────────────────────────────────────────────────────

class InterviewRequest(BaseModel):
    target_role: str = Field(..., min_length=2)
    company: str | None = None
    experience_level: str = Field(default="Fresher")
    count: int = Field(default=6, ge=1, le=20)
    resume_text: str | None = None


class InterviewQuestion(BaseModel):
    id: str
    category: InterviewCategory
    question: str
    difficulty: Difficulty
    hint: str | None = None


class InterviewResponse(BaseModel):
    questions: list[InterviewQuestion]
    role: str
    total: int


# ── Roadmap ───────────────────────────────────────────────────────────────────

class RoadmapRequest(BaseModel):
    target_role: str = Field(..., min_length=2)
    timeline: str = Field(default="3 months")
    current_level: str = Field(default="Intermediate")
    resume_text: str | None = None
    skill_gaps: list[str] | None = None


class RoadmapPhase(BaseModel):
    id: str
    title: str
    duration: str
    status: RoadmapStatus
    tasks: list[str]


class RoadmapResponse(BaseModel):
    target_role: str
    timeline: str
    overall_progress: int
    phases: list[RoadmapPhase]


# ── Health ────────────────────────────────────────────────────────────────────

class HealthResponse(BaseModel):
    status: str
    app: str
