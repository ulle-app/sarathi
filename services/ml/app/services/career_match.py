"""
Enhanced Career Matching Service

Matches user profiles to careers using multiple factors:
- Big Five personality traits
- RIASEC/Holland Codes
- Skills assessment
- Work values alignment
- Academic level appropriate recommendations
"""

from typing import Dict, List, Optional
from app.models.schemas import CareerMatch, CareerFitFactors


class CareerMatcher:
    """
    Match user profiles to careers based on multi-factor analysis.
    
    Factors considered:
    1. Personality fit (Big Five dimensions)
    2. Holland Code alignment (RIASEC)
    3. Skills match
    4. Work values alignment
    """

    # Career data with enhanced matching criteria
    # In production, this would come from a database with hundreds of careers
    CAREERS = [
        {
            "career_id": "career_001",
            "title": "Data Scientist",
            "category": "Technology",
            "holland_codes": ["IR", "IC", "IA"],  # Investigative-Realistic, etc.
            "personality_fit": {
                "openness": (70, 100),
                "conscientiousness": (60, 100),
                "extraversion": (30, 70),
            },
            "required_skills": ["python", "statistics", "machine_learning", "data_analysis", "analytical"],
            "value_alignment": {
                "achievement": 0.9,
                "independence": 0.8,
                "recognition": 0.6,
            },
        },
        {
            "career_id": "career_002",
            "title": "Software Engineer",
            "category": "Technology",
            "holland_codes": ["IR", "IC", "RI"],
            "personality_fit": {
                "openness": (60, 100),
                "conscientiousness": (70, 100),
                "extraversion": (20, 60),
            },
            "required_skills": ["programming", "problem_solving", "debugging", "algorithms", "technical"],
            "value_alignment": {
                "achievement": 0.8,
                "independence": 0.7,
                "compensation": 0.8,
            },
        },
        {
            "career_id": "career_003",
            "title": "Product Manager",
            "category": "Business",
            "holland_codes": ["ES", "EC", "EI"],
            "personality_fit": {
                "extraversion": (60, 100),
                "conscientiousness": (60, 100),
                "openness": (50, 100),
            },
            "required_skills": ["communication", "leadership", "strategy", "analytics", "organizational"],
            "value_alignment": {
                "achievement": 0.9,
                "recognition": 0.8,
                "relationships": 0.7,
            },
        },
        {
            "career_id": "career_004",
            "title": "UX Designer",
            "category": "Creative",
            "holland_codes": ["AE", "AI", "AS"],
            "personality_fit": {
                "openness": (70, 100),
                "agreeableness": (60, 100),
                "extraversion": (40, 80),
            },
            "required_skills": ["design", "empathy", "research", "prototyping", "creative"],
            "value_alignment": {
                "achievement": 0.7,
                "independence": 0.7,
                "relationships": 0.8,
            },
        },
        {
            "career_id": "career_005",
            "title": "Marketing Manager",
            "category": "Marketing",
            "holland_codes": ["EA", "ES", "EC"],
            "personality_fit": {
                "extraversion": (60, 100),
                "openness": (60, 100),
                "agreeableness": (50, 100),
            },
            "required_skills": ["marketing", "communication", "creativity", "analytics", "creative"],
            "value_alignment": {
                "recognition": 0.9,
                "achievement": 0.8,
                "compensation": 0.7,
            },
        },
        {
            "career_id": "career_006",
            "title": "Financial Analyst",
            "category": "Finance",
            "holland_codes": ["CI", "CE", "IC"],
            "personality_fit": {
                "conscientiousness": (70, 100),
                "openness": (40, 70),
                "extraversion": (20, 60),
            },
            "required_skills": ["finance", "excel", "analysis", "attention_to_detail", "analytical"],
            "value_alignment": {
                "compensation": 0.9,
                "security": 0.8,
                "achievement": 0.7,
            },
        },
        {
            "career_id": "career_007",
            "title": "HR Manager",
            "category": "Business",
            "holland_codes": ["SE", "SA", "SC"],
            "personality_fit": {
                "agreeableness": (70, 100),
                "extraversion": (60, 100),
                "conscientiousness": (60, 100),
            },
            "required_skills": ["communication", "empathy", "organization", "conflict_resolution", "interpersonal"],
            "value_alignment": {
                "relationships": 0.9,
                "support": 0.8,
                "recognition": 0.6,
            },
        },
        {
            "career_id": "career_008",
            "title": "Research Scientist",
            "category": "Science",
            "holland_codes": ["IR", "IA", "IC"],
            "personality_fit": {
                "openness": (80, 100),
                "conscientiousness": (70, 100),
                "extraversion": (20, 50),
            },
            "required_skills": ["research", "analysis", "critical_thinking", "writing", "analytical"],
            "value_alignment": {
                "achievement": 0.9,
                "independence": 0.9,
                "recognition": 0.6,
            },
        },
        {
            "career_id": "career_009",
            "title": "Teacher/Educator",
            "category": "Education",
            "holland_codes": ["SA", "SE", "SI"],
            "personality_fit": {
                "agreeableness": (65, 100),
                "extraversion": (50, 100),
                "openness": (55, 100),
            },
            "required_skills": ["communication", "empathy", "patience", "organization", "interpersonal"],
            "value_alignment": {
                "relationships": 0.9,
                "achievement": 0.7,
                "security": 0.8,
            },
        },
        {
            "career_id": "career_010",
            "title": "Entrepreneur",
            "category": "Business",
            "holland_codes": ["EC", "EA", "EI"],
            "personality_fit": {
                "extraversion": (55, 100),
                "openness": (70, 100),
                "conscientiousness": (50, 100),
            },
            "required_skills": ["leadership", "communication", "creative", "analytical", "adaptability"],
            "value_alignment": {
                "independence": 0.95,
                "achievement": 0.9,
                "recognition": 0.7,
            },
        },
        {
            "career_id": "career_011",
            "title": "Graphic Designer",
            "category": "Creative",
            "holland_codes": ["AR", "AE", "AI"],
            "personality_fit": {
                "openness": (75, 100),
                "extraversion": (30, 70),
                "conscientiousness": (50, 90),
            },
            "required_skills": ["design", "creative", "technical", "communication", "attention_to_detail"],
            "value_alignment": {
                "independence": 0.8,
                "achievement": 0.7,
                "working_conditions": 0.7,
            },
        },
        {
            "career_id": "career_012",
            "title": "Mechanical Engineer",
            "category": "Engineering",
            "holland_codes": ["RI", "RC", "RE"],
            "personality_fit": {
                "conscientiousness": (65, 100),
                "openness": (55, 100),
                "extraversion": (30, 70),
            },
            "required_skills": ["technical", "analytical", "problem_solving", "design", "attention_to_detail"],
            "value_alignment": {
                "achievement": 0.8,
                "compensation": 0.8,
                "security": 0.7,
            },
        },
        {
            "career_id": "career_013",
            "title": "Healthcare Professional",
            "category": "Healthcare",
            "holland_codes": ["SI", "SR", "SA"],
            "personality_fit": {
                "agreeableness": (65, 100),
                "conscientiousness": (70, 100),
                "neuroticism": (0, 45),
            },
            "required_skills": ["communication", "empathy", "technical", "analytical", "interpersonal"],
            "value_alignment": {
                "relationships": 0.9,
                "achievement": 0.8,
                "security": 0.8,
            },
        },
        {
            "career_id": "career_014",
            "title": "Consultant",
            "category": "Business",
            "holland_codes": ["EI", "EC", "ES"],
            "personality_fit": {
                "extraversion": (55, 100),
                "openness": (60, 100),
                "conscientiousness": (65, 100),
            },
            "required_skills": ["analytical", "communication", "leadership", "problem_solving", "adaptability"],
            "value_alignment": {
                "achievement": 0.9,
                "compensation": 0.85,
                "recognition": 0.8,
            },
        },
        {
            "career_id": "career_015",
            "title": "Social Worker",
            "category": "Social Services",
            "holland_codes": ["SA", "SE", "SI"],
            "personality_fit": {
                "agreeableness": (75, 100),
                "extraversion": (50, 90),
                "openness": (55, 100),
            },
            "required_skills": ["communication", "empathy", "interpersonal", "organizational", "adaptability"],
            "value_alignment": {
                "relationships": 0.95,
                "support": 0.9,
                "achievement": 0.6,
            },
        },
    ]

    # Holland Code compatibility matrix
    # Codes that are adjacent on the hexagon are more compatible
    HOLLAND_COMPATIBILITY = {
        'R': ['I', 'C'],  # Realistic compatible with Investigative and Conventional
        'I': ['R', 'A'],  # Investigative compatible with Realistic and Artistic
        'A': ['I', 'S'],  # Artistic compatible with Investigative and Social
        'S': ['A', 'E'],  # Social compatible with Artistic and Enterprising
        'E': ['S', 'C'],  # Enterprising compatible with Social and Conventional
        'C': ['E', 'R'],  # Conventional compatible with Enterprising and Realistic
    }

    def match_careers(
        self,
        personality_scores: Dict[str, float],
        skills: List[str],
        interests: List[str],
        top_n: int = 5,
        holland_code: Optional[str] = None,
        work_values: Optional[Dict[str, float]] = None,
    ) -> Dict:
        """
        Calculate career matches based on user profile.
        
        Args:
            personality_scores: Big Five dimension scores (0-100)
            skills: List of user's skills
            interests: List of user's interests
            top_n: Number of top matches to return
            holland_code: Optional 3-letter Holland Code (e.g., "RIA")
            work_values: Optional work values scores (0-100)
            
        Returns:
            Career matches with fit factors
        """
        matches = []

        for career in self.CAREERS:
            # Calculate personality fit (30% weight)
            personality_fit = self._calculate_personality_fit(
                personality_scores, career.get("personality_fit", {})
            )

            # Calculate skills match (25% weight)
            skills_match = self._calculate_skills_match(
                skills, career.get("required_skills", [])
            )

            # Calculate Holland Code fit (25% weight)
            holland_fit = 0.5  # Default neutral
            if holland_code:
                holland_fit = self._calculate_holland_fit(
                    holland_code, career.get("holland_codes", [])
                )

            # Calculate work values fit (20% weight)
            values_fit = 0.5  # Default neutral
            if work_values:
                values_fit = self._calculate_values_fit(
                    work_values, career.get("value_alignment", {})
                )

            # Calculate weighted overall match score
            if holland_code and work_values:
                match_score = (
                    personality_fit * 0.30 +
                    skills_match * 0.25 +
                    holland_fit * 0.25 +
                    values_fit * 0.20
                )
            elif holland_code:
                match_score = (
                    personality_fit * 0.35 +
                    skills_match * 0.30 +
                    holland_fit * 0.35
                )
            elif work_values:
                match_score = (
                    personality_fit * 0.40 +
                    skills_match * 0.30 +
                    values_fit * 0.30
                )
            else:
                match_score = (personality_fit * 0.5) + (skills_match * 0.5)

            # Calculate confidence based on data completeness
            data_completeness = 0.5
            if personality_scores:
                data_completeness += 0.15
            if skills:
                data_completeness += 0.15
            if holland_code:
                data_completeness += 0.10
            if work_values:
                data_completeness += 0.10
            
            confidence = min(0.95, data_completeness * match_score)

            matches.append(
                CareerMatch(
                    career_id=career["career_id"],
                    title=career["title"],
                    match_score=round(match_score, 2),
                    confidence=round(confidence, 2),
                    fit_factors=CareerFitFactors(
                        personality=round(personality_fit, 2),
                        skills=round(skills_match, 2),
                        holland_fit=round(holland_fit, 2) if holland_code else None,
                        values_fit=round(values_fit, 2) if work_values else None,
                    ),
                )
            )

        # Sort by match score and return top N
        matches.sort(key=lambda x: x.match_score, reverse=True)

        return {
            "success": True,
            "matches": matches[:top_n],
        }

    def _calculate_personality_fit(
        self, scores: Dict[str, float], fit_criteria: Dict[str, tuple]
    ) -> float:
        """Calculate how well personality scores fit career requirements."""
        if not fit_criteria:
            return 0.5

        total_fit = 0
        count = 0

        for dimension, (low, high) in fit_criteria.items():
            if dimension in scores:
                score = scores[dimension]
                if low <= score <= high:
                    # Perfect fit
                    total_fit += 1.0
                elif score < low:
                    # Below range - calculate partial fit
                    distance = low - score
                    total_fit += max(0, 1 - (distance / 50))
                else:
                    # Above range - calculate partial fit
                    distance = score - high
                    total_fit += max(0, 1 - (distance / 50))
                count += 1

        return total_fit / count if count > 0 else 0.5

    def _calculate_skills_match(
        self, user_skills: List[str], required_skills: List[str]
    ) -> float:
        """Calculate skills match percentage."""
        if not required_skills:
            return 0.5

        if not user_skills:
            return 0.2  # Base score for no skills provided

        user_skills_lower = [s.lower() for s in user_skills]
        required_lower = [s.lower() for s in required_skills]

        matches = sum(1 for skill in required_lower if skill in user_skills_lower)
        return matches / len(required_lower)

    def _calculate_holland_fit(
        self, user_code: str, career_codes: List[str]
    ) -> float:
        """
        Calculate Holland Code compatibility.
        
        Perfect match: 1.0
        Adjacent types: 0.7
        Opposite types: 0.3
        """
        if not user_code or not career_codes:
            return 0.5

        user_code = user_code.upper()[:3]
        best_fit = 0

        for career_code in career_codes:
            career_code = career_code.upper()
            fit = 0
            
            # Primary type match
            if len(user_code) > 0 and len(career_code) > 0:
                if user_code[0] == career_code[0]:
                    fit += 0.5
                elif career_code[0] in self.HOLLAND_COMPATIBILITY.get(user_code[0], []):
                    fit += 0.3
                else:
                    fit += 0.1

            # Secondary type match
            if len(user_code) > 1 and len(career_code) > 1:
                if user_code[1] == career_code[1]:
                    fit += 0.3
                elif career_code[1] in self.HOLLAND_COMPATIBILITY.get(user_code[1], []):
                    fit += 0.2
                else:
                    fit += 0.05

            # Tertiary type match
            if len(user_code) > 2 and len(career_code) > 1:
                if user_code[2] in career_code:
                    fit += 0.2
                else:
                    fit += 0.05

            best_fit = max(best_fit, fit)

        return min(1.0, best_fit)

    def _calculate_values_fit(
        self, user_values: Dict[str, float], career_values: Dict[str, float]
    ) -> float:
        """
        Calculate work values alignment.
        
        Compares user's top values with career's value alignment.
        """
        if not user_values or not career_values:
            return 0.5

        total_fit = 0
        count = 0

        # Normalize user values to 0-1 scale
        max_value = max(user_values.values()) if user_values else 100
        normalized_user = {k: v / max_value for k, v in user_values.items()}

        for value, importance in career_values.items():
            if value in normalized_user:
                # Higher user value + higher career importance = better fit
                user_priority = normalized_user[value]
                fit = 1 - abs(user_priority - importance)
                total_fit += fit
                count += 1

        return total_fit / count if count > 0 else 0.5


# Singleton instance
career_matcher = CareerMatcher()
