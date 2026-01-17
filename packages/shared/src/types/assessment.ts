export type AssessmentType = 'personality' | 'aptitude' | 'interest' | 'skill';
export type QuestionType = 'likert' | 'multiple_choice' | 'ranking' | 'slider';
export type ScoringMethod = 'ml' | 'weighted_sum' | 'irt';
export type AssessmentResultStatus = 'in_progress' | 'completed' | 'scored';

export interface QuestionOption {
  value: number | string;
  label: string;
}

export interface AssessmentQuestion {
  questionId: string;
  text: string;
  type: QuestionType;
  options?: QuestionOption[];
  dimension?: string;
  weight?: number;
}

export interface Assessment {
  _id: string;
  title: string;
  description: string;
  type: AssessmentType;
  category: string;
  estimatedMinutes: number;
  questions: AssessmentQuestion[];
  scoringMethod: ScoringMethod;
  isActive: boolean;
  version: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface AssessmentResponse {
  questionId: string;
  answer: number | string | number[];
  timeSpentSeconds?: number;
}

export interface DimensionScores {
  [dimension: string]: number;
}

export interface CareerMatch {
  careerId: string;
  matchScore: number;
  confidence: number;
}

export interface MLPredictions {
  careerMatches: CareerMatch[];
  personalityType?: string;
  strengthAreas: string[];
  developmentAreas: string[];
}

export interface AssessmentScores {
  overall?: number;
  dimensions?: DimensionScores;
  percentiles?: DimensionScores;
}

export interface AssessmentResult {
  _id: string;
  userId: string;
  assessmentId: string;
  responses: AssessmentResponse[];
  scores: AssessmentScores;
  mlPredictions?: MLPredictions;
  status: AssessmentResultStatus;
  completedAt?: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}
