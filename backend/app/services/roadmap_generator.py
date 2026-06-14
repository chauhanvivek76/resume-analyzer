from app.models.schemas import RoadmapPhase, RoadmapResponse, RoadmapStatus
from app.utils.keyword_extractor import get_role_skills


ROADMAP_TEMPLATES: dict[str, dict] = {
    "foundation": {
        "title": "Foundation & DSA",
        "duration": "4 weeks",
        "tasks": [
            "Complete arrays, strings, and linked lists",
            "Practice 50 easy LeetCode problems",
            "Learn time & space complexity analysis",
            "Study sorting and searching algorithms",
        ],
    },
    "frontend": {
        "title": "Frontend Mastery",
        "duration": "3 weeks",
        "tasks": [
            "Build 2 projects with React & Next.js",
            "Learn state management (Redux/Zustand)",
            "Master CSS Grid, Flexbox, and Tailwind",
            "Implement responsive design patterns",
        ],
    },
    "backend": {
        "title": "Backend & Databases",
        "duration": "3 weeks",
        "tasks": [
            "Build REST APIs with Node.js or Python",
            "Learn SQL queries and database design",
            "Implement authentication with JWT",
            "Practice API testing with Postman",
        ],
    },
    "system_design": {
        "title": "System Design Basics",
        "duration": "2 weeks",
        "tasks": [
            "Study scalability concepts (load balancing, caching)",
            "Design 3 classic system design problems",
            "Learn about microservices architecture",
            "Understand CAP theorem and trade-offs",
        ],
    },
    "interview": {
        "title": "Interview Preparation",
        "duration": "2 weeks",
        "tasks": [
            "Mock interviews (technical + behavioral)",
            "Revise all projects for resume discussion",
            "Company-specific preparation",
            "Practice STAR method for behavioral questions",
        ],
    },
    "devops": {
        "title": "DevOps & Cloud",
        "duration": "2 weeks",
        "tasks": [
            "Learn Docker containerization basics",
            "Deploy a project to AWS/GCP/Azure",
            "Set up CI/CD pipeline with GitHub Actions",
            "Understand Kubernetes fundamentals",
        ],
    },
    "data_ml": {
        "title": "Data & ML Foundations",
        "duration": "3 weeks",
        "tasks": [
            "Master pandas and numpy for data manipulation",
            "Build a machine learning project end-to-end",
            "Learn model evaluation metrics",
            "Study feature engineering techniques",
        ],
    },
}


class RoadmapGeneratorService:
    def generate(
        self,
        target_role: str,
        timeline: str = "3 months",
        current_level: str = "Intermediate",
        resume_text: str | None = None,
        skill_gaps: list[str] | None = None,
    ) -> RoadmapResponse:
        role_lower = target_role.lower()
        phase_keys = ["foundation"]

        if any(w in role_lower for w in ["frontend", "full stack", "fullstack", "react"]):
            phase_keys.append("frontend")

        if any(w in role_lower for w in ["backend", "full stack", "fullstack", "api"]):
            phase_keys.append("backend")

        if any(w in role_lower for w in ["data", "ml", "machine learning"]):
            phase_keys.append("data_ml")

        if any(w in role_lower for w in ["devops", "sre", "cloud"]):
            phase_keys.append("devops")

        if "senior" in current_level.lower() or "advanced" in current_level.lower():
            phase_keys.append("system_design")

        phase_keys.append("interview")

        # Add skill-gap specific tasks to relevant phases
        gap_tasks = self._gap_tasks(skill_gaps or [])

        phases: list[RoadmapPhase] = []
        level_lower = current_level.lower()

        for idx, key in enumerate(phase_keys):
            template = ROADMAP_TEMPLATES[key]
            tasks = list(template["tasks"])

            if key == "frontend" and gap_tasks.get("frontend"):
                tasks.extend(gap_tasks["frontend"])
            if key == "backend" and gap_tasks.get("backend"):
                tasks.extend(gap_tasks["backend"])

            if idx == 0 and "beginner" in level_lower:
                status = RoadmapStatus.IN_PROGRESS
            elif idx == 0 and "intermediate" in level_lower:
                status = RoadmapStatus.COMPLETED
            elif idx == 1 and "intermediate" in level_lower:
                status = RoadmapStatus.IN_PROGRESS
            else:
                status = RoadmapStatus.UPCOMING

            phases.append(
                RoadmapPhase(
                    id=str(idx + 1),
                    title=template["title"],
                    duration=template["duration"],
                    status=status,
                    tasks=tasks[:6],
                )
            )

        completed = sum(1 for p in phases if p.status == RoadmapStatus.COMPLETED)
        in_progress = sum(1 for p in phases if p.status == RoadmapStatus.IN_PROGRESS)
        progress = round(((completed + in_progress * 0.5) / len(phases)) * 100)

        return RoadmapResponse(
            target_role=target_role,
            timeline=timeline,
            overall_progress=progress,
            phases=phases,
        )

    def _gap_tasks(self, gaps: list[str]) -> dict[str, list[str]]:
        result: dict[str, list[str]] = {"frontend": [], "backend": []}
        frontend_kw = {"react", "next", "css", "html", "vue", "angular", "tailwind"}
        backend_kw = {"node", "python", "java", "sql", "api", "docker", "kubernetes"}

        for gap in gaps:
            lower = gap.lower()
            if any(k in lower for k in frontend_kw):
                result["frontend"].append(f"Deep dive into {gap} with a hands-on project")
            elif any(k in lower for k in backend_kw):
                result["backend"].append(f"Build a project showcasing {gap} skills")

        return result
