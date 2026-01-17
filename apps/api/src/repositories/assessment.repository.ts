import { getSupabaseAdmin } from '../config/supabase.js';
import { encrypt, decrypt } from '../utils/encryption.js';
import { env } from '../config/env.js';

// Enable encryption for sensitive assessment data in production
const ENABLE_ENCRYPTION = env.nodeEnv === 'production';

// Assessment interfaces
export interface IAssessmentQuestion {
  id: string;
  text: string;
  type: 'likert' | 'multiple_choice' | 'slider' | 'ranking';
  dimension?: string;
  options?: { value: number | string; label: string }[];
  scale?: { min: number; max: number; step: number };
  weight?: number;
}

export interface IAssessment {
  id: string;
  title: string;
  description: string;
  type: 'personality' | 'aptitude' | 'interest' | 'skill';
  category: string;
  estimated_minutes: number;
  questions: IAssessmentQuestion[];
  scoring_method: 'ml' | 'weighted_sum' | 'irt';
  is_active: boolean;
  version: number;
  academic_levels?: ('grade_10' | 'grade_12' | 'undergraduate' | 'post_graduate' | 'professional')[];
  created_at: string;
  updated_at: string;
}

// Assessment result interfaces
export interface IResponseItem {
  questionId: string;
  value: number | string | number[];
  timeSpentSeconds?: number;
}

export interface IScores {
  overall?: number;
  dimensions?: Record<string, number>;
  percentiles?: Record<string, number>;
}

export interface IMlPredictions {
  careerMatches?: {
    careerId: string;
    matchScore: number;
    confidence: number;
  }[];
  personalityType?: string;
  strengthAreas?: string[];
  developmentAreas?: string[];
}

export interface IAssessmentResult {
  id: string;
  user_id: string;
  assessment_id: string;
  responses: IResponseItem[];
  scores: IScores | null;
  ml_predictions: IMlPredictions | null;
  status: 'in_progress' | 'completed' | 'scored';
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Encrypt assessment responses and scores before storing
 * Responses contain sensitive user answers; scores contain personal insights
 */
function encryptAssessmentData(data: {
  responses?: IResponseItem[];
  scores?: IScores | null;
  ml_predictions?: IMlPredictions | null;
}): {
  responses?: string;
  scores?: string | null;
  ml_predictions?: string | null;
} {
  if (!ENABLE_ENCRYPTION) {
    return data as any; // In development, store as-is (JSONB)
  }
  
  const encrypted: any = {};
  
  if (data.responses !== undefined) {
    encrypted.responses = encrypt(JSON.stringify(data.responses));
  }
  if (data.scores !== undefined) {
    encrypted.scores = data.scores ? encrypt(JSON.stringify(data.scores)) : null;
  }
  if (data.ml_predictions !== undefined) {
    encrypted.ml_predictions = data.ml_predictions 
      ? encrypt(JSON.stringify(data.ml_predictions)) 
      : null;
  }
  
  return encrypted;
}

/**
 * Decrypt assessment responses and scores after retrieval
 */
function decryptAssessmentData(result: IAssessmentResult | null): IAssessmentResult | null {
  if (!result || !ENABLE_ENCRYPTION) return result;
  
  const decrypted = { ...result };
  
  try {
    // Handle responses - might be encrypted string or already parsed JSON
    if (typeof decrypted.responses === 'string') {
      const decryptedStr = decrypt(decrypted.responses);
      decrypted.responses = JSON.parse(decryptedStr);
    }
  } catch {
    // Not encrypted or legacy data
  }
  
  try {
    // Handle scores
    if (decrypted.scores && typeof decrypted.scores === 'string') {
      const decryptedStr = decrypt(decrypted.scores as unknown as string);
      decrypted.scores = JSON.parse(decryptedStr);
    }
  } catch {
    // Not encrypted or legacy data
  }
  
  try {
    // Handle ML predictions
    if (decrypted.ml_predictions && typeof decrypted.ml_predictions === 'string') {
      const decryptedStr = decrypt(decrypted.ml_predictions as unknown as string);
      decrypted.ml_predictions = JSON.parse(decryptedStr);
    }
  } catch {
    // Not encrypted or legacy data
  }
  
  return decrypted;
}

// API response format for assessment
export interface IAssessmentSummary {
  id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  estimatedMinutes: number;
  questionCount: number;
  isActive: boolean;
  academicLevels?: string[];
}

export function toAssessmentSummary(assessment: IAssessment): IAssessmentSummary {
  return {
    id: assessment.id,
    title: assessment.title,
    description: assessment.description,
    type: assessment.type,
    category: assessment.category,
    estimatedMinutes: assessment.estimated_minutes,
    questionCount: assessment.questions.length,
    isActive: assessment.is_active,
    academicLevels: assessment.academic_levels,
  };
}

export class AssessmentRepository {
  private get db() {
    return getSupabaseAdmin();
  }

