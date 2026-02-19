import sys
import os
import glob

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from Backend.parser import parse_document
from Backend.embedder import embed_resume_and_job
from Backend.scorer import analyze_match

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

# run full pipeline
embeddings = embed_resume_and_job(resume_text, job_description)
results = analyze_match(embeddings)

# print results
print(f"\n{'='*50}")
print(f"MATCH SCORE: {results['match_score']}%")
print(f"LABEL: {results['label']}")
print(f"\n📗 MOST RELEVANT SECTIONS:")
for i, section in enumerate(results['most_relevant_sections']):
    print(f"\n  [{i+1}] Score: {section['score']}%")
    print(f"  Text: {section['text'][:150]}...")

print(f"\n📕 LEAST RELEVANT SECTIONS:")
for i, section in enumerate(results['least_relevant_sections']):
    print(f"\n  [{i+1}] Score: {section['score']}%")
    print(f"  Text: {section['text'][:150]}...")
print(f"{'='*50}")