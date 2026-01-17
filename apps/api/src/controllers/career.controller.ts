import { Request, Response } from 'express';
import { careerService } from '../services/career.service.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { sendSuccess, sendNotFound } from '../utils/response.js';

// List all careers
export const getCareers = asyncHandler(async (req: Request, res: Response) => {
  const { category, search, recommended_streams, education_levels, is_student_friendly } = req.query;

  // Parse possible array query params which may come as comma-separated strings
  const parseArray = (v: any): string[] | undefined => {
    if (!v) return undefined;
    if (Array.isArray(v)) return v.map(String);
    if (typeof v === 'string') return v.split(',').map((s) => s.trim()).filter(Boolean);
    return undefined;
  };

  const recStreams = parseArray(recommended_streams);
  const eduLevels = parseArray(education_levels);
  const studentFriendly = is_student_friendly === 'true' ? true : is_student_friendly === 'false' ? false : undefined;

  let careers;
  if ((search && typeof search === 'string') || category || recStreams || eduLevels || typeof studentFriendly === 'boolean') {
    careers = await careerService.getFilteredCareers({
      category: typeof category === 'string' ? category : undefined,
      search: typeof search === 'string' ? search : undefined,
      recommended_streams: recStreams,
      education_levels: eduLevels,
      is_student_friendly: studentFriendly,
    });
  } else {
    careers = await careerService.getAllCareers();
  }

  sendSuccess(res, { careers }, 'Careers retrieved successfully');
});

// Get career categories
export const getCategories = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await careerService.getCategories();
  sendSuccess(res, { categories }, 'Categories retrieved successfully');
});

// Get a specific career
export const getCareer = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const career = await careerService.getCareerById(id);
  sendSuccess(res, { career }, 'Career retrieved successfully');
});

// Get personalized career recommendations
export const getRecommendations = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    sendNotFound(res, 'User not authenticated');
    return;
  }

  const recommendations = await careerService.getRecommendations(userId);
  sendSuccess(res, { recommendations }, 'Recommendations retrieved successfully');
});

// Get skill gap analysis for a career
export const getSkillGap = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    sendNotFound(res, 'User not authenticated');
    return;
  }

  const skillGap = await careerService.getSkillGap(userId, id);
  sendSuccess(res, { skillGap }, 'Skill gap analysis retrieved successfully');
});

// Get related careers
export const getRelatedCareers = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const relatedCareers = await careerService.getRelatedCareers(id);
  sendSuccess(res, { relatedCareers }, 'Related careers retrieved successfully');
});
