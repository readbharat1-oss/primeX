from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from router import api_router

app = FastAPI(
    title="PrimeLens AI API",
    description="Production backend for AI facial analysis and glow-up roadmap generation.",
    version="1.0.0"
)

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include main API router
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {
        "message": "PrimeLens AI Vision Engine is Live",
        "docs": "/docs",
        "api_root": "/api/v1"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "PrimeLens AI Vision Engine"}
