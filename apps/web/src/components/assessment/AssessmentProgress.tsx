'use client';

import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface AssessmentProgressProps {
  currentIndex: number;
  totalQuestions: number;
  answeredQuestions: Set<string>;
  questionIds: string[];
  onQuestionClick?: (index: number) => void;
}

export function AssessmentProgress({
  currentIndex,
  totalQuestions,
  answeredQuestions,
  questionIds,
  onQuestionClick,
}: AssessmentProgressProps) {
  const progress = (answeredQuestions.size / totalQuestions) * 100;

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-400">Progress</span>
          <span className="font-medium text-slate-900 dark:text-white">
            {answeredQuestions.size} / {totalQuestions}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
          <div
            className="h-full rounded-full bg-primary-600 transition-all duration-300 ease-in-out dark:bg-primary-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question dots/numbers for navigation */}
      {totalQuestions <= 30 && (
        <div className="flex flex-wrap gap-2">
          {questionIds.map((id, index) => {
            const isAnswered = answeredQuestions.has(id);
            const isCurrent = index === currentIndex;

            return (
              <button
                key={id}
                type="button"
                onClick={() => onQuestionClick?.(index)}
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all',
                  isCurrent
                    ? 'ring-2 ring-primary-600 ring-offset-2 dark:ring-primary-500 dark:ring-offset-slate-900'
                    : '',
                  isAnswered
                    ? 'bg-primary-600 text-white dark:bg-primary-500'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                )}
              >
                {isAnswered ? <Check className="h-4 w-4" /> : index + 1}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
