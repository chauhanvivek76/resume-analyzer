from app.models.schemas import ATSScoreResponse
from app.services.gemini_ats_scorer import GeminiATSScorerService
from app.utils.keyword_extractor import extract_keywords_from_job_description, match_keywords
from app.utils.text_utils import estimate_readability, has_standard_sections, word_count


class ATSScorerService:
    def __init__(self):
        self.gemini_scorer = GeminiATSScorerService()

    def calculate(
        self,
        resume_text: str,
        job_title: str,
        job_description: str,
    ) -> ATSScoreResponse:
        """Calculate ATS score using Gemini AI"""
        try:
            # Use Gemini for analysis
            return self.gemini_scorer.calculate(
                resume_text=resume_text,
                job_title=job_title,
                job_description=job_description,
            )
        except Exception as e:
            # Fallback to basic analysis if Gemini fails
            return self._fallback_calculate(resume_text, job_title, job_description)

    def _fallback_calculate(
        self,
        resume_text: str,
        job_title: str,
        job_description: str,
    ) -> ATSScoreResponse:
        """Fallback basic analysis if Gemini API is unavailable"""
        keywords = extract_keywords_from_job_description(job_description)
        matched, missing = match_keywords(resume_text, keywords)

        keyword_score = self._keyword_score(len(matched), len(keywords))
        formatting_score = self._formatting_score(resume_text)
        readability_score = estimate_readability(resume_text)

        overall = round(
            keyword_score * 0.45 + formatting_score * 0.30 + readability_score * 0.25
        )

        suggestions = self._build_suggestions(
            resume_text, missing, formatting_score, keyword_score
        )

        return ATSScoreResponse(
            overall=overall,
            formatting=formatting_score,
            keywords=keyword_score,
            readability=readability_score,
            suggestions=suggestions,
            matched_keywords=matched,
            missing_keywords=missing,
        )

    def _keyword_score(self, matched: int, total: int) -> int:
        if total == 0:
            return 70
        ratio = matched / total
        return min(100, round(ratio * 100 + 10))

    def _formatting_score(self, text: str) -> int:
        score = 70
        sections = has_standard_sections(text)

        if sections >= 3:
            score += 15
        if sections >= 4:
            score += 5

        lower = text.lower()
        bad_patterns = ["table", "column", "graphic", "image"]
        if not any(p in lower for p in bad_patterns):
            score += 5

        words = word_count(text)
        if 200 <= words <= 800:
            score += 5

        return min(100, score)

    def _build_suggestions(
        self,
        resume_text: str,
        missing: list[str],
        formatting: int,
        keywords: int,
    ) -> list[str]:
        suggestions: list[str] = []

        if missing:
            suggestions.append(
                f"Add these job description keywords: {', '.join(missing[:5])}"
            )

        if keywords < 70:
            suggestions.append(
                "Tailor your resume keywords to match the job description more closely"
            )

        if formatting < 80:
            suggestions.append(
                "Use standard section headings (Experience, Education, Skills, Projects)"
            )

        suggestions.append("Save as PDF with selectable text (not image-based)")
        suggestions.append("Avoid tables and columns — ATS may not parse them correctly")
        suggestions.append("Include a skills section with comma-separated keywords")

        if "agile" not in resume_text.lower() and "scrum" not in resume_text.lower():
            suggestions.append("Consider adding 'Agile' and 'Scrum' if relevant to the role")

        return suggestions[:6]
