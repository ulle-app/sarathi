// Assessment question types
export type QuestionType = 'likert' | 'multiple_choice' | 'slider' | 'ranking';

export interface QuestionScale {
  min: number;
  max: number;
  step: number;
}

export interface QuestionOption {
  value: number | string;
  label: string;
}

export interface AssessmentQuestion {
  id: string;
  text: string;
  type: QuestionType;
  dimension?: string;
  options?: QuestionOption[];
  scale?: QuestionScale;
  weight?: number;
}

// Assessment types
export interface AssessmentSummary {
  id: string;
  title: string;
  description: string;
  type: 'personality' | 'aptitude' | 'interest' | 'skill';
  category: string;
  estimatedMinutes: number;
  questionCount: number;
  isActive: boolean;
}

export interface Assessment extends AssessmentSummary {
  questions: AssessmentQuestion[];
  scoringMethod: 'ml' | 'weighted_sum' | 'irt';
  version: number;
}

// Response types
export interface ResponseItem {
  questionId: string;
  value: number | string | (number | string)[];
  timeSpentSeconds?: number;
}

// Scores types
export interface Scores {
  overall?: number;
  dimensions?: Record<string, number>;
  percentiles?: Record<string, number>;
}

export interface MlPredictions {
  careerMatches?: {
    careerId: string;
    matchScore: number;
    confidence: number;
  }[];
  personalityType?: string;
  strengthAreas?: string[];
  developmentAreas?: string[];
}

// Assessment result types
export interface AssessmentResult {
  id: string;
  userId: string;
  assessmentId: string;
  responses: ResponseItem[];
  scores: Scores | null;
  mlPredictions: MlPredictions | null;
  status: 'in_progress' | 'completed' | 'scored';
  completedAt: string;
  createdAt: string;
  updatedAt: string;
  // Populated from API when fetching results
  assessment?: {
    id: string;
    title: string;
    type: string;
  };
}

// Insights types
export interface AssessmentInsights {
  personalityType?: string;
  strengths: string[];
  developmentAreas: string[];
  careerSuggestions: string[];
}
