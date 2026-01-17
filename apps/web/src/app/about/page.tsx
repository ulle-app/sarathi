'use client';

import Link from 'next/link';
import { 
  Brain, 
  ArrowRight, 
  Shield, 
  Lock, 
  Eye, 
  Database,
  CheckCircle2,
  AlertTriangle,
  Info,
  BookOpen,
  Target,
  BarChart3,
  Users,
  Lightbulb,
  GraduationCap,
  Briefcase,
  ChevronRight,
  FileText,
  UserCheck,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useState } from 'react';

// Walkthrough step component
function WalkthroughStep({ 
  step, 
  title, 
  description, 
  details,
  isActive,
  onClick 
}: { 
  step: number;
  title: string;
  description: string;
  details: string[];
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <div 
      className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
        isActive 
          ? 'border-primary-500 bg-primary-50 shadow-md' 
          : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
          isActive ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'
        }`}>
          {step}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold">{title}</h4>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          {isActive && (
            <ul className="mt-3 space-y-2">
              {details.map((detail, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AboutPage() {
  const [activeStep, setActiveStep] = useState(1);

  const walkthroughSteps = [
    {
      step: 1,
      title: 'Create Your Account',
      description: 'Sign up and tell us about your academic level',
      details: [
        'Choose your current stage: Grade 10, Grade 12, Undergraduate, Post-Graduate, or Professional',
        'Your academic level helps us tailor assessments and recommendations to your life stage',
        'All information is encrypted and stored securely',
      ],
    },
    {
      step: 2,
      title: 'Take Personality Assessment (Big Five)',
      description: '60 questions measuring 5 personality dimensions',
      details: [
        'Questions are based on validated IPIP (International Personality Item Pool) research',
        'Measures: Openness, Conscientiousness, Extraversion, Agreeableness, Emotional Stability',
        'Each dimension has 6 facets for detailed insights (30 total facets)',
        'Takes about 15 minutes to complete',
      ],
    },
    {
      step: 3,
      title: 'Take Career Interest Inventory (RIASEC)',
      description: '48 questions identifying your Holland Code',
      details: [
        'Based on Holland\'s vocational theory used by career counselors worldwide',
        'Identifies your interests across 6 types: Realistic, Investigative, Artistic, Social, Enterprising, Conventional',
        'Generates a 3-letter Holland Code (e.g., "RIA" for Realistic-Investigative-Artistic)',
        'Matches you to career families that align with your interests',
      ],
    },
    {
      step: 4,
      title: 'Complete Skills & Values Assessments',
      description: 'Evaluate your skills and understand what matters to you',
      details: [
        'Skills Assessment: 48 questions across 8 skill domains',
        'Work Values Assessment: 40 questions identifying your career priorities',
        'Helps identify strengths to leverage and areas to develop',
        'Values alignment is crucial for long-term career satisfaction',
      ],
    },
    {
      step: 5,
      title: 'Receive AI-Powered Results',
      description: 'Get comprehensive insights and career matches',
      details: [
        'Scores are normalized and compared against peers at your academic level',
        'Multi-factor career matching using personality, interests, skills, and values',
        'Life-stage specific recommendations (e.g., stream selection for Grade 10, career pivots for professionals)',
        'Actionable next steps with timelines and resources',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">SkillSphere</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">
                Get Started
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="border-b bg-gradient-to-b from-primary-50 to-background py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Badge variant="secondary" className="mb-4">
            <Info className="mr-1.5 h-3.5 w-3.5" />
            About SkillSphere
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            How SkillSphere Works
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Understand our scientific approach to career guidance, how we score your assessments, 
            and how we keep your data safe and private.
          </p>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="border-b py-6">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a href="#overview" className="text-sm text-muted-foreground hover:text-primary-600">Overview</a>
            <span className="text-gray-300">•</span>
            <a href="#walkthrough" className="text-sm text-muted-foreground hover:text-primary-600">Walkthrough</a>
            <span className="text-gray-300">•</span>
            <a href="#scoring" className="text-sm text-muted-foreground hover:text-primary-600">Scoring System</a>
            <span className="text-gray-300">•</span>
            <a href="#privacy" className="text-sm text-muted-foreground hover:text-primary-600">Privacy & Security</a>
            <span className="text-gray-300">•</span>
            <a href="#disclaimer" className="text-sm text-muted-foreground hover:text-primary-600">Disclaimer</a>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section id="overview" className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold">What is SkillSphere?</h2>
          </div>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-lg text-muted-foreground">
              SkillSphere is an AI-powered career guidance platform that uses scientifically validated 
              psychometric assessments to help you discover career paths aligned with your personality, 
              interests, skills, and values.
            </p>
            
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    <CardTitle className="text-lg">Personality (Big Five)</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Measures 5 core personality dimensions with 30 facets. Based on decades of 
                    psychological research and used by Fortune 500 companies worldwide.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-green-600" />
                    <CardTitle className="text-lg">Interests (RIASEC)</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Holland's RIASEC model identifies your vocational personality type. Used by 
                    career counselors, O*NET, and the U.S. Department of Labor.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-orange-600" />
                    <CardTitle className="text-lg">Skills Assessment</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Evaluate your competencies across 8 skill domains including communication, 
                    analytical thinking, leadership, and adaptability.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-pink-600" />
                    <CardTitle className="text-lg">Work Values</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Identify what matters most to you: achievement, independence, recognition, 
                    work-life balance, compensation, or making a difference.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Walkthrough Section */}
      <section id="walkthrough" className="border-t bg-muted/30 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
              <Lightbulb className="h-5 w-5 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold">Step-by-Step Walkthrough</h2>
          </div>
          
          <p className="text-muted-foreground mb-8">
            Click on each step to learn more about what happens at each stage of your journey.
          </p>

          <div className="space-y-4">
            {walkthroughSteps.map((stepData) => (
              <WalkthroughStep
                key={stepData.step}
                {...stepData}
                isActive={activeStep === stepData.step}
                onClick={() => setActiveStep(stepData.step)}
              />
            ))}
          </div>

          {/* Visual Journey */}
          <div className="mt-12 rounded-xl border bg-white p-6">
            <h3 className="text-lg font-semibold mb-4">Your Journey at a Glance</h3>
            <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
              <div className="flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2">
                <UserCheck className="h-4 w-4 text-blue-600" />
                <span>Sign Up</span>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400 hidden sm:block" />
              <div className="flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2">
                <Brain className="h-4 w-4 text-purple-600" />
                <span>Personality</span>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400 hidden sm:block" />
              <div className="flex items-center gap-2 rounded-full bg-green-100 px-4 py-2">
                <Target className="h-4 w-4 text-green-600" />
                <span>Interests</span>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400 hidden sm:block" />
              <div className="flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2">
                <BarChart3 className="h-4 w-4 text-orange-600" />
                <span>Skills</span>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400 hidden sm:block" />
              <div className="flex items-center gap-2 rounded-full bg-pink-100 px-4 py-2">
                <Sparkles className="h-4 w-4 text-pink-600" />
                <span>Results</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scoring System Section */}
      <section id="scoring" className="border-t py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
              <BarChart3 className="h-5 w-5 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold">How Scoring Works</h2>
          </div>

          <div className="space-y-8">
            {/* Big Five Scoring */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  Big Five Personality Scoring
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Each question is answered on a 1-5 Likert scale (Strongly Disagree to Strongly Agree). 
                  Some questions are reverse-scored to ensure validity.
                </p>
                
                <div className="rounded-lg bg-gray-50 p-4">
                  <h4 className="font-medium mb-3">Scoring Example:</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Question:</strong> "I have a vivid imagination."</p>
                    <p><strong>Your Answer:</strong> 4 (Agree)</p>
                    <p><strong>Dimension:</strong> Openness → Fantasy facet</p>
                    <p><strong>Calculation:</strong> Score contributes to your Openness dimension average</p>
                  </div>
                </div>

                <div className="rounded-lg bg-gray-50 p-4">
                  <h4 className="font-medium mb-3">Normalization Process:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Raw scores (1-5) are averaged per dimension</li>
                    <li>Averages are converted to 0-100 scale</li>
                    <li>Scores are compared against norms for your academic level</li>
                    <li>Percentiles show where you stand compared to peers</li>
                  </ol>
                </div>

                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <h4 className="font-medium text-blue-800 mb-2">Life-Stage Norms</h4>
                  <p className="text-sm text-blue-700">
                    A Grade 10 student and a professional have different norm tables. This means 
                    your percentile is calculated against people at your same life stage, making 
                    comparisons more meaningful.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* RIASEC Scoring */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-600" />
                  Holland Code (RIASEC) Scoring
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Your responses are tallied for each of the 6 RIASEC dimensions. The top 3 dimensions 
                  form your Holland Code.
                </p>
                
                <div className="rounded-lg bg-gray-50 p-4">
                  <h4 className="font-medium mb-3">Example Holland Code Generation:</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm mb-4">
                    <div className="rounded bg-white p-2 text-center">
                      <div className="font-bold text-green-600">R: 72</div>
                      <div className="text-xs text-muted-foreground">Realistic</div>
                    </div>
                    <div className="rounded bg-white p-2 text-center">
                      <div className="font-bold text-blue-600">I: 85</div>
                      <div className="text-xs text-muted-foreground">Investigative</div>
                    </div>
                    <div className="rounded bg-white p-2 text-center">
                      <div className="font-bold text-purple-600">A: 78</div>
                      <div className="text-xs text-muted-foreground">Artistic</div>
                    </div>
                    <div className="rounded bg-white p-2 text-center">
                      <div className="text-gray-600">S: 45</div>
                      <div className="text-xs text-muted-foreground">Social</div>
                    </div>
                    <div className="rounded bg-white p-2 text-center">
                      <div className="text-gray-600">E: 52</div>
                      <div className="text-xs text-muted-foreground">Enterprising</div>
                    </div>
                    <div className="rounded bg-white p-2 text-center">
                      <div className="text-gray-600">C: 38</div>
                      <div className="text-xs text-muted-foreground">Conventional</div>
                    </div>
                  </div>
                  <p className="text-sm">
                    <strong>Result:</strong> Holland Code = <span className="font-mono bg-primary-100 px-2 py-1 rounded">IAR</span> 
                    (Investigative-Artistic-Realistic)
                  </p>
                </div>

                <p className="text-sm text-muted-foreground">
                  Your Holland Code is matched against career families. "IAR" types often thrive in 
                  careers like Architecture, Scientific Illustration, or Technical Writing.
                </p>
              </CardContent>
            </Card>

            {/* Career Matching */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-orange-600" />
                  Multi-Factor Career Matching
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Career matches are calculated using a weighted combination of all your assessment results:
                </p>
                
                <div className="rounded-lg bg-gray-50 p-4">
                  <h4 className="font-medium mb-3">Matching Formula:</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Personality Fit</span>
                      <span className="font-mono text-sm bg-purple-100 px-2 py-1 rounded">30%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Holland Code Alignment</span>
                      <span className="font-mono text-sm bg-green-100 px-2 py-1 rounded">25%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Skills Match</span>
                      <span className="font-mono text-sm bg-orange-100 px-2 py-1 rounded">25%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Values Alignment</span>
                      <span className="font-mono text-sm bg-pink-100 px-2 py-1 rounded">20%</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">
                  Each career has ideal ranges for personality dimensions, compatible Holland codes, 
                  required skills, and value alignments. Your match score shows how well you fit.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Privacy & Security Section */}
      <section id="privacy" className="border-t bg-muted/30 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
              <Shield className="h-5 w-5 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold">Privacy & Data Security</h2>
          </div>

          <div className="rounded-xl border border-green-200 bg-green-50 p-6 mb-8">
            <div className="flex items-start gap-3">
              <Lock className="h-6 w-6 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-green-800">Your Data is Protected</h3>
                <p className="mt-1 text-green-700">
                  We take your privacy seriously. All personal data and assessment results are 
                  encrypted and stored securely. No one—not even our team—can access your 
                  individual responses without proper authorization.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg">Encryption at Rest</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  All personal data stored in our database is encrypted using industry-standard 
                  AES-256 encryption. Even if someone gains access to the database, they cannot 
                  read your information without the encryption keys.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg">Encryption in Transit</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  All data transmitted between your browser and our servers is encrypted using 
                  TLS 1.3. This prevents anyone from intercepting your data while it travels 
                  over the internet.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg">No Third-Party Sharing</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  We do not sell, share, or provide your personal data or assessment results 
                  to any third parties. Your results are yours alone.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg">Data Minimization</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  We only collect data necessary to provide our services. You can request 
                  deletion of your account and all associated data at any time.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 rounded-lg border p-4">
            <h3 className="font-semibold mb-3">What Data We Collect:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />
                <span><strong>Account Info:</strong> Email, name (encrypted), academic level</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />
                <span><strong>Assessment Responses:</strong> Your answers to questions (encrypted)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />
                <span><strong>Results:</strong> Calculated scores and career matches (encrypted)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />
                <span><strong>Usage Data:</strong> Anonymous analytics to improve our service</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Disclaimer Section */}
      <section id="disclaimer" className="border-t py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold">Important Disclaimers</h2>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-6">
              <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                This is Not Professional Career Counseling
              </h3>
              <p className="text-amber-700">
                SkillSphere is a tool designed to provide insights and suggestions based on 
                psychometric assessments. It is <strong>not a substitute</strong> for professional 
                career counseling, therapy, or medical advice. The recommendations provided are 
                based on statistical models and may not account for your unique circumstances, 
                opportunities, or constraints.
              </p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3">Please Understand:</h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold">1</div>
                    <span>
                      <strong>Results are indicative, not definitive.</strong> Your assessment results 
                      suggest tendencies and preferences, but humans are complex. Use these insights 
                      as a starting point for exploration, not as absolute truths.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold">2</div>
                    <span>
                      <strong>AI has limitations.</strong> Our machine learning models are trained on 
                      available data and may have biases. Career success depends on many factors 
                      including effort, opportunity, networking, and sometimes luck—none of which 
                      can be fully captured by an assessment.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold">3</div>
                    <span>
                      <strong>Seek professional guidance for major decisions.</strong> Before making 
                      significant life choices (choosing a college major, changing careers, etc.), 
                      we strongly recommend consulting with qualified career counselors, academic 
                      advisors, or mentors in your field of interest.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold">4</div>
                    <span>
                      <strong>Local context matters.</strong> Career opportunities vary by region, 
                      industry, and economic conditions. Our recommendations are general and may 
                      not reflect the specific job market in your area.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold">5</div>
                    <span>
                      <strong>You can change.</strong> Personality and interests can evolve over time. 
                      Don't feel locked into a career path based on a single assessment. Retake 
                      assessments periodically to see how you've grown.
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <div className="rounded-lg border p-4 bg-gray-50">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <FileText className="h-5 w-5 text-gray-600" />
                References & Scientific Basis
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Our assessments are based on established psychological research:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Big Five Model:</strong> Costa & McCrae (1992), Goldberg (1993)</li>
                <li>• <strong>IPIP Items:</strong> International Personality Item Pool (ipip.ori.org)</li>
                <li>• <strong>Holland Codes:</strong> Holland, J.L. "Making Vocational Choices" (1997)</li>
                <li>• <strong>Work Values:</strong> Super's Work Values Inventory framework</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-primary-600 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white">Ready to Discover Your Path?</h2>
          <p className="mt-4 text-lg text-primary-100">
            Take the first step towards understanding yourself better and finding a career that fits.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/register">
              <Button size="lg" variant="secondary" className="min-w-[200px]">
                Start Free Assessment
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/">
              <Button size="lg" variant="outline" className="min-w-[200px] border-white text-white hover:bg-white/10">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary-600" />
              <span className="font-semibold">SkillSphere</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="/about" className="hover:text-primary-600">About</Link>
              <Link href="/privacy" className="hover:text-primary-600">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-primary-600">Terms of Service</Link>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} SkillSphere
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
