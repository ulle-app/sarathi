"""
Enhanced Psychometric Scoring Service

Provides research-backed scoring with:
- Facet-level analysis for Big Five personality dimensions
- Holland Code generation for RIASEC career interests
- Norm-referenced percentiles by academic level
- Reverse scoring support
- Skill proficiency mapping
- Work values prioritization
"""

import time
from typing import Dict, List, Optional, Tuple
from app.models.schemas import Response, UserMetadata


class EnhancedPsychometricScorer:
    """
    Enhanced scoring engine for psychometric assessments.
    
    Supports:
    - Big Five (OCEAN) with 30 facets
    - RIASEC/Holland Codes
    - Skills Assessment
    - Work Values Assessment
    """

    # =========================================================================
    # BIG FIVE CONFIGURATION
    # =========================================================================
    
    BIG_FIVE_DIMENSIONS = {
        'openness': {
            'name': 'Openness to Experience',
            'facets': ['fantasy', 'aesthetics', 'feelings', 'actions', 'ideas', 'values'],
            'description': 'Imagination, curiosity, and openness to new experiences',
        },
        'conscientiousness': {
            'name': 'Conscientiousness',
            'facets': ['competence', 'order', 'dutifulness', 'achievement', 'self_discipline', 'deliberation'],
            'description': 'Organization, dependability, and self-discipline',
        },
        'extraversion': {
            'name': 'Extraversion',
            'facets': ['warmth', 'gregariousness', 'assertiveness', 'activity', 'excitement_seeking', 'positive_emotions'],
            'description': 'Energy, sociability, and positive emotions',
        },
        'agreeableness': {
            'name': 'Agreeableness',
            'facets': ['trust', 'straightforwardness', 'altruism', 'compliance', 'modesty', 'tender_mindedness'],
            'description': 'Cooperation, trust, and concern for others',
        },
        'neuroticism': {
            'name': 'Neuroticism (Emotional Stability)',
            'facets': ['anxiety', 'angry_hostility', 'depression', 'self_consciousness', 'impulsiveness', 'vulnerability'],
            'description': 'Emotional reactivity and tendency to experience negative emotions',
        },
    }

    # Norm tables by academic level (percentile cutoffs for raw scores)
    # Structure: { academic_level: { dimension: [(raw_threshold, percentile), ...] } }
    # These would ideally come from validation studies; using estimated norms
    BIG_FIVE_NORMS = {
        'grade_10': {
            # Younger students tend to score higher on neuroticism, lower on conscientiousness
            'openness': [(2.0, 20), (2.8, 40), (3.4, 60), (4.0, 80), (4.5, 95)],
            'conscientiousness': [(2.2, 20), (3.0, 40), (3.5, 60), (4.0, 80), (4.5, 95)],
            'extraversion': [(2.0, 20), (2.8, 40), (3.4, 60), (4.0, 80), (4.6, 95)],
            'agreeableness': [(2.5, 20), (3.2, 40), (3.7, 60), (4.2, 80), (4.7, 95)],
            'neuroticism': [(2.0, 20), (2.6, 40), (3.2, 60), (3.8, 80), (4.4, 95)],
        },
        'grade_12': {
            'openness': [(2.2, 20), (3.0, 40), (3.6, 60), (4.1, 80), (4.6, 95)],
            'conscientiousness': [(2.4, 20), (3.2, 40), (3.7, 60), (4.2, 80), (4.6, 95)],
            'extraversion': [(2.0, 20), (2.8, 40), (3.4, 60), (4.0, 80), (4.6, 95)],
            'agreeableness': [(2.6, 20), (3.3, 40), (3.8, 60), (4.3, 80), (4.7, 95)],
            'neuroticism': [(1.8, 20), (2.4, 40), (3.0, 60), (3.6, 80), (4.2, 95)],
        },
        'undergraduate': {
            'openness': [(2.4, 20), (3.2, 40), (3.7, 60), (4.2, 80), (4.7, 95)],
            'conscientiousness': [(2.5, 20), (3.3, 40), (3.8, 60), (4.3, 80), (4.7, 95)],
            'extraversion': [(2.0, 20), (2.8, 40), (3.4, 60), (4.0, 80), (4.5, 95)],
            'agreeableness': [(2.7, 20), (3.4, 40), (3.9, 60), (4.4, 80), (4.8, 95)],
            'neuroticism': [(1.6, 20), (2.2, 40), (2.8, 60), (3.4, 80), (4.0, 95)],
        },
        'post_graduate': {
            'openness': [(2.6, 20), (3.4, 40), (3.9, 60), (4.3, 80), (4.7, 95)],
            'conscientiousness': [(2.8, 20), (3.5, 40), (4.0, 60), (4.4, 80), (4.8, 95)],
            'extraversion': [(2.0, 20), (2.8, 40), (3.4, 60), (4.0, 80), (4.5, 95)],
            'agreeableness': [(2.8, 20), (3.5, 40), (4.0, 60), (4.4, 80), (4.8, 95)],
            'neuroticism': [(1.4, 20), (2.0, 40), (2.6, 60), (3.2, 80), (3.8, 95)],
        },
        'professional': {
            # Professionals typically score higher on conscientiousness, lower on neuroticism
            'openness': [(2.5, 20), (3.3, 40), (3.8, 60), (4.3, 80), (4.7, 95)],
            'conscientiousness': [(3.0, 20), (3.6, 40), (4.1, 60), (4.5, 80), (4.9, 95)],
            'extraversion': [(2.0, 20), (2.8, 40), (3.4, 60), (4.0, 80), (4.5, 95)],
            'agreeableness': [(2.8, 20), (3.5, 40), (4.0, 60), (4.4, 80), (4.8, 95)],
            'neuroticism': [(1.2, 20), (1.8, 40), (2.4, 60), (3.0, 80), (3.6, 95)],
        },
    }

    # MBTI-like mapping based on Big Five scores
    PERSONALITY_TYPES = {
        "ENFP": {"E": True, "N": True, "F": True, "P": True, "description": "Enthusiastic, creative, and sociable free spirits"},
        "ENFJ": {"E": True, "N": True, "F": True, "P": False, "description": "Charismatic and inspiring leaders, able to mesmerize their listeners"},
        "ENTP": {"E": True, "N": True, "F": False, "P": True, "description": "Smart and curious thinkers who cannot resist an intellectual challenge"},
        "ENTJ": {"E": True, "N": True, "F": False, "P": False, "description": "Bold, imaginative and strong-willed leaders"},
        "INFP": {"E": False, "N": True, "F": True, "P": True, "description": "Poetic, kind and altruistic people, always eager to help"},
        "INFJ": {"E": False, "N": True, "F": True, "P": False, "description": "Quiet and mystical, yet very inspiring idealists"},
        "INTP": {"E": False, "N": True, "F": False, "P": True, "description": "Innovative inventors with an unquenchable thirst for knowledge"},
        "INTJ": {"E": False, "N": True, "F": False, "P": False, "description": "Imaginative and strategic thinkers with a plan for everything"},
        "ESFP": {"E": True, "N": False, "F": True, "P": True, "description": "Spontaneous, energetic and enthusiastic entertainers"},
        "ESFJ": {"E": True, "N": False, "F": True, "P": False, "description": "Extraordinarily caring, social and popular people"},
        "ESTP": {"E": True, "N": False, "F": False, "P": True, "description": "Smart, energetic and very perceptive people"},
        "ESTJ": {"E": True, "N": False, "F": False, "P": False, "description": "Excellent administrators, unsurpassed at managing things"},
        "ISFP": {"E": False, "N": False, "F": True, "P": True, "description": "Flexible and charming artists, ready to explore life"},
        "ISFJ": {"E": False, "N": False, "F": True, "P": False, "description": "Very dedicated and warm protectors"},
        "ISTP": {"E": False, "N": False, "F": False, "P": True, "description": "Bold and practical experimenters, masters of tools"},
        "ISTJ": {"E": False, "N": False, "F": False, "P": False, "description": "Practical and fact-minded individuals"},
    }

    # =========================================================================
    # RIASEC CONFIGURATION
    # =========================================================================
    
    RIASEC_DIMENSIONS = {
        'realistic': {'code': 'R', 'name': 'Realistic (Doers)', 'color': '#4CAF50'},
        'investigative': {'code': 'I', 'name': 'Investigative (Thinkers)', 'color': '#2196F3'},
        'artistic': {'code': 'A', 'name': 'Artistic (Creators)', 'color': '#9C27B0'},
        'social': {'code': 'S', 'name': 'Social (Helpers)', 'color': '#FF9800'},
        'enterprising': {'code': 'E', 'name': 'Enterprising (Persuaders)', 'color': '#F44336'},
        'conventional': {'code': 'C', 'name': 'Conventional (Organizers)', 'color': '#795548'},
    }

    # Career families mapped to Holland codes
    CAREER_FAMILIES = {
        'RI': ['Engineering', 'Architecture', 'Technology'],
        'RA': ['Industrial Design', 'Crafts', 'Technical Arts'],
        'RC': ['Quality Control', 'Technical Support', 'Maintenance'],
        'IR': ['Physical Sciences', 'Engineering Research', 'Applied Science'],
        'IA': ['Medical Research', 'Biotechnology', 'Scientific Writing'],
        'IS': ['Psychology Research', 'Medical Science', 'Health Informatics'],
        'AI': ['Architecture', 'Scientific Illustration', 'Technical Writing'],
        'AS': ['Art Therapy', 'Music Therapy', 'Educational Media'],
        'AE': ['Advertising', 'Public Relations', 'Media Production'],
        'SE': ['Human Resources', 'Counseling', 'Social Services'],
        'SI': ['Healthcare', 'Education', 'Social Work'],
        'SA': ['Teaching Arts', 'Community Arts', 'Cultural Programs'],
        'EI': ['Management Consulting', 'Business Analysis', 'Finance'],
        'ES': ['Sales Management', 'Marketing', 'Entrepreneurship'],
        'EC': ['Business Administration', 'Operations Management', 'Logistics'],
        'CI': ['Data Science', 'Financial Analysis', 'Research Administration'],
        'CE': ['Accounting', 'Banking', 'Corporate Administration'],
        'CS': ['Healthcare Administration', 'Educational Administration', 'Public Administration'],
    }

    # =========================================================================
    # SKILLS CONFIGURATION  
    # =========================================================================
    
    SKILL_DOMAINS = {
        'communication': {'name': 'Communication', 'facets': ['written', 'verbal', 'presentation', 'listening']},
        'analytical': {'name': 'Analytical Thinking', 'facets': ['problem_solving', 'research', 'data_analysis', 'critical_thinking']},
        'technical': {'name': 'Technical Skills', 'facets': ['computer', 'tools', 'specialized', 'digital_literacy']},
        'leadership': {'name': 'Leadership', 'facets': ['team_management', 'decision_making', 'delegation', 'vision']},
        'interpersonal': {'name': 'Interpersonal Skills', 'facets': ['collaboration', 'empathy', 'conflict_resolution', 'networking']},
        'creative': {'name': 'Creativity', 'facets': ['innovation', 'design_thinking', 'artistic', 'problem_solving']},
        'organizational': {'name': 'Organization', 'facets': ['time_management', 'planning', 'prioritization', 'attention_to_detail']},
        'adaptability': {'name': 'Adaptability', 'facets': ['flexibility', 'learning_agility', 'stress_tolerance', 'change_management']},
    }

    # =========================================================================
    # WORK VALUES CONFIGURATION
    # =========================================================================
    
    WORK_VALUE_DIMENSIONS = {
        'achievement': {'name': 'Achievement', 'description': 'Results-oriented, setting and reaching goals'},
        'independence': {'name': 'Independence', 'description': 'Autonomy, self-direction, working independently'},
        'recognition': {'name': 'Recognition', 'description': 'Status, advancement, being acknowledged'},
        'relationships': {'name': 'Relationships', 'description': 'Working with others, being part of a team'},
        'support': {'name': 'Support', 'description': 'Supportive management, fair treatment'},
        'working_conditions': {'name': 'Working Conditions', 'description': 'Job security, comfortable environment'},
        'compensation': {'name': 'Compensation', 'description': 'Financial rewards, benefits'},
        'security': {'name': 'Security', 'description': 'Stability, predictability, job security'},
    }

    def __init__(self):
        """Initialize the scorer."""
        pass

    # =========================================================================
    # MAIN SCORING METHODS
    # =========================================================================

    def score_big_five(
        self,
        responses: List[Response],
        user_metadata: Optional[UserMetadata] = None,
    ) -> Dict:
        """
        Score Big Five personality assessment with facet-level analysis.
        
        Returns dimension scores, facet scores, percentiles, and personality type.
        """
        start_time = time.time()
        
        academic_level = user_metadata.academic_level if user_metadata else 'undergraduate'
        norms = self.BIG_FIVE_NORMS.get(academic_level, self.BIG_FIVE_NORMS['undergraduate'])

        # Calculate raw scores by dimension and facet
        dimension_scores = {}
        dimension_counts = {}
        facet_scores = {}
        facet_counts = {}

        for response in responses:
            dimension = response.dimension
            if dimension not in self.BIG_FIVE_DIMENSIONS:
                continue
                
            # Handle reverse scoring
            value = response.value
            if hasattr(response, 'reverse_scored') and response.reverse_scored:
                value = 6 - value  # Reverse 1-5 scale
            
            # Aggregate dimension scores
            if dimension not in dimension_scores:
                dimension_scores[dimension] = 0
                dimension_counts[dimension] = 0
            dimension_scores[dimension] += value
            dimension_counts[dimension] += 1

            # Aggregate facet scores
            facet = getattr(response, 'facet', None)
            if facet:
                facet_key = f"{dimension}_{facet}"
                if facet_key not in facet_scores:
                    facet_scores[facet_key] = 0
                    facet_counts[facet_key] = 0
                facet_scores[facet_key] += value
                facet_counts[facet_key] += 1

        # Calculate average scores (1-5 scale)
        avg_scores = {}
        for dimension in self.BIG_FIVE_DIMENSIONS:
            if dimension in dimension_scores and dimension_counts[dimension] > 0:
                avg_scores[dimension] = dimension_scores[dimension] / dimension_counts[dimension]
            else:
                avg_scores[dimension] = 3.0  # Neutral default

        # Calculate facet averages
        facet_averages = {}
        for facet_key, total in facet_scores.items():
            if facet_counts[facet_key] > 0:
                facet_averages[facet_key] = total / facet_counts[facet_key]

        # Convert to normalized scores (0-100)
        normalized_scores = {}
        for dimension, avg in avg_scores.items():
            normalized_scores[dimension] = ((avg - 1) / 4) * 100

        # Calculate norm-referenced percentiles
        percentiles = {}
        for dimension, avg in avg_scores.items():
            percentiles[dimension] = self._calculate_percentile(avg, norms.get(dimension, []))

        # Predict personality type
        personality_type = self._predict_personality_type(normalized_scores)

        # Generate dimension insights
        insights = self._generate_big_five_insights(normalized_scores, facet_averages, academic_level)

        processing_time = (time.time() - start_time) * 1000

        return {
            "success": True,
            "assessment_type": "big_five",
            "scores": {
                "dimensions": normalized_scores,
                "facets": facet_averages,
                "raw_averages": avg_scores,
                "percentiles": percentiles,
            },
            "personality_type": {
                "code": personality_type,
                "description": self.PERSONALITY_TYPES.get(personality_type, {}).get('description', ''),
            },
            "insights": insights,
            "confidence": min(0.95, len(responses) / 60),  # Based on 60-question target
            "processing_time_ms": round(processing_time, 2),
            "norms_used": academic_level,
        }

    def score_riasec(
        self,
        responses: List[Response],
        user_metadata: Optional[UserMetadata] = None,
    ) -> Dict:
        """
        Score RIASEC/Holland Codes assessment.
        
        Returns dimension scores, Holland Code, and career family suggestions.
        """
        start_time = time.time()

        # Calculate dimension scores
        dimension_scores = {}
        dimension_counts = {}

        for response in responses:
            dimension = response.dimension
            if dimension not in self.RIASEC_DIMENSIONS:
                continue
            
            if dimension not in dimension_scores:
                dimension_scores[dimension] = 0
                dimension_counts[dimension] = 0
            dimension_scores[dimension] += response.value
            dimension_counts[dimension] += 1

        # Calculate averages
        avg_scores = {}
        for dimension in self.RIASEC_DIMENSIONS:
            if dimension in dimension_scores and dimension_counts[dimension] > 0:
                avg_scores[dimension] = dimension_scores[dimension] / dimension_counts[dimension]
            else:
                avg_scores[dimension] = 2.5

        # Normalize to 0-100
        normalized_scores = {}
        for dimension, avg in avg_scores.items():
            normalized_scores[dimension] = ((avg - 1) / 4) * 100

        # Generate Holland Code (top 3 dimensions)
        sorted_dims = sorted(avg_scores.items(), key=lambda x: x[1], reverse=True)
        holland_code = ''.join([
            self.RIASEC_DIMENSIONS[dim]['code'] 
            for dim, _ in sorted_dims[:3]
        ])
        
        # Get top 2 for career family lookup
        top_two_code = ''.join([
            self.RIASEC_DIMENSIONS[dim]['code'] 
            for dim, _ in sorted_dims[:2]
        ])
        
        # Get career families
        career_families = self.CAREER_FAMILIES.get(top_two_code, [])
        
        # Also check reversed code
        reversed_code = top_two_code[::-1]
        career_families.extend(self.CAREER_FAMILIES.get(reversed_code, []))
        career_families = list(set(career_families))  # Remove duplicates

        processing_time = (time.time() - start_time) * 1000

        return {
            "success": True,
            "assessment_type": "riasec",
            "scores": {
                "dimensions": normalized_scores,
                "raw_averages": avg_scores,
                "rankings": [
                    {"dimension": dim, "score": score, "code": self.RIASEC_DIMENSIONS[dim]['code']}
                    for dim, score in sorted_dims
                ],
            },
            "holland_code": {
                "code": holland_code,
                "primary": sorted_dims[0][0] if len(sorted_dims) > 0 else None,
                "secondary": sorted_dims[1][0] if len(sorted_dims) > 1 else None,
                "tertiary": sorted_dims[2][0] if len(sorted_dims) > 2 else None,
            },
            "career_families": career_families,
            "confidence": min(0.95, len(responses) / 48),
            "processing_time_ms": round(processing_time, 2),
        }

    def score_skills(
        self,
        responses: List[Response],
        user_metadata: Optional[UserMetadata] = None,
    ) -> Dict:
        """
        Score skills self-assessment.
        
        Returns skill domain scores and development priorities.
        """
        start_time = time.time()

        # Calculate domain scores
        domain_scores = {}
        domain_counts = {}

        for response in responses:
            domain = response.dimension
            if domain not in self.SKILL_DOMAINS:
                continue
            
            if domain not in domain_scores:
                domain_scores[domain] = 0
                domain_counts[domain] = 0
            domain_scores[domain] += response.value
            domain_counts[domain] += 1

        # Calculate averages (1-5 scale to 0-100)
        normalized_scores = {}
        for domain in self.SKILL_DOMAINS:
            if domain in domain_scores and domain_counts[domain] > 0:
                avg = domain_scores[domain] / domain_counts[domain]
                normalized_scores[domain] = ((avg - 1) / 4) * 100
            else:
                normalized_scores[domain] = 50.0

        # Identify strengths and development areas
        sorted_skills = sorted(normalized_scores.items(), key=lambda x: x[1], reverse=True)
        strengths = [s[0] for s in sorted_skills[:3]]
        development_areas = [s[0] for s in sorted_skills[-3:]]

        processing_time = (time.time() - start_time) * 1000

        return {
            "success": True,
            "assessment_type": "skills",
            "scores": {
                "domains": normalized_scores,
                "rankings": [
                    {"domain": domain, "score": score, "name": self.SKILL_DOMAINS[domain]['name']}
                    for domain, score in sorted_skills
                ],
            },
            "analysis": {
                "strengths": [
                    {"domain": s, "name": self.SKILL_DOMAINS[s]['name'], "score": normalized_scores[s]}
                    for s in strengths
                ],
                "development_areas": [
                    {"domain": d, "name": self.SKILL_DOMAINS[d]['name'], "score": normalized_scores[d]}
                    for d in development_areas
                ],
            },
            "confidence": min(0.95, len(responses) / 48),
            "processing_time_ms": round(processing_time, 2),
        }

    def score_work_values(
        self,
        responses: List[Response],
        user_metadata: Optional[UserMetadata] = None,
    ) -> Dict:
        """
        Score work values assessment.
        
        Returns value priorities and alignment insights.
        """
        start_time = time.time()

        # Calculate value scores
        value_scores = {}
        value_counts = {}

        for response in responses:
            value = response.dimension
            if value not in self.WORK_VALUE_DIMENSIONS:
                continue
            
            if value not in value_scores:
                value_scores[value] = 0
                value_counts[value] = 0
            value_scores[value] += response.value
            value_counts[value] += 1

        # Calculate averages
        normalized_scores = {}
        for value in self.WORK_VALUE_DIMENSIONS:
            if value in value_scores and value_counts[value] > 0:
                avg = value_scores[value] / value_counts[value]
                normalized_scores[value] = ((avg - 1) / 4) * 100
            else:
                normalized_scores[value] = 50.0

        # Rank priorities
        sorted_values = sorted(normalized_scores.items(), key=lambda x: x[1], reverse=True)
        top_values = [v[0] for v in sorted_values[:3]]

        processing_time = (time.time() - start_time) * 1000

        return {
            "success": True,
            "assessment_type": "work_values",
            "scores": {
                "dimensions": normalized_scores,
                "rankings": [
                    {
                        "value": value,
                        "score": score,
                        "name": self.WORK_VALUE_DIMENSIONS[value]['name'],
                        "description": self.WORK_VALUE_DIMENSIONS[value]['description'],
                    }
                    for value, score in sorted_values
                ],
            },
            "priorities": {
                "primary": top_values[0] if len(top_values) > 0 else None,
                "secondary": top_values[1] if len(top_values) > 1 else None,
                "tertiary": top_values[2] if len(top_values) > 2 else None,
            },
            "confidence": min(0.95, len(responses) / 40),
            "processing_time_ms": round(processing_time, 2),
        }

    # =========================================================================
    # HELPER METHODS
    # =========================================================================

    def _calculate_percentile(self, raw_score: float, norm_table: List[Tuple[float, int]]) -> int:
        """
        Convert raw score to percentile using norm table.
        
        Norm table is a list of (threshold, percentile) tuples.
        """
        if not norm_table:
            # Fallback: linear mapping
            return min(99, max(1, int(((raw_score - 1) / 4) * 100)))
        
        for threshold, percentile in norm_table:
            if raw_score < threshold:
                return percentile
        return 99

    def _predict_personality_type(self, scores: Dict[str, float]) -> str:
        """
        Map Big Five scores to MBTI-like personality type.
        
        Mapping:
        - E/I: Extraversion (>50 = E)
        - N/S: Openness (>50 = N for intuition)
        - T/F: Agreeableness (>50 = F for feeling)
        - J/P: Conscientiousness (>50 = J for judging)
        """
        e_i = 'E' if scores.get('extraversion', 50) > 50 else 'I'
        n_s = 'N' if scores.get('openness', 50) > 50 else 'S'
        t_f = 'F' if scores.get('agreeableness', 50) > 50 else 'T'
        j_p = 'J' if scores.get('conscientiousness', 50) > 50 else 'P'
        
        return f"{e_i}{n_s}{t_f}{j_p}"

    def _generate_big_five_insights(
        self,
        dimension_scores: Dict[str, float],
        facet_scores: Dict[str, float],
        academic_level: str,
    ) -> Dict:
        """
        Generate life-stage appropriate insights from Big Five scores.
        """
        insights = {
            "strengths": [],
            "growth_areas": [],
            "academic_implications": [],
            "career_implications": [],
        }

        # Identify high and low dimensions
        high_dims = [d for d, s in dimension_scores.items() if s >= 65]
        low_dims = [d for d, s in dimension_scores.items() if s <= 35]

        # Generate strength statements
        for dim in high_dims:
            if dim == 'openness':
                insights["strengths"].append("Strong imagination and intellectual curiosity")
            elif dim == 'conscientiousness':
                insights["strengths"].append("Excellent organization and follow-through")
            elif dim == 'extraversion':
                insights["strengths"].append("Energetic and skilled at building relationships")
            elif dim == 'agreeableness':
                insights["strengths"].append("Cooperative and empathetic team player")
            elif dim == 'neuroticism':
                insights["growth_areas"].append("May benefit from stress management techniques")

        # Life-stage specific academic/career implications
        if academic_level in ['grade_10', 'grade_12']:
            if 'openness' in high_dims:
                insights["academic_implications"].append(
                    "Consider creative subjects and research projects"
                )
            if 'conscientiousness' in high_dims:
                insights["academic_implications"].append(
                    "Well-suited for rigorous academic programs"
                )
        else:
            if 'openness' in high_dims:
                insights["career_implications"].append(
                    "Thrives in roles requiring innovation and adaptability"
                )
            if 'conscientiousness' in high_dims:
                insights["career_implications"].append(
                    "Excellent fit for project management and quality-focused roles"
                )

        return insights


