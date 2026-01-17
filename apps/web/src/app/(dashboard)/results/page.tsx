'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { BarChart3, Loader2, Calendar, ArrowRight, CheckCircle, Clock } from 'lucide-react';
import { useAssessmentStore } from '@/stores/assessmentStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function ResultsListPage() {
  const { results, isLoadingResults, error, fetchResults } = useAssessmentStore();

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'scored':
        return <Badge variant="info">Scored</Badge>;
      case 'in_progress':
        return <Badge variant="warning">In Progress</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Results</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          View your assessment results and personalized insights
        </p>
      </div>

      {/* Loading state */}
      {isLoadingResults && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Empty state */}
      {!isLoadingResults && !error && results.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <BarChart3 className="h-16 w-16 text-slate-300 dark:text-slate-600" />
          <h2 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">
            No Results Yet
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Complete an assessment to see your results here
          </p>
          <Link href="/assessment" className="mt-4">
            <Button>Browse Assessments</Button>
          </Link>
        </div>
      )}

      {/* Results list */}
      {!isLoadingResults && !error && results.length > 0 && (
        <div className="grid gap-4">
          {results.map((result) => (
            <Card key={result.id} className="transition-shadow hover:shadow-md">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-lg">Assessment Result</CardTitle>
                  <CardDescription className="mt-1">
                    ID: {result.assessmentId.slice(0, 8)}...
                  </CardDescription>
                </div>
                {getStatusBadge(result.status)}
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Started: {formatDate(result.createdAt)}</span>
                  </div>
                  {result.completedAt && (
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Completed: {formatDate(result.completedAt)}</span>
                    </div>
                  )}
                  {result.status === 'in_progress' && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-yellow-500" />
                      <span>{result.responses.length} questions answered</span>
                    </div>
                  )}
                </div>

                {/* Show score preview if available */}
                {result.scores?.overall !== undefined && (
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      Overall Score:
                    </span>
                    <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                      {Math.round(result.scores.overall)}%
                    </span>
                  </div>
                )}

                <div className="mt-4 flex justify-end">
                  {result.status === 'in_progress' ? (
                    <Link href={`/assessment/${result.assessmentId}`}>
                      <Button size="sm" variant="outline">
                        Continue Assessment
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  ) : (
                    <Link href={`/results/${result.id}`}>
                      <Button size="sm">
                        View Details
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
