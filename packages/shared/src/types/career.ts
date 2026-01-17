export type SkillImportance = 'required' | 'preferred' | 'nice_to_have';
export type GrowthOutlook = 'high' | 'medium' | 'low';
export type ResourceType = 'course' | 'article' | 'certification';

export interface RequiredSkill {
  skill: string;
  importance: SkillImportance;
  proficiencyLevel: number; // 1-5
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

export interface CareerResource {
  type: ResourceType;
  title: string;
  url: string;
}

export interface Career {
  _id: string;
  title: string;
  description: string;
  category: string;
  requiredSkills: RequiredSkill[];
  personalityFit: PersonalityFit[];
  salaryRange?: SalaryRange;
  growthOutlook: GrowthOutlook;
  relatedCareers: string[];
  resources: CareerResource[];
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CareerRecommendation {
  career: Career;
  matchScore: number;
  confidence: number;
  fitFactors: {
    personality: number;
    skills: number;
    interests?: number;
  };
}
