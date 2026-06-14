import re
from collections import Counter


# Common tech skills database for matching
SKILL_DATABASE: dict[str, list[str]] = {
    "programming": [
        "python", "javascript", "typescript", "java", "c++", "c#", "go", "rust",
        "ruby", "php", "swift", "kotlin", "scala", "r",
    ],
    "frontend": [
        "react", "next.js", "nextjs", "vue", "angular", "html", "css", "tailwind",
        "sass", "redux", "webpack", "vite",
    ],
    "backend": [
        "node.js", "nodejs", "express", "django", "flask", "fastapi", "spring",
        "spring boot", "rails", "laravel", ".net",
    ],
    "database": [
        "sql", "mysql", "postgresql", "postgres", "mongodb", "redis", "sqlite",
        "dynamodb", "firebase", "elasticsearch",
    ],
    "cloud_devops": [
        "aws", "azure", "gcp", "docker", "kubernetes", "k8s", "ci/cd", "jenkins",
        "terraform", "ansible", "github actions", "gitlab",
    ],
    "data_ml": [
        "machine learning", "deep learning", "tensorflow", "pytorch", "pandas",
        "numpy", "scikit-learn", "nlp", "computer vision", "data analysis",
    ],
    "tools": [
        "git", "github", "gitlab", "jira", "figma", "postman", "linux", "bash",
        "agile", "scrum",
    ],
    "concepts": [
        "data structures", "algorithms", "system design", "oop", "rest api",
        "graphql", "microservices", "testing", "unit testing", "api design",
    ],
}

ALL_SKILLS: list[str] = []
for skills in SKILL_DATABASE.values():
    ALL_SKILLS.extend(skills)


def _normalize_skill(skill: str) -> str:
    return skill.lower().strip()


def extract_skills_from_text(text: str) -> list[str]:
    lower = text.lower()
    found: list[str] = []

    for skill in ALL_SKILLS:
        pattern = r"\b" + re.escape(skill) + r"\b"
        if re.search(pattern, lower):
            display = skill.title() if len(skill) > 3 else skill.upper()
            if skill in ("next.js", "nextjs"):
                display = "Next.js"
            elif skill in ("node.js", "nodejs"):
                display = "Node.js"
            elif skill == "ci/cd":
                display = "CI/CD"
            elif skill == "c++":
                display = "C++"
            elif skill == "c#":
                display = "C#"
            if display not in found:
                found.append(display)

    return found


def extract_keywords_from_job_description(job_description: str, top_n: int = 30) -> list[str]:
    lower = job_description.lower()
    found_skills = extract_skills_from_text(job_description)

    # Extract capitalized multi-word terms and important nouns
    extra_terms = re.findall(
        r"\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+\b",
        job_description,
    )

    words = re.findall(r"\b[a-z]{4,}\b", lower)
    stopwords = {
        "with", "that", "this", "from", "have", "will", "your", "their",
        "about", "would", "should", "could", "been", "being", "other",
        "which", "while", "where", "when", "what", "some", "such", "into",
        "over", "also", "than", "then", "them", "these", "those", "able",
        "work", "team", "role", "join", "looking", "experience", "years",
        "required", "preferred", "strong", "good", "excellent", "knowledge",
    }
    word_freq = Counter(w for w in words if w not in stopwords)

    keywords = list(found_skills)
    for term in extra_terms[:5]:
        if term not in keywords:
            keywords.append(term)

    for word, _ in word_freq.most_common(top_n):
        display = word.title()
        if display not in keywords and len(keywords) < top_n:
            keywords.append(display)

    return keywords[:top_n]


def match_keywords(resume_text: str, keywords: list[str]) -> tuple[list[str], list[str]]:
    lower = resume_text.lower()
    found: list[str] = []
    missing: list[str] = []

    for kw in keywords:
        if kw.lower() in lower:
            found.append(kw)
        else:
            missing.append(kw)

    return found, missing


def get_role_skills(target_role: str) -> list[str]:
    role = target_role.lower()
    skills: list[str] = []

    if any(w in role for w in ["frontend", "front-end", "ui", "react"]):
        skills.extend(SKILL_DATABASE["frontend"])
        skills.extend(["javascript", "typescript", "html", "css"])
    elif any(w in role for w in ["backend", "back-end", "api", "server"]):
        skills.extend(SKILL_DATABASE["backend"])
        skills.extend(SKILL_DATABASE["database"])
    elif any(w in role for w in ["full stack", "fullstack", "full-stack"]):
        for cat in ["frontend", "backend", "database"]:
            skills.extend(SKILL_DATABASE[cat])
    elif any(w in role for w in ["data", "ml", "machine learning", "ai"]):
        skills.extend(SKILL_DATABASE["data_ml"])
        skills.extend(["python", "sql"])
    elif any(w in role for w in ["devops", "sre", "cloud"]):
        skills.extend(SKILL_DATABASE["cloud_devops"])
    else:
        skills.extend(SKILL_DATABASE["programming"])
        skills.extend(SKILL_DATABASE["frontend"][:4])
        skills.extend(SKILL_DATABASE["backend"][:4])
        skills.extend(SKILL_DATABASE["database"][:4])

    skills.extend(SKILL_DATABASE["concepts"][:5])
    skills.extend(SKILL_DATABASE["tools"][:4])

    seen: set[str] = set()
    unique: list[str] = []
    for s in skills:
        key = _normalize_skill(s)
        if key not in seen:
            seen.add(key)
            unique.append(s.title() if len(s) > 3 else s.upper())

    return unique
