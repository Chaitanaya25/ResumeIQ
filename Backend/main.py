from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from parser import parse_document
from skill_extractor import get_skill_gap
from ats_scorer import calculate_ats_score

# -----------------------------
# Initialize FastAPI app
# -----------------------------
app = FastAPI(
    title="ResumeIQ API",
    description="AI powered resume job matching and skill gap analyzer",
    version="2.0.0"
)

# -----------------------------
# CORS Configuration (Fixed)
# -----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # Allow all origins
    allow_credentials=False,      # MUST be False when using "*"
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Health Check
# -----------------------------
@app.get("/")
async def root():
    return {"status": "ResumeIQ API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# -----------------------------
# Main Analysis Endpoint
# -----------------------------
@app.post("/analyze")
async def analyze_resume(
    resume: UploadFile = File(...),
    job_description: str = Form(...)
):

    # 1️⃣ Validate file type
    filename = resume.filename.lower()
    if not filename.endswith((".pdf", ".docx")):
        raise HTTPException(
            status_code=400,
            detail="Only PDF and DOCX files are supported"
        )

    # 2️⃣ Validate job description
    if not job_description or len(job_description.strip()) < 20:
        raise HTTPException(
            status_code=400,
            detail="Please provide a valid job description"
        )

    try:
        # 3️⃣ Extract text
        file_bytes = await resume.read()
        parse_result = parse_document(file_bytes, resume.filename)

        if not parse_result["success"]:
            raise HTTPException(
                status_code=400,
                detail=parse_result["error"]
            )

        resume_text = parse_result["clean_text"]

        # 4️⃣ Skill Gap Analysis
        skill_results = get_skill_gap(resume_text, job_description)

        # 5️⃣ ATS Score Calculation
        ats_results = calculate_ats_score(
            resume_text,
            job_description,
            skill_results["skill_match_percent"]
        )

        # 6️⃣ Return final response
        return {
            "success": True,
            "ats_score": ats_results["ats_score"],
            "ats_label": ats_results["ats_label"],
            "ats_breakdown": ats_results["breakdown"],
            "matched_keywords": ats_results["matched_keywords"],
            "missing_keywords": ats_results["missing_keywords"],
            "matched_skills": skill_results["matched_skills"],
            "missing_skills": skill_results["missing_skills"],
            "extra_skills": skill_results["extra_skills"],
            "skill_match_percent": skill_results["skill_match_percent"],
            "total_job_skills": skill_results["total_job_skills"],
            "total_matched": skill_results["total_matched"],
            "total_missing": skill_results["total_missing"],
            "word_count": parse_result["word_count"],
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}"
        )