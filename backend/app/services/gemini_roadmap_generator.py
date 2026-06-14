import json
import re

import google.generativeai as genai

from app.config import settings
from app.models.schemas import RoadmapStatus


class GeminiRoadmapGeneratorService:
    def __init__(self):
        if settings.gemini_api_key:
            genai.configure(api_key=settings.gemini_api_key)
        self.model = genai.GenerativeModel("gemini-1.5-flash")

    def generate_roadmap(
        self,
        target_role: str,
        timeline: str = "3 months",
        current_level: str = "Intermediate",
    ) -> dict:
        """Generate career roadmap using Gemini AI"""

        prompt = f"""Create a detailed career roadmap for someone aiming for a {target_role} position.
Timeline: {timeline}
Current level: {current_level}

Break down the roadmap into phases with:
1. Phase title
2. Duration (e.g., 2 weeks)
3. Status: "completed" for past phases, "in-progress" for current, "upcoming" for future
4. Specific tasks/milestones

Generate 4-5 phases. Mark the first as "completed", next as "in-progress", rest as "upcoming".

Respond with ONLY valid JSON (no markdown, no code blocks):
{{
    "phases": [
        {{
            "title": "phase title",
            "duration": "X weeks/days",
            "status": "completed|in-progress|upcoming",
            "tasks": [
                "task 1",
                "task 2",
                "task 3"
            ]
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
            phases = result_json.get("phases", [])

            return {
                "phases": phases[:5],
                "total_phases": len(phases),
                "target_role": target_role,
                "timeline": timeline,
            }

        except Exception as e:
            print(f"Gemini API error: {e}")
            raise ValueError(f"Failed to generate roadmap: {str(e)}")
