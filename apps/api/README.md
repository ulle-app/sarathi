# API - Local DB tasks

This document shows quick commands to apply SQL migrations and seed the database for local development.

Prerequisites
- Ensure `.env` in `apps/api` contains your Supabase keys (SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_KEY) for seed operations.
- For running raw SQL migrations from this repo you need a Postgres connection string in `DATABASE_URL` or `SUPABASE_DB_URL` environment variable.

Apply migrations 003 and 004 (local):

```bash
cd apps/api
# set DATABASE_URL in env, then run
DATABASE_URL="postgres://USER:PASSWORD@HOST:PORT/DBNAME" pnpm run migrate:003004
```

If you don't want to expose a connection string locally, paste the SQL files into the Supabase SQL editor and run them there:
- `apps/api/supabase/migrations/003_add_academic_level.sql`
- `apps/api/supabase/migrations/004_backfill_academic_level.sql`

Seed data (assessments & careers):

```bash
cd apps/api
pnpm run seed
```

CI / GitHub Actions
- A workflow can be used to run migrations in CI if you set the `DATABASE_URL` secret in your repository.

*** End of file
