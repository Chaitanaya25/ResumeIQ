import sys
import os
import glob

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from Backend.parser import parse_document
from Backend.embedder import embed_resume_and_job

# load resume
pdf_files = glob.glob(r"E:\ResumeIQ\*.pdf")
filename = os.path.basename(pdf_files[0])

with open(pdf_files[0], "rb") as f:
    file_bytes = f.read()

resume_result = parse_document(file_bytes, filename)
resume_text = resume_result["clean_text"]

# sample job description for testing
job_description = """
We are looking for a Python developer with experience in machine learning,
deep learning, and NLP. Candidates should know PyTorch, scikit-learn,
and have experience deploying models using FastAPI or Flask.
Knowledge of Docker and cloud platforms like AWS is a plus.
"""

# generate embeddings
embeddings = embed_resume_and_job(resume_text, job_description)

# verify output
print(f"\n📊 Results:")
print(f"Resume embedding shape: {embeddings['resume_embedding'].shape}")
print(f"Job embedding shape: {embeddings['job_embedding'].shape}")
print(f"Number of chunks: {len(embeddings['chunk_embeddings'])}")
print(f"First chunk preview: {embeddings['chunk_embeddings'][0]['chunk_text'][:100]}")
print(f"Chunk embedding shape: {embeddings['chunk_embeddings'][0]['embedding'].shape}")
print("\n✅ Embedder working correctly!")