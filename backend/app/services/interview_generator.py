import uuid

from app.models.schemas import (
    Difficulty,
    InterviewCategory,
    InterviewQuestion,
    InterviewResponse,
)
from app.utils.keyword_extractor import extract_skills_from_text


QUESTION_BANK: dict[str, list[dict]] = {
    "technical": [
        {
            "question": "Explain the difference between let, const, and var in JavaScript.",
            "difficulty": Difficulty.EASY,
            "hint": "Focus on scope, hoisting, and reassignment rules.",
        },
        {
            "question": "What is the virtual DOM and how does React use it?",
            "difficulty": Difficulty.MEDIUM,
            "hint": "Explain reconciliation, diffing algorithm, and performance benefits.",
        },
        {
            "question": "How would you optimize the performance of a React application?",
            "difficulty": Difficulty.MEDIUM,
            "hint": "Mention memoization, code splitting, lazy loading, and virtualization.",
        },
        {
            "question": "Explain REST vs GraphQL. When would you choose each?",
            "difficulty": Difficulty.MEDIUM,
            "hint": "Compare over-fetching, under-fetching, caching, and complexity.",
        },
        {
            "question": "Design a URL shortening service like bit.ly.",
            "difficulty": Difficulty.HARD,
            "hint": "Cover hashing, database schema, caching, and scalability.",
        },
        {
            "question": "Explain time and space complexity of common sorting algorithms.",
            "difficulty": Difficulty.MEDIUM,
            "hint": "Compare quicksort, mergesort, and heapsort with Big-O notation.",
        },
        {
            "question": "What are microservices and what are their trade-offs vs monoliths?",
            "difficulty": Difficulty.HARD,
            "hint": "Discuss deployment, communication, data consistency, and team structure.",
        },
        {
            "question": "How does Python's GIL affect multithreading?",
            "difficulty": Difficulty.HARD,
            "hint": "Explain Global Interpreter Lock and when to use multiprocessing instead.",
        },
    ],
    "behavioral": [
        {
            "question": "Tell me about a time you faced a conflict in a team project.",
            "difficulty": Difficulty.MEDIUM,
            "hint": "Use the STAR method: Situation, Task, Action, Result.",
        },
        {
            "question": "Describe a project where you had to learn a new technology quickly.",
            "difficulty": Difficulty.MEDIUM,
            "hint": "Highlight your learning approach and the outcome achieved.",
        },
        {
            "question": "Tell me about a time you failed and what you learned from it.",
            "difficulty": Difficulty.MEDIUM,
            "hint": "Be honest, focus on growth and what you'd do differently.",
        },
        {
            "question": "Describe a situation where you had to meet a tight deadline.",
            "difficulty": Difficulty.EASY,
            "hint": "Explain prioritization, communication, and how you delivered.",
        },
        {
            "question": "Give an example of when you took initiative beyond your assigned tasks.",
            "difficulty": Difficulty.MEDIUM,
            "hint": "Show proactivity and impact on the team or product.",
        },
    ],
    "hr": [
        {
            "question": "Why do you want to join our company?",
            "difficulty": Difficulty.EASY,
            "hint": "Research the company and align your goals with their mission.",
        },
        {
            "question": "Where do you see yourself in 5 years?",
            "difficulty": Difficulty.EASY,
            "hint": "Show ambition aligned with growth at the company.",
        },
        {
            "question": "What are your salary expectations?",
            "difficulty": Difficulty.MEDIUM,
            "hint": "Research market rates and provide a reasonable range.",
        },
        {
            "question": "Why should we hire you over other candidates?",
            "difficulty": Difficulty.MEDIUM,
            "hint": "Highlight unique skills, projects, and cultural fit.",
        },
    ],
}


class InterviewGeneratorService:
    def generate(
        self,
        target_role: str,
        company: str | None = None,
        experience_level: str = "Fresher",
        count: int = 6,
        resume_text: str | None = None,
    ) -> InterviewResponse:
        questions: list[InterviewQuestion] = []
        role_lower = target_role.lower()

        # Role-specific technical questions
        if any(w in role_lower for w in ["frontend", "react", "ui"]):
            questions.append(self._make_q(
                InterviewCategory.TECHNICAL,
                "Explain the React component lifecycle and hooks equivalents.",
                Difficulty.MEDIUM,
                "Cover useEffect, useState, and cleanup functions.",
            ))
        elif any(w in role_lower for w in ["backend", "api", "python"]):
            questions.append(self._make_q(
                InterviewCategory.TECHNICAL,
                "Explain database indexing and when it helps vs hurts performance.",
                Difficulty.MEDIUM,
                "Discuss B-trees, query plans, and write amplification.",
            ))
        elif any(w in role_lower for w in ["data", "ml", "machine learning"]):
            questions.append(self._make_q(
                InterviewCategory.TECHNICAL,
                "Explain bias-variance tradeoff in machine learning models.",
                Difficulty.MEDIUM,
                "Use examples of overfitting and underfitting.",
            ))

        # Skill-based questions from resume
        if resume_text:
            skills = extract_skills_from_text(resume_text)[:3]
            for skill in skills:
                questions.append(self._make_q(
                    InterviewCategory.TECHNICAL,
                    f"Describe your experience with {skill} and a project where you used it.",
                    Difficulty.MEDIUM,
                    f"Prepare a specific project example demonstrating {skill} proficiency.",
                ))

        # Fill from question bank
        categories = [
            (InterviewCategory.TECHNICAL, 0.5),
            (InterviewCategory.BEHAVIORAL, 0.3),
            (InterviewCategory.HR, 0.2),
        ]

        for category, ratio in categories:
            needed = max(1, int(count * ratio))
            bank = QUESTION_BANK[category.value]
            for item in bank:
                if len(questions) >= count:
                    break
                q_text = item["question"]
                if company and category == InterviewCategory.HR:
                    q_text = q_text.replace("our company", company)
                questions.append(self._make_q(
                    category,
                    q_text,
                    item["difficulty"],
                    item.get("hint"),
                ))
                needed -= 1
                if needed <= 0:
                    break

        # Deduplicate and trim
        seen: set[str] = set()
        unique: list[InterviewQuestion] = []
        for q in questions:
            if q.question not in seen:
                seen.add(q.question)
                unique.append(q)

        return InterviewResponse(
            questions=unique[:count],
            role=target_role,
            total=min(count, len(unique)),
        )

    def _make_q(
        self,
        category: InterviewCategory,
        question: str,
        difficulty: Difficulty,
        hint: str | None = None,
    ) -> InterviewQuestion:
        return InterviewQuestion(
            id=str(uuid.uuid4())[:8],
            category=category,
            question=question,
            difficulty=difficulty,
            hint=hint,
        )
