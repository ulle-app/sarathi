# SkillSphere Deployment Guide

This guide covers deploying SkillSphere to **Vercel** (frontend) and **Render** (backend + ML service).

## Prerequisites

1. **Supabase Account** - [supabase.com](https://supabase.com)
2. **Vercel Account** - [vercel.com](https://vercel.com)
3. **Render Account** - [render.com](https://render.com)
4. **GitHub Repository** - Push your code to GitHub

---

## Step 1: Set Up Supabase Database

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Project Settings** → **API**
3. Copy these values (you'll need them later):
   - `Project URL` → `SUPABASE_URL`
   - `anon public` key → `SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_KEY`

4. Run the database migrations:
   - Go to **SQL Editor** in Supabase
   - Copy and run the contents of `apps/api/supabase/migrations/001_initial_schema.sql`

---

## Step 2: Deploy Backend to Render (Automatic)

### Option A: Blueprint Deploy (Recommended)

1. Go to [render.com](https://render.com) → **Dashboard**
2. Click **New** → **Blueprint**
3. Connect your GitHub repository
4. Render will detect `render.yaml` and create both services automatically
5. After services are created, add the secret environment variables:

**For `skillsphere-api`:**
| Variable | Value |
|----------|-------|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Your Supabase anon key |
| `SUPABASE_SERVICE_KEY` | Your Supabase service role key |
| `JWT_SECRET` | Generate with: `openssl rand -base64 32` |
| `CORS_ORIGIN` | `https://your-app.vercel.app` (update after Vercel deploy) |
| `ML_SERVICE_API_KEY` | Any secure random string |

**For `skillsphere-ml`:**
| Variable | Value |
|----------|-------|
| `API_KEY` | Same value as `ML_SERVICE_API_KEY` above |

6. Click **Manual Deploy** → **Deploy latest commit** for both services

### Option B: Manual Setup

See the `render.yaml` file for configuration details and set up each service manually.

---

## Step 3: Deploy Frontend to Vercel (Automatic)

1. Go to [vercel.com](https://vercel.com) → **Dashboard**
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Configure the project:

| Setting | Value |
|---------|-------|
| **Framework Preset** | Next.js |
| **Root Directory** | `apps/web` |

5. Add Environment Variables:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | `https://skillsphere-api.onrender.com` |
| `NEXT_PUBLIC_APP_NAME` | `SkillSphere` |

6. Click **Deploy**

---

## Step 4: Update CORS (Important!)

After Vercel deployment completes:

1. Copy your Vercel app URL (e.g., `https://skillsphere-abc123.vercel.app`)
2. Go to Render → `skillsphere-api` → **Environment**
3. Update `CORS_ORIGIN` to your Vercel URL
4. Click **Save Changes** (service will auto-redeploy)

---

## Deployment URLs

After deployment, your services will be available at:

| Service | URL |
|---------|-----|
| Frontend | `https://your-project.vercel.app` |
| API | `https://skillsphere-api.onrender.com` |
| ML Service | `https://skillsphere-ml.onrender.com` |

---

## Environment Variables Reference

### Backend API (Render)

| Variable | Required | Description |
|----------|----------|-------------|
| `NODE_ENV` | Yes | `production` |
| `PORT` | Yes | `4000` |
| `SUPABASE_URL` | Yes | Supabase project URL |
| `SUPABASE_ANON_KEY` | Yes | Supabase anonymous key |
| `SUPABASE_SERVICE_KEY` | Yes | Supabase service role key |
| `JWT_SECRET` | Yes | Min 32 char secret for JWT signing |
| `JWT_EXPIRES_IN` | No | Access token expiry (default: `15m`) |
| `REFRESH_TOKEN_EXPIRES_IN` | No | Refresh token expiry (default: `7d`) |
| `CORS_ORIGIN` | Yes | Vercel app URL |
| `ML_SERVICE_URL` | Auto | Auto-linked from ML service |
| `ML_SERVICE_API_KEY` | Yes | Shared secret with ML service |

### Frontend (Vercel)

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Yes | Render API URL |
| `NEXT_PUBLIC_APP_NAME` | No | App display name |

### ML Service (Render)

| Variable | Required | Description |
|----------|----------|-------------|
| `ENVIRONMENT` | Yes | `production` |
| `API_KEY` | Yes | Must match `ML_SERVICE_API_KEY` |

---

## Troubleshooting

### Build Fails on Render
- Ensure `pnpm-lock.yaml` is committed
- Check that Node version is 18+

### CORS Errors
- Verify `CORS_ORIGIN` matches your Vercel URL exactly (including `https://`)
- No trailing slash

### API Connection Issues
- Check that `NEXT_PUBLIC_API_URL` has no trailing slash
- Verify the Render service is running (check health endpoint: `/health`)

### Database Errors
- Ensure all Supabase env vars are set correctly
- Run migrations if tables don't exist

---

## Custom Domain Setup

### Vercel
1. Go to Project → **Settings** → **Domains**
2. Add your custom domain
3. Update DNS records as instructed

### Render
1. Go to Service → **Settings** → **Custom Domains**
2. Add your custom domain
3. Update DNS records as instructed
4. Update `CORS_ORIGIN` if using custom domain for frontend

---

## Continuous Deployment

Both Vercel and Render automatically deploy when you push to your main branch:

- **Vercel**: Deploys on every push to `main`
- **Render**: Deploys on every push to `main`

To disable auto-deploy, configure it in each platform's settings.
