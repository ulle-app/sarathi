import {
  assessmentRepository,
  assessmentResultRepository,
  IAssessment,
  IAssessmentResult,
  IResponseItem,
  IScores,
  toAssessmentSummary,
  IAssessmentSummary,
} from '../repositories/assessment.repository.js';
import { mlService } from './ml.service.js';
import { ApiError } from '../middleware/errorHandler.js';

export interface StartAssessmentInput {
  userId: string;
  assessmentId: string;
}

export interface SaveProgressInput {
  resultId: string;
  userId: string;
  responses: IResponseItem[];
}

export interface SubmitAssessmentInput {
  resultId: string;
  userId: string;
  responses: IResponseItem[];
}

class AssessmentService {
  async getAllAssessments(): Promise<IAssessmentSummary[]> {
    const assessments = await assessmentRepository.findAll(true);
    return assessments.map(toAssessmentSummary);
  }

  /**
   * Map incoming academic level to the three-tier values we use to tailor assessments.
   * Supported incoming values: 'grade_10', 'grade_12', 'undergraduate', 'post_graduate', 'professional'
   * Behavior: keep 'grade_10' and 'grade_12' as-is; map everything else to 'professional'.
   */
  private normalizeAcademicLevel(academicLevel?: string): string | undefined {
    if (!academicLevel) return undefined;
    const STUDENT_LEVELS = ['grade_10', 'grade_12'];
    if (STUDENT_LEVELS.includes(academicLevel)) return academicLevel;
    // Treat undergraduate, post_graduate and any unknown values as 'professional'
    return 'professional';
  }

  async getAssessments(academicLevel?: string): Promise<IAssessmentSummary[]> {
    const normalizedLevel = this.normalizeAcademicLevel(academicLevel);
    const assessments = await assessmentRepository.findAll(true, normalizedLevel);
    return assessments.map(toAssessmentSummary);
  }

  async getAssessment(id: string): Promise<IAssessment | null> {
    const assessment = await assessmentRepository.findById(id);
    if (!assessment) {
      throw new ApiError('Assessment not found', 404);
    }
    return assessment;
  }

  async getAssessmentsByType(type: string): Promise<IAssessmentSummary[]> {
    const assessments = await assessmentRepository.findByType(type);
    return assessments.map(toAssessmentSummary);
  }

  async startAssessment(input: StartAssessmentInput): Promise<IAssessmentResult> {
    const { userId, assessmentId } = input;

    // Check if assessment exists
    const assessment = await assessmentRepository.findById(assessmentId);
    if (!assessment) {
      throw new ApiError('Assessment not found', 404);
    }

    if (!assessment.is_active) {
      throw new ApiError('This assessment is not currently available', 400);
    }

    // Check if user has an in-progress session for this assessment
    const existingResult = await assessmentResultRepository.findByUserAndAssessment(
      userId,
      assessmentId,
      'in_progress'
    );

    if (existingResult) {
      // Return existing in-progress session
      return existingResult;
    }

    // Create new assessment result
    const result = await assessmentResultRepository.create({
      user_id: userId,
      assessment_id: assessmentId,
      responses: [],
      status: 'in_progress',
    });

    return result;
  }

  async saveProgress(input: SaveProgressInput): Promise<IAssessmentResult> {
    const { resultId, userId, responses } = input;

    // Get existing result
    const result = await assessmentResultRepository.findById(resultId);
    if (!result) {
      throw new ApiError('Assessment session not found', 404);
    }

    // Verify ownership
    if (result.user_id !== userId) {
      throw new ApiError('You do not have access to this assessment session', 403);
    }

    // Can only save progress on in-progress assessments
    if (result.status !== 'in_progress') {
      throw new ApiError('This assessment has already been submitted', 400);
    }

    // Update responses
    const updatedResult = await assessmentResultRepository.update(resultId, {
      responses,
    });

    if (!updatedResult) {
      throw new ApiError('Failed to save progress', 500);
    }

    return updatedResult;
  }

  async submitAssessment(input: SubmitAssessmentInput): Promise<IAssessmentResult> {
    const { resultId, userId, responses } = input;

    // Get existing result
    const result = await assessmentResultRepository.findById(resultId);
    if (!result) {
      throw new ApiError('Assessment session not found', 404);
    }

    // Verify ownership
    if (result.user_id !== userId) {
      throw new ApiError('You do not have access to this assessment session', 403);
    }

    // Can only submit in-progress assessments
    if (result.status !== 'in_progress') {
      throw new ApiError('This assessment has already been submitted', 400);
    }

    // Get assessment to validate responses
    const assessment = await assessmentRepository.findById(result.assessment_id);
    if (!assessment) {
      throw new ApiError('Assessment not found', 404);
    }

    // Validate that all questions are answered
    const questionIds = new Set(assessment.questions.map((q) => q.id));
    const answeredIds = new Set(responses.map((r) => r.questionId));

    if (answeredIds.size < questionIds.size) {
      throw new ApiError('Please answer all questions before submitting', 400);
    }

    // Calculate scores using the appropriate method
    let scores: IScores;

    if (assessment.scoring_method === 'ml') {
      // Use ML service for scoring
      try {
        const mlResponse = await mlService.scoreAssessment({
          assessmentType: assessment.type,
          responses: responses.map((r) => {
            const question = assessment.questions.find((q) => q.id === r.questionId);
            return {
              questionId: r.questionId,
              value: r.value as number,
              dimension: question?.dimension,
            };
          }),
        });
        scores = {
          overall: mlResponse.overallScore,
          dimensions: mlResponse.dimensions,
          percentiles: mlResponse.percentiles,
        };
      } catch {
        // Fallback to weighted sum if ML service fails
        scores = this.calculateWeightedSumScores(assessment, responses);
      }
    } else {
      scores = this.calculateWeightedSumScores(assessment, responses);
    }

    // Update result with scores and status
    const updatedResult = await assessmentResultRepository.update(resultId, {
      responses,
      scores,
      status: 'completed',
      completed_at: new Date().toISOString(),
    });

    if (!updatedResult) {
      throw new ApiError('Failed to submit assessment', 500);
    }

    return updatedResult;
  }

