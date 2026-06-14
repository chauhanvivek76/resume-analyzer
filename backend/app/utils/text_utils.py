import re


def normalize_text(text: str) -> str:
    text = text.replace("\x00", "")
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def word_count(text: str) -> int:
    return len(text.split())


def extract_sentences(text: str) -> list[str]:
    return [s.strip() for s in re.split(r"[.!?]+", text) if s.strip()]


def contains_quantifiable_metrics(text: str) -> bool:
    patterns = [
        r"\d+%",
        r"\$\d+",
        r"\d+\+?\s*(users|customers|projects|team|engineers|people)",
        r"(increased|decreased|reduced|improved|saved|grew)\s+\w*\s*\d+",
        r"\d+x",
    ]
    return any(re.search(p, text, re.IGNORECASE) for p in patterns)


def has_standard_sections(text: str) -> bool:
    sections = ["experience", "education", "skills", "projects"]
    lower = text.lower()
    return sum(1 for s in sections if s in lower)


def estimate_readability(text: str) -> int:
    sentences = extract_sentences(text)
    if not sentences:
        return 50

    words = word_count(text)
    avg_sentence_len = words / max(len(sentences), 1)

    score = 100
    if avg_sentence_len > 30:
        score -= 20
    elif avg_sentence_len > 20:
        score -= 10

    if words < 150:
        score -= 15
    elif words > 900:
        score -= 10

    return max(30, min(100, score))
