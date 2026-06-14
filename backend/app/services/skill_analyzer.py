from app.models.schemas import Priority, SkillGapItem, SkillGapResponse
from app.utils.keyword_extractor import (
    extract_skills_from_text,
    get_role_skills,
    match_keywords,
)
from app.utils.text_utils import word_count


class SkillAnalyzerService:
    def analyze(
        self,
        resume_text: str,
        target_role: str,
        job_description: str | None = None,
        experience_level: str = "Fresher",
    ) -> SkillGapResponse:
        resume_skills = extract_skills_from_text(resume_text)

        if job_description:
            from app.utils.keyword_extractor import extract_keywords_from_job_description
            required_skills = extract_keywords_from_job_description(job_description, top_n=15)
        else:
            required_skills = get_role_skills(target_role)

        items: list[SkillGapItem] = []
        seen: set[str] = set()

        for skill in required_skills:
            key = skill.lower()
            if key in seen:
                continue
            seen.add(key)

            in_resume = skill.lower() in resume_text.lower()
            current = self._estimate_level(skill, resume_text, in_resume, experience_level)
            target = self._target_level(skill, target_role, experience_level)
            priority = self._priority(current, target)

            items.append(
                SkillGapItem(
                    skill=skill,
                    required=True,
                    current_level=current,
                    target_level=target,
                    priority=priority,
                )
            )

        # Add resume skills not in required list
        for skill in resume_skills:
            if skill.lower() not in seen:
                items.append(
                    SkillGapItem(
                        skill=skill,
                        required=False,
                        current_level=75,
                        target_level=80,
                        priority=Priority.LOW,
                    )
                )

        matched = sum(1 for i in items if i.required and i.current_level >= i.target_level)
        required_items = [i for i in items if i.required]
        total_required = len(required_items)

        overall = round((matched / total_required) * 100) if total_required else 0
        high_gaps = sum(
            1 for i in required_items
            if i.current_level < i.target_level and i.priority == Priority.HIGH
        )

        recommendations = self._recommendations(
            [i for i in required_items if i.current_level < i.target_level]
        )

        return SkillGapResponse(
            overall_match=overall,
            skills_matched=matched,
            total_skills=total_required,
            high_priority_gaps=high_gaps,
            skills=items,
            recommendations=recommendations,
        )

    def _estimate_level(
        self,
        skill: str,
        text: str,
        in_resume: bool,
        experience: str,
    ) -> int:
        if not in_resume:
            return 15

        lower = text.lower()
        skill_lower = skill.lower()
        base = 55

        count = lower.count(skill_lower)
        if count >= 3:
            base += 20
        elif count >= 2:
            base += 10

        exp_lower = experience.lower()
        if "senior" in exp_lower or "3" in exp_lower or "5" in exp_lower:
            base += 10
        elif "fresher" in exp_lower or "0" in exp_lower:
            base -= 5

        return min(95, max(20, base))

    def _target_level(self, skill: str, role: str, experience: str) -> int:
        core_skills = ["react", "python", "javascript", "java", "data structures", "algorithms"]
        exp_lower = experience.lower()

        if any(c in skill.lower() for c in core_skills):
            if "senior" in exp_lower:
                return 90
            if "fresher" in exp_lower:
                return 70
            return 80

        return 75

    def _priority(self, current: int, target: int) -> Priority:
        gap = target - current
        if gap >= 40:
            return Priority.HIGH
        if gap >= 20:
            return Priority.MEDIUM
        return Priority.LOW

    def _recommendations(self, gaps: list[SkillGapItem]) -> list[str]:
        if not gaps:
            return ["Great job! Your skills align well with the target role."]

        sorted_gaps = sorted(
            gaps,
            key=lambda x: {"high": 0, "medium": 1, "low": 2}[x.priority.value],
        )

        recs: list[str] = []
        for item in sorted_gaps[:4]:
            recs.append(
                f"Focus on {item.skill}: currently at {item.current_level}%, "
                f"target is {item.target_level}%"
            )

        if word_count(" ".join(g.skill for g in gaps)) > 0:
            recs.append("Visit the Career Roadmap page for a structured learning plan")

        return recs
