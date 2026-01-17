"""
Life-Stage Specific Recommendation Engine

Generates actionable career guidance tailored to user's academic level:
- Grade 10: Stream selection (Science/Commerce/Arts), exploration activities
- Grade 12: College major selection, entrance exam guidance  
- Undergraduate: Specialization paths, internship guidance
- Post-Graduate: Research focus, advanced career paths
- Professional: Career pivot options, skill development, advancement

Each life stage receives:
1. Context-appropriate career paths
2. Concrete next steps
3. Educational pathway recommendations
4. Skill development priorities
5. Resources and action items
"""

from typing import Dict, List, Optional, Any
from dataclasses import dataclass
from enum import Enum


class AcademicLevel(str, Enum):
    GRADE_10 = "grade_10"
    GRADE_12 = "grade_12"
    UNDERGRADUATE = "undergraduate"
    POST_GRADUATE = "post_graduate"
    PROFESSIONAL = "professional"


@dataclass
class StreamRecommendation:
    """Stream selection recommendation for high school students."""
    stream: str
    fit_score: float
    reasons: List[str]
    subjects: List[str]
    career_examples: List[str]


@dataclass
class CollegeMajorRecommendation:
    """College major recommendation."""
    major: str
    fit_score: float
    reasons: List[str]
    top_colleges: List[str]
    entrance_exams: List[str]
    career_paths: List[str]


@dataclass
class CareerPathRecommendation:
    """Career path recommendation with development plan."""
    career: str
    fit_score: float
    current_fit: str  # 'high', 'medium', 'developing'
    skill_gaps: List[str]
    certifications: List[str]
    timeline: str
    salary_range: Dict[str, int]


@dataclass
class ActionItem:
    """A concrete action item for the user."""
    action: str
    category: str  # 'education', 'skill', 'experience', 'networking', 'research'
    priority: str  # 'immediate', 'short_term', 'long_term'
    details: str
    resources: List[str]


