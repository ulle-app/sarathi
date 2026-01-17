/**
 * RIASEC Career Interest Inventory (Holland Codes)
 * 
 * Based on Holland's Theory of Vocational Personalities and Work Environments
 * Reference: John L. Holland - "Making Vocational Choices" (1997)
 * 
 * The RIASEC model identifies six personality types:
 * - R: Realistic (Doers) - Practical, hands-on, mechanical
 * - I: Investigative (Thinkers) - Analytical, intellectual, scientific  
 * - A: Artistic (Creators) - Creative, expressive, unconventional
 * - S: Social (Helpers) - Cooperative, supportive, service-oriented
 * - E: Enterprising (Persuaders) - Ambitious, competitive, leadership
 * - C: Conventional (Organizers) - Detail-oriented, organized, systematic
 * 
 * Structure:
 * - 42 questions total (7 per dimension)
 * - Mix of activity preferences and self-descriptors
 * - Generates 3-letter Holland Code (e.g., "RIA", "SEC")
 * 
 * Scoring: 1-5 Likert scale measuring interest level
 * - 1 = Strongly Dislike / Not at all like me
 * - 2 = Dislike / Unlike me
 * - 3 = Neutral / Somewhat like me
 * - 4 = Like / Like me
 * - 5 = Strongly Like / Very much like me
 */

export interface RIASECQuestion {
  id: string;
  text: string;
  dimension: 'realistic' | 'investigative' | 'artistic' | 'social' | 'enterprising' | 'conventional';
  category: 'activity' | 'competency' | 'occupation';
  weight: number;
  altText?: {
    grade_10?: string;
    grade_12?: string;
  };
}

