from fastapi import APIRouter
from app.api.v1.endpoints import health, scoring

api_router = APIRouter()

# Include endpoint routers
api_router.include_router(health.router, tags=["Health"])
api_router.include_router(scoring.router, prefix="/scoring", tags=["Scoring"])
