import json
import re

import google.generativeai as genai

from app.config import settings
from app.models.schemas import ATSScoreResponse


class GeminiATSScorerService:
    def __init__(self):
        if settings.gemini_api_key:
            genai.configure(api_key=settings.gemini_api_key)
        self.model = genai.GenerativeModel("gemini-1.5-flash")

    def calculate(
        self,
        resume_text: str,
        job_title: str,
        job_description: str,
    ) -> ATSScoreResponse:
        """Calculate ATS score using Gemini AI"""

        prompt = f"""Analyze this resume for ATS (Applicant Tracking System) compatibility with the following job posting:

Job Title: {job_title}
Job Description:
{job_description}

Resume:
{resume_text}

Provide a detailed ATS analysis. Respond with ONLY valid JSON (no markdown, no code blocks) in this exact format:
{{
    "overall": <number 0-100>,
    "formatting": <number 0-100>,
    "keywords": <number 0-100>,
    "readability": <number 0-100>,
    "matched_keywords": [<list of keywords from resume that match job description>],
    "missing_keywords": [<list of important keywords from job description missing in resume>],
    "suggestions": [<list of 5-6 specific, actionable ATS optimization tips>]
}}

Scoring guidelines:
- overall: Average of formatting, keywords, and readability (weighted: 0.3, 0.45, 0.25)
- formatting: Score on standard section usage, proper structure, ATS-friendly format (0-100)
- keywords: Percentage of job description keywords found in resume (0-100)
- readability: Clarity, sentence structure, proper grammar (0-100)
- suggestions: Include specific keyword recommendations and formatting advice

Be precise with scores and provide actionable recommendations."""

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
            overall = max(0, min(100, int(result_json.get("overall", 70))))
            formatting = max(0, min(100, int(result_json.get("formatting", 70))))
            keywords = max(0, min(100, int(result_json.get("keywords", 70))))
            readability = max(0, min(100, int(result_json.get("readability", 70))))
            matched_keywords = result_json.get("matched_keywords", [])[:20]
            missing_keywords = result_json.get("missing_keywords", [])[:10]
            suggestions = result_json.get("suggestions", [])[:6]

            return ATSScoreResponse(
                overall=overall,
                formatting=formatting,
                keywords=keywords,
                readability=readability,
                suggestions=suggestions,
                matched_keywords=matched_keywords,
                missing_keywords=missing_keywords,
            )

        except Exception as e:
            # Fallback to basic analysis if Gemini fails
            print(f"Gemini API error: {e}")
            raise ValueError(f"Failed to calculate ATS score: {str(e)}")
