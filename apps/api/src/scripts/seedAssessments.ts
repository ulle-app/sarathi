#!/usr/bin/env tsx
/**
 * Assessment and Career Seed Script
 * 
 * Seeds the database with research-backed, comprehensive assessments:
 * - Big Five Personality: 60 questions with facet-level coverage (IPIP-based)
 * - RIASEC Career Interests: 48 questions based on Holland Codes
 * - Skills Self-Assessment: 48 questions across 8 skill domains
 * - Work Values Assessment: 40 questions across 8 value dimensions
 * 
 * Question counts based on psychometric research standards:
 * - BFI-44 standard: 44 items, our enhanced version: 60 items (2 per facet × 6 facets × 5 traits)
 * - O*NET Interest Profiler: 60 items, our version: 48 items (8 per RIASEC dimension)
 */

import { getSupabaseAdmin } from '../config/supabase.js';
import { logger } from '../utils/logger.js';
import { ALL_ASSESSMENTS } from '../data/assessments/index.js';

// Transform assessment data files to database format
const assessments = ALL_ASSESSMENTS.map((assessment) => ({
  title: assessment.title,
  description: assessment.description,
  type: assessment.type,
  category: assessment.category,
  estimated_minutes: assessment.estimated_minutes,
  scoring_method: assessment.scoring_method,
  is_active: assessment.is_active,
  version: assessment.version,
  academic_levels: assessment.academic_levels,
  questions: assessment.questions.map((q: any) => ({
    id: q.id,
    text: q.text,
    type: q.type,
    dimension: q.dimension,
    scale: q.scale,
    weight: q.weight,
    // Include facet and reverse scoring for enhanced scoring
    ...(q.facet && { facet: q.facet }),
    ...(q.reverse !== undefined && { reverseScored: q.reverse }),
    ...(q.category && { category: q.category }),
  })),
}));

