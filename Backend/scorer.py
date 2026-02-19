import numpy as np
from sklearn.metrics.pairwise import cosine_similarity


def calculate_overall_score(resume_embedding: np.ndarray, job_embedding: np.ndarray) -> float:
    """
    Compare full resume vs full job description
    Returns match percentage 0-100
    """
    score = cosine_similarity(
        resume_embedding.reshape(1, -1),
        job_embedding.reshape(1, -1)
    )[0][0]

    # convert to percentage and round
    return round(float(score) * 100, 2)


def rank_chunks(chunk_embeddings: list, job_embedding: np.ndarray) -> dict:
    """
    Compare each resume chunk against job description
    Returns most and least relevant sections
    """
    scored_chunks = []

    for chunk in chunk_embeddings:
        score = cosine_similarity(
            chunk["embedding"].reshape(1, -1),
            job_embedding.reshape(1, -1)
        )[0][0]

        scored_chunks.append({
            "text": chunk["chunk_text"],
            "score": round(float(score) * 100, 2)
        })

    # sort by score highest to lowest
    scored_chunks.sort(key=lambda x: x["score"], reverse=True)

    return {
        "all_chunks": scored_chunks,
        "most_relevant": scored_chunks[:2],   # top 2
        "least_relevant": scored_chunks[-2:]  # bottom 2
    }


def get_score_label(score: float) -> str:
    """
    Convert numeric score to human readable label
    """
    if score >= 95:
        return "Perfect Choice"
    elif score >= 80:
        return "Good Match"
    elif score >= 50:
        return "Average Match"
    else:
        return "Worst Match"


def analyze_match(embeddings: dict) -> dict:
    """
    Main function — call this from main.py
    Takes embeddings dict from embedder.py
    Returns complete scoring result
    """

    overall_score = calculate_overall_score(
        embeddings["resume_embedding"],
        embeddings["job_embedding"]
    )

    chunk_results = rank_chunks(
        embeddings["chunk_embeddings"],
        embeddings["job_embedding"]
    )

    return {
        "match_score": overall_score,
        "label": get_score_label(overall_score),
        "most_relevant_sections": chunk_results["most_relevant"],
        "least_relevant_sections": chunk_results["least_relevant"],
        "all_chunks": chunk_results["all_chunks"]
    }