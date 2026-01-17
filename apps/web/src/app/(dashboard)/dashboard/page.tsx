'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui';
import { resultsApi, careerApi, assessmentApi } from '@/lib/api';
import { AssessmentResult } from '@/types/assessment';
import { CareerRecommendation } from '@/types/career';
import {
  ClipboardList,
  BarChart3,
  Compass,
  ArrowRight,
  TrendingUp,
  Target,
  Award,
  Loader2,
  Calendar,
  CheckCircle,
} from 'lucide-react';

interface DashboardStats {
  completedAssessments: number;
  skillsIdentified: number;
  careerMatches: number;
  overallProgress: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    completedAssessments: 0,
    skillsIdentified: 0,
    careerMatches: 0,
    overallProgress: 0,
  });
  const [recentResults, setRecentResults] = useState<AssessmentResult[]>([]);
  const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalAssessments, setTotalAssessments] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch data in parallel
        const [resultsData, assessmentsData] = await Promise.all([
          resultsApi.getAll().catch(() => []),
          assessmentApi.getAll().catch(() => []),
        ]);

        setTotalAssessments(assessmentsData.length);
        setRecentResults(resultsData.slice(0, 3));

        // Calculate stats from results
        const completedAssessments = resultsData.length;

        // Extract unique skills from all results
        const allSkills = new Set<string>();
        resultsData.forEach((result: AssessmentResult) => {
          if (result.scores) {
            Object.keys(result.scores).forEach(skill => allSkills.add(skill));
          }
        });
        const skillsIdentified = allSkills.size;

        // Fetch career recommendations
        let careerMatches = 0;
        try {
          const recsData = await careerApi.getRecommendations();
          setRecommendations(recsData);
          careerMatches = recsData.length;
        } catch {
          // User may not have recommendations yet
        }

        // Calculate progress (completed assessments / total assessments)
        const progress = assessmentsData.length > 0
          ? Math.round((completedAssessments / assessmentsData.length) * 100)
          : 0;

        setStats({
          completedAssessments,
          skillsIdentified,
          careerMatches,
          overallProgress: progress,
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
          Welcome back, {user?.profile.firstName}!
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Continue your career journey and discover new insights.
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/30">
              <ClipboardList className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Assessments
              </p>
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
              ) : (
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {stats.completedAssessments}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/30">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Skills Identified
              </p>
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
              ) : (
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {stats.skillsIdentified}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary-100 dark:bg-secondary-900/30">
              <Target className="h-6 w-6 text-secondary-600 dark:text-secondary-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Career Matches
              </p>
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
              ) : (
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {stats.careerMatches}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
              <Award className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Progress
              </p>
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
              ) : (
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {stats.overallProgress}%
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Get started / Continue card */}
        <div className="card">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            {stats.completedAssessments > 0 ? 'Continue Your Journey' : 'Get Started'}
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            {stats.completedAssessments > 0
              ? `You've completed ${stats.completedAssessments} of ${totalAssessments} assessments. Keep going to unlock more insights!`
              : 'Take your first psychometric assessment to discover your personality traits and career matches.'}
          </p>
          <Link href="/assessment">
            <Button className="mt-4" size="lg">
              {stats.completedAssessments > 0 ? 'Continue Assessments' : 'Start Assessment'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Recent activity card */}
        <div className="card">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Recent Activity
          </h2>
          {isLoading ? (
            <div className="mt-4 flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
          ) : recentResults.length > 0 ? (
            <div className="mt-4 space-y-3">
              {recentResults.map((result) => (
                <Link
                  key={result.id}
                  href={`/results/${result.id}`}
                  className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 dark:text-white">
                      {result.assessment?.title || 'Assessment'}
                    </p>
                    <p className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                      <Calendar className="h-3 w-3" />
                      {formatDate(result.completedAt)}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-4 flex flex-col items-center justify-center py-8 text-center">
              <BarChart3 className="h-12 w-12 text-slate-300 dark:text-slate-600" />
              <p className="mt-3 text-slate-500 dark:text-slate-400">
                No activity yet
              </p>
              <p className="text-sm text-slate-400 dark:text-slate-500">
                Complete an assessment to see your results here
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Career recommendations or assessments */}
      {recommendations.length > 0 ? (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Top Career Matches
            </h2>
            <Link
              href="/career-paths"
              className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
            >
              View all
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recommendations.slice(0, 3).map((rec) => (
              <Link
                key={rec.career.id}
                href={`/career-paths/${rec.career.id}`}
                className="card hover:border-primary-300 hover:shadow-md dark:hover:border-primary-700"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-primary-100 px-2 py-1 text-xs font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
                    {Math.round(rec.matchScore * 100)}% Match
                  </span>
                </div>
                <h3 className="mt-3 font-semibold text-slate-900 dark:text-white">
                  {rec.career.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                  {rec.career.description}
                </p>
                <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                  {rec.career.category}
                </p>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Recommended Assessments
            </h2>
            <Link
              href="/assessment"
              className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
            >
              View all
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Personality assessment card */}
            <Link href="/assessment" className="card hover:border-primary-300 hover:shadow-md dark:hover:border-primary-700">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900/30">
                <Target className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
                Personality Assessment
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Discover your Big Five personality traits and understand your
                strengths.
              </p>
              <div className="mt-4 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <ClipboardList className="h-4 w-4" />
                <span>~15 minutes</span>
              </div>
            </Link>

            {/* Interest inventory card */}
            <Link href="/assessment" className="card hover:border-primary-300 hover:shadow-md dark:hover:border-primary-700">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                <Compass className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
                Interest Inventory
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Explore your career interests using the RIASEC model.
              </p>
              <div className="mt-4 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <ClipboardList className="h-4 w-4" />
                <span>~10 minutes</span>
              </div>
            </Link>

            {/* Skills assessment card */}
            <Link href="/assessment" className="card hover:border-primary-300 hover:shadow-md dark:hover:border-primary-700">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary-100 dark:bg-secondary-900/30">
                <BarChart3 className="h-5 w-5 text-secondary-600 dark:text-secondary-400" />
              </div>
              <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
                Skills Assessment
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Evaluate your technical and soft skills across key areas.
              </p>
              <div className="mt-4 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <ClipboardList className="h-4 w-4" />
                <span>~12 minutes</span>
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
