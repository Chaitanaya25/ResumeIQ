import json
import os
import re

# load skills dictionary
SKILLS_PATH = os.path.join(os.path.dirname(__file__), 'skills.json')
with open(SKILLS_PATH, 'r') as f:
    SKILLS_DATA = json.load(f)

# flatten skills into a list of dicts with name + all aliases
ALL_SKILLS = []

for category, category_data in SKILLS_DATA["technical_skills_taxonomy"].items():
    for skill_obj in category_data["skills"]:
        skill_entry = {
            "name": skill_obj["name"],
            "patterns": [skill_obj["name"]] + skill_obj.get("aliases", [])
        }
        ALL_SKILLS.append(skill_entry)

print(f"✅ Loaded {len(ALL_SKILLS)} skills from dictionary")


def match_skill_in_text(skill_entry: dict, text: str) -> bool:
    """
    Check if a skill or any of its aliases appear in text
    Handles multi-word skills, hyphens, dots, plus signs
    """
    for pattern in skill_entry["patterns"]:
        if not pattern:
            continue

        # escape special regex characters
        escaped = re.escape(pattern)

        # use word boundary for single word skills
        # use flexible spacing for multi-word skills
        if " " in pattern:
            # multi-word: allow flexible whitespace between words
            flexible = r'\s+'.join(escaped.split(r'\ '))
            regex = r'(?i)(?<!\w)' + flexible + r'(?!\w)'
        else:
            regex = r'(?i)\b' + escaped + r'\b'

        if re.search(regex, text):
            return True

    return False


def extract_skills(text: str) -> list:
    """
    Find all skills present in a given text
    Returns list of skill names (canonical names)
    """
    found_skills = []

    for skill_entry in ALL_SKILLS:
        if match_skill_in_text(skill_entry, text):
            found_skills.append(skill_entry["name"])

    return sorted(found_skills)


def get_skill_gap(resume_text: str, job_text: str) -> dict:
    """
    Main function — call this from main.py
    Compares skills in resume vs skills required in job
    """
    resume_skills = set(extract_skills(resume_text))
    job_skills = set(extract_skills(job_text))

    matched_skills = resume_skills.intersection(job_skills)
    missing_skills = job_skills - resume_skills
    extra_skills = resume_skills - job_skills

    # skill match percentage based on job requirements
    if len(job_skills) > 0:
        skill_match_percent = round(len(matched_skills) / len(job_skills) * 100, 2)
    else:
        skill_match_percent = 0.0

    return {
        "resume_skills": sorted(list(resume_skills)),
        "job_skills": sorted(list(job_skills)),
        "matched_skills": sorted(list(matched_skills)),
        "missing_skills": sorted(list(missing_skills)),
        "extra_skills": sorted(list(extra_skills)),
        "skill_match_percent": skill_match_percent,
        "total_job_skills": len(job_skills),
        "total_matched": len(matched_skills),
        "total_missing": len(missing_skills)
    }