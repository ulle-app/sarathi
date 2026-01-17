"""Psychometric scoring service."""

import time
from typing import Dict, List, Optional
from app.models.schemas import Response, UserMetadata


class PsychometricScorer:
    """Big Five personality dimension scoring."""

    DIMENSIONS = [
        "extraversion",
        "agreeableness",
        "conscientiousness",
        "neuroticism",
        "openness",
    ]

    # MBTI-like mapping based on Big Five scores
    PERSONALITY_TYPES = {
        "ENFP": {"extraversion": (60, 100), "openness": (60, 100), "agreeableness": (60, 100), "conscientiousness": (0, 50)},
        "ENFJ": {"extraversion": (60, 100), "openness": (60, 100), "agreeableness": (60, 100), "conscientiousness": (50, 100)},
        "ENTP": {"extraversion": (60, 100), "openness": (60, 100), "agreeableness": (0, 50), "conscientiousness": (0, 50)},
        "ENTJ": {"extraversion": (60, 100), "openness": (60, 100), "agreeableness": (0, 50), "conscientiousness": (50, 100)},
        "INFP": {"extraversion": (0, 50), "openness": (60, 100), "agreeableness": (60, 100), "conscientiousness": (0, 50)},
        "INFJ": {"extraversion": (0, 50), "openness": (60, 100), "agreeableness": (60, 100), "conscientiousness": (50, 100)},
        "INTP": {"extraversion": (0, 50), "openness": (60, 100), "agreeableness": (0, 50), "conscientiousness": (0, 50)},
        "INTJ": {"extraversion": (0, 50), "openness": (60, 100), "agreeableness": (0, 50), "conscientiousness": (50, 100)},
        "ESFP": {"extraversion": (60, 100), "openness": (0, 50), "agreeableness": (60, 100), "conscientiousness": (0, 50)},
        "ESFJ": {"extraversion": (60, 100), "openness": (0, 50), "agreeableness": (60, 100), "conscientiousness": (50, 100)},
        "ESTP": {"extraversion": (60, 100), "openness": (0, 50), "agreeableness": (0, 50), "conscientiousness": (0, 50)},
        "ESTJ": {"extraversion": (60, 100), "openness": (0, 50), "agreeableness": (0, 50), "conscientiousness": (50, 100)},
        "ISFP": {"extraversion": (0, 50), "openness": (0, 50), "agreeableness": (60, 100), "conscientiousness": (0, 50)},
        "ISFJ": {"extraversion": (0, 50), "openness": (0, 50), "agreeableness": (60, 100), "conscientiousness": (50, 100)},
        "ISTP": {"extraversion": (0, 50), "openness": (0, 50), "agreeableness": (0, 50), "conscientiousness": (0, 50)},
        "ISTJ": {"extraversion": (0, 50), "openness": (0, 50), "agreeableness": (0, 50), "conscientiousness": (50, 100)},
    }

    def score_responses(
        self,
        assessment_type: str,
        responses: List[Response],
        user_metadata: Optional[UserMetadata] = None,
    ) -> Dict:
        """Calculate dimension scores from responses."""
        start_time = time.time()

        # Calculate dimension scores
        dimension_scores = {}
        dimension_counts = {}

        for response in responses:
            dimension = response.dimension
            if dimension and dimension in self.DIMENSIONS:
                if dimension not in dimension_scores:
                    dimension_scores[dimension] = 0
                    dimension_counts[dimension] = 0
                dimension_scores[dimension] += response.value
                dimension_counts[dimension] += 1

        # Normalize to 0-100 scale (assuming input is 1-5 Likert scale)
        normalized_scores = {}
        for dimension, total in dimension_scores.items():
            count = dimension_counts[dimension]
            if count > 0:
                raw_avg = total / count  # 1-5 scale
                normalized_scores[dimension] = ((raw_avg - 1) / 4) * 100  # 0-100 scale

        # Fill in missing dimensions with neutral values
        for dimension in self.DIMENSIONS:
            if dimension not in normalized_scores:
                normalized_scores[dimension] = 50.0

        # Calculate percentiles (simplified - using normalized scores as percentiles)
        percentiles = {k: min(99, max(1, int(v))) for k, v in normalized_scores.items()}

        # Predict personality type
        personality_type = self._predict_personality_type(normalized_scores)

        # Calculate confidence based on response count
        confidence = min(0.95, len(responses) / 50)

        processing_time = (time.time() - start_time) * 1000

        return {
            "success": True,
            "scores": {
                "dimensions": normalized_scores,
                "percentiles": percentiles,
            },
            "personality_type": personality_type,
            "confidence": round(confidence, 2),
            "processing_time_ms": round(processing_time, 2),
        }

    def _predict_personality_type(self, scores: Dict[str, float]) -> str:
        """Map dimension scores to MBTI-like personality type."""
        best_match = "INFP"  # Default
        best_score = 0

        for ptype, criteria in self.PERSONALITY_TYPES.items():
            match_score = 0
            for dimension, (low, high) in criteria.items():
                if dimension in scores:
                    if low <= scores[dimension] <= high:
                        match_score += 1

            if match_score > best_score:
                best_score = match_score
                best_match = ptype

        return best_match


# Singleton instance
psychometric_scorer = PsychometricScorer()
