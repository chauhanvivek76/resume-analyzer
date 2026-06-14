from app.models.schemas import KeywordAnalysis, ResumeAnalysisResponse
from app.services.gemini_resume_analyzer import GeminiResumeAnalyzerService
from app.utils.keyword_extractor import (
    extract_keywords_from_job_description,
    extract_skills_from_text,
    match_keywords,
)
from app.utils.text_utils import (
    contains_quantifiable_metrics,
    has_standard_sections,
    word_count,
)


class ResumeAnalyzerService:
    def __init__(self):
        self.gemini_analyzer = GeminiResumeAnalyzerService()

    def analyze(
        self,
        resume_text: str,
        target_role: str,
        job_description: str | None = None,
    ) -> ResumeAnalysisResponse:
        """Analyze resume using Gemini AI"""
        try:
            # Use Gemini for analysis
            return self.gemini_analyzer.analyze(
                resume_text=resume_text,
                target_role=target_role,
                job_description=job_description,
            )
        except Exception as e:
            # Fallback to basic analysis if Gemini fails
            return self._fallback_analyze(resume_text, target_role, job_description)

    def _fallback_analyze(
        self,
        resume_text: str,
        target_role: str,
        job_description: str | None = None,
    ) -> ResumeAnalysisResponse:
        """Fallback basic analysis if Gemini API is unavailable"""
        strengths: list[str] = []
        improvements: list[str] = []
        score = 60

        words = word_count(resume_text)
        sections = has_standard_sections(resume_text)

        if sections >= 3:
            strengths.append("Contains standard resume sections (Experience, Education, Skills)")
            score += 8
        else:
            improvements.append("Add standard sections: Experience, Education, Skills, Projects")

        if contains_quantifiable_metrics(resume_text):
            strengths.append("Includes quantifiable achievements and metrics")
            score += 10
        else:
            improvements.append("Add quantifiable achievements (numbers, percentages, impact metrics)")

        resume_skills = extract_skills_from_text(resume_text)
        if len(resume_skills) >= 5:
            strengths.append(f"Strong skills section with {len(resume_skills)} relevant technologies")
            score += 8
        elif len(resume_skills) >= 2:
            improvements.append("Expand your skills section with more relevant technologies")
        else:
            improvements.append("Add a dedicated skills section with relevant technologies")

        action_verbs = [
            "developed", "built", "designed", "implemented", "led", "managed",
            "created", "optimized", "improved", "delivered", "achieved",
        ]
        verb_count = sum(1 for v in action_verbs if v in resume_text.lower())
        if verb_count >= 4:
            strengths.append("Good use of action verbs throughout the resume")
            score += 5
        else:
            improvements.append("Use stronger action verbs (developed, built, led, optimized)")

        if 250 <= words <= 700:
            strengths.append("Resume length is within optimal range")
            score += 5
        elif words > 700:
            improvements.append("Consider shortening resume — aim for 1 page (~400-600 words)")
            score -= 5
        else:
            improvements.append("Resume seems too short — add more detail about projects and experience")
            score -= 5

        if job_description:
            keywords = extract_keywords_from_job_description(job_description)
        else:
            keywords = [s.lower() for s in resume_skills[:15]]
            from app.utils.keyword_extractor import get_role_skills
            keywords = get_role_skills(target_role)[:15]

        found, missing = match_keywords(resume_text, keywords)

        if len(found) >= len(keywords) * 0.6:
            strengths.append(f"Good keyword coverage ({len(found)}/{len(keywords)} matched)")
            score += 10
        else:
            improvements.append(
                f"Include missing keywords: {', '.join(missing[:5])}"
            )

        score = max(0, min(100, score))

        return ResumeAnalysisResponse(
            score=score,
            strengths=strengths,
            improvements=improvements,
            keywords=KeywordAnalysis(found=found, missing=missing),
        )