  async getUserResults(userId: string): Promise<IAssessmentResult[]> {
    return assessmentResultRepository.findByUser(userId);
  }

  async getResultById(resultId: string, userId: string): Promise<IAssessmentResult> {
    const result = await assessmentResultRepository.findById(resultId);
    if (!result) {
      throw new ApiError('Result not found', 404);
    }

    // Verify ownership
    if (result.user_id !== userId) {
      throw new ApiError('You do not have access to this result', 403);
    }

    return result;
  }

  async getResultWithAssessment(
    resultId: string,
    userId: string
  ): Promise<{ result: IAssessmentResult; assessment: IAssessment }> {
    const result = await this.getResultById(resultId, userId);
    const assessment = await assessmentRepository.findById(result.assessment_id);

    if (!assessment) {
      throw new ApiError('Associated assessment not found', 404);
    }

    return { result, assessment };
  }

  async getResultInsights(
    resultId: string,
    userId: string
  ): Promise<{
    result: IAssessmentResult;
    insights: {
      personalityType?: string;
      strengths: string[];
      developmentAreas: string[];
      careerSuggestions: string[];
    };
  }> {
    const result = await this.getResultById(resultId, userId);

    if (result.status !== 'completed' && result.status !== 'scored') {
      throw new ApiError('Assessment not yet completed', 400);
    }

    // If we already have ML predictions, use them
    if (result.ml_predictions) {
      return {
        result,
        insights: {
          personalityType: result.ml_predictions.personalityType,
          strengths: result.ml_predictions.strengthAreas || [],
          developmentAreas: result.ml_predictions.developmentAreas || [],
          careerSuggestions: result.ml_predictions.careerMatches?.map(
            (m) => m.careerId
          ) || [],
        },
      };
    }

    // Get insights from ML service
    const assessment = await assessmentRepository.findById(result.assessment_id);
    if (!assessment) {
      throw new ApiError('Assessment not found', 404);
    }

    try {
      const mlInsights = await mlService.getInsights({
        assessmentType: assessment.type,
        scores: (result.scores || {}) as Record<string, unknown>,
      });

      // Update result with ML predictions
      await assessmentResultRepository.update(resultId, {
        ml_predictions: {
          personalityType: mlInsights.personalityType,
          strengthAreas: mlInsights.strengths,
          developmentAreas: mlInsights.developmentAreas,
        },
        status: 'scored',
      });

      return {
        result,
        insights: mlInsights,
      };
    } catch {
      // Return basic insights if ML service fails
      return {
        result,
        insights: this.generateBasicInsights(result.scores || {}),
      };
    }
  }

  private calculateWeightedSumScores(
    assessment: IAssessment,
    responses: IResponseItem[]
  ): IScores {
    const dimensionScores: Record<string, { total: number; weight: number }> = {};

    for (const response of responses) {
      const question = assessment.questions.find((q) => q.id === response.questionId);
      if (!question) continue;

      const dimension = question.dimension || 'overall';
      const weight = question.weight || 1;
      const value = typeof response.value === 'number' ? response.value : 0;

      if (!dimensionScores[dimension]) {
        dimensionScores[dimension] = { total: 0, weight: 0 };
      }

      dimensionScores[dimension].total += value * weight;
      dimensionScores[dimension].weight += weight;
    }

    const dimensions: Record<string, number> = {};
    let overallTotal = 0;
    let overallWeight = 0;

    for (const [dimension, data] of Object.entries(dimensionScores)) {
      const score = data.weight > 0 ? (data.total / data.weight) * 20 : 0; // Normalize to 0-100 (assuming 5-point scale)
      dimensions[dimension] = Math.round(score * 100) / 100;
      overallTotal += score;
      overallWeight += 1;
    }

    return {
      overall: overallWeight > 0 ? Math.round((overallTotal / overallWeight) * 100) / 100 : 0,
      dimensions,
    };
  }

  private generateBasicInsights(scores: IScores): {
    personalityType?: string;
    strengths: string[];
    developmentAreas: string[];
    careerSuggestions: string[];
  } {
    const strengths: string[] = [];
    const developmentAreas: string[] = [];

    if (scores.dimensions) {
      const sortedDimensions = Object.entries(scores.dimensions).sort(
        ([, a], [, b]) => b - a
      );

      // Top dimensions are strengths
      sortedDimensions.slice(0, 3).forEach(([dim, score]) => {
        if (score >= 60) {
          strengths.push(dim);
        }
      });

      // Bottom dimensions are development areas
      sortedDimensions.slice(-3).forEach(([dim, score]) => {
        if (score < 50) {
          developmentAreas.push(dim);
        }
      });
    }

    return {
      strengths,
      developmentAreas,
      careerSuggestions: [],
    };
  }
}

export const assessmentService = new AssessmentService();
