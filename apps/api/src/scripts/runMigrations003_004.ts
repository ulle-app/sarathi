#!/usr/bin/env tsx
import fs from 'fs';
import path from 'path';
import { Client } from 'pg';
import { logger } from '../utils/logger.js';

async function runFile(sqlPath: string, client: Client) {
  const sql = fs.readFileSync(sqlPath, 'utf-8');
  await client.query(sql);
}

async function run() {
  const base = path.resolve(__dirname, '../../supabase/migrations');
  const files = ['003_add_academic_level.sql', '004_backfill_academic_level.sql'].map((f) => path.join(base, f));

  for (const p of files) {
    if (!fs.existsSync(p)) {
      logger.error('Migration file not found:', p);
      process.exit(1);
    }
  }

  const databaseUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
  if (!databaseUrl) {
    logger.info('No DATABASE_URL found in env. Please apply the SQL in `apps/api/supabase/migrations/003_add_academic_level.sql` and `004_backfill_academic_level.sql` using the Supabase SQL editor.');
    process.exit(0);
  }

  const client = new Client({ connectionString: databaseUrl });
  try {
    await client.connect();
    logger.info('Connected to Postgres. Running migrations 003 & 004...');
    for (const p of files) {
      logger.info('Applying', p);
      await runFile(p, client);
    }
    logger.info('Migrations applied successfully.');
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
