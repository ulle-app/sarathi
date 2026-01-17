import axios, { AxiosInstance } from 'axios';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

export interface ScoreAssessmentInput {
  assessmentType: string;
  responses: {
    questionId: string;
    value: number;
    dimension?: string;
  }[];
  userMetadata?: {
    ageGroup?: string;
    educationLevel?: string;
  };
}

export interface ScoreAssessmentResponse {
  success: boolean;
  overallScore: number;
  dimensions: Record<string, number>;
  percentiles?: Record<string, number>;
  personalityType?: string;
  confidence: number;
  processingTimeMs: number;
}

export interface CareerMatchInput {
  personalityScores: Record<string, number>;
  skills: string[];
  interests: string[];
  topN?: number;
}

export interface CareerMatch {
  careerId: string;
  title: string;
  matchScore: number;
  confidence: number;
  fitFactors: {
    personality: number;
    skills: number;
    interests: number;
  };
}

export interface CareerMatchResponse {
  success: boolean;
  matches: CareerMatch[];
}

export interface InsightsInput {
  assessmentType: string;
  scores: Record<string, unknown>;
}

export interface InsightsResponse {
  personalityType?: string;
  strengths: string[];
  developmentAreas: string[];
  careerSuggestions: string[];
}

class MlService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: env.mlServiceUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': env.mlServiceApiKey,
      },
    });

    // Add request/response interceptors for logging
    this.client.interceptors.request.use(
      (config) => {
        logger.debug(`ML Service Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        logger.error('ML Service Request Error:', error);
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => {
        logger.debug(`ML Service Response: ${response.status}`);
        return response;
      },
      (error) => {
        logger.error('ML Service Response Error:', error.message);
        return Promise.reject(error);
      }
    );
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.client.get('/api/v1/health');
      return response.data?.status === 'healthy';
    } catch {
      return false;
    }
  }

  async scoreAssessment(input: ScoreAssessmentInput): Promise<ScoreAssessmentResponse> {
    try {
      const response = await this.client.post('/api/v1/score_profile', {
        assessment_type: input.assessmentType,
        responses: input.responses.map((r) => ({
          question_id: r.questionId,
          value: r.value,
          dimension: r.dimension,
        })),
        user_metadata: input.userMetadata,
      });

      const data = response.data;

      return {
        success: data.success,
        overallScore: this.calculateOverallFromDimensions(data.scores?.dimensions || {}),
        dimensions: data.scores?.dimensions || {},
        percentiles: data.scores?.percentiles,
        personalityType: data.personality_type,
        confidence: data.confidence || 0,
        processingTimeMs: data.processing_time_ms || 0,
      };
    } catch (error) {
      logger.error('ML scoring failed:', error);
      throw new Error('Failed to score assessment with ML service');
    }
  }

  async getCareerMatches(input: CareerMatchInput): Promise<CareerMatchResponse> {
    try {
      const response = await this.client.post('/api/v1/career_match', {
        personality_scores: input.personalityScores,
        skills: input.skills,
        interests: input.interests,
        top_n: input.topN || 5,
      });

      const data = response.data;

      return {
        success: data.success,
        matches: (data.matches || []).map((m: Record<string, unknown>) => ({
          careerId: m.career_id,
          title: m.title,
          matchScore: m.match_score,
          confidence: m.confidence,
          fitFactors: {
            personality: (m.fit_factors as Record<string, number>)?.personality || 0,
            skills: (m.fit_factors as Record<string, number>)?.skills || 0,
            interests: (m.fit_factors as Record<string, number>)?.interests || 0,
          },
        })),
      };
    } catch (error) {
      logger.error('ML career matching failed:', error);
      throw new Error('Failed to get career matches from ML service');
    }
  }

  async getInsights(input: InsightsInput): Promise<InsightsResponse> {
    try {
      // First try to get personality prediction
      const personalityResponse = await this.client.post('/api/v1/personality_predict', {
        assessment_type: input.assessmentType,
        scores: input.scores,
      });

      const personalityData = personalityResponse.data;

      return {
        personalityType: personalityData.personality_type,
        strengths: personalityData.strength_areas || [],
        developmentAreas: personalityData.development_areas || [],
        careerSuggestions: personalityData.career_suggestions || [],
      };
    } catch {
      // Fallback: generate basic insights from scores
      return this.generateFallbackInsights(input.scores);
    }
  }

  async analyzeSkillGap(
    userSkills: string[],
    targetCareer: { requiredSkills: { skill: string; proficiencyLevel: number }[] }
  ): Promise<{
    matchingSkills: string[];
    missingSkills: string[];
    gapScore: number;
    recommendations: string[];
  }> {
    try {
      const response = await this.client.post('/api/v1/skill_analysis', {
        user_skills: userSkills,
        target_skills: targetCareer.requiredSkills,
      });

      return {
        matchingSkills: response.data.matching_skills || [],
        missingSkills: response.data.missing_skills || [],
        gapScore: response.data.gap_score || 0,
        recommendations: response.data.recommendations || [],
      };
    } catch {
      // Fallback calculation
      const requiredSkillNames = targetCareer.requiredSkills.map((s) => s.skill.toLowerCase());
      const userSkillsLower = userSkills.map((s) => s.toLowerCase());

      const matchingSkills = userSkillsLower.filter((s) => requiredSkillNames.includes(s));
      const missingSkills = requiredSkillNames.filter((s) => !userSkillsLower.includes(s));

      return {
        matchingSkills,
        missingSkills,
        gapScore: requiredSkillNames.length > 0
          ? matchingSkills.length / requiredSkillNames.length
          : 0,
        recommendations: missingSkills.map((skill) => `Consider learning ${skill}`),
      };
    }
  }

  private calculateOverallFromDimensions(dimensions: Record<string, number>): number {
    const values = Object.values(dimensions);
    if (values.length === 0) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  private generateFallbackInsights(scores: Record<string, unknown>): InsightsResponse {
    const dimensions = (scores as { dimensions?: Record<string, number> }).dimensions || {};
    const strengths: string[] = [];
    const developmentAreas: string[] = [];

    for (const [dimension, score] of Object.entries(dimensions)) {
      if (score >= 70) {
        strengths.push(this.formatDimensionName(dimension));
      } else if (score < 40) {
        developmentAreas.push(this.formatDimensionName(dimension));
      }
    }

    return {
      strengths: strengths.slice(0, 3),
      developmentAreas: developmentAreas.slice(0, 3),
      careerSuggestions: [],
    };
  }

  private formatDimensionName(dimension: string): string {
    return dimension
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }
}

export const mlService = new MlService();
