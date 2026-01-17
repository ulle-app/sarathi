'use client';

import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { Badge } from '@/components/ui/Badge';
import { SkillGapAnalysis } from '@/types/career';

interface SkillGapDisplayProps {
  skillGap: SkillGapAnalysis;
}

export function SkillGapDisplay({ skillGap }: SkillGapDisplayProps) {
  const gapPercentage = Math.round(skillGap.gapScore * 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skill Gap Analysis</CardTitle>
        <CardDescription>
          Your skills compared to requirements for {skillGap.career.title}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Match */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">Skill Match</span>
            <span className="font-medium text-slate-900 dark:text-white">
              {gapPercentage}%
            </span>
          </div>
          <Progress value={gapPercentage} />
        </div>

        {/* Matching Skills */}
        {skillGap.matchingSkills.length > 0 && (
          <div>
            <h4 className="mb-2 flex items-center gap-2 font-medium text-slate-900 dark:text-white">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Skills You Have
            </h4>
            <div className="flex flex-wrap gap-2">
              {skillGap.matchingSkills.map((skill, index) => (
                <Badge key={index} variant="success">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Missing Skills */}
        {skillGap.missingSkills.length > 0 && (
          <div>
            <h4 className="mb-2 flex items-center gap-2 font-medium text-slate-900 dark:text-white">
              <XCircle className="h-4 w-4 text-red-500" />
              Skills to Develop
            </h4>
            <div className="flex flex-wrap gap-2">
              {skillGap.missingSkills.map((skill, index) => (
                <Badge key={index} variant="danger">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {skillGap.recommendations.length > 0 && (
          <div>
            <h4 className="mb-2 font-medium text-slate-900 dark:text-white">
              Recommendations
            </h4>
            <ul className="space-y-2">
              {skillGap.recommendations.map((rec, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400"
                >
                  <ArrowRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-600" />
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
