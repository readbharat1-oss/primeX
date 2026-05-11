from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import List, Optional
import uuid
import time
try:
    from services.vision import analyze_face_image
    from services.report import generate_pdf_report
except ImportError:
    try:
        from ..services.vision import analyze_face_image
        from ..services.report import generate_pdf_report
    except ImportError:
        from api.services.vision import analyze_face_image
        from api.services.report import generate_pdf_report
from fastapi.responses import Response

api_router = APIRouter()

class AnalysisResult(BaseModel):
    id: str
    status: str
    scores: dict
    metrics: list
    recommendations: dict

@api_router.post("/analyze", response_model=AnalysisResult)
async def upload_and_analyze(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File provided is not an image.")
    
    # Read image bytes
    contents = await file.read()
    
    try:
        # Pass bytes to vision service
        result = analyze_face_image(contents)
        
        return AnalysisResult(
            id=str(uuid.uuid4()),
            status="completed",
            scores=result["scores"],
            metrics=result["metrics"],
            recommendations=result["recommendations"]
        )
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"BACKEND CRASH:\n{error_details}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}\n{error_details}")

@api_router.get("/reports/{report_id}")
async def get_report(report_id: str):
    # Mock endpoint to retrieve a report
    return {"id": report_id, "status": "unlocked"}

@api_router.get("/reports/{report_id}/download")
async def download_report(report_id: str):
    # In a real app, you'd fetch the analysis from DB using report_id
    # Here we'll generate a dummy one for the demo
    from services.vision import generate_mock_scores
    mock_data = generate_mock_scores(detected=True)
    
    pdf_bytes = generate_pdf_report(mock_data)
    
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=LooksMax_Report_{report_id}.pdf"
        }
    )

@api_router.post("/payments/webhook")
async def payment_webhook(payload: dict):
    # Mock payment webhook for UPI/Stripe integration
    print(f"Payment received: {payload}")
    return {"status": "success"}
