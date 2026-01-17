# SkillSphere Web MVP - Complete Implementation Plan

**Project:** SkillSphere - Holistic Career Co-Pilot
**Architecture:** MERN Stack (MongoDB, Express, React, Node.js) + Python ML Service
**Deployment Strategy:** 100% Free Tier (Vercel, Render, MongoDB Atlas)
**Date:** January 16, 2026

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Architecture Overview](#2-architecture-overview)
3. [Project Structure](#3-project-structure)
4. [Technology Stack & Dependencies](#4-technology-stack--dependencies)
5. [Database Schema Design](#5-database-schema-design)
6. [API Endpoint Design](#6-api-endpoint-design)
7. [Frontend Component Architecture](#7-frontend-component-architecture)
8. [Authentication Flow](#8-authentication-flow)
9. [ML Service Design](#9-ml-service-design)
10. [Implementation Phases](#10-implementation-phases)
11. [Free-Tier Constraints & Mitigations](#11-free-tier-constraints--mitigations)
12. [Environment Variables](#12-environment-variables)
13. [Verification & Testing](#13-verification--testing)

---

## 1. Executive Summary

SkillSphere is a career assessment platform with psychometric testing capabilities. The MVP will enable users to:

- Register and authenticate securely
- Take psychometric assessments (personality, aptitude, interests)
- Receive ML-powered scoring and career recommendations
- Visualize results through interactive charts
- Explore career paths with skill gap analysis

**Current State:** Empty repository with only README.md
**Target:** Fully functional MVP deployed on free-tier hosting

---

## 2. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              USERS                                       │
└─────────────────────────────────┬───────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Vercel)                                 │
│                     Next.js + React + Tailwind                          │
│                                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │
│  │   Auth UI    │  │ Assessment   │  │   Results    │  │   Career    │ │
│  │ Login/Signup │  │   Taking     │  │   & Charts   │  │   Explorer  │ │
│  └──────────────┘  └──────────────┘  └──────────────┘  └─────────────┘ │
└─────────────────────────────────┬───────────────────────────────────────┘
                                  │ HTTPS
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        BACKEND API (Render)                              │
│                      Node.js + Express.js                                │
│                                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │
│  │   Auth       │  │ Assessment   │  │   Results    │  │   Career    │ │
│  │   Service    │  │   Service    │  │   Service    │  │   Service   │ │
│  └──────────────┘  └──────────────┘  └──────────────┘  └─────────────┘ │
└────────────┬────────────────────────────────┬───────────────────────────┘
             │                                │
             ▼                                ▼
┌────────────────────────┐       ┌────────────────────────────────────────┐
│   MongoDB Atlas        │       │         ML SERVICE (Render)            │
│   (Free M0 Cluster)    │       │         Python + FastAPI               │
│                        │       │                                        │
│  ┌──────────────────┐  │       │  ┌──────────────┐  ┌────────────────┐ │
│  │ Users            │  │       │  │ Psychometric │  │ Career Match   │ │
│  │ Assessments      │  │       │  │ Scoring      │  │ Algorithm      │ │
│  │ Results          │  │       │  └──────────────┘  └────────────────┘ │
│  │ Careers          │  │       │                                        │
│  └──────────────────┘  │       │  ┌──────────────────────────────────┐ │
└────────────────────────┘       │  │ Scikit-learn Models (.pkl)       │ │
                                 │  └──────────────────────────────────┘ │
                                 └────────────────────────────────────────┘
```

| Tier | Component | Technology | Free-Tier Host |
|------|-----------|------------|----------------|
| Frontend | User Interface | Next.js + React + Tailwind | Vercel |
| Backend | API Server | Node.js + Express.js | Render |
| ML Service | Psychometric AI | Python + FastAPI + Scikit-learn | Render |
| Database | Data Storage | MongoDB | MongoDB Atlas (M0) |

---

## 3. Project Structure

```
sarathi/
├── README.md
├── IMPLEMENTATION_PLAN.md          # This file
├── package.json                    # Root workspace configuration
├── pnpm-workspace.yaml             # pnpm workspace definition
├── turbo.json                      # Turborepo configuration
├── .gitignore
├── .env.example                    # Environment variables template
│
├── apps/
│   ├── web/                        # ═══ NEXT.JS FRONTEND ═══
│   │   ├── package.json
│   │   ├── next.config.js
│   │   ├── tailwind.config.js
│   │   ├── postcss.config.js
│   │   ├── tsconfig.json
│   │   ├── .env.local.example
│   │   │
│   │   ├── public/
│   │   │   ├── favicon.ico
│   │   │   └── images/
│   │   │
│   │   └── src/
│   │       ├── app/                        # Next.js App Router
│   │       │   ├── layout.tsx              # Root layout
│   │       │   ├── page.tsx                # Landing page
│   │       │   ├── globals.css             # Global styles
│   │       │   │
│   │       │   ├── (auth)/                 # Auth route group
│   │       │   │   ├── layout.tsx
│   │       │   │   ├── login/
│   │       │   │   │   └── page.tsx
│   │       │   │   └── register/
│   │       │   │       └── page.tsx
│   │       │   │
│   │       │   ├── (dashboard)/            # Protected route group
│   │       │   │   ├── layout.tsx
│   │       │   │   ├── dashboard/
│   │       │   │   │   └── page.tsx
│   │       │   │   ├── assessment/
│   │       │   │   │   ├── page.tsx        # Assessment list
│   │       │   │   │   └── [id]/
│   │       │   │   │       └── page.tsx    # Take assessment
│   │       │   │   ├── results/
│   │       │   │   │   ├── page.tsx        # Results list
│   │       │   │   │   └── [id]/
│   │       │   │   │       └── page.tsx    # Result detail
│   │       │   │   ├── career-paths/
│   │       │   │   │   └── page.tsx
│   │       │   │   └── profile/
│   │       │   │       └── page.tsx
│   │       │   │
│   │       │   └── api/                    # API routes (minimal)
│   │       │       └── health/
│   │       │           └── route.ts
│   │       │
│   │       ├── components/
│   │       │   ├── ui/                     # Reusable UI components
│   │       │   │   ├── Button.tsx
│   │       │   │   ├── Input.tsx
│   │       │   │   ├── Card.tsx
│   │       │   │   ├── Modal.tsx
│   │       │   │   ├── Spinner.tsx
│   │       │   │   ├── Progress.tsx
│   │       │   │   └── index.ts
│   │       │   │
│   │       │   ├── layout/
│   │       │   │   ├── Header.tsx
│   │       │   │   ├── Sidebar.tsx
│   │       │   │   ├── Footer.tsx
│   │       │   │   └── DashboardLayout.tsx
│   │       │   │
│   │       │   ├── auth/
│   │       │   │   ├── LoginForm.tsx
│   │       │   │   ├── RegisterForm.tsx
│   │       │   │   └── ProtectedRoute.tsx
│   │       │   │
│   │       │   ├── assessment/
│   │       │   │   ├── AssessmentCard.tsx
│   │       │   │   ├── QuestionDisplay.tsx
│   │       │   │   ├── ProgressBar.tsx
│   │       │   │   ├── AnswerOptions.tsx
│   │       │   │   │   ├── LikertScale.tsx
│   │       │   │   │   ├── MultipleChoice.tsx
│   │       │   │   │   ├── RankingInput.tsx
│   │       │   │   │   └── SliderInput.tsx
│   │       │   │   └── AssessmentSummary.tsx
│   │       │   │
│   │       │   ├── charts/
│   │       │   │   ├── SkillRadarChart.tsx
│   │       │   │   ├── PersonalityBarChart.tsx
│   │       │   │   ├── CareerMatchPieChart.tsx
│   │       │   │   └── ProgressLineChart.tsx
│   │       │   │
│   │       │   └── career/
│   │       │       ├── CareerCard.tsx
│   │       │       ├── CareerGraph.tsx
│   │       │       └── SkillGapAnalysis.tsx
│   │       │
│   │       ├── hooks/
│   │       │   ├── useAuth.ts
│   │       │   ├── useAssessment.ts
│   │       │   ├── useApi.ts
│   │       │   └── useLocalStorage.ts
│   │       │
│   │       ├── stores/                     # Zustand state management
│   │       │   ├── authStore.ts
│   │       │   ├── assessmentStore.ts
│   │       │   └── uiStore.ts
│   │       │
│   │       ├── lib/
│   │       │   ├── api.ts                  # Axios API client
│   │       │   ├── auth.ts                 # Auth utilities
│   │       │   └── utils.ts                # General utilities
│   │       │
│   │       └── types/
│   │           ├── api.ts
│   │           ├── assessment.ts
│   │           ├── user.ts
│   │           └── career.ts
│   │
│   └── api/                        # ═══ EXPRESS.JS BACKEND ═══
│       ├── package.json
│       ├── tsconfig.json
│       ├── .env.example
│       │
│       ├── src/
│       │   ├── index.ts                    # Entry point
│       │   ├── app.ts                      # Express app setup
│       │   │
│       │   ├── config/
│       │   │   ├── database.ts             # MongoDB connection
│       │   │   ├── passport.ts             # Passport.js JWT strategy
│       │   │   ├── cors.ts                 # CORS configuration
│       │   │   └── env.ts                  # Environment validation
│       │   │
│       │   ├── middleware/
│       │   │   ├── auth.ts                 # JWT authentication
│       │   │   ├── errorHandler.ts         # Global error handler
│       │   │   ├── rateLimiter.ts          # Rate limiting
│       │   │   └── validator.ts            # Request validation
│       │   │
│       │   ├── models/
│       │   │   ├── User.ts
│       │   │   ├── Assessment.ts
│       │   │   ├── AssessmentResult.ts
│       │   │   ├── Career.ts
│       │   │   └── RefreshToken.ts
│       │   │
│       │   ├── routes/
│       │   │   ├── index.ts                # Route aggregator
│       │   │   ├── auth.routes.ts
│       │   │   ├── user.routes.ts
│       │   │   ├── assessment.routes.ts
│       │   │   ├── result.routes.ts
│       │   │   └── career.routes.ts
│       │   │
│       │   ├── controllers/
│       │   │   ├── auth.controller.ts
│       │   │   ├── user.controller.ts
│       │   │   ├── assessment.controller.ts
│       │   │   ├── result.controller.ts
│       │   │   └── career.controller.ts
│       │   │
│       │   ├── services/
│       │   │   ├── auth.service.ts
│       │   │   ├── user.service.ts
│       │   │   ├── assessment.service.ts
│       │   │   ├── result.service.ts
│       │   │   ├── career.service.ts
│       │   │   └── ml.service.ts           # ML service HTTP client
│       │   │
│       │   ├── validators/
│       │   │   ├── auth.validator.ts
│       │   │   ├── assessment.validator.ts
│       │   │   └── user.validator.ts
│       │   │
│       │   ├── utils/
│       │   │   ├── jwt.ts
│       │   │   ├── password.ts
│       │   │   └── response.ts
│       │   │
│       │   └── types/
│       │       ├── express.d.ts            # Express type extensions
│       │       └── index.ts
│       │
│       ├── scripts/
│       │   └── seed.ts                     # Database seeding
│       │
│       └── tests/
│           ├── setup.ts
│           ├── auth.test.ts
│           └── assessment.test.ts
│
├── services/
│   └── ml/                         # ═══ FASTAPI ML SERVICE ═══
│       ├── requirements.txt
│       ├── Dockerfile
│       ├── .env.example
│       │
│       ├── app/
│       │   ├── __init__.py
│       │   ├── main.py                     # FastAPI entry point
│       │   ├── config.py                   # Configuration
│       │   │
│       │   ├── api/
│       │   │   ├── __init__.py
│       │   │   └── v1/
│       │   │       ├── __init__.py
│       │   │       ├── router.py           # API router
│       │   │       └── endpoints/
│       │   │           ├── __init__.py
│       │   │           ├── health.py
│       │   │           └── scoring.py
│       │   │
│       │   ├── models/
│       │   │   ├── __init__.py
│       │   │   └── schemas.py              # Pydantic models
│       │   │
│       │   ├── services/
│       │   │   ├── __init__.py
│       │   │   ├── psychometric.py         # Psychometric scoring
│       │   │   ├── career_match.py         # Career matching
│       │   │   └── skill_analysis.py       # Skill gap analysis
│       │   │
│       │   └── ml/
│       │       ├── __init__.py
│       │       ├── models/                 # Trained model files
│       │       │   └── .gitkeep
│       │       ├── training/               # Training scripts
│       │       │   ├── train_personality.py
│       │       │   └── train_career_match.py
│       │       └── preprocessing.py
│       │
│       └── tests/
│           ├── __init__.py
│           ├── conftest.py
│           └── test_scoring.py
│
└── packages/
    └── shared/                     # ═══ SHARED TYPES ═══
        ├── package.json
        ├── tsconfig.json
        └── src/
            ├── index.ts
            ├── types/
            │   ├── user.ts
            │   ├── assessment.ts
            │   ├── career.ts
            │   └── api.ts
            └── constants/
                └── index.ts
```

---

## 4. Technology Stack & Dependencies

### 4.1 Root Workspace (`package.json`)

```json
{
  "name": "skillsphere",
  "private": true,
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "test": "turbo run test",
    "dev:web": "turbo run dev --filter=web",
    "dev:api": "turbo run dev --filter=api",
    "dev:ml": "cd services/ml && uvicorn app.main:app --reload --port 8000"
  },
  "devDependencies": {
    "turbo": "^2.0.0",
    "typescript": "^5.3.0"
  },
  "packageManager": "pnpm@8.15.0"
}
```

### 4.2 Frontend Dependencies (`apps/web/package.json`)

```json
{
  "name": "web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --port 3000",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^14.1.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "recharts": "^2.12.0",
    "zustand": "^4.5.0",
    "axios": "^1.6.0",
    "js-cookie": "^3.0.5",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0",
    "react-hook-form": "^7.50.0",
    "@hookform/resolvers": "^3.3.0",
    "zod": "^3.22.0",
    "lucide-react": "^0.331.0",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-progress": "^1.0.3",
    "@radix-ui/react-slider": "^1.1.2"
  },
  "devDependencies": {
    "@types/node": "^20.11.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@types/js-cookie": "^3.0.6",
    "autoprefixer": "^10.4.17",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.3.0",
    "eslint": "^8.56.0",
    "eslint-config-next": "^14.1.0"
  }
}
```

### 4.3 Backend Dependencies (`apps/api/package.json`)

```json
{
  "name": "api",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "lint": "eslint src/**/*.ts",
    "test": "vitest",
    "seed": "tsx scripts/seed.ts"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.1.0",
    "passport": "^0.7.0",
    "passport-jwt": "^4.0.1",
    "jsonwebtoken": "^9.0.2",
    "bcrypt": "^5.1.1",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5",
    "express-validator": "^7.0.1",
    "dotenv": "^16.4.1",
    "axios": "^1.6.0",
    "winston": "^3.11.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/passport": "^1.0.16",
    "@types/passport-jwt": "^4.0.1",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/bcrypt": "^5.0.2",
    "@types/cors": "^2.8.17",
    "@types/node": "^20.11.0",
    "typescript": "^5.3.0",
    "tsx": "^4.7.0",
    "vitest": "^1.2.0",
    "eslint": "^8.56.0",
    "@typescript-eslint/parser": "^6.20.0",
    "@typescript-eslint/eslint-plugin": "^6.20.0"
  }
}
```

### 4.4 ML Service Dependencies (`services/ml/requirements.txt`)

```
# FastAPI and Server
fastapi==0.109.0
uvicorn[standard]==0.27.0
python-multipart==0.0.6

# Data Processing
numpy==1.26.3
pandas==2.2.0
scikit-learn==1.4.0

# Model Persistence
joblib==1.3.2

# Validation
pydantic==2.6.0
pydantic-settings==2.1.0

# HTTP Client (for health checks)
httpx==0.26.0

# Keep-alive for Render free tier
aiocron==1.8

# Testing
pytest==8.0.0
pytest-asyncio==0.23.4

# Development
python-dotenv==1.0.1
```

---

## 5. Database Schema Design

### 5.1 User Schema

```typescript
// apps/api/src/models/User.ts

interface IUser {
  _id: ObjectId;
  email: string;                    // Unique, indexed
  passwordHash: string;
  profile: {
    firstName: string;
    lastName: string;
    dateOfBirth?: Date;
    location?: string;
    avatar?: string;
  };
  preferences: {
    emailNotifications: boolean;
    darkMode: boolean;
  };
  roles: ('user' | 'admin')[];
  isEmailVerified: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Indexes: { email: 1 } (unique)
```

### 5.2 Assessment Schema

```typescript
// apps/api/src/models/Assessment.ts

interface IAssessment {
  _id: ObjectId;
  title: string;
  description: string;
  type: 'personality' | 'aptitude' | 'interest' | 'skill';
  category: string;
  estimatedMinutes: number;
  questions: {
    questionId: string;
    text: string;
    type: 'likert' | 'multiple_choice' | 'ranking' | 'slider';
    options?: {
      value: number | string;
      label: string;
    }[];
    dimension?: string;           // For personality dimensions (e.g., 'extraversion')
    weight?: number;
  }[];
  scoringMethod: 'ml' | 'weighted_sum' | 'irt';
  isActive: boolean;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

// Questions are embedded (always accessed together)
```

### 5.3 Assessment Result Schema

```typescript
// apps/api/src/models/AssessmentResult.ts

interface IAssessmentResult {
  _id: ObjectId;
  userId: ObjectId;               // Indexed, ref: User
  assessmentId: ObjectId;         // Indexed, ref: Assessment
  responses: {
    questionId: string;
    answer: number | string | number[];
    timeSpentSeconds?: number;
  }[];
  scores: {
    overall?: number;
    dimensions?: Record<string, number>;  // e.g., { extraversion: 75, openness: 82 }
    percentiles?: Record<string, number>;
  };
  mlPredictions?: {
    careerMatches: {
      careerId: ObjectId;
      matchScore: number;
      confidence: number;
    }[];
    personalityType?: string;
    strengthAreas: string[];
    developmentAreas: string[];
  };
  status: 'in_progress' | 'completed' | 'scored';
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Indexes: { userId: 1, assessmentId: 1, createdAt: -1 }
```

### 5.4 Career Schema

```typescript
// apps/api/src/models/Career.ts

interface ICareer {
  _id: ObjectId;
  title: string;
  description: string;
  category: string;               // e.g., 'Technology', 'Healthcare'
  requiredSkills: {
    skill: string;
    importance: 'required' | 'preferred' | 'nice_to_have';
    proficiencyLevel: number;     // 1-5
  }[];
  personalityFit: {
    dimension: string;            // e.g., 'extraversion'
    idealRange: [number, number]; // e.g., [60, 100]
    weight: number;
  }[];
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
  growthOutlook: 'high' | 'medium' | 'low';
  relatedCareers: ObjectId[];
  resources: {
    type: 'course' | 'article' | 'certification';
    title: string;
    url: string;
  }[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### 5.5 Refresh Token Schema

```typescript
// apps/api/src/models/RefreshToken.ts

interface IRefreshToken {
  _id: ObjectId;
  userId: ObjectId;               // Indexed, ref: User
  token: string;                  // Indexed, unique
  expiresAt: Date;                // TTL index for automatic cleanup
  createdAt: Date;
}

// TTL Index: { expiresAt: 1 }, { expireAfterSeconds: 0 }
// Auto-deletes expired tokens to save storage
```

---

## 6. API Endpoint Design

### 6.1 Backend REST API (Express.js)

**Base URL:** `https://skillsphere-api.onrender.com/api/v1`

#### Authentication Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/auth/register` | Register new user | No |
| `POST` | `/auth/login` | Login and get tokens | No |
| `POST` | `/auth/refresh` | Refresh access token | Cookie |
| `POST` | `/auth/logout` | Logout and invalidate tokens | Yes |
| `POST` | `/auth/forgot-password` | Request password reset | No |
| `POST` | `/auth/reset-password` | Reset password with token | No |

#### User Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/users/me` | Get current user profile | Yes |
| `PATCH` | `/users/me` | Update current user profile | Yes |
| `DELETE` | `/users/me` | Delete account | Yes |

#### Assessment Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/assessments` | List available assessments | Yes |
| `GET` | `/assessments/:id` | Get assessment with questions | Yes |
| `POST` | `/assessments/:id/start` | Start assessment session | Yes |
| `PATCH` | `/assessments/:id/progress` | Save progress (partial) | Yes |
| `POST` | `/assessments/:id/submit` | Submit completed assessment | Yes |

#### Result Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/results` | List user's assessment results | Yes |
| `GET` | `/results/:id` | Get detailed result with scores | Yes |
| `GET` | `/results/:id/insights` | Get ML-generated insights | Yes |

#### Career Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/careers` | List all careers | Yes |
| `GET` | `/careers/:id` | Get career details | Yes |
| `GET` | `/careers/recommendations` | Get personalized matches | Yes |
| `GET` | `/careers/:id/skill-gap` | Get skill gap analysis | Yes |

### 6.2 ML Service API (FastAPI)

**Base URL:** `https://skillsphere-ml.onrender.com/api/v1`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/health` | Health check | No |
| `POST` | `/score_profile` | Score psychometric responses | API Key |
| `POST` | `/career_match` | Calculate career matches | API Key |
| `POST` | `/personality_predict` | Predict personality type | API Key |
| `POST` | `/skill_analysis` | Analyze skills and gaps | API Key |

#### Request/Response Examples

**POST `/api/v1/score_profile`**

```json
// Request
{
  "assessment_type": "personality",
  "responses": [
    {"question_id": "q1", "value": 4, "dimension": "extraversion"},
    {"question_id": "q2", "value": 2, "dimension": "openness"}
  ],
  "user_metadata": {
    "age_group": "25-34",
    "education_level": "bachelors"
  }
}

// Response
{
  "success": true,
  "scores": {
    "dimensions": {
      "extraversion": 72.5,
      "agreeableness": 65.0,
      "conscientiousness": 80.0,
      "neuroticism": 35.0,
      "openness": 88.5
    },
    "percentiles": {
      "extraversion": 68,
      "openness": 92
    }
  },
  "personality_type": "ENFP",
  "confidence": 0.87,
  "processing_time_ms": 45
}
```

**POST `/api/v1/career_match`**

```json
// Request
{
  "personality_scores": {
    "extraversion": 72.5,
    "openness": 88.5
  },
  "skills": ["python", "data_analysis", "communication"],
  "interests": ["technology", "problem_solving"],
  "top_n": 5
}

// Response
{
  "success": true,
  "matches": [
    {
      "career_id": "career_001",
      "title": "Data Scientist",
      "match_score": 0.92,
      "confidence": 0.85,
      "fit_factors": {
        "personality": 0.88,
        "skills": 0.95,
        "interests": 0.93
      }
    }
  ]
}
```

---

## 7. Frontend Component Architecture

```
App
├── Providers (AuthProvider, ThemeProvider)
│
├── Layouts
│   ├── AuthLayout                    # Login/register pages
│   │   ├── Logo
│   │   └── AuthCard
│   │
│   └── DashboardLayout               # Authenticated pages
│       ├── Header
│       │   ├── Logo
│       │   ├── Navigation
│       │   └── UserMenu
│       ├── Sidebar
│       │   └── NavItem[]
│       └── MainContent
│
├── Pages
│   ├── Landing (/)
│   │   ├── Hero
│   │   ├── Features
│   │   └── CTASection
│   │
│   ├── Auth
│   │   ├── Login (/login)
│   │   │   └── LoginForm
│   │   └── Register (/register)
│   │       └── RegisterForm
│   │
│   ├── Dashboard (/dashboard)
│   │   ├── WelcomeCard
│   │   ├── QuickStats
│   │   ├── RecentActivity
│   │   └── RecommendedAssessments
│   │
│   ├── Assessment
│   │   ├── List (/assessment)
│   │   │   └── AssessmentCard[]
│   │   │
│   │   └── Take (/assessment/:id)
│   │       ├── AssessmentHeader
│   │       │   ├── Title
│   │       │   └── ProgressBar
│   │       ├── QuestionDisplay
│   │       │   ├── QuestionText
│   │       │   └── AnswerOptions
│   │       │       ├── LikertScale
│   │       │       ├── MultipleChoice
│   │       │       ├── RankingInput
│   │       │       └── SliderInput
│   │       └── NavigationButtons
│   │
│   ├── Results
│   │   ├── List (/results)
│   │   │   └── ResultCard[]
│   │   │
│   │   └── Detail (/results/:id)
│   │       ├── ScoreSummary
│   │       ├── PersonalityProfile
│   │       │   ├── SkillRadarChart
│   │       │   └── PersonalityBarChart
│   │       ├── Insights
│   │       └── CareerRecommendations
│   │
│   ├── CareerPaths (/career-paths)
│   │   ├── TopMatches
│   │   ├── SkillGapAnalysis
│   │   └── ResourceRecommendations
│   │
│   └── Profile (/profile)
│       ├── ProfileHeader
│       ├── PersonalInfoForm
│       └── PreferencesForm
│
└── Shared Components
    ├── UI (Button, Input, Card, Modal, Spinner)
    └── Charts (SkillRadarChart, PersonalityBarChart, etc.)
```

---

## 8. Authentication Flow

### 8.1 Token Strategy

| Token Type | Expiry | Storage | Purpose |
|------------|--------|---------|---------|
| Access Token | 15 minutes | Memory (Zustand) | API authentication |
| Refresh Token | 7 days | HTTP-only cookie | Silent refresh |

### 8.2 Registration Flow

```
┌─────────┐      ┌─────────┐      ┌─────────┐      ┌─────────┐
│ Client  │      │ Next.js │      │ Express │      │ MongoDB │
└────┬────┘      └────┬────┘      └────┬────┘      └────┬────┘
     │                │                │                │
     │ POST /register │                │                │
     │ {email, pass}  │                │                │
     │───────────────>│                │                │
     │                │ POST /api/v1/  │                │
     │                │ auth/register  │                │
     │                │───────────────>│                │
     │                │                │ Check email    │
     │                │                │───────────────>│
     │                │                │<───────────────│
     │                │                │                │
     │                │                │ Hash password  │
     │                │                │ Create user    │
     │                │                │───────────────>│
     │                │                │                │
     │                │                │ Generate JWT   │
     │                │                │ Create refresh │
     │                │                │ token          │
     │                │                │───────────────>│
     │                │ Set-Cookie +   │                │
     │                │ accessToken    │                │
     │                │<───────────────│                │
     │ User data +    │                │                │
     │ accessToken    │                │                │
     │<───────────────│                │                │
```

### 8.3 Login Flow

```
┌─────────┐      ┌─────────┐      ┌─────────┐
│ Client  │      │ Express │      │ MongoDB │
└────┬────┘      └────┬────┘      └────┬────┘
     │                │                │
     │ POST /login    │                │
     │ {email, pass}  │                │
     │───────────────>│                │
     │                │ Find user      │
     │                │───────────────>│
     │                │<───────────────│
     │                │                │
     │                │ Verify bcrypt  │
     │                │ Generate tokens│
     │                │───────────────>│
     │ Set-Cookie +   │                │
     │ accessToken    │                │
     │<───────────────│                │
```

### 8.4 Silent Refresh Flow

```
┌─────────┐      ┌─────────┐      ┌─────────┐
│ Client  │      │ Express │      │ MongoDB │
└────┬────┘      └────┬────┘      └────┬────┘
     │                │                │
     │ Access token   │                │
     │ expired!       │                │
     │                │                │
     │ POST /refresh  │                │
     │ (cookie sent)  │                │
     │───────────────>│                │
     │                │ Verify refresh │
     │                │ token          │
     │                │───────────────>│
     │                │                │
     │                │ Rotate tokens  │
     │                │───────────────>│
     │ New tokens     │                │
     │<───────────────│                │
```

### 8.5 Protected Route Component

```typescript
// apps/web/src/components/auth/ProtectedRoute.tsx

function ProtectedRoute({ children }) {
  const { user, isLoading, refreshToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user && !isLoading) {
      refreshToken().catch(() => {
        router.push('/login');
      });
    }
  }, [user, isLoading]);

  if (isLoading) return <Spinner />;
  if (!user) return null;

  return children;
}
```

---

## 9. ML Service Design

### 9.1 Psychometric Scoring

The ML service implements Big Five personality scoring:

```python
# services/ml/app/services/psychometric.py

class PsychometricScorer:
    """Big Five personality dimension scoring."""

    DIMENSIONS = [
        'extraversion',
        'agreeableness',
        'conscientiousness',
        'neuroticism',
        'openness'
    ]

    def score_responses(self, responses: List[Response]) -> Dict[str, float]:
        """Calculate dimension scores from responses."""
        dimension_scores = {}

        for dimension in self.DIMENSIONS:
            relevant = [r for r in responses if r.dimension == dimension]
            if relevant:
                raw_score = sum(r.value for r in relevant) / len(relevant)
                # Normalize to 0-100 scale
                dimension_scores[dimension] = self._normalize(raw_score)

        return dimension_scores

    def predict_personality_type(self, scores: Dict[str, float]) -> str:
        """Map dimension scores to MBTI-like personality type."""
        # Simplified mapping logic
        type_code = ""
        type_code += "E" if scores['extraversion'] > 50 else "I"
        type_code += "N" if scores['openness'] > 50 else "S"
        type_code += "F" if scores['agreeableness'] > 50 else "T"
        type_code += "P" if scores['conscientiousness'] < 50 else "J"
        return type_code
```

### 9.2 Career Matching Algorithm

```python
# services/ml/app/services/career_match.py

class CareerMatcher:
    """Match user profiles to careers."""

    def calculate_match(
        self,
        personality_scores: Dict[str, float],
        skills: List[str],
        career: Career
    ) -> MatchResult:
        """Calculate match score for a career."""

        # Personality fit score
        personality_fit = self._calculate_personality_fit(
            personality_scores,
            career.personality_fit
        )

        # Skills match score
        skills_match = self._calculate_skills_match(
            skills,
            career.required_skills
        )

        # Weighted combination
        match_score = (
            personality_fit * 0.4 +
            skills_match * 0.6
        )

        return MatchResult(
            career_id=career.id,
            match_score=match_score,
            confidence=self._calculate_confidence(personality_fit, skills_match),
            fit_factors={
                'personality': personality_fit,
                'skills': skills_match
            }
        )
```

### 9.3 Keep-Alive for Render Free Tier

```python
# services/ml/app/main.py

from fastapi import FastAPI
from contextlib import asynccontextmanager
import aiocron
import httpx

app = FastAPI()

# Keep-alive ping every 14 minutes to prevent Render spindown
@aiocron.crontab('*/14 * * * *')
async def keep_alive():
    """Ping self to stay warm on Render free tier."""
    async with httpx.AsyncClient() as client:
        try:
            await client.get(f"{settings.BASE_URL}/api/v1/health")
        except Exception:
            pass  # Ignore errors, this is just a keep-alive
```

---

## 10. Implementation Phases

### Phase 1: Foundation (Week 1-2)

**Goal:** Basic project setup, authentication, and deployment

**Tasks:**
1. Initialize monorepo with Turborepo + pnpm
2. Set up Express.js backend with TypeScript
3. Configure MongoDB connection with Mongoose
4. Implement User model and auth routes
5. Set up Passport.js JWT strategy
6. Create Next.js frontend with App Router
7. Configure Tailwind CSS
8. Build auth pages (login/register)
9. Implement protected routes
10. Set up MongoDB Atlas cluster
11. Deploy to Vercel and Render

**Deliverables:**
- User can register and login
- Protected dashboard accessible
- Basic CI/CD working

**Key Files:**
- `apps/api/src/config/passport.ts`
- `apps/api/src/models/User.ts`
- `apps/api/src/routes/auth.routes.ts`
- `apps/web/src/stores/authStore.ts`
- `apps/web/src/components/auth/LoginForm.tsx`

---

### Phase 2: Assessment System (Week 3-4)

**Goal:** Implement assessment taking functionality

**Tasks:**
1. Create Assessment and AssessmentResult models
2. Implement assessment CRUD routes
3. Build assessment list page
4. Create assessment taking UI
5. Implement question types (Likert, multiple choice, slider, ranking)
6. Add progress saving functionality
7. Build basic results display
8. Create seed script for sample assessments

**Deliverables:**
- User can browse assessments
- User can take and submit assessments
- Responses saved to database
- Basic weighted scoring working

**Key Files:**
- `apps/api/src/models/Assessment.ts`
- `apps/api/src/models/AssessmentResult.ts`
- `apps/web/src/app/(dashboard)/assessment/[id]/page.tsx`
- `apps/web/src/components/assessment/QuestionDisplay.tsx`

---

### Phase 3: ML Service (Week 5-6)

**Goal:** Implement psychometric scoring ML service

**Tasks:**
1. Set up FastAPI application structure
2. Create Pydantic schemas for API
3. Implement health check endpoint
4. Build psychometric scoring service
5. Create personality type prediction
6. Implement career matching algorithm
7. Add API key authentication
8. Integrate backend with ML service
9. Deploy ML service to Render
10. Add keep-alive for free tier

**Deliverables:**
- ML service scoring assessments
- Career recommendations generated
- Results show personality insights
- Keep-alive prevents cold starts

**Key Files:**
- `services/ml/app/main.py`
- `services/ml/app/services/psychometric.py`
- `services/ml/app/services/career_match.py`
- `apps/api/src/services/ml.service.ts`

---

### Phase 4: Visualization & Careers (Week 7-8)

**Goal:** Rich data visualization and career exploration

**Tasks:**
1. Set up Recharts
2. Build skill radar chart
3. Create personality bar chart
4. Implement career match visualization
5. Create Career model and routes
6. Build career list and detail pages
7. Implement skill gap analysis
8. Add dashboard charts
9. Create career graph visualization

**Deliverables:**
- Interactive charts on results page
- Career exploration with recommendations
- Skill gap analysis working
- Enhanced dashboard

**Key Files:**
- `apps/web/src/components/charts/SkillRadarChart.tsx`
- `apps/web/src/components/charts/PersonalityBarChart.tsx`
- `apps/api/src/models/Career.ts`
- `apps/web/src/app/(dashboard)/career-paths/page.tsx`

---

### Phase 5: Polish & Testing (Week 9-10)

**Goal:** Production readiness

**Tasks:**
1. Add loading states and skeletons
2. Implement error boundaries
3. Add toast notifications
4. Polish responsive design
5. Implement rate limiting
6. Add input validation
7. Configure security headers
8. Write unit tests for auth
9. Write integration tests for assessment flow
10. Optimize performance

**Deliverables:**
- Production-ready application
- Comprehensive error handling
- Test coverage for critical paths
- Security hardened

---

## 11. Free-Tier Constraints & Mitigations

### 11.1 Render Cold Starts (30-60 seconds)

**Problem:** Services spin down after 15 minutes of inactivity

**Mitigations:**
1. **Keep-alive pings:** Cron job every 14 minutes
2. **Loading UI:** Show "Warming up server..." message
3. **Warm-up endpoint:** Hit `/health` on app load
4. **User expectation:** Inform users about initial delay

### 11.2 MongoDB Atlas 512MB Limit

**Problem:** Limited storage for user data

**Mitigations:**
1. **TTL indexes:** Auto-delete expired refresh tokens
2. **Bounded arrays:** Limit response arrays by question count
3. **Selective embedding:** Only embed frequently accessed data
4. **Monitor usage:** Set up Atlas alerts at 80% capacity

### 11.3 Vercel Serverless Limits

**Problem:** 10-second timeout on Hobby plan

**Mitigations:**
1. **Client-side fetching:** Use React Query/SWR
2. **Minimal API routes:** Only for auth cookies
3. **Edge functions:** Use for simple operations

---

## 12. Environment Variables

### Frontend (`apps/web/.env.local`)

```env
NEXT_PUBLIC_API_URL=https://skillsphere-api.onrender.com
NEXT_PUBLIC_APP_NAME=SkillSphere
```

### Backend (`apps/api/.env`)

```env
NODE_ENV=development
PORT=4000

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/skillsphere

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# ML Service
ML_SERVICE_URL=https://skillsphere-ml.onrender.com
ML_SERVICE_API_KEY=your-ml-api-key

# CORS
CORS_ORIGIN=https://skillsphere.vercel.app
```

### ML Service (`services/ml/.env`)

```env
ENVIRONMENT=development
API_KEY=your-ml-api-key
BASE_URL=https://skillsphere-ml.onrender.com
LOG_LEVEL=info
```

---

## 13. Verification & Testing

### After Phase 1: Auth Working

```bash
# Start all services
pnpm dev

# Test registration
curl -X POST http://localhost:4000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","firstName":"Test","lastName":"User"}'

# Test login
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Access dashboard in browser: http://localhost:3000/dashboard
```

### After Phase 2: Assessment Working

```bash
# Seed database
pnpm --filter api seed

# List assessments (with JWT token)
curl http://localhost:4000/api/v1/assessments \
  -H "Authorization: Bearer <token>"

# Submit assessment
curl -X POST http://localhost:4000/api/v1/assessments/123/submit \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"responses":[...]}'
```

### After Phase 3: ML Service Working

```bash
# Start ML service
cd services/ml && uvicorn app.main:app --reload --port 8000

# Test health
curl http://localhost:8000/api/v1/health

# Test scoring
curl -X POST http://localhost:8000/api/v1/score_profile \
  -H "X-API-Key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"assessment_type":"personality","responses":[...]}'
```

### After Phase 4: Full Flow

1. Register new user
2. Take personality assessment
3. View results with charts
4. Explore career recommendations
5. Check skill gap analysis

### After Phase 5: Production

1. Deploy all services
2. Test full flow in production
3. Monitor error rates
4. Check cold start times
5. Verify rate limiting

---

## Next Steps

Once this plan is approved, implementation will proceed in the following order:

1. Create monorepo structure and configuration files
2. Set up Express.js backend with auth
3. Set up Next.js frontend with auth pages
4. Connect to MongoDB Atlas
5. Deploy initial version
6. Continue with subsequent phases

Ready to begin implementation upon approval.
