import json
import re

import google.generativeai as genai

from app.config import settings
from app.models.schemas import KeywordAnalysis, ResumeAnalysisResponse


class GeminiResumeAnalyzerService:
    def __init__(self):
        if settings.gemini_api_key:
            genai.configure(api_key=settings.gemini_api_key)
        self.model = genai.GenerativeModel("gemini-1.5-flash")

    def analyze(
        self,
        resume_text: str,
        target_role: str,
        job_description: str | None = None,
    ) -> ResumeAnalysisResponse:
        """Analyze resume using Gemini AI"""

        prompt = f"""Analyze this resume for a {target_role} position and provide a detailed assessment.

Resume:
{resume_text}

{f'Job Description:{chr(10)}{job_description}' if job_description else ''}

Please respond with ONLY valid JSON (no markdown, no code blocks) in this exact format:
{{
    "score": <number 0-100>,
    "strengths": [<list of 4-5 specific strengths>],
    "improvements": [<list of 4-5 specific improvements>],
    "found_keywords": [<list of relevant keywords/skills found in resume>],
    "missing_keywords": [<list of important keywords/skills missing from resume>]
}}

Guidelines:
- Score based on: clarity, metrics, keywords, ATS-friendliness, length, and relevance to {target_role}
- Strengths: Specific, positive observations (not generic)
- Improvements: Actionable, specific suggestions
- Keywords: Focus on technical skills, tools, and frameworks relevant to {target_role}
- Be constructive but honest"""

        try:
            response = self.model.generate_content(prompt)
            result_text = response.text.strip()

            # Remove markdown code blocks if present
            if result_text.startswith("```"):
                result_text = re.sub(r"^```(?:json)?\n", "", result_text)
                result_text = re.sub(r"\n```$", "", result_text)

            # Parse JSON response
            result_json = json.loads(result_text)

            # Validate and clean response
            score = max(0, min(100, int(result_json.get("score", 60))))
            strengths = result_json.get("strengths", [])[:5]
            improvements = result_json.get("improvements", [])[:5]
            found_keywords = result_json.get("found_keywords", [])[:15]
            missing_keywords = result_json.get("missing_keywords", [])[:15]

            return ResumeAnalysisResponse(
                score=score,
                strengths=strengths,
                improvements=improvements,
                keywords=KeywordAnalysis(
                    found=found_keywords,
                    missing=missing_keywords,
                ),
            )

        except Exception as e:
            # Fallback to basic analysis if Gemini fails
            print(f"Gemini API error: {e}")
            raise ValueError(f"Failed to analyze resume: {str(e)}")