const careers = [
  {
    title: 'Software Engineer',
    description: 'Design, develop, and maintain software applications. Collaborate with teams to solve complex technical problems and create innovative solutions.',
    category: 'Technology',
    required_skills: [
      { skill: 'Programming', importance: 'required', proficiencyLevel: 4 },
      { skill: 'Problem Solving', importance: 'required', proficiencyLevel: 4 },
      { skill: 'System Design', importance: 'preferred', proficiencyLevel: 3 },
      { skill: 'Collaboration', importance: 'preferred', proficiencyLevel: 3 },
      { skill: 'Communication', importance: 'nice_to_have', proficiencyLevel: 3 },
    ],
    personality_fit: [
      { dimension: 'openness', idealRange: [60, 100], weight: 0.8 },
      { dimension: 'conscientiousness', idealRange: [65, 100], weight: 0.9 },
      { dimension: 'extraversion', idealRange: [30, 70], weight: 0.5 },
    ],
    salary_range: { min: 80000, max: 200000, currency: 'USD' },
    growth_outlook: 'high',
    related_careers: [],
    resources: [
      { type: 'course', title: 'CS50: Introduction to Computer Science', url: 'https://cs50.harvard.edu/' },
      { type: 'certification', title: 'AWS Certified Developer', url: 'https://aws.amazon.com/certification/' },
    ],
    is_active: true,
  },
  {
    title: 'Data Scientist',
    description: 'Analyze complex data sets to identify patterns, build predictive models, and provide actionable insights for business decisions.',
    category: 'Technology',
    required_skills: [
      { skill: 'Statistics', importance: 'required', proficiencyLevel: 4 },
      { skill: 'Machine Learning', importance: 'required', proficiencyLevel: 4 },
      { skill: 'Python', importance: 'required', proficiencyLevel: 4 },
      { skill: 'Data Visualization', importance: 'preferred', proficiencyLevel: 3 },
      { skill: 'Business Acumen', importance: 'preferred', proficiencyLevel: 3 },
    ],
    personality_fit: [
      { dimension: 'openness', idealRange: [70, 100], weight: 0.9 },
      { dimension: 'conscientiousness', idealRange: [60, 100], weight: 0.8 },
      { dimension: 'neuroticism', idealRange: [0, 40], weight: 0.6 },
    ],
    salary_range: { min: 90000, max: 180000, currency: 'USD' },
    growth_outlook: 'high',
    related_careers: [],
    resources: [
      { type: 'course', title: 'Machine Learning by Andrew Ng', url: 'https://www.coursera.org/learn/machine-learning' },
      { type: 'article', title: 'Towards Data Science', url: 'https://towardsdatascience.com/' },
    ],
    is_active: true,
  },
  {
    title: 'Product Manager',
    description: 'Lead product development from conception to launch. Define product strategy, work with cross-functional teams, and ensure products meet customer needs.',
    category: 'Business',
    required_skills: [
      { skill: 'Strategic Thinking', importance: 'required', proficiencyLevel: 4 },
      { skill: 'Communication', importance: 'required', proficiencyLevel: 5 },
      { skill: 'Data Analysis', importance: 'preferred', proficiencyLevel: 3 },
      { skill: 'User Research', importance: 'preferred', proficiencyLevel: 3 },
      { skill: 'Technical Understanding', importance: 'nice_to_have', proficiencyLevel: 3 },
    ],
    personality_fit: [
      { dimension: 'extraversion', idealRange: [55, 100], weight: 0.8 },
      { dimension: 'conscientiousness', idealRange: [60, 100], weight: 0.8 },
      { dimension: 'agreeableness', idealRange: [50, 80], weight: 0.6 },
    ],
    salary_range: { min: 100000, max: 200000, currency: 'USD' },
    growth_outlook: 'high',
    related_careers: [],
    resources: [
      { type: 'course', title: 'Product Management Certificate', url: 'https://www.productschool.com/' },
      { type: 'article', title: 'Silicon Valley Product Group', url: 'https://www.svpg.com/' },
    ],
    is_active: true,
  },
  {
    title: 'UX Designer',
    description: 'Create user-centered designs for digital products. Conduct user research, create wireframes and prototypes, and improve user experiences.',
    category: 'Design',
    required_skills: [
      { skill: 'User Research', importance: 'required', proficiencyLevel: 4 },
      { skill: 'Prototyping', importance: 'required', proficiencyLevel: 4 },
      { skill: 'Visual Design', importance: 'preferred', proficiencyLevel: 3 },
      { skill: 'Empathy', importance: 'required', proficiencyLevel: 4 },
      { skill: 'Communication', importance: 'preferred', proficiencyLevel: 3 },
    ],
    personality_fit: [
      { dimension: 'openness', idealRange: [70, 100], weight: 0.9 },
      { dimension: 'agreeableness', idealRange: [60, 100], weight: 0.8 },
      { dimension: 'extraversion', idealRange: [40, 80], weight: 0.5 },
    ],
    salary_range: { min: 70000, max: 150000, currency: 'USD' },
    growth_outlook: 'high',
    related_careers: [],
    resources: [
      { type: 'course', title: 'Google UX Design Certificate', url: 'https://grow.google/certificates/ux-design/' },
      { type: 'article', title: 'Nielsen Norman Group', url: 'https://www.nngroup.com/' },
    ],
    is_active: true,
  },
  {
    title: 'Marketing Manager',
    description: 'Develop and execute marketing strategies to promote products and services. Manage campaigns, analyze performance, and drive brand awareness.',
    category: 'Marketing',
    required_skills: [
      { skill: 'Marketing Strategy', importance: 'required', proficiencyLevel: 4 },
      { skill: 'Data Analysis', importance: 'required', proficiencyLevel: 3 },
      { skill: 'Content Creation', importance: 'preferred', proficiencyLevel: 3 },
      { skill: 'Leadership', importance: 'preferred', proficiencyLevel: 3 },
      { skill: 'Digital Marketing', importance: 'required', proficiencyLevel: 4 },
    ],
    personality_fit: [
      { dimension: 'extraversion', idealRange: [60, 100], weight: 0.8 },
      { dimension: 'openness', idealRange: [60, 100], weight: 0.7 },
      { dimension: 'conscientiousness', idealRange: [55, 100], weight: 0.7 },
    ],
    salary_range: { min: 70000, max: 150000, currency: 'USD' },
    growth_outlook: 'medium',
    related_careers: [],
    resources: [
      { type: 'certification', title: 'Google Digital Marketing', url: 'https://skillshop.withgoogle.com/' },
      { type: 'course', title: 'HubSpot Marketing Certification', url: 'https://academy.hubspot.com/' },
    ],
    is_active: true,
  },
  {
    title: 'Financial Analyst',
    description: 'Analyze financial data, prepare reports, and provide recommendations for business decisions. Evaluate investment opportunities and assess financial risks.',
    category: 'Finance',
    required_skills: [
      { skill: 'Financial Analysis', importance: 'required', proficiencyLevel: 5 },
      { skill: 'Excel', importance: 'required', proficiencyLevel: 4 },
      { skill: 'Financial Modeling', importance: 'required', proficiencyLevel: 4 },
      { skill: 'Attention to Detail', importance: 'required', proficiencyLevel: 4 },
      { skill: 'Communication', importance: 'preferred', proficiencyLevel: 3 },
    ],
    personality_fit: [
      { dimension: 'conscientiousness', idealRange: [70, 100], weight: 0.9 },
      { dimension: 'neuroticism', idealRange: [0, 40], weight: 0.7 },
      { dimension: 'openness', idealRange: [40, 80], weight: 0.5 },
    ],
    salary_range: { min: 60000, max: 120000, currency: 'USD' },
    growth_outlook: 'medium',
    related_careers: [],
    resources: [
      { type: 'certification', title: 'CFA Certification', url: 'https://www.cfainstitute.org/' },
      { type: 'course', title: 'Financial Modeling & Valuation', url: 'https://corporatefinanceinstitute.com/' },
    ],
    is_active: true,
  },
  {
    title: 'Human Resources Manager',
    description: 'Oversee employee relations, recruitment, and organizational development. Create policies, manage benefits, and foster a positive workplace culture.',
    category: 'Human Resources',
    required_skills: [
      { skill: 'People Management', importance: 'required', proficiencyLevel: 4 },
      { skill: 'Communication', importance: 'required', proficiencyLevel: 5 },
      { skill: 'Conflict Resolution', importance: 'required', proficiencyLevel: 4 },
      { skill: 'Employment Law', importance: 'preferred', proficiencyLevel: 3 },
      { skill: 'Strategic Planning', importance: 'preferred', proficiencyLevel: 3 },
    ],
    personality_fit: [
      { dimension: 'agreeableness', idealRange: [65, 100], weight: 0.9 },
      { dimension: 'extraversion', idealRange: [55, 100], weight: 0.7 },
      { dimension: 'conscientiousness', idealRange: [60, 100], weight: 0.7 },
    ],
    salary_range: { min: 70000, max: 140000, currency: 'USD' },
    growth_outlook: 'medium',
    related_careers: [],
    resources: [
      { type: 'certification', title: 'SHRM Certification', url: 'https://www.shrm.org/certification' },
      { type: 'article', title: 'HR Dive', url: 'https://www.hrdive.com/' },
    ],
    is_active: true,
  },
  {
    title: 'Healthcare Administrator',
    description: 'Manage healthcare facilities and services. Oversee operations, ensure regulatory compliance, and improve patient care quality.',
    category: 'Healthcare',
    required_skills: [
      { skill: 'Healthcare Management', importance: 'required', proficiencyLevel: 4 },
      { skill: 'Leadership', importance: 'required', proficiencyLevel: 4 },
      { skill: 'Regulatory Compliance', importance: 'required', proficiencyLevel: 4 },
      { skill: 'Financial Management', importance: 'preferred', proficiencyLevel: 3 },
      { skill: 'Communication', importance: 'preferred', proficiencyLevel: 4 },
    ],
    personality_fit: [
      { dimension: 'conscientiousness', idealRange: [70, 100], weight: 0.9 },
      { dimension: 'agreeableness', idealRange: [55, 100], weight: 0.7 },
      { dimension: 'neuroticism', idealRange: [0, 45], weight: 0.6 },
    ],
    salary_range: { min: 80000, max: 160000, currency: 'USD' },
    growth_outlook: 'high',
    related_careers: [],
    resources: [
      { type: 'certification', title: 'Healthcare Administration Certification', url: 'https://www.ache.org/' },
      { type: 'course', title: 'Healthcare Management Programs', url: 'https://www.healthcaremanagement.edu/' },
    ],
    is_active: true,
  },
  {
    title: 'Teacher/Educator',
    description: 'Educate and inspire students at various levels. Develop curriculum, assess learning outcomes, and create engaging learning experiences.',
    category: 'Education',
    required_skills: [
      { skill: 'Teaching', importance: 'required', proficiencyLevel: 5 },
      { skill: 'Communication', importance: 'required', proficiencyLevel: 5 },
      { skill: 'Patience', importance: 'required', proficiencyLevel: 4 },
      { skill: 'Curriculum Development', importance: 'preferred', proficiencyLevel: 3 },
      { skill: 'Classroom Management', importance: 'required', proficiencyLevel: 4 },
    ],
    personality_fit: [
      { dimension: 'agreeableness', idealRange: [65, 100], weight: 0.9 },
      { dimension: 'extraversion', idealRange: [50, 100], weight: 0.7 },
      { dimension: 'openness', idealRange: [55, 100], weight: 0.7 },
    ],
    salary_range: { min: 45000, max: 85000, currency: 'USD' },
    growth_outlook: 'medium',
    related_careers: [],
    resources: [
      { type: 'certification', title: 'Teaching Certification Programs', url: 'https://www.teach.org/' },
      { type: 'article', title: 'Edutopia', url: 'https://www.edutopia.org/' },
    ],
    is_active: true,
  },
  {
    title: 'Mechanical Engineer',
    description: 'Design and develop mechanical systems and products. Work on everything from small components to large machinery and vehicles.',
    category: 'Engineering',
    required_skills: [
      { skill: 'CAD Software', importance: 'required', proficiencyLevel: 4 },
      { skill: 'Problem Solving', importance: 'required', proficiencyLevel: 4 },
      { skill: 'Mathematics', importance: 'required', proficiencyLevel: 4 },
      { skill: 'Physics', importance: 'required', proficiencyLevel: 4 },
      { skill: 'Project Management', importance: 'preferred', proficiencyLevel: 3 },
    ],
    personality_fit: [
      { dimension: 'conscientiousness', idealRange: [65, 100], weight: 0.9 },
      { dimension: 'openness', idealRange: [55, 100], weight: 0.7 },
      { dimension: 'neuroticism', idealRange: [0, 45], weight: 0.5 },
    ],
    salary_range: { min: 65000, max: 130000, currency: 'USD' },
    growth_outlook: 'medium',
    related_careers: [],
    resources: [
      { type: 'certification', title: 'PE License', url: 'https://ncees.org/engineering/' },
      { type: 'course', title: 'Engineering Courses', url: 'https://www.edx.org/learn/engineering' },
    ],
    is_active: true,
  },
];

