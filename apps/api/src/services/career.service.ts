import {
  careerRepository,
  ICareer,
  ICareerSummary,
  toCareerSummary,
} from '../repositories/career.repository.js';
import { assessmentResultRepository } from '../repositories/assessment.repository.js';
import { mlService } from './ml.service.js';
import { ApiError } from '../middleware/errorHandler.js';

export interface CareerRecommendation {
  career: ICareerSummary;
  matchScore: number;
  confidence: number;
  fitFactors: {
    personality: number;
    skills: number;
    interests: number;
  };
}

export interface SkillGapAnalysis {
  career: ICareerSummary;
  matchingSkills: string[];
  missingSkills: string[];
  gapScore: number;
  recommendations: string[];
}

class CareerService {
  async getAllCareers(): Promise<ICareerSummary[]> {
    const careers = await careerRepository.findAll(true);
    return careers.map(toCareerSummary);
  }

  async getFilteredCareers(options: {
    category?: string;
    search?: string;
    recommended_streams?: string[];
    education_levels?: string[];
    is_student_friendly?: boolean;
  }): Promise<ICareerSummary[]> {
    const careers = await careerRepository.findFiltered({
      category: options.category,
      search: options.search,
      recommended_streams: options.recommended_streams,
      education_levels: options.education_levels,
      is_student_friendly: options.is_student_friendly,
      activeOnly: true,
    });
    return careers.map(toCareerSummary);
  }

  async getCareerById(id: string): Promise<ICareer> {
    const career = await careerRepository.findById(id);
    if (!career) {
      throw new ApiError('Career not found', 404);
    }
    return career;
  }

  async getCareersByCategory(category: string): Promise<ICareerSummary[]> {
    const careers = await careerRepository.findByCategory(category);
    return careers.map(toCareerSummary);
  }

  async getCategories(): Promise<string[]> {
    return careerRepository.getCategories();
  }

  async searchCareers(query: string): Promise<ICareerSummary[]> {
    const careers = await careerRepository.search(query);
    return careers.map(toCareerSummary);
  }

  async getRecommendations(userId: string): Promise<CareerRecommendation[]> {
    // Get user's completed assessment results
    const results = await assessmentResultRepository.findCompletedByUser(userId);

    if (results.length === 0) {
      throw new ApiError(
        'Please complete at least one assessment to get career recommendations',
        400
      );
    }

    // Aggregate personality scores from all results
    const personalityScores: Record<string, number[]> = {};
    const skills: string[] = [];

    for (const result of results) {
      if (result.scores?.dimensions) {
        for (const [dimension, score] of Object.entries(result.scores.dimensions)) {
          if (!personalityScores[dimension]) {
            personalityScores[dimension] = [];
          }
          personalityScores[dimension].push(score);
        }
      }

      // Collect strength areas as skills
      if (result.ml_predictions?.strengthAreas) {
        skills.push(...result.ml_predictions.strengthAreas);
      }
    }

    // Average the personality scores
    const avgScores: Record<string, number> = {};
    for (const [dimension, scores] of Object.entries(personalityScores)) {
      avgScores[dimension] = scores.reduce((a, b) => a + b, 0) / scores.length;
    }

    // Get all careers for matching
    const careers = await careerRepository.findAll(true);

    // Try ML service for recommendations
    try {
      const mlResponse = await mlService.getCareerMatches({
        personalityScores: avgScores,
        skills: [...new Set(skills)],
        interests: [],
        topN: 10,
      });

      if (mlResponse.success && mlResponse.matches.length > 0) {
        // Map ML results to career summaries
        const careerMap = new Map(careers.map((c) => [c.id, c]));
        const recommendations: CareerRecommendation[] = [];

        for (const match of mlResponse.matches) {
          const career = careerMap.get(match.careerId);
          if (career) {
            recommendations.push({
              career: toCareerSummary(career),
              matchScore: match.matchScore,
              confidence: match.confidence,
              fitFactors: match.fitFactors,
            });
          }
        }

        return recommendations;
      }
    } catch {
      // Fall through to local matching
    }

    // Local matching algorithm as fallback
    return this.calculateLocalRecommendations(careers, avgScores, skills);
  }

