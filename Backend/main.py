from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn

from parser import parse_document
from skill_extractor import get_skill_gap
from ats_scorer import calculate_ats_score

# initialize FastAPI app
app = FastAPI(
    title="ResumeIQ API",
    description="AI powered resume job matching and skill gap analyzer",
    version="2.0.0"
)

# allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Health check endpoint"""
    return {"status": "ResumeIQ API is running"}


@app.post("/analyze")
async def analyze_resume(
    resume: UploadFile = File(...),
    job_description: str = Form(...)
):
    """
    Main endpoint — receives resume file + job description
    Returns ATS score, skill gap analysis, and keyword breakdown
    """

    # step 1 — validate file type
    filename = resume.filename.lower()
    if not (filename.endswith('.pdf') or filename.endswith('.docx')):
        return JSONResponse(
            status_code=400,
            content={"error": "Only PDF and DOCX files are supported"}
        )

    # step 2 — validate job description
    if not job_description or len(job_description.strip()) < 20:
        return JSONResponse(
            status_code=400,
            content={"error": "Please provide a valid job description"}
        )

    try:
        # step 3 — extract text from resume
        file_bytes = await resume.read()
        parse_result = parse_document(file_bytes, resume.filename)

        if not parse_result["success"]:
            return JSONResponse(
                status_code=400,
                content={"error": parse_result["error"]}
            )

        resume_text = parse_result["clean_text"]

        # step 4 — extract skill gap
        skill_results = get_skill_gap(resume_text, job_description)

        # step 5 — calculate ATS score
        ats_results = calculate_ats_score(
            resume_text,
            job_description,
            skill_results["skill_match_percent"]
        )

        # step 6 — combine everything into final response
        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "ats_score":         ats_results["ats_score"],
                "ats_label":         ats_results["ats_label"],
                "ats_breakdown":     ats_results["breakdown"],
                "matched_keywords":  ats_results["matched_keywords"],
                "missing_keywords":  ats_results["missing_keywords"],
                "matched_skills":    skill_results["matched_skills"],
                "missing_skills":    skill_results["missing_skills"],
                "extra_skills":      skill_results["extra_skills"],
                "skill_match_percent": skill_results["skill_match_percent"],
                "total_job_skills":  skill_results["total_job_skills"],
                "total_matched":     skill_results["total_matched"],
                "total_missing":     skill_results["total_missing"],
                "word_count":        parse_result["word_count"],
            }
        )

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": f"Analysis failed: {str(e)}"}
        )


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
