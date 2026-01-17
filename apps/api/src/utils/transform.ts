/**
 * Utility functions for transforming data between API and database formats
 */

/**
 * Convert snake_case string to camelCase
 */
function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Transform object keys from snake_case to camelCase
 * Recursively transforms nested objects and arrays
 */
export function toCamelCase<T>(obj: unknown): T {
  if (obj === null || obj === undefined) {
    return obj as T;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => toCamelCase(item)) as T;
  }

  if (typeof obj === 'object' && obj !== null) {
    const transformed: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      const camelKey = snakeToCamel(key);
      transformed[camelKey] = toCamelCase(value);
    }
    return transformed as T;
  }

  return obj as T;
}

/**
 * Transform assessment result from database format to API format
 */
export interface ApiAssessmentResult {
  id: string;
  userId: string;
  assessmentId: string;
  responses: Array<{
    questionId: string;
    value: number | string | number[];
    timeSpentSeconds?: number;
  }>;
  scores: {
    overall?: number;
    dimensions?: Record<string, number>;
    percentiles?: Record<string, number>;
  } | null;
  mlPredictions: {
    careerMatches?: Array<{
      careerId: string;
      matchScore: number;
      confidence: number;
    }>;
    personalityType?: string;
    strengthAreas?: string[];
    developmentAreas?: string[];
  } | null;
  status: 'in_progress' | 'completed' | 'scored';
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export function toApiResult(result: {
  id: string;
  user_id: string;
  assessment_id: string;
  responses: unknown[];
  scores: unknown | null;
  ml_predictions: unknown | null;
  status: string;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}): ApiAssessmentResult {
  return {
    id: result.id,
    userId: result.user_id,
    assessmentId: result.assessment_id,
    responses: result.responses as ApiAssessmentResult['responses'],
    scores: result.scores as ApiAssessmentResult['scores'],
    mlPredictions: result.ml_predictions as ApiAssessmentResult['mlPredictions'],
    status: result.status as ApiAssessmentResult['status'],
    completedAt: result.completed_at,
    createdAt: result.created_at,
    updatedAt: result.updated_at,
  };
}
