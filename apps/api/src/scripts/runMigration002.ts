#!/usr/bin/env tsx
import fs from 'fs';
import path from 'path';
import { Client } from 'pg';
import { logger } from '../utils/logger.js';

async function run() {
  const sqlPath = path.resolve(__dirname, '../../supabase/migrations/002_add_student_fields.sql');
  if (!fs.existsSync(sqlPath)) {
    logger.error('Migration file not found:', sqlPath);
    process.exit(1);
  }

  const databaseUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;

  if (!databaseUrl) {
    logger.info('No DATABASE_URL found in env. Please apply the SQL in `apps/api/supabase/migrations/002_add_student_fields.sql` using the Supabase SQL editor.');
    process.exit(0);
  }

  const sql = fs.readFileSync(sqlPath, 'utf-8');

  const client = new Client({ connectionString: databaseUrl });
  try {
    await client.connect();
    logger.info('Connected to Postgres. Running migration...');
    await client.query(sql);
    logger.info('Migration applied successfully.');
  } catch (err) {
    logger.error('Migration failed:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

if (require.main === module) {
  run().catch((e) => {
    logger.error(e);
    process.exit(1);
  });
}
