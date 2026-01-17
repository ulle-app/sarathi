import { testConnection, getSupabaseAdmin } from './supabase.js';
import { logger } from '../utils/logger.js';

export async function connectDatabase(): Promise<void> {
  try {
    // Test connection to Supabase
    const isConnected = await testConnection();
    
    if (!isConnected) {
      throw new Error('Failed to connect to Supabase');
    }

    logger.info('Supabase connected successfully');
  } catch (error) {
    logger.error('Failed to connect to Supabase:', error);
    process.exit(1);
  }
}

export async function getConnectionStatus(): Promise<string> {
  try {
    const db = getSupabaseAdmin();
    const { error } = await db.from('users').select('id').limit(1);
    return error ? 'disconnected' : 'connected';
  } catch {
    return 'disconnected';
  }
}
