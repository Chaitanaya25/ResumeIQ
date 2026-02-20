import json
import os
import re


# Load skills dictionary once at module level (same source as skill_extractor.py)
_SKILLS_PATH = os.path.join(os.path.dirname(__file__), 'skills.json')
with open(_SKILLS_PATH, 'r') as _f:
    _SKILLS_DATA = json.load(_f)

# Flat list of all canonical skill names + aliases (original casing preserved)
_SKILL_PATTERNS: list = []
for _cat in _SKILLS_DATA["technical_skills_taxonomy"].values():
    for _skill in _cat["skills"]:
        _SKILL_PATTERNS.append(_skill["name"])
        _SKILL_PATTERNS.extend(_skill.get("aliases", []))


_BLACKLIST = {
    'location', 'remote', 'experience', 'type', 'full', 'time', 'internship',
    'about', 'looking', 'responsibilities', 'required', 'skills', 'good',
    'have', 'qualifications', 'education', 'year', 'fresher', 'role', 'ideal',
    'candidate', 'should', 'hands', 'based', 'using', 'build', 'train',
    'perform', 'develop', 'manage', 'implement', 'design', 'training',
    'services', 'applications', 'features', 'solutions', 'systems', 'products',
    'building', 'passion', 'strong', 'real', 'world', 'portfolio',
    'demonstrating', 'specialization', 'pursuing', 'completed', 'exposure',
    'basics', 'key', 'our', 'the', 'and', 'for', 'with', 'that', 'this',
    'are', 'you', 'will', 'from', 'your', 'been', 'they', 'their', 'also',
    'into', 'such', 'more', 'both', 'each', 'well', 'able', 'new', 'any',
    'all', 'can', 'its', 'plus', 'via', 'per', 'vs', 'etc', 'or', 'of',
    'in', 'is', 'it', 'be', 'as', 'at', 'to', 'do', 'by', 'we', 'an',
    'on', 'work', 'team', 'must', 'other', 'high', 'some', 'than', 'like',
    'what', 'when', 'who', 'how', 'use', 'need', 'join', 'help', 'make',
    'know', 'give', 'take', 'come', 'seek',
}


def extract_keywords(text: str) -> list:
    """
    Extract meaningful technical keywords from JD text.

    Rule 1 — exact match against every skill name/alias in skills.json
    Rule 2 — supplementary regex for CamelCase tools, tech suffixes, acronyms
    Rule 3 — hard blacklist of non-technical words
    Rule 4 — deduplicate, min 2 chars, no pure numbers, cap at 40
    """
    found = []

    # Rule 1: match every known skill / alias against the JD (case-insensitive)
    for pattern_str in _SKILL_PATTERNS:
        escaped = re.escape(pattern_str)
        if re.search(r'\b' + escaped + r'\b', text, re.IGNORECASE):
            found.append(pattern_str)

    # Rule 2a: CamelCase words (e.g. SQLAlchemy, FastAPI)
    found.extend(re.findall(r'\b(?:[A-Z][a-z]+){2,}\w*\b', text))

    # Rule 2b: known technical suffixes (.js, .py, API, ML, AI)
    found.extend(re.findall(r'\b\w+(?:\.js|\.py|API|ML|AI)\b', text, re.IGNORECASE))

    # Rule 2c: 2-5 uppercase-letter acronyms (CNN, JWT, REST, NLP, CRUD)
    found.extend(re.findall(r'\b[A-Z]{2,5}\b', text))

    # Rules 3 & 4: filter, deduplicate, cap
    seen: set = set()
    result = []
    for kw in found:
        kw_clean = kw.strip()
        kw_lower = kw_clean.lower()
        if (
            kw_lower not in _BLACKLIST
            and len(kw_clean) >= 2
            and not kw_clean.isdigit()
            and kw_lower not in seen
        ):
            seen.add(kw_lower)
            result.append(kw_clean)
        if len(result) >= 40:
            break

    return result


def keyword_match_score(resume_text: str, jd_text: str) -> dict:
    """
    Component 1 — Keyword Match Score (40% weight).
    """
    jd_keywords = extract_keywords(jd_text)

    if not jd_keywords:
        return {"score": 0.0, "matched": [], "missing": []}

    matched = []
    missing = []

    for keyword in jd_keywords:
        pattern = re.escape(keyword)
        if re.search(pattern, resume_text, re.IGNORECASE):
            matched.append(keyword)
        else:
            missing.append(keyword)

    score = round(len(matched) / len(jd_keywords) * 100, 2)
    return {"score": score, "matched": matched, "missing": missing}


def section_structure_score(resume_text: str) -> float:
    """
    Component 3 — Section Structure Score (15% weight).
    """
    text_lower = resume_text.lower()
    total = 0

    if re.search(r'\b(experience|projects?)\b', text_lower):
        total += 25
    if re.search(r'\beducation\b', text_lower):
        total += 25
    if re.search(r'\bskills?\b', text_lower):
        total += 25
    if re.search(r'\b(summary|objective|career)\b', text_lower):
        total += 25

    return float(total)


def achievement_score(resume_text: str) -> float:
    """
    Component 4 — Achievement Score (15% weight).
    """
    count = 0

    count += len(re.findall(r'\d+\.?\d*\s*%', resume_text))
    count += len(re.findall(r'\b\d+\s+[a-zA-Z]+', resume_text))

    action_words = [
        'improved', 'achieved', 'reduced', 'increased',
        'built', 'designed', 'developed', 'deployed',
    ]
    for word in action_words:
        count += len(re.findall(r'\b' + word + r'\b', resume_text, re.IGNORECASE))

    return min(count * 10, 100.0)


def get_ats_label(score: float) -> str:
    if score >= 95:
        return "Perfect Match"
    elif score >= 80:
        return "Strong Match"
    elif score >= 60:
        return "Good Match"
    elif score >= 40:
        return "Partial Match"
    else:
        return "Low Match"


def calculate_ats_score(
    resume_text: str,
    job_description: str,
    skill_match_percent: float
) -> dict:
    """
    Main function — calculates weighted ATS score from 4 components.
    """
    # Component 1: Keyword Match (40%)
    kw_result = keyword_match_score(resume_text, job_description)
    keyword_score = kw_result["score"]

    # Component 2: Skill Coverage (30%)
    skill_score = round(skill_match_percent, 2)

    # Component 3: Section Structure (15%)
    section_score = section_structure_score(resume_text)

    # Component 4: Achievements (15%)
    ach_score = achievement_score(resume_text)

    # Weighted final score
    ats_score = round(
        keyword_score * 0.40 +
        skill_score   * 0.30 +
        section_score * 0.15 +
        ach_score     * 0.15,
        2
    )

    return {
        "ats_score": ats_score,
        "ats_label": get_ats_label(ats_score),
        "breakdown": {
            "keyword_match":     {"score": keyword_score, "weight": 40},
            "skill_coverage":    {"score": skill_score,   "weight": 30},
            "section_structure": {"score": section_score, "weight": 15},
            "achievements":      {"score": ach_score,     "weight": 15},
        },
        "matched_keywords":      kw_result["matched"],
        "missing_keywords":      kw_result["missing"],
        "keyword_match_percent": keyword_score,
    }