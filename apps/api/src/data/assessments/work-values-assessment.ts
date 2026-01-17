/**
 * Work Values Assessment
 * 
 * Measures what matters most to an individual in their career and work environment.
 * Based on research from O*NET Work Importance Profiler and career counseling best practices.
 * 
 * Structure:
 * - 30 questions total (5 per value dimension)
 * - 6 core work value dimensions
 * 
 * Scoring: 1-5 scale measuring importance
 * - 1 = Not Important at All
 * - 2 = Slightly Important
 * - 3 = Moderately Important
 * - 4 = Very Important
 * - 5 = Extremely Important
 */

export const WORK_VALUES_ASSESSMENT = {
  title: 'Work Values Assessment',
  description: 'Understand what matters most to you in your career. This assessment identifies your core work values—the factors that contribute to job satisfaction and fulfillment. Aligning your career with your values leads to greater happiness and success.',
  type: 'interest',
  category: 'Career',
  estimated_minutes: 10,
  scoring_method: 'weighted_sum',
  is_active: true,
  version: 2,
  academic_levels: ['grade_10', 'grade_12', 'undergraduate', 'post_graduate', 'professional'],

  dimensions: {
    achievement: {
      name: 'Achievement',
      description: 'Importance of accomplishment, advancement, and recognition for your work.',
      careers: ['Entrepreneur', 'Sales', 'Consultant', 'Executive', 'Athlete'],
    },
    independence: {
      name: 'Independence',
      description: 'Importance of autonomy, freedom, and control over your work.',
      careers: ['Freelancer', 'Entrepreneur', 'Researcher', 'Artist', 'Consultant'],
    },
    recognition: {
      name: 'Recognition & Status',
      description: 'Importance of prestige, influence, and being valued by others.',
      careers: ['Executive', 'Lawyer', 'Doctor', 'Professor', 'Politician'],
    },
    relationships: {
      name: 'Relationships',
      description: 'Importance of working with supportive colleagues and helping others.',
      careers: ['HR', 'Healthcare', 'Social Work', 'Teaching', 'Counseling'],
    },
    support: {
      name: 'Support & Security',
      description: 'Importance of job stability, fair treatment, and supportive management.',
      careers: ['Government', 'Education', 'Healthcare', 'Established corporations'],
    },
    working_conditions: {
      name: 'Working Conditions',
      description: 'Importance of work-life balance, flexibility, and comfortable environment.',
      careers: ['Remote work', 'Tech companies', 'Flexible careers'],
    },
  },

  questions: [
    // ============================================
    // ACHIEVEMENT (5 questions)
    // ============================================
    {
      id: 'wv_ac1',
      text: 'Having opportunities for career advancement and promotion.',
      dimension: 'achievement',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'wv_ac2',
      text: 'Being able to see the tangible results of my work.',
      dimension: 'achievement',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'wv_ac3',
      text: 'Having challenging work that pushes me to grow.',
      dimension: 'achievement',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'wv_ac4',
      text: 'Receiving recognition for my accomplishments.',
      dimension: 'achievement',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'wv_ac5',
      text: 'Having opportunities to use my abilities to the fullest.',
      dimension: 'achievement',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },

    // ============================================
    // INDEPENDENCE (5 questions)
    // ============================================
    {
      id: 'wv_in1',
      text: 'Having the freedom to make my own decisions at work.',
      dimension: 'independence',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'wv_in2',
      text: 'Being able to work independently without constant supervision.',
      dimension: 'independence',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'wv_in3',
      text: 'Having control over how I complete my tasks.',
      dimension: 'independence',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'wv_in4',
      text: 'Being able to try out my own ideas.',
      dimension: 'independence',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'wv_in5',
      text: 'Having flexibility in when and where I work.',
      dimension: 'independence',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },

    // ============================================
    // RECOGNITION & STATUS (5 questions)
    // ============================================
    {
      id: 'wv_re1',
      text: 'Having a prestigious job title or position.',
      dimension: 'recognition',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'wv_re2',
      text: 'Being respected and admired by others for my work.',
      dimension: 'recognition',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'wv_re3',
      text: 'Having influence over important decisions.',
      dimension: 'recognition',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'wv_re4',
      text: 'Earning a high salary and financial rewards.',
      dimension: 'recognition',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'wv_re5',
      text: 'Being seen as an expert or authority in my field.',
      dimension: 'recognition',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },

    // ============================================
    // RELATIONSHIPS (5 questions)
    // ============================================
    {
      id: 'wv_rl1',
      text: 'Working with friendly and supportive colleagues.',
      dimension: 'relationships',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'wv_rl2',
      text: 'Helping others and making a positive impact on people\'s lives.',
      dimension: 'relationships',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'wv_rl3',
      text: 'Being part of a team and collaborating with others.',
      dimension: 'relationships',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'wv_rl4',
      text: 'Having a sense of belonging at work.',
      dimension: 'relationships',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'wv_rl5',
      text: 'Contributing to society and doing meaningful work.',
      dimension: 'relationships',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },

    // ============================================
    // SUPPORT & SECURITY (5 questions)
    // ============================================
    {
      id: 'wv_su1',
      text: 'Having job security and stable employment.',
      dimension: 'support',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'wv_su2',
      text: 'Working for a company with fair policies and good ethics.',
      dimension: 'support',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'wv_su3',
      text: 'Having a supportive manager who provides guidance.',
      dimension: 'support',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'wv_su4',
      text: 'Receiving good benefits (health insurance, retirement, etc.).',
      dimension: 'support',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
      altText: {
        grade_10: 'Having good benefits and perks in a job.',
        grade_12: 'Having good benefits and perks (like health coverage).',
      },
    },
    {
      id: 'wv_su5',
      text: 'Having clear expectations and knowing what is expected of me.',
      dimension: 'support',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },

    // ============================================
    // WORKING CONDITIONS (5 questions)
    // ============================================
    {
      id: 'wv_wc1',
      text: 'Having a comfortable and pleasant work environment.',
      dimension: 'working_conditions',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'wv_wc2',
      text: 'Maintaining a healthy work-life balance.',
      dimension: 'working_conditions',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'wv_wc3',
      text: 'Having variety and not doing the same thing every day.',
      dimension: 'working_conditions',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'wv_wc4',
      text: 'Working in a low-stress environment.',
      dimension: 'working_conditions',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'wv_wc5',
      text: 'Having reasonable working hours.',
      dimension: 'working_conditions',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
  ],
};

export default WORK_VALUES_ASSESSMENT;