async function seed() {
  const db = getSupabaseAdmin();

  logger.info('Starting database seeding...');

  // Seed assessments
  logger.info('Seeding assessments...');
  for (const assessment of assessments) {
    // ensure assessment has academic_levels (default: all levels for broad access)
    if (!('academic_levels' in assessment)) {
      // @ts-ignore - augmenting object for DB seeding
      assessment.academic_levels = ['grade_10', 'grade_12', 'undergraduate', 'post_graduate', 'professional'];
    }
    // Check if assessment with this title already exists
    const { data: existing } = await db
      .from('assessments')
      .select('id')
      .eq('title', assessment.title)
      .single();

    if (existing) {
      // Update academic_levels if the assessment already exists (ensures proper filtering)
      const { error: updateError } = await db
        .from('assessments')
        .update({ academic_levels: (assessment as any).academic_levels })
        .eq('id', existing.id);
      
      if (updateError) {
        logger.error(`Failed to update academic_levels for "${assessment.title}":`, updateError);
      } else {
        logger.info(`Updated academic_levels for existing assessment: "${assessment.title}"`);
      }
      continue;
    }

    const { error } = await db.from('assessments').insert(assessment);

    if (error) {
      logger.error(`Failed to seed assessment "${assessment.title}":`, error);
    } else {
      logger.info(`Seeded assessment: ${assessment.title}`);
    }
  }

  // Seed careers
  logger.info('Seeding careers...');
  for (const career of careers) {
    // Check if career with this title already exists
    const { data: existing } = await db
      .from('careers')
      .select('id')
      .eq('title', career.title)
      .single();

    if (existing) {
      logger.info(`Career "${career.title}" already exists - skipping`);
      continue;
    }

    const { error } = await db.from('careers').insert(career);

    if (error) {
      logger.error(`Failed to seed career "${career.title}":`, error);
    } else {
      logger.info(`Seeded career: ${career.title}`);
    }
  }

  // Update related careers after all are inserted
  logger.info('Updating related careers...');
  const { data: allCareers } = await db.from('careers').select('id, title, category');

  if (allCareers) {
    // Set related careers based on category
    const categoryGroups = new Map<string, string[]>();
    for (const career of allCareers) {
      if (!categoryGroups.has(career.category)) {
        categoryGroups.set(career.category, []);
      }
      categoryGroups.get(career.category)!.push(career.id);
    }

    // Update each career with related careers from same category
    for (const career of allCareers) {
      const related = categoryGroups.get(career.category)?.filter((id) => id !== career.id) || [];
      if (related.length > 0) {
        await db
          .from('careers')
          .update({ related_careers: related.slice(0, 3) })
          .eq('id', career.id);
      }
    }
  }

  logger.info('Seeding complete!');
  process.exit(0);
}

seed().catch((err) => {
  logger.error('Seeding failed:', err);
  process.exit(1);
});
