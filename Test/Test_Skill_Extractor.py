import sys
import os
import glob

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from Backend.parser import parse_document
from Backend.skill_extractor import get_skill_gap

# load resume
pdf_files = glob.glob(r"E:\ResumeIQ\*.pdf")
filename = os.path.basename(pdf_files[0])

with open(pdf_files[0], "rb") as f:
    file_bytes = f.read()

resume_result = parse_document(file_bytes, filename)
resume_text = resume_result["clean_text"]

job_description = """
We are looking for a Python developer with experience in machine learning,
deep learning, and NLP. Candidates should know PyTorch, scikit-learn,
and have experience deploying models using FastAPI or Flask.
Knowledge of Docker and cloud platforms like AWS is a plus.
"""

results = get_skill_gap(resume_text, job_description)

print(f"\n{'='*50}")
print(f"SKILL MATCH: {results['skill_match_percent']}%")
print(f"Matched {results['total_matched']} of {results['total_job_skills']} required skills")

print(f"\n✅ MATCHED SKILLS ({len(results['matched_skills'])}):")
print(", ".join(results['matched_skills']) if results['matched_skills'] else "None found")

print(f"\n❌ MISSING SKILLS ({len(results['missing_skills'])}):")
print(", ".join(results['missing_skills']) if results['missing_skills'] else "None missing")

print(f"\n⭐ YOUR EXTRA SKILLS ({len(results['extra_skills'])}):")
print(", ".join(results['extra_skills']) if results['extra_skills'] else "None")
print(f"{'='*50}")