export const RIASEC_ASSESSMENT = {
  title: 'Career Interest Inventory (RIASEC)',
  description: 'Discover your career interests using the scientifically validated Holland RIASEC model. This assessment identifies your top interest areas and matches them to career paths. Understanding your Holland Code helps you find careers where you\'ll thrive and feel fulfilled.',
  type: 'interest',
  category: 'Career',
  estimated_minutes: 12,
  scoring_method: 'weighted_sum',
  is_active: true,
  version: 2,
  academic_levels: ['grade_10', 'grade_12', 'undergraduate', 'post_graduate', 'professional'],

  // Dimension descriptions for results
  dimensions: {
    realistic: {
      name: 'Realistic (Doers)',
      code: 'R',
      description: 'Realistic people enjoy working with things—tools, machines, plants, or animals. They prefer hands-on activities and solving practical problems.',
      keywords: ['practical', 'mechanical', 'outdoors', 'athletic', 'hands-on'],
      careers: ['Engineer', 'Mechanic', 'Electrician', 'Pilot', 'Surgeon', 'Architect', 'Chef', 'Farmer', 'Athlete'],
      subjects: ['Physics', 'Technical Drawing', 'Physical Education', 'Agriculture', 'Workshop'],
    },
    investigative: {
      name: 'Investigative (Thinkers)',
      code: 'I',
      description: 'Investigative people enjoy researching, analyzing, and solving complex problems. They prefer working with ideas and data over people or things.',
      keywords: ['analytical', 'intellectual', 'scientific', 'curious', 'independent'],
      careers: ['Scientist', 'Doctor', 'Software Developer', 'Data Analyst', 'Researcher', 'Pharmacist', 'Economist'],
      subjects: ['Mathematics', 'Science', 'Computer Science', 'Economics', 'Statistics'],
    },
    artistic: {
      name: 'Artistic (Creators)',
      code: 'A',
      description: 'Artistic people enjoy creative activities and self-expression. They prefer unstructured environments where they can use imagination and originality.',
      keywords: ['creative', 'expressive', 'original', 'intuitive', 'imaginative'],
      careers: ['Designer', 'Writer', 'Artist', 'Musician', 'Actor', 'Photographer', 'Architect', 'Content Creator'],
      subjects: ['Art', 'Music', 'Drama', 'English Literature', 'Media Studies'],
    },
    social: {
      name: 'Social (Helpers)',
      code: 'S',
      description: 'Social people enjoy helping, teaching, and caring for others. They prefer working with people and solving problems through discussion and collaboration.',
      keywords: ['helpful', 'friendly', 'cooperative', 'empathetic', 'patient'],
      careers: ['Teacher', 'Counselor', 'Nurse', 'Social Worker', 'HR Manager', 'Therapist', 'Coach'],
      subjects: ['Psychology', 'Sociology', 'Health Sciences', 'Languages', 'Education'],
    },
    enterprising: {
      name: 'Enterprising (Persuaders)',
      code: 'E',
      description: 'Enterprising people enjoy leading, persuading, and managing others. They are ambitious and prefer competitive environments with opportunities for advancement.',
      keywords: ['ambitious', 'competitive', 'persuasive', 'energetic', 'confident'],
      careers: ['Entrepreneur', 'Manager', 'Lawyer', 'Sales Director', 'Marketing Manager', 'Politician', 'CEO'],
      subjects: ['Business Studies', 'Economics', 'Debate', 'Public Speaking', 'Law'],
    },
    conventional: {
      name: 'Conventional (Organizers)',
      code: 'C',
      description: 'Conventional people enjoy organizing data and working with systems. They prefer structured environments with clear rules and procedures.',
      keywords: ['organized', 'detail-oriented', 'systematic', 'efficient', 'reliable'],
      careers: ['Accountant', 'Administrator', 'Banker', 'Auditor', 'Data Entry', 'Librarian', 'Financial Analyst'],
      subjects: ['Accounting', 'Mathematics', 'Computer Applications', 'Business Administration'],
    },
  },

  questions: [
    // ============================================
    // REALISTIC - Doers (7 questions)
    // ============================================
    {
      id: 'r1',
      text: 'I enjoy building or fixing things with my hands.',
      dimension: 'realistic',
      category: 'activity',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'r2',
      text: 'I like working outdoors or with nature.',
      dimension: 'realistic',
      category: 'activity',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'r3',
      text: 'I am good at using tools, machines, or equipment.',
      dimension: 'realistic',
      category: 'competency',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'r4',
      text: 'I prefer physical activities over desk work.',
      dimension: 'realistic',
      category: 'activity',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'r5',
      text: 'I enjoy learning how machines or electronics work.',
      dimension: 'realistic',
      category: 'activity',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'r6',
      text: 'I would enjoy a job that involves operating heavy machinery or vehicles.',
      dimension: 'realistic',
      category: 'occupation',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
      altText: {
        grade_10: 'I would enjoy learning to operate vehicles or machinery.',
      },
    },
    {
      id: 'r7',
      text: 'I am practical and prefer concrete results over abstract ideas.',
      dimension: 'realistic',
      category: 'competency',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },

    // ============================================
    // INVESTIGATIVE - Thinkers (7 questions)
    // ============================================
    {
      id: 'i1',
      text: 'I enjoy solving complex puzzles and problems.',
      dimension: 'investigative',
      category: 'activity',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'i2',
      text: 'I like researching topics in depth to understand them better.',
      dimension: 'investigative',
      category: 'activity',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'i3',
      text: 'I am curious about how things work and why.',
      dimension: 'investigative',
      category: 'competency',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'i4',
      text: 'I enjoy working with data, numbers, or scientific information.',
      dimension: 'investigative',
      category: 'activity',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'i5',
      text: 'I prefer working independently to figure things out.',
      dimension: 'investigative',
      category: 'competency',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'i6',
      text: 'I would enjoy a career in science or research.',
      dimension: 'investigative',
      category: 'occupation',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'i7',
      text: 'I like analyzing information to find patterns or solutions.',
      dimension: 'investigative',
      category: 'competency',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },

    // ============================================
    // ARTISTIC - Creators (7 questions)
    // ============================================
    {
      id: 'a1',
      text: 'I enjoy creative activities like art, music, or writing.',
      dimension: 'artistic',
      category: 'activity',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'a2',
      text: 'I prefer work that allows me to express myself creatively.',
      dimension: 'artistic',
      category: 'activity',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'a3',
      text: 'I am drawn to original and unconventional ideas.',
      dimension: 'artistic',
      category: 'competency',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'a4',
      text: 'I enjoy designing, decorating, or making things look appealing.',
      dimension: 'artistic',
      category: 'activity',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'a5',
      text: 'I dislike repetitive tasks and prefer variety in my work.',
      dimension: 'artistic',
      category: 'competency',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'a6',
      text: 'I would enjoy a career in design, entertainment, or the arts.',
      dimension: 'artistic',
      category: 'occupation',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'a7',
      text: 'I have a good sense of aesthetics and appreciate beauty.',
      dimension: 'artistic',
      category: 'competency',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },

    // ============================================
    // SOCIAL - Helpers (7 questions)
    // ============================================
    {
      id: 's1',
      text: 'I enjoy helping others solve their problems.',
      dimension: 'social',
      category: 'activity',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 's2',
      text: 'I like teaching or explaining things to people.',
      dimension: 'social',
      category: 'activity',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 's3',
      text: 'I am a good listener and people often come to me for advice.',
      dimension: 'social',
      category: 'competency',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 's4',
      text: 'I prefer working in teams rather than alone.',
      dimension: 'social',
      category: 'activity',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 's5',
      text: 'I care deeply about the well-being of others.',
      dimension: 'social',
      category: 'competency',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 's6',
      text: 'I would enjoy a career in healthcare, education, or counseling.',
      dimension: 'social',
      category: 'occupation',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 's7',
      text: 'I find it rewarding to make a positive impact on people\'s lives.',
      dimension: 'social',
      category: 'competency',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },

    // ============================================
    // ENTERPRISING - Persuaders (7 questions)
    // ============================================
    {
      id: 'en1',
      text: 'I enjoy persuading or influencing others.',
      dimension: 'enterprising',
      category: 'activity',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'en2',
      text: 'I like taking on leadership roles and responsibilities.',
      dimension: 'enterprising',
      category: 'activity',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'en3',
      text: 'I am competitive and enjoy winning.',
      dimension: 'enterprising',
      category: 'competency',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'en4',
      text: 'I enjoy setting goals and working to achieve them.',
      dimension: 'enterprising',
      category: 'activity',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'en5',
      text: 'I am confident in making decisions that affect others.',
      dimension: 'enterprising',
      category: 'competency',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'en6',
      text: 'I would enjoy a career in business, sales, or management.',
      dimension: 'enterprising',
      category: 'occupation',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'en7',
      text: 'I am good at motivating and inspiring others.',
      dimension: 'enterprising',
      category: 'competency',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },

    // ============================================
    // CONVENTIONAL - Organizers (7 questions)
    // ============================================
    {
      id: 'co1',
      text: 'I enjoy organizing information and keeping records.',
      dimension: 'conventional',
      category: 'activity',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'co2',
      text: 'I prefer following clear procedures and guidelines.',
      dimension: 'conventional',
      category: 'activity',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'co3',
      text: 'I pay close attention to details and accuracy.',
      dimension: 'conventional',
      category: 'competency',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'co4',
      text: 'I enjoy working with numbers, spreadsheets, or databases.',
      dimension: 'conventional',
      category: 'activity',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'co5',
      text: 'I prefer a predictable work environment with clear expectations.',
      dimension: 'conventional',
      category: 'competency',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'co6',
      text: 'I would enjoy a career in accounting, administration, or finance.',
      dimension: 'conventional',
      category: 'occupation',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'co7',
      text: 'I am reliable and always complete tasks on time.',
      dimension: 'conventional',
      category: 'competency',
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
  ],
};

export default RIASEC_ASSESSMENT;
