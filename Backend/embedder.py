from sentence_transformers import SentenceTransformer
import numpy as np

# load model once when file is imported
# downloads ~80MB first time, then cached locally
print("Loading sentence transformer model...")
model = SentenceTransformer('all-MiniLM-L6-v2')
print("[OK] Model loaded successfully")


def generate_embedding(text: str) -> np.ndarray:
    """
    Convert a single text into a 384-dimensional vector
    Used for full resume and full job description
    """
    embedding = model.encode(text, convert_to_numpy=True)
    return embedding


def generate_chunk_embeddings(text: str, chunk_size: int = 100) -> list:
    """
    Split text into chunks and embed each one separately
    Used for section-level matching (most/least relevant parts)
    Returns list of dicts with chunk text and its embedding
    """
    words = text.split()
    chunks = []

    # split text into chunks of chunk_size words
    for i in range(0, len(words), chunk_size):
        chunk_text = " ".join(words[i:i + chunk_size])
        if len(chunk_text.strip()) > 20:  # skip very short chunks
            chunks.append(chunk_text)

    if not chunks:
        return []

    # embed all chunks at once (faster than one by one)
    embeddings = model.encode(chunks, convert_to_numpy=True)

    # pair each chunk with its embedding
    result = []
    for i, chunk in enumerate(chunks):
        result.append({
            "chunk_text": chunk,
            "embedding": embeddings[i]
        })

    return result


def embed_resume_and_job(resume_text: str, job_text: str) -> dict:
    """
    Main function — call this from scorer.py
    Takes both texts, returns all embeddings needed
    """
    
    print("Generating embeddings...")

    resume_embedding = generate_embedding(resume_text)
    job_embedding = generate_embedding(job_text)
    chunk_embeddings = generate_chunk_embeddings(resume_text)

    print(f"[OK] Generated embeddings for {len(chunk_embeddings)} resume chunks")

    return {
        "resume_embedding": resume_embedding,
        "job_embedding": job_embedding,
        "chunk_embeddings": chunk_embeddings
    }