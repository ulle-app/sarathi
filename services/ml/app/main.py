from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from app.config import settings
from app.api.v1.router import api_router

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.log_level.upper()),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events."""
    # Startup
    logger.info("Starting ML Service...")
    logger.info(f"Environment: {settings.environment}")

    # Optional: Set up keep-alive for Render free tier
    if settings.environment == "production":
        try:
            import aiocron
            import httpx

            @aiocron.crontab('*/14 * * * *')
            async def keep_alive():
                """Ping self every 14 minutes to prevent Render spindown."""
                try:
                    async with httpx.AsyncClient() as client:
                        await client.get(f"{settings.base_url}/api/v1/health")
                        logger.debug("Keep-alive ping successful")
                except Exception as e:
                    logger.warning(f"Keep-alive ping failed: {e}")

            logger.info("Keep-alive cron job scheduled")
        except ImportError:
            logger.warning("aiocron not available, keep-alive disabled")

    yield

    # Shutdown
    logger.info("Shutting down ML Service...")


# Create FastAPI app
app = FastAPI(
    title="SkillSphere ML Service",
    description="Psychometric scoring and career matching service",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix=settings.api_v1_prefix)


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "name": "SkillSphere ML Service",
        "version": "1.0.0",
        "status": "running",
    }