# =========================================================================
# UNIFIED SCORER INTERFACE
# =========================================================================

class UnifiedScorer:
    """
    Unified interface for all assessment types.
    
    Routes to appropriate scorer based on assessment type.
    """

    def __init__(self):
        self.enhanced_scorer = EnhancedPsychometricScorer()

    def score_assessment(
        self,
        assessment_type: str,
        responses: List[Response],
        user_metadata: Optional[UserMetadata] = None,
    ) -> Dict:
        """
        Score any assessment type.
        
        Args:
            assessment_type: 'personality', 'big_five', 'interest', 'riasec', 'skill', 'work_values'
            responses: List of Response objects
            user_metadata: Optional user context (academic_level, etc.)
            
        Returns:
            Scoring results dictionary
        """
        # Normalize assessment type
        type_lower = assessment_type.lower().replace(' ', '_').replace('-', '_')
        
        if type_lower in ['personality', 'big_five', 'big5', 'ocean']:
            return self.enhanced_scorer.score_big_five(responses, user_metadata)
        elif type_lower in ['interest', 'riasec', 'holland', 'career_interest', 'career_interests']:
            return self.enhanced_scorer.score_riasec(responses, user_metadata)
        elif type_lower in ['skill', 'skills', 'competency', 'competencies']:
            return self.enhanced_scorer.score_skills(responses, user_metadata)
        elif type_lower in ['work_values', 'values', 'work_value']:
            return self.enhanced_scorer.score_work_values(responses, user_metadata)
        else:
            # Fallback to Big Five for unknown types
            return self.enhanced_scorer.score_big_five(responses, user_metadata)


# Singleton instances
enhanced_psychometric_scorer = EnhancedPsychometricScorer()
unified_scorer = UnifiedScorer()
