// Career types
export interface RequiredSkill {
  skill: string;
  importance: 'required' | 'preferred' | 'nice_to_have';
  proficiencyLevel: number;
}

export interface PersonalityFit {
  dimension: string;
  idealRange: [number, number];
  weight: number;
}

export interface SalaryRange {
  min: number;
  max: number;
  currency: string;
}

export interface Resource {
  type: 'course' | 'article' | 'certification';
  title: string;
  url: string;
}

export interface CareerSummary {
  id: string;
  title: string;
  description: string;
  category: string;
  growthOutlook: 'high' | 'medium' | 'low';
  requiredSkillsCount: number;
}

export interface Career extends CareerSummary {
  requiredSkills: RequiredSkill[];
  personalityFit: PersonalityFit[];
  salaryRange: SalaryRange | null;
  relatedCareers: string[];
  resources: Resource[];
  isActive: boolean;
}

// Recommendation types
export interface CareerRecommendation {
  career: CareerSummary;
  matchScore: number;
  confidence: number;
  fitFactors: {
    personality: number;
    skills: number;
    interests: number;
  };
}

// Skill gap types
export interface SkillGapAnalysis {
  career: CareerSummary;
  matchingSkills: string[];
  missingSkills: string[];
  gapScore: number;
  recommendations: string[];
}