class LifeStageRecommendationEngine:
    """
    Generates life-stage appropriate recommendations based on assessment results.
    """

    # =========================================================================
    # STREAM/SUBJECT MAPPINGS FOR HIGH SCHOOL
    # =========================================================================
    
    STREAMS = {
        'science': {
            'name': 'Science',
            'core_subjects': ['Physics', 'Chemistry', 'Mathematics', 'Biology (optional)'],
            'holland_codes': ['IR', 'RI', 'IC', 'RC'],
            'personality_fit': {
                'openness': (55, 100),
                'conscientiousness': (60, 100),
            },
            'careers': [
                'Doctor', 'Engineer', 'Scientist', 'Data Scientist', 'Architect',
                'Pharmacist', 'Research Analyst', 'Software Developer'
            ],
        },
        'commerce': {
            'name': 'Commerce',
            'core_subjects': ['Accountancy', 'Business Studies', 'Economics', 'Mathematics (optional)'],
            'holland_codes': ['EC', 'CE', 'EI', 'CS'],
            'personality_fit': {
                'conscientiousness': (60, 100),
                'extraversion': (45, 100),
            },
            'careers': [
                'Chartered Accountant', 'Investment Banker', 'Business Analyst',
                'Financial Advisor', 'Entrepreneur', 'Marketing Manager', 'Economist'
            ],
        },
        'arts': {
            'name': 'Arts/Humanities',
            'core_subjects': ['History', 'Political Science', 'Psychology', 'Sociology', 'Languages'],
            'holland_codes': ['AS', 'SA', 'AE', 'SE'],
            'personality_fit': {
                'openness': (60, 100),
                'agreeableness': (55, 100),
            },
            'careers': [
                'Lawyer', 'Journalist', 'Psychologist', 'Social Worker', 'Teacher',
                'Content Writer', 'Public Relations', 'Civil Services'
            ],
        },
    }

    # =========================================================================
    # COLLEGE MAJOR MAPPINGS
    # =========================================================================
    
    MAJORS = {
        'engineering': {
            'name': 'Engineering',
            'holland_codes': ['RI', 'IR', 'RC', 'IC'],
            'entrance_exams': ['JEE Main', 'JEE Advanced', 'BITSAT', 'State CETs'],
            'top_colleges': ['IITs', 'NITs', 'BITS Pilani', 'IIITs'],
            'specializations': [
                'Computer Science', 'Mechanical', 'Electrical', 'Civil',
                'Electronics', 'Chemical', 'Aerospace'
            ],
        },
        'medicine': {
            'name': 'Medicine/Healthcare',
            'holland_codes': ['IS', 'SI', 'IR', 'SR'],
            'entrance_exams': ['NEET UG', 'AIIMS', 'JIPMER'],
            'top_colleges': ['AIIMS', 'CMC Vellore', 'AFMC', 'JIPMER'],
            'specializations': [
                'MBBS', 'BDS', 'BAMS', 'BHMS', 'Nursing', 'Pharmacy'
            ],
        },
        'business': {
            'name': 'Business/Management',
            'holland_codes': ['EC', 'ES', 'EI', 'CE'],
            'entrance_exams': ['CUET', 'IPMAT', 'SET', 'NPAT'],
            'top_colleges': ['SRCC', 'Hindu College', 'St. Stephen\'s', 'Christ University'],
            'specializations': [
                'BBA', 'B.Com', 'BMS', 'BBE', 'Integrated MBA'
            ],
        },
        'science': {
            'name': 'Pure Sciences',
            'holland_codes': ['IR', 'IA', 'IC', 'IS'],
            'entrance_exams': ['CUET', 'NEST', 'IAT', 'IISER Aptitude Test'],
            'top_colleges': ['IISc', 'IISERs', 'NISER', 'St. Stephen\'s', 'Presidency'],
            'specializations': [
                'Physics', 'Chemistry', 'Mathematics', 'Biology', 'Statistics'
            ],
        },
        'arts': {
            'name': 'Arts/Humanities',
            'holland_codes': ['AS', 'SA', 'AE', 'SE'],
            'entrance_exams': ['CUET', 'DU JAT', 'IPU CET', 'BHU UET'],
            'top_colleges': ['JNU', 'DU Colleges', 'Jadavpur', 'Presidency'],
            'specializations': [
                'English', 'History', 'Political Science', 'Psychology', 
                'Sociology', 'Philosophy', 'Economics'
            ],
        },
        'law': {
            'name': 'Law',
            'holland_codes': ['ES', 'EI', 'SE', 'EC'],
            'entrance_exams': ['CLAT', 'AILET', 'LSAT India', 'MH CET Law'],
            'top_colleges': ['NLUs', 'Faculty of Law DU', 'NALSAR', 'NLSIU'],
            'specializations': [
                'BA LLB', 'BBA LLB', 'B.Com LLB', 'LLB (3-year)'
            ],
        },
        'design': {
            'name': 'Design',
            'holland_codes': ['AE', 'AR', 'AI', 'AS'],
            'entrance_exams': ['NID DAT', 'UCEED', 'CEED', 'NIFT'],
            'top_colleges': ['NID', 'IIT IDC', 'NIFT', 'Srishti'],
            'specializations': [
                'Product Design', 'Communication Design', 'Fashion Design',
                'Interior Design', 'UX/UI Design'
            ],
        },
        'media': {
            'name': 'Media & Communication',
            'holland_codes': ['AE', 'EA', 'AS', 'ES'],
            'entrance_exams': ['IIMC Entrance', 'XIC OET', 'IPU CET'],
            'top_colleges': ['IIMC', 'XIC', 'ACJ', 'Jamia', 'Symbiosis'],
            'specializations': [
                'Journalism', 'Advertising', 'Film Making', 'Public Relations',
                'Digital Media', 'Mass Communication'
            ],
        },
    }

    # =========================================================================
    # PROFESSIONAL DEVELOPMENT PATHS
    # =========================================================================
    
    PROFESSIONAL_CERTIFICATIONS = {
        'technology': [
            {'name': 'AWS Solutions Architect', 'duration': '3-6 months', 'value': 'high'},
            {'name': 'Google Cloud Professional', 'duration': '3-6 months', 'value': 'high'},
            {'name': 'PMP Certification', 'duration': '3-4 months', 'value': 'high'},
            {'name': 'Scrum Master', 'duration': '1-2 months', 'value': 'medium'},
        ],
        'finance': [
            {'name': 'CFA', 'duration': '2-3 years', 'value': 'very_high'},
            {'name': 'FRM', 'duration': '1-2 years', 'value': 'high'},
            {'name': 'CA/CPA', 'duration': '3-4 years', 'value': 'very_high'},
            {'name': 'CMA', 'duration': '1-2 years', 'value': 'high'},
        ],
        'marketing': [
            {'name': 'Google Analytics', 'duration': '1-2 months', 'value': 'medium'},
            {'name': 'HubSpot Marketing', 'duration': '1 month', 'value': 'medium'},
            {'name': 'Meta Blueprint', 'duration': '1-2 months', 'value': 'medium'},
        ],
        'data_science': [
            {'name': 'TensorFlow Developer', 'duration': '2-3 months', 'value': 'high'},
            {'name': 'IBM Data Science Professional', 'duration': '3-4 months', 'value': 'medium'},
            {'name': 'Azure Data Scientist', 'duration': '3-4 months', 'value': 'high'},
        ],
        'management': [
            {'name': 'Six Sigma Green Belt', 'duration': '2-3 months', 'value': 'medium'},
            {'name': 'SHRM-CP (HR)', 'duration': '3-4 months', 'value': 'high'},
            {'name': 'Executive MBA', 'duration': '1-2 years', 'value': 'very_high'},
        ],
    }

    def __init__(self):
        """Initialize the recommendation engine."""
        pass

    def generate_recommendations(
        self,
        academic_level: str,
        personality_scores: Dict[str, float],
        holland_code: Optional[str] = None,
        skills_scores: Optional[Dict[str, float]] = None,
        work_values: Optional[Dict[str, float]] = None,
        career_matches: Optional[List[Dict]] = None,
    ) -> Dict[str, Any]:
        """
        Generate comprehensive life-stage specific recommendations.
        
        Args:
            academic_level: User's current academic level
            personality_scores: Big Five dimension scores (0-100)
            holland_code: 3-letter Holland Code (e.g., "RIA")
            skills_scores: Skill domain scores (0-100)
            work_values: Work value priorities (0-100)
            career_matches: List of matched careers from career_matcher
            
        Returns:
            Comprehensive recommendations tailored to life stage
        """
        level = academic_level.lower().replace(' ', '_').replace('-', '_')
        
        if level == 'grade_10':
            return self._generate_grade_10_recommendations(
                personality_scores, holland_code, work_values
            )
        elif level == 'grade_12':
            return self._generate_grade_12_recommendations(
                personality_scores, holland_code, skills_scores, work_values
            )
        elif level == 'undergraduate':
            return self._generate_undergraduate_recommendations(
                personality_scores, holland_code, skills_scores, work_values, career_matches
            )
        elif level == 'post_graduate':
            return self._generate_postgraduate_recommendations(
                personality_scores, holland_code, skills_scores, work_values, career_matches
            )
        elif level == 'professional':
            return self._generate_professional_recommendations(
                personality_scores, holland_code, skills_scores, work_values, career_matches
            )
        else:
            # Default to undergraduate-level recommendations
            return self._generate_undergraduate_recommendations(
                personality_scores, holland_code, skills_scores, work_values, career_matches
            )

    # =========================================================================
    # GRADE 10 RECOMMENDATIONS
    # =========================================================================
    
    def _generate_grade_10_recommendations(
        self,
        personality_scores: Dict[str, float],
        holland_code: Optional[str],
        work_values: Optional[Dict[str, float]],
    ) -> Dict[str, Any]:
        """
        Generate recommendations for Grade 10 students.
        
        Focus:
        - Stream selection (Science/Commerce/Arts)
        - Subject choices
        - Exploration activities
        - Foundation building
        """
        # Calculate stream fit scores
        stream_recommendations = []
        
        for stream_key, stream_data in self.STREAMS.items():
            fit_score = self._calculate_stream_fit(
                personality_scores, holland_code, stream_data
            )
            
            reasons = self._generate_stream_reasons(
                personality_scores, holland_code, stream_key, fit_score
            )
            
            stream_recommendations.append({
                'stream': stream_data['name'],
                'fit_score': round(fit_score * 100, 1),
                'reasons': reasons,
                'subjects': stream_data['core_subjects'],
                'career_examples': stream_data['careers'][:5],
            })
        
        # Sort by fit score
        stream_recommendations.sort(key=lambda x: x['fit_score'], reverse=True)
        
        # Generate action items
        action_items = [
            {
                'action': 'Research your top recommended stream thoroughly',
                'category': 'research',
                'priority': 'immediate',
                'details': f"Your strongest fit is {stream_recommendations[0]['stream']}. Research subjects, career options, and talk to people in these fields.",
                'resources': ['Career counseling sessions', 'YouTube career videos', 'Career exploration websites'],
            },
            {
                'action': 'Talk to seniors and professionals',
                'category': 'networking',
                'priority': 'immediate',
                'details': 'Connect with Grade 11/12 students and professionals in your areas of interest to understand real-world experiences.',
                'resources': ['School alumni network', 'LinkedIn', 'Family connections'],
            },
            {
                'action': 'Explore through activities and projects',
                'category': 'experience',
                'priority': 'short_term',
                'details': 'Join clubs, participate in competitions, or work on projects related to your interests.',
                'resources': ['School clubs', 'Online courses', 'Science fairs', 'Debate clubs'],
            },
            {
                'action': 'Build strong foundations in core subjects',
                'category': 'education',
                'priority': 'short_term',
                'details': 'Focus on Mathematics, English, and Science as these form the foundation for all streams.',
                'resources': ['NCERT books', 'Khan Academy', 'School teachers'],
            },
        ]
        
        # Generate exploration activities based on Holland code
        exploration_activities = self._generate_exploration_activities(holland_code)
        
        return {
            'life_stage': 'grade_10',
            'summary': f"Based on your personality and interests, {stream_recommendations[0]['stream']} appears to be your strongest fit, but you should explore all options before deciding.",
            'stream_recommendations': stream_recommendations,
            'primary_recommendation': {
                'stream': stream_recommendations[0]['stream'],
                'message': f"Your profile strongly aligns with {stream_recommendations[0]['stream']}. Your {self._get_top_traits(personality_scores)} suggest you would thrive in this stream.",
            },
            'action_items': action_items,
            'exploration_activities': exploration_activities,
            'important_note': "Grade 10 is about exploration, not final decisions. Use this time to discover your interests through activities, reading, and conversations.",
        }

    # =========================================================================
    # GRADE 12 RECOMMENDATIONS
    # =========================================================================
    
    def _generate_grade_12_recommendations(
        self,
        personality_scores: Dict[str, float],
        holland_code: Optional[str],
        skills_scores: Optional[Dict[str, float]],
        work_values: Optional[Dict[str, float]],
    ) -> Dict[str, Any]:
        """
        Generate recommendations for Grade 12 students.
        
        Focus:
        - College major selection
        - Entrance exam guidance
        - Top college recommendations
        - Application timeline
        """
        # Calculate major fit scores
        major_recommendations = []
        
        for major_key, major_data in self.MAJORS.items():
            fit_score = self._calculate_major_fit(
                personality_scores, holland_code, skills_scores, major_data
            )
            
            if fit_score > 0.4:  # Only include reasonably good fits
                major_recommendations.append({
                    'major': major_data['name'],
                    'fit_score': round(fit_score * 100, 1),
                    'entrance_exams': major_data['entrance_exams'],
                    'top_colleges': major_data['top_colleges'],
                    'specializations': major_data['specializations'],
                })
        
        # Sort by fit score
        major_recommendations.sort(key=lambda x: x['fit_score'], reverse=True)
        
        # Get top 3 majors
        top_majors = major_recommendations[:3]
        
        # Generate entrance exam timeline
        exam_timeline = self._generate_exam_timeline(top_majors)
        
        # Action items
        action_items = [
            {
                'action': 'Register for relevant entrance exams',
                'category': 'education',
                'priority': 'immediate',
                'details': f"Based on your interests, prioritize: {', '.join(top_majors[0]['entrance_exams'][:2]) if top_majors else 'relevant entrance exams'}",
                'resources': ['Official exam websites', 'Coaching classes', 'Online prep platforms'],
            },
            {
                'action': 'Create a study plan for entrance exams',
                'category': 'education',
                'priority': 'immediate',
                'details': 'Divide your preparation between board exams and entrance exams. Focus on concepts and practice.',
                'resources': ['Previous year papers', 'Mock tests', 'Study groups'],
            },
            {
                'action': 'Research colleges and their cutoffs',
                'category': 'research',
                'priority': 'short_term',
                'details': 'Understand admission criteria, placement records, and campus life of your target colleges.',
                'resources': ['College websites', 'College Dunia', 'Shiksha', 'YouTube campus tours'],
            },
            {
                'action': 'Prepare application essays and portfolios',
                'category': 'education',
                'priority': 'short_term',
                'details': 'Many colleges require SOPs, essays, or portfolios. Start drafting early.',
                'resources': ['College application guides', 'Essay writing workshops'],
            },
        ]
        
        return {
            'life_stage': 'grade_12',
            'summary': f"Your profile suggests strong alignment with {top_majors[0]['major'] if top_majors else 'multiple fields'}. Focus on entrance exam preparation while keeping backup options.",
            'major_recommendations': top_majors,
            'all_options': major_recommendations,
            'exam_timeline': exam_timeline,
            'action_items': action_items,
            'college_selection_factors': [
                'Placement records and industry connections',
                'Faculty quality and research opportunities',
                'Location and campus infrastructure',
                'Alumni network strength',
                'Fee structure and scholarship availability',
            ],
        }

    # =========================================================================
    # UNDERGRADUATE RECOMMENDATIONS
    # =========================================================================
    
    def _generate_undergraduate_recommendations(
        self,
        personality_scores: Dict[str, float],
        holland_code: Optional[str],
        skills_scores: Optional[Dict[str, float]],
        work_values: Optional[Dict[str, float]],
        career_matches: Optional[List[Dict]],
    ) -> Dict[str, Any]:
        """
        Generate recommendations for undergraduate students.
        
        Focus:
        - Specialization selection
        - Internship guidance
        - Skill building priorities
        - Entry-level career paths
        """
        # Identify skill development priorities
        skill_priorities = self._identify_skill_priorities(skills_scores)
        
        # Generate internship recommendations
        internship_guidance = self._generate_internship_guidance(
            holland_code, career_matches
        )
        
        # Action items
        action_items = [
            {
                'action': 'Secure relevant internships',
                'category': 'experience',
                'priority': 'immediate',
                'details': 'Apply to internships that align with your career interests. Even short-term projects add value.',
                'resources': ['LinkedIn', 'Internshala', 'Company career pages', 'College placement cell'],
            },
            {
                'action': 'Build your skill portfolio',
                'category': 'skill',
                'priority': 'immediate',
                'details': f"Focus on developing: {', '.join(skill_priorities[:3])}",
                'resources': ['Coursera', 'Udemy', 'YouTube tutorials', 'GitHub projects'],
            },
            {
                'action': 'Work on real projects',
                'category': 'experience',
                'priority': 'short_term',
                'details': 'Create a portfolio of projects that demonstrate your skills. Open source, freelance, or personal projects all count.',
                'resources': ['GitHub', 'Behance', 'Personal website'],
            },
            {
                'action': 'Network with professionals',
                'category': 'networking',
                'priority': 'short_term',
                'details': 'Connect with alumni, attend industry events, and join professional communities.',
                'resources': ['LinkedIn', 'Industry conferences', 'Alumni meetups', 'Professional associations'],
            },
            {
                'action': 'Consider higher education options',
                'category': 'education',
                'priority': 'long_term',
                'details': 'Research Masters programs or professional certifications if they align with your career goals.',
                'resources': ['GRE/GMAT prep', 'University rankings', 'Scholarship databases'],
            },
        ]
        
        return {
            'life_stage': 'undergraduate',
            'summary': 'Focus on building practical skills through internships and projects while clarifying your career direction.',
            'career_directions': career_matches[:5] if career_matches else [],
            'skill_priorities': skill_priorities,
            'internship_guidance': internship_guidance,
            'action_items': action_items,
            'timeline_milestones': {
                'year_1_2': 'Explore interests, build foundational skills, get your first internship',
                'year_2_3': 'Specialize, take leadership roles, build portfolio',
                'year_3_4': 'Secure pre-placement offers, prepare for full-time roles',
            },
        }

    # =========================================================================
    # POST-GRADUATE RECOMMENDATIONS
    # =========================================================================
    
    def _generate_postgraduate_recommendations(
        self,
        personality_scores: Dict[str, float],
        holland_code: Optional[str],
        skills_scores: Optional[Dict[str, float]],
        work_values: Optional[Dict[str, float]],
        career_matches: Optional[List[Dict]],
    ) -> Dict[str, Any]:
        """
        Generate recommendations for post-graduate students.
        
        Focus:
        - Research vs Industry decision
        - Advanced career paths
        - Specialization depth
        - Leadership development
        """
        # Determine research vs industry fit
        research_fit = self._calculate_research_fit(personality_scores, holland_code)
        industry_fit = 1 - research_fit
        
        action_items = [
            {
                'action': 'Define your career focus: Research or Industry',
                'category': 'research',
                'priority': 'immediate',
                'details': f"Your profile suggests {'research' if research_fit > 0.6 else 'industry'} alignment ({round(max(research_fit, industry_fit)*100)}% fit). Validate through informational interviews.",
                'resources': ['Faculty advisors', 'Industry mentors', 'LinkedIn professionals'],
            },
            {
                'action': 'Build thought leadership',
                'category': 'skill',
                'priority': 'short_term',
                'details': 'Publish papers, speak at conferences, or write industry articles to establish expertise.',
                'resources': ['Academic journals', 'Medium', 'Industry conferences', 'LinkedIn articles'],
            },
            {
                'action': 'Develop leadership skills',
                'category': 'skill',
                'priority': 'short_term',
                'details': 'Take on leadership roles in projects, student organizations, or research teams.',
                'resources': ['Leadership workshops', 'Student bodies', 'Research collaborations'],
            },
        ]
        
        return {
            'life_stage': 'post_graduate',
            'summary': f"Your profile shows {round(research_fit*100)}% research fit and {round(industry_fit*100)}% industry fit. Focus on building depth in your specialization.",
            'career_paths': {
                'research_track': {
                    'fit_score': round(research_fit * 100, 1),
                    'paths': ['Academia', 'Research Labs', 'R&D in Industry', 'Think Tanks'],
                    'next_steps': ['PhD programs', 'Post-doc positions', 'Research fellowships'],
                },
                'industry_track': {
                    'fit_score': round(industry_fit * 100, 1),
                    'paths': career_matches[:3] if career_matches else [],
                    'next_steps': ['Senior roles', 'Consulting', 'Entrepreneurship'],
                },
            },
            'action_items': action_items,
        }

    # =========================================================================
    # PROFESSIONAL RECOMMENDATIONS
    # =========================================================================
    
    def _generate_professional_recommendations(
        self,
        personality_scores: Dict[str, float],
        holland_code: Optional[str],
        skills_scores: Optional[Dict[str, float]],
        work_values: Optional[Dict[str, float]],
        career_matches: Optional[List[Dict]],
    ) -> Dict[str, Any]:
        """
        Generate recommendations for working professionals.
        
        Focus:
        - Career advancement
        - Skill gap analysis
        - Pivot opportunities
        - Leadership development
        - Certifications and upskilling
        """
        # Identify career categories
        career_category = self._identify_career_category(holland_code, career_matches)
        
        # Get relevant certifications
        certifications = self.PROFESSIONAL_CERTIFICATIONS.get(career_category, [])
        
        # Generate skill gap analysis
        skill_gaps = self._analyze_skill_gaps(skills_scores, career_matches)
        
        # Career pivot options
        pivot_options = self._generate_pivot_options(
            personality_scores, holland_code, skills_scores, career_matches
        )
        
        action_items = [
            {
                'action': 'Conduct a skill gap analysis',
                'category': 'skill',
                'priority': 'immediate',
                'details': f"Key areas to develop: {', '.join(skill_gaps[:3])}",
                'resources': ['Skills assessment tools', 'Manager feedback', 'Industry benchmarks'],
            },
            {
                'action': 'Pursue relevant certifications',
                'category': 'education',
                'priority': 'short_term',
                'details': f"Consider: {certifications[0]['name'] if certifications else 'industry-relevant certifications'}",
                'resources': ['Online learning platforms', 'Professional associations', 'Employer training programs'],
            },
            {
                'action': 'Build your professional brand',
                'category': 'networking',
                'priority': 'short_term',
                'details': 'Update LinkedIn, share insights, and establish yourself as a thought leader.',
                'resources': ['LinkedIn', 'Industry blogs', 'Speaking opportunities'],
            },
            {
                'action': 'Expand your network strategically',
                'category': 'networking',
                'priority': 'short_term',
                'details': 'Connect with people in roles you aspire to, mentors, and cross-functional peers.',
                'resources': ['Industry events', 'Professional associations', 'LinkedIn'],
            },
        ]
        
        return {
            'life_stage': 'professional',
            'summary': 'Focus on strategic skill development and positioning yourself for advancement or meaningful career transitions.',
            'career_advancement': {
                'current_path': career_matches[0] if career_matches else None,
                'next_level_roles': self._suggest_next_level_roles(career_matches),
                'timeline': '1-3 years with focused development',
            },
            'skill_development': {
                'gaps': skill_gaps,
                'certifications': certifications[:3],
                'learning_paths': self._generate_learning_paths(skill_gaps),
            },
            'pivot_options': pivot_options,
            'action_items': action_items,
            'values_alignment': self._analyze_values_fit(work_values) if work_values else None,
        }

    # =========================================================================
    # HELPER METHODS
    # =========================================================================
    
    def _calculate_stream_fit(
        self,
        personality_scores: Dict[str, float],
        holland_code: Optional[str],
        stream_data: Dict,
    ) -> float:
        """Calculate fit score for a high school stream."""
        fit = 0.5  # Base score
        
        # Personality fit (40% weight)
        if personality_scores:
            personality_match = 0
            count = 0
            for dim, (low, high) in stream_data.get('personality_fit', {}).items():
                if dim in personality_scores:
                    score = personality_scores[dim]
                    if low <= score <= high:
                        personality_match += 1
                    elif score < low:
                        personality_match += max(0, 1 - (low - score) / 50)
                    else:
                        personality_match += max(0, 1 - (score - high) / 50)
                    count += 1
            if count > 0:
                fit += (personality_match / count) * 0.4
        
        # Holland code fit (40% weight)
        if holland_code:
            user_codes = holland_code.upper()[:2]
            best_match = 0
            for stream_code in stream_data.get('holland_codes', []):
                match = sum(1 for c in user_codes if c in stream_code) / 2
                best_match = max(best_match, match)
            fit += best_match * 0.4
        
        return min(1.0, fit)

    def _calculate_major_fit(
        self,
        personality_scores: Dict[str, float],
        holland_code: Optional[str],
        skills_scores: Optional[Dict[str, float]],
        major_data: Dict,
    ) -> float:
        """Calculate fit score for a college major."""
        fit = 0.3  # Base score
        
        # Holland code fit (50% weight for majors)
        if holland_code:
            user_codes = holland_code.upper()[:2]
            best_match = 0
            for major_code in major_data.get('holland_codes', []):
                match = sum(1 for c in user_codes if c in major_code) / 2
                best_match = max(best_match, match)
            fit += best_match * 0.5
        
        return min(1.0, fit)

    def _calculate_research_fit(
        self,
        personality_scores: Dict[str, float],
        holland_code: Optional[str],
    ) -> float:
        """Estimate fit for research career track."""
        fit = 0.5
        
        # High openness and conscientiousness favor research
        if personality_scores:
            if personality_scores.get('openness', 50) > 70:
                fit += 0.15
            if personality_scores.get('conscientiousness', 50) > 65:
                fit += 0.1
            if personality_scores.get('extraversion', 50) < 50:
                fit += 0.1
        
        # Investigative Holland code favors research
        if holland_code and 'I' in holland_code.upper()[:2]:
            fit += 0.15
        
        return min(1.0, fit)

    def _generate_stream_reasons(
        self,
        personality_scores: Dict[str, float],
        holland_code: Optional[str],
        stream: str,
        fit_score: float,
    ) -> List[str]:
        """Generate reasons for stream recommendation."""
        reasons = []
        
        if fit_score > 0.7:
            reasons.append("Strong alignment with your personality profile")
        
        if stream == 'science' and personality_scores.get('openness', 50) > 60:
            reasons.append("Your curiosity and analytical thinking suit scientific inquiry")
        elif stream == 'commerce' and personality_scores.get('conscientiousness', 50) > 60:
            reasons.append("Your organizational skills and attention to detail align with business studies")
        elif stream == 'arts' and personality_scores.get('agreeableness', 50) > 60:
            reasons.append("Your empathy and communication strengths suit humanities")
        
        if not reasons:
            reasons.append("Offers career paths matching your interests")
        
        return reasons[:3]

    def _generate_exploration_activities(self, holland_code: Optional[str]) -> List[Dict]:
        """Generate exploration activities based on Holland code."""
        activities = []
        
        if holland_code:
            if 'R' in holland_code.upper():
                activities.append({
                    'activity': 'Join robotics club or science project',
                    'reason': 'Matches your practical, hands-on interests'
                })
            if 'I' in holland_code.upper():
                activities.append({
                    'activity': 'Participate in science olympiads or research projects',
                    'reason': 'Feeds your analytical and investigative nature'
                })
            if 'A' in holland_code.upper():
                activities.append({
                    'activity': 'Join art, music, or creative writing clubs',
                    'reason': 'Nurtures your creative expression'
                })
            if 'S' in holland_code.upper():
                activities.append({
                    'activity': 'Volunteer or join peer counseling programs',
                    'reason': 'Develops your helping and social skills'
                })
            if 'E' in holland_code.upper():
                activities.append({
                    'activity': 'Join debate club or student council',
                    'reason': 'Builds your leadership and persuasion skills'
                })
            if 'C' in holland_code.upper():
                activities.append({
                    'activity': 'Take up organizing events or managing projects',
                    'reason': 'Utilizes your organizational strengths'
                })
        
        return activities[:4]

    def _generate_exam_timeline(self, majors: List[Dict]) -> List[Dict]:
        """Generate entrance exam preparation timeline."""
        timeline = []
        
        # Collect all exams from top majors
        all_exams = set()
        for major in majors:
            all_exams.update(major.get('entrance_exams', []))
        
        # Common exam timeline (can be customized based on country/region)
        exam_dates = {
            'JEE Main': 'January & April',
            'JEE Advanced': 'May',
            'NEET UG': 'May',
            'CUET': 'May-June',
            'CLAT': 'December',
            'NID DAT': 'December-January',
        }
        
        for exam in all_exams:
            if exam in exam_dates:
                timeline.append({
                    'exam': exam,
                    'timing': exam_dates[exam],
                    'prep_start': 'At least 6 months before',
                })
        
        return timeline

    def _identify_skill_priorities(
        self,
        skills_scores: Optional[Dict[str, float]],
    ) -> List[str]:
        """Identify skills that need development."""
        if not skills_scores:
            return ['communication', 'analytical', 'technical', 'leadership']
        
        # Sort by score ascending to get weakest skills
        sorted_skills = sorted(skills_scores.items(), key=lambda x: x[1])
        return [skill for skill, score in sorted_skills if score < 70][:5]

    def _generate_internship_guidance(
        self,
        holland_code: Optional[str],
        career_matches: Optional[List[Dict]],
    ) -> Dict:
        """Generate internship search guidance."""
        return {
            'target_industries': [m.get('title', '').split()[0] for m in (career_matches or [])[:3]],
            'search_tips': [
                'Start applying 3-4 months before desired start date',
                'Tailor resume for each application',
                'Leverage alumni networks',
                'Follow up professionally after applying',
            ],
            'platforms': ['LinkedIn', 'Internshala', 'AngelList', 'Company career pages'],
        }

    def _identify_career_category(
        self,
        holland_code: Optional[str],
        career_matches: Optional[List[Dict]],
    ) -> str:
        """Identify the primary career category."""
        if career_matches and len(career_matches) > 0:
            title = career_matches[0].get('title', '').lower()
            if any(t in title for t in ['software', 'data', 'engineer', 'developer']):
                return 'technology'
            elif any(t in title for t in ['finance', 'analyst', 'account']):
                return 'finance'
            elif any(t in title for t in ['marketing', 'sales']):
                return 'marketing'
            elif any(t in title for t in ['manager', 'director', 'lead']):
                return 'management'
        
        return 'technology'  # Default

    def _analyze_skill_gaps(
        self,
        skills_scores: Optional[Dict[str, float]],
        career_matches: Optional[List[Dict]],
    ) -> List[str]:
        """Analyze skill gaps based on career targets."""
        gaps = []
        
        if skills_scores:
            for skill, score in skills_scores.items():
                if score < 60:
                    gaps.append(skill)
        
        if not gaps:
            gaps = ['advanced communication', 'strategic thinking', 'leadership']
        
        return gaps[:5]

    def _generate_pivot_options(
        self,
        personality_scores: Dict[str, float],
        holland_code: Optional[str],
        skills_scores: Optional[Dict[str, float]],
        career_matches: Optional[List[Dict]],
    ) -> List[Dict]:
        """Generate career pivot options."""
        pivots = []
        
        if career_matches and len(career_matches) > 3:
            for match in career_matches[3:6]:
                pivots.append({
                    'career': match.get('title', ''),
                    'transition_difficulty': 'medium',
                    'key_skills_needed': ['transferable skills', 'domain knowledge'],
                    'timeline': '6-12 months',
                })
        
        return pivots

    def _suggest_next_level_roles(
        self,
        career_matches: Optional[List[Dict]],
    ) -> List[str]:
        """Suggest advancement roles."""
        if not career_matches:
            return ['Senior positions', 'Team lead roles', 'Management track']
        
        suggestions = []
        for match in career_matches[:2]:
            title = match.get('title', '')
            suggestions.append(f"Senior {title}")
            suggestions.append(f"{title} Lead/Manager")
        
        return suggestions[:4]

    def _generate_learning_paths(self, skill_gaps: List[str]) -> List[Dict]:
        """Generate learning paths for skill gaps."""
        paths = []
        for gap in skill_gaps[:3]:
            paths.append({
                'skill': gap,
                'resources': ['Online courses', 'Books', 'Practice projects'],
                'timeline': '2-3 months',
            })
        return paths

    def _get_top_traits(self, personality_scores: Dict[str, float]) -> str:
        """Get description of top personality traits."""
        if not personality_scores:
            return "unique combination of traits"
        
        sorted_traits = sorted(personality_scores.items(), key=lambda x: x[1], reverse=True)
        top_two = [t[0] for t in sorted_traits[:2]]
        
        trait_descriptions = {
            'openness': 'curiosity and creativity',
            'conscientiousness': 'organization and reliability',
            'extraversion': 'energy and sociability',
            'agreeableness': 'empathy and cooperation',
            'neuroticism': 'emotional awareness',
        }
        
        return ' and '.join([trait_descriptions.get(t, t) for t in top_two])

    def _analyze_values_fit(self, work_values: Dict[str, float]) -> Dict:
        """Analyze work values alignment."""
        sorted_values = sorted(work_values.items(), key=lambda x: x[1], reverse=True)
        
        return {
            'top_values': [v[0] for v in sorted_values[:3]],
            'career_implications': 'Look for roles that prioritize: ' + ', '.join([v[0] for v in sorted_values[:3]]),
        }


# Singleton instance
life_stage_recommender = LifeStageRecommendationEngine()
