from fastapi import APIRouter, HTTPException, Header
from typing import Optional, Dict, List, Any
from pydantic import BaseModel, Field
from app.models.schemas import (
    ScoreProfileRequest,
    ScoreProfileResponse,
    CareerMatchRequest,
    CareerMatchResponse,
)
from app.services.psychometric import psychometric_scorer
from app.services.psychometric_enhanced import unified_scorer
from app.services.career_match import career_matcher
from app.services.recommendations import life_stage_recommender
from app.config import settings

router = APIRouter()


class RecommendationRequest(BaseModel):
    """Request for life-stage specific recommendations."""
    academic_level: str = Field(..., description="User's academic level: grade_10, grade_12, undergraduate, post_graduate, professional")
    personality_scores: Dict[str, float] = Field(default_factory=dict, description="Big Five dimension scores (0-100)")
    holland_code: Optional[str] = Field(None, description="3-letter Holland Code (e.g., 'RIA')")
    skills_scores: Optional[Dict[str, float]] = Field(None, description="Skill domain scores (0-100)")
    work_values: Optional[Dict[str, float]] = Field(None, description="Work value priorities (0-100)")
    career_matches: Optional[List[Dict[str, Any]]] = Field(None, description="Career matches from career_match endpoint")


def verify_api_key(x_api_key: Optional[str] = Header(None)):
    """Verify API key for protected endpoints."""
    if settings.environment != "development":
        if not x_api_key or x_api_key != settings.api_key:
            raise HTTPException(status_code=401, detail="Invalid API key")


@router.post("/score_profile", response_model=ScoreProfileResponse)
async def score_profile(
    request: ScoreProfileRequest,
    x_api_key: Optional[str] = Header(None),
):
    """
    Score psychometric assessment responses.
    
    Supports:
    - personality/big_five: Big Five (OCEAN) personality with facet-level analysis
    - interest/riasec: Holland Codes career interest inventory
    - skill/skills: Professional skills self-assessment
    - work_values: Work values and priorities assessment
    
    Returns enhanced scoring with:
    - Dimension and facet scores (0-100 normalized)
    - Norm-referenced percentiles by academic level
    - Personality type mapping (MBTI-like)
    - Holland Code generation (3-letter)
    - Life-stage appropriate insights
    """
    verify_api_key(x_api_key)

    try:
        # Use enhanced unified scorer for all assessment types
        result = unified_scorer.score_assessment(
            assessment_type=request.assessment_type.value,
            responses=request.responses,
            user_metadata=request.user_metadata,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/score_profile_legacy", response_model=ScoreProfileResponse)
async def score_profile_legacy(
    request: ScoreProfileRequest,
    x_api_key: Optional[str] = Header(None),
):
    """Legacy scoring endpoint for backward compatibility."""
    verify_api_key(x_api_key)

    try:
        result = psychometric_scorer.score_responses(
            assessment_type=request.assessment_type,
            responses=request.responses,
            user_metadata=request.user_metadata,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/career_match", response_model=CareerMatchResponse)
async def career_match(
    request: CareerMatchRequest,
    x_api_key: Optional[str] = Header(None),
):
    """
    Calculate career matches based on profile.
    
    Enhanced with:
    - Holland Code matching
    - Work values alignment
    - Academic level appropriate recommendations
    """
    verify_api_key(x_api_key)

    try:
        result = career_matcher.match_careers(
            personality_scores=request.personality_scores,
            skills=request.skills,
            interests=request.interests,
            top_n=request.top_n,
            holland_code=request.holland_code,
            work_values=request.work_values,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/recommendations")
async def get_recommendations(
    request: RecommendationRequest,
    x_api_key: Optional[str] = Header(None),
):
    """
    Generate life-stage specific career recommendations.
    
    Provides tailored guidance based on academic level:
    - Grade 10: Stream selection (Science/Commerce/Arts), exploration activities
    - Grade 12: College major selection, entrance exam guidance
    - Undergraduate: Internship guidance, skill development priorities
    - Post-Graduate: Research vs industry paths, advanced career options
    - Professional: Career advancement, pivot opportunities, certifications
    
    Returns:
    - Primary recommendations with rationale
    - Action items with priorities
    - Educational pathway guidance
    - Skill development priorities
    """
    verify_api_key(x_api_key)

    try:
        result = life_stage_recommender.generate_recommendations(
            academic_level=request.academic_level,
            personality_scores=request.personality_scores,
            holland_code=request.holland_code,
            skills_scores=request.skills_scores,
            work_values=request.work_values,
            career_matches=request.career_matches,
        )
        return {
            "success": True,
            **result,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
