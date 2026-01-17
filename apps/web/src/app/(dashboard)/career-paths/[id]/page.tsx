'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Loader2,
  AlertCircle,
  ArrowLeft,
  TrendingUp,
  DollarSign,
  BookOpen,
  Award,
  FileText,
  ExternalLink,
  Users,
} from 'lucide-react';
import { careerApi } from '@/lib/api';
import { Career, CareerSummary, SkillGapAnalysis } from '@/types/career';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { CareerCard, SkillGapDisplay } from '@/components/career';

export default function CareerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const careerId = params.id as string;

  const [career, setCareer] = useState<Career | null>(null);
  const [skillGap, setSkillGap] = useState<SkillGapAnalysis | null>(null);
  const [relatedCareers, setRelatedCareers] = useState<CareerSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSkillGap, setIsLoadingSkillGap] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCareer = async () => {
      try {
        const [careerData, relatedData] = await Promise.all([
          careerApi.getById(careerId),
          careerApi.getRelated(careerId),
        ]);
        setCareer(careerData);
        setRelatedCareers(relatedData);
        setIsLoading(false);

        // Fetch skill gap separately (may fail if user hasn't completed assessments)
        setIsLoadingSkillGap(true);
        try {
          const gapData = await careerApi.getSkillGap(careerId);
          setSkillGap(gapData);
        } catch {
          // Ignore skill gap errors
        } finally {
          setIsLoadingSkillGap(false);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load career');
        setIsLoading(false);
      }
    };

    fetchCareer();
  }, [careerId]);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error || !career) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <h2 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">
          Unable to Load Career
        </h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          {error || 'Career not found'}
        </p>
        <Button className="mt-4" onClick={() => router.push('/career-paths')}>
          Back to Careers
        </Button>
      </div>
    );
  }

  const getGrowthBadge = (outlook: string) => {
    switch (outlook) {
      case 'high':
        return <Badge variant="success">High Growth</Badge>;
      case 'low':
        return <Badge variant="danger">Low Growth</Badge>;
      default:
        return <Badge variant="warning">Stable Growth</Badge>;
    }
  };

  const formatSalary = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/career-paths"
          className="mb-4 inline-flex items-center text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Careers
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {career.title}
            </h1>
            <div className="mt-2 flex items-center gap-3">
              <Badge>{career.category}</Badge>
              {getGrowthBadge(career.growthOutlook)}
            </div>
          </div>
        </div>
        <p className="mt-4 text-slate-600 dark:text-slate-400">{career.description}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Required Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary-600" />
                Required Skills
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {career.requiredSkills.map((skill, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900 dark:text-white">
                        {skill.skill}
                      </span>
                      <Badge
                        variant={
                          skill.importance === 'required'
                            ? 'danger'
                            : skill.importance === 'preferred'
                            ? 'warning'
                            : 'default'
                        }
                      >
                        {skill.importance.replace('_', ' ')}
                      </Badge>
                    </div>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      Level {skill.proficiencyLevel}/5
                    </span>
                  </div>
                  <Progress value={(skill.proficiencyLevel / 5) * 100} />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Skill Gap Analysis */}
          {isLoadingSkillGap ? (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
                <span className="ml-2 text-slate-500">Analyzing your skills...</span>
              </CardContent>
            </Card>
          ) : skillGap ? (
            <SkillGapDisplay skillGap={skillGap} />
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <Users className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" />
                <p className="mt-4 text-slate-600 dark:text-slate-400">
                  Complete an assessment to see your skill gap analysis for this career.
                </p>
                <Link href="/assessment" className="mt-4 inline-block">
                  <Button>Take an Assessment</Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Resources */}
          {career.resources.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                  Learning Resources
                </CardTitle>
                <CardDescription>
                  Courses, certifications, and articles to help you prepare
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {career.resources.map((resource, index) => (
                    <a
                      key={index}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-lg border border-slate-200 p-3 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                    >
                      <div className="flex items-center gap-3">
                        {resource.type === 'course' && (
                          <BookOpen className="h-5 w-5 text-blue-500" />
                        )}
                        {resource.type === 'certification' && (
                          <Award className="h-5 w-5 text-green-500" />
                        )}
                        {resource.type === 'article' && (
                          <FileText className="h-5 w-5 text-orange-500" />
                        )}
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {resource.title}
                          </p>
                          <p className="text-xs capitalize text-slate-500 dark:text-slate-400">
                            {resource.type}
                          </p>
                        </div>
                      </div>
                      <ExternalLink className="h-4 w-4 text-slate-400" />
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Salary Range */}
          {career.salaryRange && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  Salary Range
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {formatSalary(career.salaryRange.min, career.salaryRange.currency)} -{' '}
                  {formatSalary(career.salaryRange.max, career.salaryRange.currency)}
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Annual salary ({career.salaryRange.currency})
                </p>
              </CardContent>
            </Card>
          )}

          {/* Growth Outlook */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-5 w-5 text-primary-600" />
                Growth Outlook
              </CardTitle>
            </CardHeader>
            <CardContent>
              {getGrowthBadge(career.growthOutlook)}
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                {career.growthOutlook === 'high' &&
                  'This career field is experiencing rapid growth with increasing demand.'}
                {career.growthOutlook === 'medium' &&
                  'This career field has stable growth with consistent demand.'}
                {career.growthOutlook === 'low' &&
                  'This career field may have limited growth opportunities.'}
              </p>
            </CardContent>
          </Card>

          {/* Related Careers */}
          {relatedCareers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Related Careers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {relatedCareers.map((related) => (
                    <Link
                      key={related.id}
                      href={`/career-paths/${related.id}`}
                      className="block rounded-lg border border-slate-200 p-3 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                    >
                      <p className="font-medium text-slate-900 dark:text-white">
                        {related.title}
                      </p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {related.category}
                      </p>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
