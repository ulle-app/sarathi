'use client';

import { cn } from '@/lib/utils';

interface LikertScaleProps {
  value: number | null;
  onChange: (value: number) => void;
  scale?: { min: number; max: number };
  labels?: string[];
}

const defaultLabels = [
  'Strongly Disagree',
  'Disagree',
  'Neutral',
  'Agree',
  'Strongly Agree',
];

export function LikertScale({
  value,
  onChange,
  scale = { min: 1, max: 5 },
  labels = defaultLabels,
}: LikertScaleProps) {
  const options = [];
  for (let i = scale.min; i <= scale.max; i++) {
    options.push(i);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between gap-2">
        {options.map((option, index) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={cn(
              'flex-1 flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all',
              value === option
                ? 'border-primary-600 bg-primary-50 dark:border-primary-500 dark:bg-primary-900/20'
                : 'border-slate-200 hover:border-slate-300 dark:border-slate-600 dark:hover:border-slate-500'
            )}
          >
            <span
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center font-medium transition-colors',
                value === option
                  ? 'bg-primary-600 text-white dark:bg-primary-500'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
              )}
            >
              {option}
            </span>
            <span className="text-xs text-center text-slate-600 dark:text-slate-400 hidden sm:block">
              {labels[index] || ''}
            </span>
          </button>
        ))}
      </div>
      <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 sm:hidden">
        <span>{labels[0]}</span>
        <span>{labels[labels.length - 1]}</span>
      </div>
    </div>
  );
}
