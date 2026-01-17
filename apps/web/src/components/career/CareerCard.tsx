'use client';

import Link from 'next/link';
import { ArrowRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CareerSummary } from '@/types/career';

interface CareerCardProps {
  career: CareerSummary;
  matchScore?: number;
}

const getGrowthIcon = (outlook: string) => {
  switch (outlook) {
    case 'high':
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    case 'low':
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    default:
      return <Minus className="h-4 w-4 text-yellow-500" />;
  }
};

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

export function CareerCard({ career, matchScore }: CareerCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden shadow-sm hover:shadow-md transition-all">
      <CardHeader className="bg-slate-50 dark:bg-slate-900 p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getGrowthBadge(career.growthOutlook)}
            <span className="text-sm text-slate-500 dark:text-slate-400">{career.category}</span>
          </div>
          {matchScore !== undefined && (
            <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
              {Math.round(matchScore * 100)}% match
            </span>
          )}
        </div>
        <CardTitle className="mt-2 text-lg">{career.title}</CardTitle>
        <CardDescription className="mt-1 text-sm line-clamp-2 text-slate-600 dark:text-slate-400">{career.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="mt-2 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-slate-100 px-2 py-1 text-xs dark:bg-slate-700">{career.requiredSkillsCount} skills</div>
            <div className="flex items-center gap-1">{getGrowthIcon(career.growthOutlook)}<span className="text-xs">Outlook</span></div>
          </div>
        </div>
      </CardContent>
      <div className="p-4 pt-0">
        <Link href={`/career-paths/${career.id}`}>
          <Button variant="outline" className="w-full group">
            View Details
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}
