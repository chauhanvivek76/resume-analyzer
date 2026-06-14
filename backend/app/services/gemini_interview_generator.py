import json
import re

import google.generativeai as genai

from app.config import settings


class GeminiInterviewGeneratorService:
    def __init__(self):
        if settings.gemini_api_key:
            genai.configure(api_key=settings.gemini_api_key)
        self.model = genai.GenerativeModel("gemini-1.5-flash")

    def generate_questions(
        self,
        target_role: str,
        company: str | None = None,
        experience_level: str = "Intermediate",
    ) -> list[dict]:
        """Generate interview questions using Gemini AI"""

        prompt = f"""Generate 6 interview questions for a {target_role} position{f' at {company}' if company else ''}.
Candidate experience level: {experience_level}

Include 2 technical, 2 behavioral, and 2 HR questions. Format each question with difficulty (easy/medium/hard).

Respond with ONLY valid JSON (no markdown, no code blocks) in this exact format:
{{
    "questions": [
        {{
            "question": "question text",
            "category": "technical|behavioral|hr",
            "difficulty": "easy|medium|hard",
            "hint": "helpful hint for the candidate"
        }},
        ...
    ]
}}"""

        try:
            response = self.model.generate_content(prompt)
            result_text = response.text.strip()

            # Remove markdown code blocks if present
            if result_text.startswith("```"):
                result_text = re.sub(r"^```(?:json)?\n", "", result_text)
                result_text = re.sub(r"\n```$", "", result_text)

            result_json = json.loads(result_text)
            questions = result_json.get("questions", [])

            return questions[:6]

        except Exception as e:
            print(f"Gemini API error: {e}")
            raise ValueError(f"Failed to generate interview questions: {str(e)}")