  async getSkillGap(userId: string, careerId: string): Promise<SkillGapAnalysis> {
    const career = await careerRepository.findById(careerId);
    if (!career) {
      throw new ApiError('Career not found', 404);
    }

    // Get user's skills from completed assessments
    const results = await assessmentResultRepository.findCompletedByUser(userId);
    const userSkills: string[] = [];

    for (const result of results) {
      if (result.ml_predictions?.strengthAreas) {
        userSkills.push(...result.ml_predictions.strengthAreas);
      }
    }

    const uniqueSkills = [...new Set(userSkills)];

    // Try ML service for skill gap analysis
    try {
      const analysis = await mlService.analyzeSkillGap(uniqueSkills, {
        requiredSkills: career.required_skills,
      });

      return {
        career: toCareerSummary(career),
        ...analysis,
      };
    } catch {
      // Local skill gap analysis as fallback
      return this.calculateLocalSkillGap(career, uniqueSkills);
    }
  }

  async getRelatedCareers(careerId: string): Promise<ICareerSummary[]> {
    const career = await careerRepository.findById(careerId);
    if (!career) {
      throw new ApiError('Career not found', 404);
    }

    if (career.related_careers.length === 0) {
      // Return careers from the same category
      const categoryCareers = await careerRepository.findByCategory(career.category);
      return categoryCareers
        .filter((c) => c.id !== careerId)
        .slice(0, 5)
        .map(toCareerSummary);
    }

    const relatedCareers = await careerRepository.findByIds(career.related_careers);
    return relatedCareers.map(toCareerSummary);
  }

  private calculateLocalRecommendations(
    careers: ICareer[],
    personalityScores: Record<string, number>,
    skills: string[]
  ): CareerRecommendation[] {
    const recommendations: CareerRecommendation[] = [];

    for (const career of careers) {
      let personalityFitScore = 0;
      let personalityWeight = 0;

      // Calculate personality fit
      for (const fit of career.personality_fit) {
        const userScore = personalityScores[fit.dimension];
        if (userScore !== undefined) {
          const [min, max] = fit.idealRange;
          let fitScore = 0;

          if (userScore >= min && userScore <= max) {
            fitScore = 1;
          } else if (userScore < min) {
            fitScore = Math.max(0, 1 - (min - userScore) / 50);
          } else {
            fitScore = Math.max(0, 1 - (userScore - max) / 50);
          }

          personalityFitScore += fitScore * fit.weight;
          personalityWeight += fit.weight;
        }
      }

      const personalityMatch =
        personalityWeight > 0 ? personalityFitScore / personalityWeight : 0.5;

      // Calculate skills match
      const requiredSkillNames = career.required_skills.map((s) => s.skill.toLowerCase());
      const userSkillsLower = skills.map((s) => s.toLowerCase());
      const matchingSkills = requiredSkillNames.filter((s) =>
        userSkillsLower.some((us) => us.includes(s) || s.includes(us))
      );
      const skillsMatch =
        requiredSkillNames.length > 0
          ? matchingSkills.length / requiredSkillNames.length
          : 0.5;

      // Combined score
      const matchScore = personalityMatch * 0.4 + skillsMatch * 0.6;

      recommendations.push({
        career: toCareerSummary(career),
        matchScore: Math.round(matchScore * 100) / 100,
        confidence: 0.7, // Lower confidence for local calculations
        fitFactors: {
          personality: Math.round(personalityMatch * 100) / 100,
          skills: Math.round(skillsMatch * 100) / 100,
          interests: 0.5,
        },
      });
    }

    // Sort by match score and return top 10
    return recommendations
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 10);
  }

  private calculateLocalSkillGap(
    career: ICareer,
    userSkills: string[]
  ): SkillGapAnalysis {
    const requiredSkillNames = career.required_skills.map((s) => s.skill.toLowerCase());
    const userSkillsLower = userSkills.map((s) => s.toLowerCase());

    const matchingSkills = requiredSkillNames.filter((s) =>
      userSkillsLower.some((us) => us.includes(s) || s.includes(us))
    );

    const missingSkills = requiredSkillNames.filter(
      (s) => !userSkillsLower.some((us) => us.includes(s) || s.includes(us))
    );

    const gapScore =
      requiredSkillNames.length > 0
        ? matchingSkills.length / requiredSkillNames.length
        : 1;

    const recommendations = missingSkills.map((skill) => {
      const skillInfo = career.required_skills.find(
        (s) => s.skill.toLowerCase() === skill
      );
      const importance = skillInfo?.importance || 'preferred';
      return `${importance === 'required' ? 'Essential: ' : ''}Learn ${skill}`;
    });

    return {
      career: toCareerSummary(career),
      matchingSkills,
      missingSkills,
      gapScore: Math.round(gapScore * 100) / 100,
      recommendations: recommendations.slice(0, 5),
    };
  }
}

export const careerService = new CareerService();
