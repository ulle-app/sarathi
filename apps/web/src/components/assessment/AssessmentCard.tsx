'use client';

import Link from 'next/link';
import { Clock, FileQuestion, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AssessmentSummary } from '@/types/assessment';

interface AssessmentCardProps {
  assessment: AssessmentSummary;
}

const typeColors: Record<string, 'default' | 'success' | 'warning' | 'info'> = {
  personality: 'info',
  aptitude: 'success',
  interest: 'warning',
  skill: 'default',
};

export function AssessmentCard({ assessment }: AssessmentCardProps) {
  return (
    <Card className="flex flex-col transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between">
          <Badge variant={typeColors[assessment.type] || 'default'}>
            {assessment.type.charAt(0).toUpperCase() + assessment.type.slice(1)}
          </Badge>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {assessment.category}
          </span>
        </div>
        <CardTitle className="mt-2">{assessment.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {assessment.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{assessment.estimatedMinutes} min</span>
          </div>
          <div className="flex items-center gap-1">
            <FileQuestion className="h-4 w-4" />
            <span>{assessment.questionCount} questions</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/assessment/${assessment.id}`} className="w-full">
          <Button className="w-full group">
            Start Assessment
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
