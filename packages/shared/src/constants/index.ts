// Personality dimensions (Big Five)
export const PERSONALITY_DIMENSIONS = [
  'extraversion',
  'agreeableness',
  'conscientiousness',
  'neuroticism',
  'openness',
] as const;

export type PersonalityDimension = (typeof PERSONALITY_DIMENSIONS)[number];

// Likert scale values
export const LIKERT_SCALE = {
  STRONGLY_DISAGREE: 1,
  DISAGREE: 2,
  NEUTRAL: 3,
  AGREE: 4,
  STRONGLY_AGREE: 5,
} as const;

// Assessment categories
export const ASSESSMENT_CATEGORIES = [
  'personality',
  'cognitive',
  'interest',
  'skill',
  'values',
] as const;

export type AssessmentCategory = (typeof ASSESSMENT_CATEGORIES)[number];

// Career categories
export const CAREER_CATEGORIES = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Creative Arts',
  'Engineering',
  'Business',
  'Science',
  'Legal',
  'Marketing',
] as const;

export type CareerCategory = (typeof CAREER_CATEGORIES)[number];

// API version
export const API_VERSION = 'v1';

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;