  async findAll(activeOnly = true, academicLevel?: string): Promise<IAssessment[]> {
    let query = this.db
      .from('assessments')
      .select('*')
      .order('created_at', { ascending: false });

    if (activeOnly) {
      query = query.eq('is_active', true);
    }

    if (academicLevel) {
      query = query.contains('academic_levels', [academicLevel]);
    }

    const { data, error } = await query;

    if (error) throw error;
    return (data || []) as IAssessment[];
  }

  async findById(id: string): Promise<IAssessment | null> {
    const { data, error } = await this.db
      .from('assessments')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    return data as IAssessment;
  }

  async findByType(type: string): Promise<IAssessment[]> {
    const { data, error } = await this.db
      .from('assessments')
      .select('*')
      .eq('type', type)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as IAssessment[];
  }

  async create(assessment: Omit<IAssessment, 'id' | 'created_at' | 'updated_at'>): Promise<IAssessment> {
    const { data, error } = await this.db
      .from('assessments')
      .insert(assessment)
      .select()
      .single();

    if (error) throw error;
    return data as IAssessment;
  }

  async update(id: string, updates: Partial<IAssessment>): Promise<IAssessment | null> {
    const { data, error } = await this.db
      .from('assessments')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    return data as IAssessment;
  }
}

export class AssessmentResultRepository {
  private get db() {
    return getSupabaseAdmin();
  }

  async create(data: {
    user_id: string;
    assessment_id: string;
    responses?: IResponseItem[];
    status?: 'in_progress' | 'completed' | 'scored';
  }): Promise<IAssessmentResult> {
    // Encrypt sensitive data before storing
    const encryptedData = encryptAssessmentData({ 
      responses: data.responses || [] 
    });
    
    const { data: result, error } = await this.db
      .from('assessment_results')
      .insert({
        user_id: data.user_id,
        assessment_id: data.assessment_id,
        responses: encryptedData.responses,
        scores: null,
        ml_predictions: null,
        status: data.status || 'in_progress',
        completed_at: null,
      })
      .select()
      .single();

    if (error) throw error;
    // Decrypt before returning
    return decryptAssessmentData(result as IAssessmentResult) as IAssessmentResult;
  }

  async findById(id: string): Promise<IAssessmentResult | null> {
    const { data, error } = await this.db
      .from('assessment_results')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    // Decrypt before returning
    return decryptAssessmentData(data as IAssessmentResult);
  }

  async findByUserAndAssessment(
    userId: string,
    assessmentId: string,
    status?: string
  ): Promise<IAssessmentResult | null> {
    let query = this.db
      .from('assessment_results')
      .select('*')
      .eq('user_id', userId)
      .eq('assessment_id', assessmentId)
      .order('created_at', { ascending: false })
      .limit(1);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query.single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    // Decrypt before returning
    return decryptAssessmentData(data as IAssessmentResult);
  }

  async findByUser(userId: string, limit = 20): Promise<IAssessmentResult[]> {
    const { data, error } = await this.db
      .from('assessment_results')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    // Decrypt each result
    return (data || []).map((r) => decryptAssessmentData(r as IAssessmentResult) as IAssessmentResult);
  }

  async findCompletedByUser(userId: string): Promise<IAssessmentResult[]> {
    const { data, error } = await this.db
      .from('assessment_results')
      .select('*')
      .eq('user_id', userId)
      .in('status', ['completed', 'scored'])
      .order('completed_at', { ascending: false });

    if (error) throw error;
    // Decrypt each result
    return (data || []).map((r) => decryptAssessmentData(r as IAssessmentResult) as IAssessmentResult);
  }

  async update(
    id: string,
    updates: Partial<{
      responses: IResponseItem[];
      scores: IScores;
      ml_predictions: IMlPredictions;
      status: 'in_progress' | 'completed' | 'scored';
      completed_at: string;
    }>
  ): Promise<IAssessmentResult | null> {
    // Encrypt sensitive data before updating
    const encryptedUpdates: any = { updated_at: new Date().toISOString() };
    
    // Copy non-sensitive fields
    if (updates.status !== undefined) encryptedUpdates.status = updates.status;
    if (updates.completed_at !== undefined) encryptedUpdates.completed_at = updates.completed_at;
    
    // Encrypt sensitive fields
    const encryptedData = encryptAssessmentData({
      responses: updates.responses,
      scores: updates.scores,
      ml_predictions: updates.ml_predictions,
    });
    
    if (updates.responses !== undefined) encryptedUpdates.responses = encryptedData.responses;
    if (updates.scores !== undefined) encryptedUpdates.scores = encryptedData.scores;
    if (updates.ml_predictions !== undefined) encryptedUpdates.ml_predictions = encryptedData.ml_predictions;
    
    const { data, error } = await this.db
      .from('assessment_results')
      .update(encryptedUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    // Decrypt before returning
    return decryptAssessmentData(data as IAssessmentResult);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.db
      .from('assessment_results')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}

// Singleton instances
export const assessmentRepository = new AssessmentRepository();
export const assessmentResultRepository = new AssessmentResultRepository();
