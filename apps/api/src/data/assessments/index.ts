/**
 * Assessment Data Index
 * 
 * Exports all assessment definitions for use in seeding and validation.
 */

export { BIG_FIVE_ASSESSMENT } from './big-five-assessment.js';
export { RIASEC_ASSESSMENT } from './riasec-assessment.js';
export { SKILLS_ASSESSMENT } from './skills-assessment.js';
export { WORK_VALUES_ASSESSMENT } from './work-values-assessment.js';

// Collect all assessments for batch operations
import { BIG_FIVE_ASSESSMENT } from './big-five-assessment.js';
import { RIASEC_ASSESSMENT } from './riasec-assessment.js';
import { SKILLS_ASSESSMENT } from './skills-assessment.js';
import { WORK_VALUES_ASSESSMENT } from './work-values-assessment.js';

export const ALL_ASSESSMENTS = [
  BIG_FIVE_ASSESSMENT,
  RIASEC_ASSESSMENT,
  SKILLS_ASSESSMENT,
  WORK_VALUES_ASSESSMENT,
];
