import { Request, Response } from 'express';
import { assessmentService } from '../services/assessment.service.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { sendSuccess, sendCreated, sendNotFound } from '../utils/response.js';

// List all available assessments
export const getAssessments = asyncHandler(async (req: Request, res: Response) => {
  const { type, academicLevel } = req.query;

  let assessments;
  if (type && typeof type === 'string') {
    assessments = await assessmentService.getAssessments(academicLevel as string); 
  } else {
    assessments = await assessmentService.getAssessments(academicLevel as string);
  }

  sendSuccess(res, { assessments }, 'Assessments retrieved successfully');
});

// Get a specific assessment with questions
export const getAssessment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const assessment = await assessmentService.getAssessment(id);
  sendSuccess(res, { assessment }, 'Assessment retrieved successfully');
});

// Start an assessment session
export const startAssessment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    sendNotFound(res, 'User not authenticated');
    return;
  }

  const result = await assessmentService.startAssessment({
    userId,
    assessmentId: id,
  });

  sendCreated(res, { result }, 'Assessment session started');
});

// Save progress on an assessment
export const saveProgress = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;
  const { responses } = req.body;

  if (!userId) {
    sendNotFound(res, 'User not authenticated');
    return;
  }

  const result = await assessmentService.saveProgress({
    resultId: id,
    userId,
    responses,
  });

  sendSuccess(res, { result }, 'Progress saved successfully');
});

// Submit a completed assessment
export const submitAssessment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;
  const { responses } = req.body;

  if (!userId) {
    sendNotFound(res, 'User not authenticated');
    return;
  }

  const result = await assessmentService.submitAssessment({
    resultId: id,
    userId,
    responses,
  });

  sendSuccess(res, { result }, 'Assessment submitted successfully');
});

// Get user's assessment results
export const getResults = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    sendNotFound(res, 'User not authenticated');
    return;
  }

  const results = await assessmentService.getUserResults(userId);
  sendSuccess(res, { results }, 'Results retrieved successfully');
});

// Get a specific result
export const getResult = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    sendNotFound(res, 'User not authenticated');
    return;
  }

  const { result, assessment } = await assessmentService.getResultWithAssessment(id, userId);
  sendSuccess(res, { result, assessment }, 'Result retrieved successfully');
});

// Get insights for a result
export const getResultInsights = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    sendNotFound(res, 'User not authenticated');
    return;
  }

  const { result, insights } = await assessmentService.getResultInsights(id, userId);
  sendSuccess(res, { result, insights }, 'Insights retrieved successfully');
});
