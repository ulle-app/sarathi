/**
 * Skills Self-Assessment
 * 
 * Measures self-perceived competency across key professional skill domains.
 * Used in combination with personality and interests to identify:
 * - Current strengths to leverage
 * - Skill gaps for development
 * - Career fit based on required competencies
 * 
 * Structure:
 * - 40 questions total (4-5 per skill domain)
 * - 10 skill domains covering technical and soft skills
 * 
 * Scoring: 1-5 scale measuring current proficiency
 * - 1 = Beginner (Little to no experience)
 * - 2 = Basic (Some experience, need guidance)
 * - 3 = Intermediate (Can work independently)
 * - 4 = Advanced (Can teach others)
 * - 5 = Expert (Recognized authority)
 */

export const SKILLS_ASSESSMENT = {
  title: 'Skills Self-Assessment',
  description: 'Evaluate your current skill levels across key professional competencies. This assessment helps identify your strengths and areas for development, informing your career path and learning priorities.',
  type: 'skill',
  category: 'Professional Development',
  estimated_minutes: 12,
  scoring_method: 'weighted_sum',
  is_active: true,
  version: 2,
  academic_levels: ['undergraduate', 'post_graduate', 'professional'],

  dimensions: {
    analytical: {
      name: 'Analytical & Problem-Solving',
      description: 'Ability to analyze information, identify problems, and develop solutions.',
      careers: ['Data Analyst', 'Consultant', 'Engineer', 'Researcher'],
    },
    communication: {
      name: 'Communication',
      description: 'Ability to convey information clearly in written and verbal forms.',
      careers: ['Writer', 'Marketing', 'Sales', 'Teacher', 'Manager'],
    },
    leadership: {
      name: 'Leadership & Management',
      description: 'Ability to guide, motivate, and manage teams and projects.',
      careers: ['Manager', 'Director', 'Entrepreneur', 'Team Lead'],
    },
    technical: {
      name: 'Technical & Digital',
      description: 'Proficiency with technology, software, and digital tools.',
      careers: ['Software Developer', 'IT Specialist', 'Data Scientist'],
    },
    creativity: {
      name: 'Creativity & Innovation',
      description: 'Ability to generate new ideas and think outside the box.',
      careers: ['Designer', 'Entrepreneur', 'Marketing', 'Product Manager'],
    },
    interpersonal: {
      name: 'Interpersonal & Teamwork',
      description: 'Ability to work effectively with others and build relationships.',
      careers: ['HR', 'Sales', 'Customer Service', 'Healthcare'],
    },
    organization: {
      name: 'Organization & Time Management',
      description: 'Ability to plan, prioritize, and manage time effectively.',
      careers: ['Project Manager', 'Administrator', 'Executive Assistant'],
    },
    adaptability: {
      name: 'Adaptability & Learning',
      description: 'Ability to learn new skills and adapt to changing situations.',
      careers: ['Consultant', 'Entrepreneur', 'Tech roles', 'Startup environment'],
    },
    critical_thinking: {
      name: 'Critical Thinking & Decision Making',
      description: 'Ability to evaluate information objectively and make sound decisions.',
      careers: ['Analyst', 'Manager', 'Lawyer', 'Doctor', 'Consultant'],
    },
    emotional_intelligence: {
      name: 'Emotional Intelligence',
      description: 'Ability to understand and manage emotions in yourself and others.',
      careers: ['HR', 'Counselor', 'Manager', 'Healthcare', 'Teacher'],
    },
  },

  questions: [
    // ============================================
    // ANALYTICAL & PROBLEM-SOLVING (4 questions)
    // ============================================
    {
      id: 'sk_an1',
      text: 'I can break down complex problems into smaller, manageable parts.',
      dimension: 'analytical',
      weight: 1,
      type: 'slider',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'sk_an2',
      text: 'I can identify patterns and trends in data or information.',
      dimension: 'analytical',
      weight: 1,
      type: 'slider',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'sk_an3',
      text: 'I can develop multiple solutions to a problem and evaluate their pros and cons.',
      dimension: 'analytical',
      weight: 1,
      type: 'slider',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'sk_an4',
      text: 'I can use logic and reasoning to draw conclusions from available information.',
      dimension: 'analytical',
      weight: 1,
      type: 'slider',
      scale: { min: 1, max: 5, step: 1 },
    },

    // ============================================
    // COMMUNICATION (4 questions)
    // ============================================
    {
      id: 'sk_co1',
      text: 'I can write clearly and effectively for different audiences.',
      dimension: 'communication',
      weight: 1,
      type: 'slider',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'sk_co2',
      text: 'I can present ideas confidently in front of groups.',
      dimension: 'communication',
      weight: 1,
      type: 'slider',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'sk_co3',
      text: 'I can listen actively and understand others\' perspectives.',
      dimension: 'communication',
      weight: 1,
      type: 'slider',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'sk_co4',
      text: 'I can adapt my communication style for different situations.',
      dimension: 'communication',
      weight: 1,
      type: 'slider',
      scale: { min: 1, max: 5, step: 1 },
    },

    // ============================================
    // LEADERSHIP & MANAGEMENT (4 questions)
    // ============================================
    {
      id: 'sk_le1',
      text: 'I can motivate and inspire others to achieve goals.',
      dimension: 'leadership',
      weight: 1,
      type: 'slider',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'sk_le2',
      text: 'I can delegate tasks effectively based on team members\' strengths.',
      dimension: 'leadership',
      weight: 1,
      type: 'slider',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'sk_le3',
      text: 'I can manage conflicts and find solutions that work for everyone.',
      dimension: 'leadership',
      weight: 1,
      type: 'slider',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'sk_le4',
      text: 'I can set clear goals and track progress toward them.',
      dimension: 'leadership',
      weight: 1,
      type: 'slider',
      scale: { min: 1, max: 5, step: 1 },
    },

    // ============================================
    // TECHNICAL & DIGITAL (4 questions)
    // ============================================
    {
      id: 'sk_te1',
      text: 'I am proficient with common office software (Word, Excel, etc.).',
      dimension: 'technical',
      weight: 1,
      type: 'slider',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'sk_te2',
      text: 'I can learn new software and technology quickly.',
      dimension: 'technical',
      weight: 1,
      type: 'slider',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'sk_te3',
      text: 'I can troubleshoot basic technical problems.',
      dimension: 'technical',
      weight: 1,
      type: 'slider',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'sk_te4',
      text: 'I understand how to use data and analytics tools.',
      dimension: 'technical',
      weight: 1,
      type: 'slider',
      scale: { min: 1, max: 5, step: 1 },
    },

    // ============================================
    // CREATIVITY & INNOVATION (4 questions)
    // ============================================
    {
      id: 'sk_cr1',
      text: 'I can generate creative ideas and think outside the box.',
      dimension: 'creativity',
      weight: 1,
      type: 'slider',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'sk_cr2',
      text: 'I can find new approaches to existing problems.',
      dimension: 'creativity',
      weight: 1,
      type: 'slider',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'sk_cr3',
      text: 'I enjoy brainstorming and building on others\' ideas.',
      dimension: 'creativity',
      weight: 1,
      type: 'slider',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'sk_cr4',
      text: 'I can visualize concepts and communicate them clearly.',
      dimension: 'creativity',
      weight: 1,
      type: 'slider',
      scale: { min: 1, max: 5, step: 1 },
    },

    // ============================================
    // INTERPERSONAL & TEAMWORK (4 questions)
    // ============================================
    {
      id: 'sk_in1',
      text: 'I work effectively with people from different backgrounds.',
      dimension: 'interpersonal',
      weight: 1,
      type: 'slider',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'sk_in2',
      text: 'I can build rapport and trust with colleagues and clients.',
      dimension: 'interpersonal',
      weight: 1,
      type: 'slider',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'sk_in3',
      text: 'I contribute positively to team dynamics and morale.',
      dimension: 'interpersonal',
      weight: 1,
      type: 'slider',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'sk_in4',
      text: 'I can give and receive feedback constructively.',
      dimension: 'interpersonal',
      weight: 1,
      type: 'slider',
      scale: { min: 1, max: 5, step: 1 },
    },

    // ============================================
    // ORGANIZATION & TIME MANAGEMENT (4 questions)
    // ============================================
    {
      id: 'sk_or1',
      text: 'I can prioritize tasks effectively when facing multiple deadlines.',
      dimension: 'organization',
      weight: 1,
      type: 'slider',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'sk_or2',
      text: 'I manage my time well and rarely miss deadlines.',
      dimension: 'organization',
      weight: 1,
      type: 'slider',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'sk_or3',
      text: 'I can plan projects from start to finish.',
      dimension: 'organization',
      weight: 1,
      type: 'slider',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'sk_or4',
      text: 'I keep my workspace and files organized.',
      dimension: 'organization',
      weight: 1,
      type: 'slider',
      scale: { min: 1, max: 5, step: 1 },
    },

    // ============================================
    // ADAPTABILITY & LEARNING (4 questions)
    // ============================================
    {
      id: 'sk_ad1',
      text: 'I adapt quickly to new situations and changes.',
      dimension: 'adaptability',
      weight: 1,
      type: 'slider',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'sk_ad2',
      text: 'I am open to feedback and use it to improve.',
      dimension: 'adaptability',
      weight: 1,
      type: 'slider',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'sk_ad3',
      text: 'I actively seek opportunities to learn new skills.',
      dimension: 'adaptability',
      weight: 1,
      type: 'slider',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'sk_ad4',
      text: 'I stay calm and productive during uncertain situations.',
      dimension: 'adaptability',
      weight: 1,
      type: 'slider',
      scale: { min: 1, max: 5, step: 1 },
    },

    // ============================================
    // CRITICAL THINKING & DECISION MAKING (4 questions)
    // ============================================
    {
      id: 'sk_ct1',
      text: 'I evaluate information from multiple sources before forming opinions.',
      dimension: 'critical_thinking',
      weight: 1,
      type: 'slider',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'sk_ct2',
      text: 'I can make decisions under pressure with limited information.',
      dimension: 'critical_thinking',
      weight: 1,
      type: 'slider',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'sk_ct3',
      text: 'I question assumptions and consider alternative viewpoints.',
      dimension: 'critical_thinking',
      weight: 1,
      type: 'slider',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'sk_ct4',
      text: 'I weigh the risks and benefits before making important decisions.',
      dimension: 'critical_thinking',
      weight: 1,
      type: 'slider',
      scale: { min: 1, max: 5, step: 1 },
    },

    // ============================================
    // EMOTIONAL INTELLIGENCE (4 questions)
    // ============================================
    {
      id: 'sk_eq1',
      text: 'I am aware of my own emotions and how they affect my behavior.',
      dimension: 'emotional_intelligence',
      weight: 1,
      type: 'slider',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'sk_eq2',
      text: 'I can recognize and understand others\' emotions.',
      dimension: 'emotional_intelligence',
      weight: 1,
      type: 'slider',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'sk_eq3',
      text: 'I can manage my emotions effectively in stressful situations.',
      dimension: 'emotional_intelligence',
      weight: 1,
      type: 'slider',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'sk_eq4',
      text: 'I show empathy and support for others during difficult times.',
      dimension: 'emotional_intelligence',
      weight: 1,
      type: 'slider',
      scale: { min: 1, max: 5, step: 1 },
    },
  ],
};

export default SKILLS_ASSESSMENT;
