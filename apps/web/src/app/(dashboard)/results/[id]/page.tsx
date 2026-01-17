'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Loader2,
  AlertCircle,
  ArrowLeft,
  TrendingUp,
  Target,
  Lightbulb,
  Briefcase,
} from 'lucide-react';
import { resultsApi } from '@/lib/api';
import { AssessmentResult, Assessment, AssessmentInsights } from '@/types/assessment';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PersonalityBarChart, SkillRadarChart } from '@/components/charts';

export default function ResultDetailPage() {
  const params = useParams();
  const router = useRouter();
  const resultId = params.id as string;

  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [insights, setInsights] = useState<AssessmentInsights | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const data = await resultsApi.getById(resultId);
        setResult(data.result);
        setAssessment(data.assessment);
        setIsLoading(false);

        // Fetch insights separately
        if (data.result.status === 'completed' || data.result.status === 'scored') {
          setIsLoadingInsights(true);
          try {
            const insightsData = await resultsApi.getInsights(resultId);
            setInsights(insightsData.insights);
          } catch {
            console.error('Failed to fetch insights');
          } finally {
            setIsLoadingInsights(false);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load result');
        setIsLoading(false);
      }
    };

    fetchResult();
  }, [resultId]);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error || !result || !assessment) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <h2 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">
          Unable to Load Result
        </h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          {error || 'Result not found'}
        </p>
        <Button className="mt-4" onClick={() => router.push('/results')}>
          Back to Results
        </Button>
      </div>
    );
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/results"
            className="mb-2 inline-flex items-center text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Results
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {assessment.title}
          </h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            Completed on {formatDate(result.completedAt)}
          </p>
        </div>
        <Badge
          variant={result.status === 'scored' ? 'success' : 'info'}
          className="text-sm"
        >
          {result.status === 'scored' ? 'Analyzed' : 'Completed'}
        </Badge>
      </div>

      {/* Overall Score */}
      {result.scores?.overall !== undefined && (
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Overall Score
              </p>
              <p className="mt-1 text-4xl font-bold text-primary-600 dark:text-primary-400">
                {Math.round(result.scores.overall)}%
              </p>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30">
              <TrendingUp className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dimension Scores Chart */}
      {result.scores?.dimensions && Object.keys(result.scores.dimensions).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary-600" />
              Score Breakdown
            </CardTitle>
            <CardDescription>
              Your scores across different dimensions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {Object.keys(result.scores.dimensions).length <= 6 ? (
              <SkillRadarChart dimensions={result.scores.dimensions} />
            ) : (
              <PersonalityBarChart dimensions={result.scores.dimensions} />
            )}
          </CardContent>
        </Card>
      )}

      {/* Insights Section */}
      {(insights || isLoadingInsights) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              Personalized Insights
            </CardTitle>
            <CardDescription>
              Analysis and recommendations based on your results
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoadingInsights ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
                <span className="ml-2 text-slate-500">Generating insights...</span>
              </div>
            ) : (
              <>
                {/* Personality Type */}
                {insights?.personalityType && (
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white">
                      Personality Type
                    </h4>
                    <p className="mt-2 text-2xl font-bold text-primary-600 dark:text-primary-400">
                      {insights.personalityType}
                    </p>
                  </div>
                )}

                {/* Strengths */}
                {insights?.strengths && insights.strengths.length > 0 && (
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white">
                      Your Strengths
                    </h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {insights.strengths.map((strength, index) => (
                        <Badge key={index} variant="success">
                          {strength}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Development Areas */}
                {insights?.developmentAreas && insights.developmentAreas.length > 0 && (
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white">
                      Areas for Development
                    </h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {insights.developmentAreas.map((area, index) => (
                        <Badge key={index} variant="warning">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Career Suggestions */}
      {result.mlPredictions?.careerMatches &&
        result.mlPredictions.careerMatches.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-blue-500" />
                Career Matches
              </CardTitle>
              <CardDescription>
                Careers that align with your profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {result.mlPredictions.careerMatches.slice(0, 5).map((match, index) => (
                  <div
                    key={match.careerId}
                    className="flex items-center justify-between rounded-lg border border-slate-200 p-3 dark:border-slate-700"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-medium text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                        {index + 1}
                      </span>
                      <span className="font-medium text-slate-900 dark:text-white">
                        Career ID: {match.careerId.slice(0, 8)}...
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                        {Math.round(match.matchScore * 100)}%
                      </span>
                      <p className="text-xs text-slate-500">Match</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Link href="/career-paths">
                  <Button variant="outline" className="w-full">
                    Explore Career Paths
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

      {/* Actions */}
      <div className="flex gap-4">
        <Link href="/assessment" className="flex-1">
          <Button variant="outline" className="w-full">
            Take Another Assessment
          </Button>
        </Link>
        <Link href="/career-paths" className="flex-1">
          <Button className="w-full">Explore Career Paths</Button>
        </Link>
      </div>
    </div>
  );
}
