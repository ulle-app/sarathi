/**
 * Big Five Personality Assessment (OCEAN Model)
 * 
 * Based on the International Personality Item Pool (IPIP) - public domain validated items
 * Reference: https://ipip.ori.org/newBigFive5broadKey.htm
 * 
 * Structure:
 * - 50 questions total (10 per dimension)
 * - Each dimension has 2 questions per facet (6 facets × ~2 items ≈ 10-12 items)
 * - Mix of positively and negatively keyed items for validity
 * - Age-appropriate wording for different academic levels
 * 
 * Scoring: 1-5 Likert scale
 * - 1 = Strongly Disagree
 * - 2 = Disagree  
 * - 3 = Neutral
 * - 4 = Agree
 * - 5 = Strongly Agree
 * 
 * Reverse scoring applied to negatively keyed items (marked with reverse: true)
 */

export interface BigFiveQuestion {
  id: string;
  text: string;
  dimension: 'openness' | 'conscientiousness' | 'extraversion' | 'agreeableness' | 'neuroticism';
  facet: string;
  reverse: boolean; // If true, scoring is reversed (5→1, 4→2, etc.)
  weight: number;
  // Age-appropriate alternative text
  altText?: {
    grade_10?: string;
    grade_12?: string;
  };
}

export const BIG_FIVE_ASSESSMENT = {
  title: 'Big Five Personality Assessment',
  description: 'A comprehensive personality assessment based on the scientifically validated Big Five (OCEAN) model. This assessment measures five core dimensions of personality: Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism (Emotional Stability). Each dimension includes multiple facets for a detailed personality profile.',
  type: 'personality',
  category: 'Personality',
  estimated_minutes: 15,
  scoring_method: 'ml',
  is_active: true,
  version: 2,
  academic_levels: ['grade_10', 'grade_12', 'undergraduate', 'post_graduate', 'professional'],
  
  // Dimension descriptions for results
  dimensions: {
    openness: {
      name: 'Openness to Experience',
      description: 'Reflects imagination, creativity, intellectual curiosity, and preference for novelty and variety.',
      facets: ['fantasy', 'aesthetics', 'feelings', 'actions', 'ideas', 'values'],
      highDescription: 'You are imaginative, curious, and open to new experiences. You appreciate art, emotion, and unconventional ideas.',
      lowDescription: 'You prefer routine and familiarity. You are practical, conventional, and prefer straightforward approaches.',
    },
    conscientiousness: {
      name: 'Conscientiousness',
      description: 'Reflects self-discipline, organization, dependability, and preference for planned rather than spontaneous behavior.',
      facets: ['competence', 'order', 'dutifulness', 'achievement', 'self_discipline', 'deliberation'],
      highDescription: 'You are organized, dependable, and goal-oriented. You plan ahead and work hard to achieve your objectives.',
      lowDescription: 'You are flexible and spontaneous. You may prefer to go with the flow rather than stick to rigid plans.',
    },
    extraversion: {
      name: 'Extraversion',
      description: 'Reflects energy, positive emotions, assertiveness, sociability, and the tendency to seek stimulation.',
      facets: ['warmth', 'gregariousness', 'assertiveness', 'activity', 'excitement_seeking', 'positive_emotions'],
      highDescription: 'You are outgoing, energetic, and thrive in social situations. You enjoy being around others and tend to be talkative.',
      lowDescription: 'You are reserved and prefer solitary activities. You recharge through quiet time and deep conversations with close friends.',
    },
    agreeableness: {
      name: 'Agreeableness',
      description: 'Reflects a tendency to be compassionate and cooperative rather than suspicious and antagonistic towards others.',
      facets: ['trust', 'straightforwardness', 'altruism', 'compliance', 'modesty', 'tender_mindedness'],
      highDescription: 'You are cooperative, trusting, and helpful. You value harmony and getting along with others.',
      lowDescription: 'You are more competitive and skeptical. You prioritize your own interests and question others\' motives.',
    },
    neuroticism: {
      name: 'Neuroticism (Emotional Stability)',
      description: 'Reflects the tendency to experience negative emotions such as anxiety, anger, or depression. Low neuroticism indicates emotional stability.',
      facets: ['anxiety', 'angry_hostility', 'depression', 'self_consciousness', 'impulsiveness', 'vulnerability'],
      highDescription: 'You tend to experience emotional ups and downs. You may be more sensitive to stress and prone to worry.',
      lowDescription: 'You are emotionally stable and resilient. You handle stress well and maintain a calm demeanor.',
    },
  },

  questions: [
    // ============================================
    // OPENNESS TO EXPERIENCE (10 questions)
    // ============================================
    
    // Fantasy facet
    {
      id: 'o1',
      text: 'I have a vivid imagination.',
      dimension: 'openness',
      facet: 'fantasy',
      reverse: false,
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'o2',
      text: 'I rarely daydream or let my mind wander.',
      dimension: 'openness',
      facet: 'fantasy',
      reverse: true,
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    
    // Aesthetics facet
    {
      id: 'o3',
      text: 'I appreciate art, music, or literature.',
      dimension: 'openness',
      facet: 'aesthetics',
      reverse: false,
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'o4',
      text: 'I am not interested in abstract art or theoretical discussions.',
      dimension: 'openness',
      facet: 'aesthetics',
      reverse: true,
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
      altText: {
        grade_10: 'I find abstract ideas and deep discussions boring.',
        grade_12: 'I am not interested in abstract concepts or theoretical discussions.',
      },
    },
    
    // Ideas facet
    {
      id: 'o5',
      text: 'I enjoy thinking about complex problems and abstract concepts.',
      dimension: 'openness',
      facet: 'ideas',
      reverse: false,
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
      altText: {
        grade_10: 'I enjoy thinking about tricky problems and big ideas.',
      },
    },
    {
      id: 'o6',
      text: 'I prefer straightforward, practical solutions over creative ones.',
      dimension: 'openness',
      facet: 'ideas',
      reverse: true,
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    
    // Actions facet
    {
      id: 'o7',
      text: 'I like to try new activities and experiences.',
      dimension: 'openness',
      facet: 'actions',
      reverse: false,
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'o8',
      text: 'I prefer to stick with what I know rather than try new things.',
      dimension: 'openness',
      facet: 'actions',
      reverse: true,
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    
    // Values facet
    {
      id: 'o9',
      text: 'I am open to reconsidering my values and beliefs.',
      dimension: 'openness',
      facet: 'values',
      reverse: false,
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
      altText: {
        grade_10: 'I am willing to change my opinions when I learn new information.',
      },
    },
    {
      id: 'o10',
      text: 'I believe there is usually one right way to do things.',
      dimension: 'openness',
      facet: 'values',
      reverse: true,
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },

    // ============================================
    // CONSCIENTIOUSNESS (10 questions)
    // ============================================
    
    // Competence facet
    {
      id: 'c1',
      text: 'I am confident in my ability to handle tasks effectively.',
      dimension: 'conscientiousness',
      facet: 'competence',
      reverse: false,
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
      altText: {
        grade_10: 'I believe I can do a good job when I put my mind to it.',
      },
    },
    {
      id: 'c2',
      text: 'I often feel unprepared for the challenges I face.',
      dimension: 'conscientiousness',
      facet: 'competence',
      reverse: true,
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    
    // Order facet
    {
      id: 'c3',
      text: 'I keep my belongings neat and organized.',
      dimension: 'conscientiousness',
      facet: 'order',
      reverse: false,
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'c4',
      text: 'My workspace or room is often messy.',
      dimension: 'conscientiousness',
      facet: 'order',
      reverse: true,
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    
    // Dutifulness facet
    {
      id: 'c5',
      text: 'I always keep my promises and commitments.',
      dimension: 'conscientiousness',
      facet: 'dutifulness',
      reverse: false,
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    
    // Achievement facet
    {
      id: 'c6',
      text: 'I work hard to achieve my goals.',
      dimension: 'conscientiousness',
      facet: 'achievement',
      reverse: false,
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'c7',
      text: 'I am satisfied with just getting by rather than excelling.',
      dimension: 'conscientiousness',
      facet: 'achievement',
      reverse: true,
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    
    // Self-discipline facet
    {
      id: 'c8',
      text: 'I complete tasks on time and avoid procrastination.',
      dimension: 'conscientiousness',
      facet: 'self_discipline',
      reverse: false,
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'c9',
      text: 'I often put off tasks until the last minute.',
      dimension: 'conscientiousness',
      facet: 'self_discipline',
      reverse: true,
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    
    // Deliberation facet
    {
      id: 'c10',
      text: 'I think carefully before making important decisions.',
      dimension: 'conscientiousness',
      facet: 'deliberation',
      reverse: false,
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },

    // ============================================
    // EXTRAVERSION (10 questions)
    // ============================================
    
    // Warmth facet
    {
      id: 'e1',
      text: 'I make friends easily and enjoy connecting with new people.',
      dimension: 'extraversion',
      facet: 'warmth',
      reverse: false,
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'e2',
      text: 'I find it difficult to approach and talk to strangers.',
      dimension: 'extraversion',
      facet: 'warmth',
      reverse: true,
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    
    // Gregariousness facet
    {
      id: 'e3',
      text: 'I enjoy being in large groups and social gatherings.',
      dimension: 'extraversion',
      facet: 'gregariousness',
      reverse: false,
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'e4',
      text: 'I prefer spending time alone rather than in groups.',
      dimension: 'extraversion',
      facet: 'gregariousness',
      reverse: true,
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    
    // Assertiveness facet
    {
      id: 'e5',
      text: 'I am comfortable taking charge in group situations.',
      dimension: 'extraversion',
      facet: 'assertiveness',
      reverse: false,
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'e6',
      text: 'I usually let others take the lead.',
      dimension: 'extraversion',
      facet: 'assertiveness',
      reverse: true,
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    
    // Activity facet
    {
      id: 'e7',
      text: 'I have a lot of energy and am always on the go.',
      dimension: 'extraversion',
      facet: 'activity',
      reverse: false,
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    
    // Excitement-seeking facet
    {
      id: 'e8',
      text: 'I seek out exciting and thrilling experiences.',
      dimension: 'extraversion',
      facet: 'excitement_seeking',
      reverse: false,
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    
    // Positive emotions facet
    {
      id: 'e9',
      text: 'I often feel cheerful and optimistic.',
      dimension: 'extraversion',
      facet: 'positive_emotions',
      reverse: false,
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'e10',
      text: 'I rarely feel enthusiastic or excited.',
      dimension: 'extraversion',
      facet: 'positive_emotions',
      reverse: true,
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },

    // ============================================
    // AGREEABLENESS (10 questions)
    // ============================================
    
    // Trust facet
    {
      id: 'a1',
      text: 'I believe most people have good intentions.',
      dimension: 'agreeableness',
      facet: 'trust',
      reverse: false,
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'a2',
      text: 'I am suspicious of other people\'s motives.',
      dimension: 'agreeableness',
      facet: 'trust',
      reverse: true,
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    
    // Straightforwardness facet
    {
      id: 'a3',
      text: 'I am honest and direct in my communication.',
      dimension: 'agreeableness',
      facet: 'straightforwardness',
      reverse: false,
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    
    // Altruism facet
    {
      id: 'a4',
      text: 'I go out of my way to help others, even if it inconveniences me.',
      dimension: 'agreeableness',
      facet: 'altruism',
      reverse: false,
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'a5',
      text: 'I focus on my own needs before considering others.',
      dimension: 'agreeableness',
      facet: 'altruism',
      reverse: true,
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    
    // Compliance facet
    {
      id: 'a6',
      text: 'I try to avoid conflict and seek compromise.',
      dimension: 'agreeableness',
      facet: 'compliance',
      reverse: false,
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'a7',
      text: 'I am willing to argue to defend my position.',
      dimension: 'agreeableness',
      facet: 'compliance',
      reverse: true,
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    
    // Modesty facet
    {
      id: 'a8',
      text: 'I am humble about my achievements.',
      dimension: 'agreeableness',
      facet: 'modesty',
      reverse: false,
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    
    // Tender-mindedness facet
    {
      id: 'a9',
      text: 'I feel sympathy for those who are less fortunate.',
      dimension: 'agreeableness',
      facet: 'tender_mindedness',
      reverse: false,
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'a10',
      text: 'I believe people should solve their own problems.',
      dimension: 'agreeableness',
      facet: 'tender_mindedness',
      reverse: true,
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },

    // ============================================
    // NEUROTICISM (10 questions)
    // ============================================
    
    // Anxiety facet
    {
      id: 'n1',
      text: 'I often worry about things that might go wrong.',
      dimension: 'neuroticism',
      facet: 'anxiety',
      reverse: false,
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'n2',
      text: 'I am relaxed and rarely feel anxious.',
      dimension: 'neuroticism',
      facet: 'anxiety',
      reverse: true,
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    
    // Angry hostility facet
    {
      id: 'n3',
      text: 'I get irritated or frustrated easily.',
      dimension: 'neuroticism',
      facet: 'angry_hostility',
      reverse: false,
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    
    // Depression facet
    {
      id: 'n4',
      text: 'I sometimes feel sad or down for no particular reason.',
      dimension: 'neuroticism',
      facet: 'depression',
      reverse: false,
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'n5',
      text: 'I generally feel positive and content.',
      dimension: 'neuroticism',
      facet: 'depression',
      reverse: true,
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    
    // Self-consciousness facet
    {
      id: 'n6',
      text: 'I feel self-conscious or embarrassed easily.',
      dimension: 'neuroticism',
      facet: 'self_consciousness',
      reverse: false,
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    
    // Impulsiveness facet
    {
      id: 'n7',
      text: 'I sometimes act without thinking about the consequences.',
      dimension: 'neuroticism',
      facet: 'impulsiveness',
      reverse: false,
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    
    // Vulnerability facet
    {
      id: 'n8',
      text: 'I feel overwhelmed when under pressure.',
      dimension: 'neuroticism',
      facet: 'vulnerability',
      reverse: false,
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'n9',
      text: 'I stay calm and composed during stressful situations.',
      dimension: 'neuroticism',
      facet: 'vulnerability',
      reverse: true,
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
    {
      id: 'n10',
      text: 'My mood changes frequently throughout the day.',
      dimension: 'neuroticism',
      facet: 'impulsiveness',
      reverse: false,
      weight: 1,
      type: 'likert',
      scale: { min: 1, max: 5, step: 1 },
    },
  ],
};

export default BIG_FIVE_ASSESSMENT;
