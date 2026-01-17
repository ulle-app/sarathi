import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

let supabase: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!supabase) {
    supabase = createClient(env.supabaseUrl, env.supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      db: {
        schema: 'public',
      },
    });
  }
  return supabase;
}

// Admin client with service role key for server-side operations
let supabaseAdmin: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (!supabaseAdmin) {
    supabaseAdmin = createClient(env.supabaseUrl, env.supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      db: {
        schema: 'public',
      },
    });
  }
  return supabaseAdmin;
}

export async function testConnection(): Promise<boolean> {
  try {
    const client = getSupabaseAdmin();
    
    // Simple health check - just verify we can reach Supabase
    // The tables may not exist yet if migrations haven't run
    const { error } = await client.from('users').select('id').limit(1);
    
    if (error) {
      logger.info(`Supabase error code: ${error.code}, message: ${error.message}`);
      
      // PGRST116 = no rows found (OK)
      // 42P01 = table doesn't exist (need to run migrations)
      // PGRST204 = no rows (also OK)
      if (error.code === 'PGRST116' || error.code === 'PGRST204') {
        logger.info('Supabase connection successful (no users yet)');
        return true;
      }
      if (error.code === '42P01') {
        logger.warn('Supabase connected but tables not found. Please run migrations.');
        logger.warn('Run the SQL in: apps/api/supabase/migrations/001_initial_schema.sql');
        return true; // Connection works, just need migrations
      }
      // If the error is about schema, it might be a config issue
      if (error.message?.includes('schema')) {
        logger.error('Schema error - check if tables exist in Supabase');
        logger.error('Run the migration SQL in Supabase SQL Editor');
      }
      throw error;
    }
    
    logger.info('Supabase connection successful');
    return true;
  } catch (error) {
    logger.error('Supabase connection failed:', error);
    return false;
  }
}

// Database types for TypeScript
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          password_hash: string;
          first_name: string;
          last_name: string;
          date_of_birth: string | null;
          location: string | null;
          avatar: string | null;
          email_notifications: boolean;
          dark_mode: boolean;
          roles: string[];
          is_email_verified: boolean;
          last_login_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      refresh_tokens: {
        Row: {
          id: string;
          user_id: string;
          token: string;
          expires_at: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['refresh_tokens']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['refresh_tokens']['Insert']>;
      };
      assessments: {
        Row: {
          id: string;
          title: string;
          description: string;
          type: string;
          category: string;
          estimated_minutes: number;
          questions: object;
          scoring_method: string;
          is_active: boolean;
          version: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['assessments']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['assessments']['Insert']>;
      };
      assessment_results: {
        Row: {
          id: string;
          user_id: string;
          assessment_id: string;
          responses: object;
          scores: object;
          ml_predictions: object | null;
          status: string;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['assessment_results']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['assessment_results']['Insert']>;
      };
    };
  };
}
