from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Any
from enum import Enum


class AssessmentType(str, Enum):
    PERSONALITY = "personality"
    BIG_FIVE = "big_five"
    APTITUDE = "aptitude"
    INTEREST = "interest"
    RIASEC = "riasec"
    SKILL = "skill"
    SKILLS = "skills"
    WORK_VALUES = "work_values"


class AcademicLevel(str, Enum):
    GRADE_10 = "grade_10"
    GRADE_12 = "grade_12"
    UNDERGRADUATE = "undergraduate"
    POST_GRADUATE = "post_graduate"
    PROFESSIONAL = "professional"


class Response(BaseModel):
    """
    Individual question response with optional facet and reverse scoring support.
    """
    question_id: str
    value: float
    dimension: Optional[str] = None
    facet: Optional[str] = None
    reverse_scored: Optional[bool] = False


class UserMetadata(BaseModel):
    """
    User context for norm-referenced scoring.
    """
    age_group: Optional[str] = None
    education_level: Optional[str] = None
    academic_level: Optional[str] = Field(default="undergraduate", description="Academic level for norm referencing")


class ScoreProfileRequest(BaseModel):
    """
    Request to score an assessment profile.
    """
    assessment_type: AssessmentType
    responses: List[Response]
    user_metadata: Optional[UserMetadata] = None


class DimensionScores(BaseModel):
    extraversion: Optional[float] = None
    agreeableness: Optional[float] = None
    conscientiousness: Optional[float] = None
    neuroticism: Optional[float] = None
    openness: Optional[float] = None


class PersonalityTypeInfo(BaseModel):
    """
    Personality type information with description.
    """
    code: str
    description: Optional[str] = None


class BigFiveInsights(BaseModel):
    """
    Life-stage appropriate insights from Big Five assessment.
    """
    strengths: List[str] = Field(default_factory=list)
    growth_areas: List[str] = Field(default_factory=list)
    academic_implications: List[str] = Field(default_factory=list)
    career_implications: List[str] = Field(default_factory=list)


class HollandCodeInfo(BaseModel):
    """
    Holland Code (RIASEC) result.
    """
    code: str
    primary: Optional[str] = None
    secondary: Optional[str] = None
    tertiary: Optional[str] = None


class RankingItem(BaseModel):
    """
    A ranked item (dimension, skill, value, etc.)
    """
    dimension: Optional[str] = None
    domain: Optional[str] = None
    value: Optional[str] = None
    score: float
    name: Optional[str] = None
    code: Optional[str] = None
    description: Optional[str] = None


class StrengthItem(BaseModel):
    """
    A strength or development area.
    """
    domain: str
    name: str
    score: float


class SkillAnalysis(BaseModel):
    """
    Skills analysis with strengths and development areas.
    """
    strengths: List[StrengthItem] = Field(default_factory=list)
    development_areas: List[StrengthItem] = Field(default_factory=list)


class ValuePriorities(BaseModel):
    """
    Top work value priorities.
    """
    primary: Optional[str] = None
    secondary: Optional[str] = None
    tertiary: Optional[str] = None


class EnhancedScores(BaseModel):
    """
    Enhanced scoring results with dimensions, facets, and percentiles.
    """
    dimensions: Dict[str, float] = Field(default_factory=dict)
    facets: Optional[Dict[str, float]] = None
    raw_averages: Optional[Dict[str, float]] = None
    percentiles: Optional[Dict[str, int]] = None
    rankings: Optional[List[RankingItem]] = None
    domains: Optional[Dict[str, float]] = None


class ScoreProfileResponse(BaseModel):
    """
    Response from scoring an assessment.
    """
    success: bool = True
    assessment_type: Optional[str] = None
    scores: Dict[str, Any]
    personality_type: Optional[Any] = None  # Can be string or PersonalityTypeInfo
    holland_code: Optional[HollandCodeInfo] = None
    insights: Optional[BigFiveInsights] = None
    analysis: Optional[SkillAnalysis] = None
    priorities: Optional[ValuePriorities] = None
    career_families: Optional[List[str]] = None
    confidence: float
    processing_time_ms: float
    norms_used: Optional[str] = None


class CareerMatchRequest(BaseModel):
    personality_scores: Dict[str, float]
    skills: List[str] = Field(default_factory=list)
    interests: List[str] = Field(default_factory=list)
    holland_code: Optional[str] = None
    work_values: Optional[Dict[str, float]] = None
    academic_level: Optional[str] = None
    top_n: int = Field(default=5, ge=1, le=20)


class CareerFitFactors(BaseModel):
    personality: float
    skills: float
    interests: Optional[float] = None
    holland_fit: Optional[float] = None
    values_fit: Optional[float] = None


class CareerMatch(BaseModel):
    career_id: str
    title: str
    match_score: float
    confidence: float
    fit_factors: CareerFitFactors


class CareerMatchResponse(BaseModel):
    success: bool = True
    matches: List[CareerMatch]

