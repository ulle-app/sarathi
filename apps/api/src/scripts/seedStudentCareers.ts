#!/usr/bin/env tsx
import { getSupabaseAdmin } from '../config/supabase.js';
import { logger } from '../utils/logger.js';

const studentCareers = [
  {
    title: 'Graphic Designer',
    category: 'Design',
    description: 'Create visual concepts to communicate ideas and messages.',
    recommended_streams: ['arts'],
    education_levels: ['10-12', 'undergraduate'],
    is_student_friendly: true,
    required_skills: ['creativity', 'visual design', 'communication'],
  },
  {
    title: 'Journalist / Reporter',
    category: 'Media',
    description: 'Research and report news stories across media channels.',
    recommended_streams: ['arts', 'commerce'],
    education_levels: ['10-12', 'undergraduate'],
    is_student_friendly: true,
    required_skills: ['writing', 'research', 'communication'],
  },
  {
    title: 'Accountant',
    category: 'Commerce',
    description: 'Manage financial records and prepare reports for organizations.',
    recommended_streams: ['commerce'],
    education_levels: ['10-12', 'undergraduate'],
    is_student_friendly: true,
    required_skills: ['numeracy', 'attention to detail', 'accounting'],
  },
  {
    title: 'Banking Clerk',
    category: 'Commerce',
    description: 'Assist with daily banking operations and customer service.',
    recommended_streams: ['commerce'],
    education_levels: ['10-12'],
    is_student_friendly: true,
    required_skills: ['customer service', 'numeracy'],
  },
  {
    title: 'Hospitality Manager',
    category: 'Hospitality',
    description: 'Oversee operations in hotels, restaurants and events.',
    recommended_streams: ['vocational', 'commerce'],
    education_levels: ['10-12', 'undergraduate'],
    is_student_friendly: true,
    required_skills: ['management', 'customer service'],
  },
  {
    title: 'Electrician (Apprentice)',
    category: 'Trades',
    description: 'Install and maintain electrical systems (entry-level/apprenticeship).',
    recommended_streams: ['vocational'],
    education_levels: ['10-12'],
    is_student_friendly: true,
    required_skills: ['hands-on', 'safety awareness'],
  },
  {
    title: 'Plumber (Apprentice)',
    category: 'Trades',
    description: 'Install and repair piping systems (entry-level/apprenticeship).',
    recommended_streams: ['vocational'],
    education_levels: ['10-12'],
    is_student_friendly: true,
    required_skills: ['hands-on', 'problem solving'],
  },
  {
    title: 'Performing Artist',
    category: 'Arts',
    description: 'Act, dance, or perform in theatre, film, and live events.',
    recommended_streams: ['arts'],
    education_levels: ['10-12', 'undergraduate'],
    is_student_friendly: true,
    required_skills: ['creativity', 'performance'],
  },
  {
    title: 'Journalism / Media Producer',
    category: 'Media',
    description: 'Produce media content including video and digital storytelling.',
    recommended_streams: ['arts', 'commerce'],
    education_levels: ['10-12', 'undergraduate'],
    is_student_friendly: true,
    required_skills: ['storytelling', 'editing', 'production'],
  },
  {
    title: 'Business Studies / Management Trainee',
    category: 'Business',
    description: 'Entry pathway to business roles and management training programs.',
    recommended_streams: ['commerce'],
    education_levels: ['10-12', 'undergraduate'],
    is_student_friendly: true,
    required_skills: ['communication', 'organisation'],
  }
];

export async function seedStudentCareers() {
  const db = getSupabaseAdmin();

  logger.info('Seeding student careers...');

  for (const career of studentCareers) {
    const { data: existing } = await db
      .from('careers')
      .select('id')
      .eq('title', career.title)
      .single();

    if (existing) {
      logger.info(`Career "${career.title}" already exists - skipping`);
      continue;
    }

    const insertDoc = {
      title: career.title,
      description: career.description,
      category: career.category,
      required_skills: career.required_skills,
      recommended_streams: career.recommended_streams,
      education_levels: career.education_levels,
      is_student_friendly: career.is_student_friendly,
    };

    const { error } = await db.from('careers').insert(insertDoc);

    if (error) {
      logger.error(`Failed to seed career "${career.title}":`, error);
    } else {
      logger.info(`Seeded career: ${career.title}`);
    }
  }

  logger.info('Student career seeding complete');
}

if (require.main === module) {
  seedStudentCareers()
    .then(() => process.exit(0))
    .catch((err) => {
      logger.error('Seeding student careers failed:', err);
      process.exit(1);
    });
}
