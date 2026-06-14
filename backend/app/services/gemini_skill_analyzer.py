import json
import re

import google.generativeai as genai

from app.config import settings
from app.models.schemas import SkillGapResponse, SkillGapItem
from app.models.schemas import Priority


class GeminiSkillAnalyzerService:
    def __init__(self):
        if settings.gemini_api_key:
            genai.configure(api_key=settings.gemini_api_key)
        self.model = genai.GenerativeModel("gemini-1.5-flash")

    def analyze_gaps(
        self,
        resume_text: str,
        target_role: str,
        experience_level: str = "Fresher",
    ) -> SkillGapResponse:
        """Analyze skill gaps using Gemini AI"""

        prompt = f"""Analyze the skill gaps for a {target_role} position.
Candidate experience level: {experience_level}
Resume: {resume_text}

Identify 8-10 key skills needed for this role. For each skill, determine:
1. If it's required for the role
2. Current level (0-100 based on resume)
3. Target level (0-100 to be competitive)
4. Priority (high/medium/low)

Respond with ONLY valid JSON (no markdown, no code blocks):
{{
    "overall_match": <number 0-100>,
    "skills": [
        {{
            "skill": "skill name",
            "required": true/false,
            "current_level": <0-100>,
            "target_level": <0-100>,
            "priority": "high|medium|low"
        }},
        ...
    ],
    "recommendations": [
        "actionable recommendation 1",
        "actionable recommendation 2",
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

            overall_match = max(0, min(100, int(result_json.get("overall_match", 50))))
            skills_data = result_json.get("skills", [])
            recommendations = result_json.get("recommendations", [])[:5]

            # Convert to SkillGapItem objects
            skills: list[SkillGapItem] = []
            for s in skills_data:
                priority_str = s.get("priority", "medium").lower()
                priority = Priority(priority_str) if priority_str in [p.value for p in Priority] else Priority.MEDIUM
                
                skills.append(
                    SkillGapItem(
                        skill=s.get("skill", "Unknown"),
                        required=s.get("required", False),
                        current_level=max(0, min(100, int(s.get("current_level", 0)))),
                        target_level=max(0, min(100, int(s.get("target_level", 100)))),
                        priority=priority,
                    )
                )

            skills_matched = sum(1 for s in skills if s.current_level >= s.target_level)
            high_priority_gaps = sum(1 for s in skills if s.current_level < s.target_level and s.priority == Priority.HIGH)

            return SkillGapResponse(
                overall_match=overall_match,
                skills_matched=skills_matched,
                total_skills=len(skills),
                high_priority_gaps=high_priority_gaps,
                skills=skills,
                recommendations=recommendations,
            )

        except Exception as e:
            print(f"Gemini API error: {e}")
            raise ValueError(f"Failed to analyze skill gaps: {str(e)}")
