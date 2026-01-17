'use client';

import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface Option {
  value: string | number;
  label: string;
}

interface MultipleChoiceProps {
  value: string | number | null;
  onChange: (value: string | number) => void;
  options: Option[];
}

export function MultipleChoice({ value, onChange, options }: MultipleChoiceProps) {
  return (
    <div className="space-y-3">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            'w-full flex items-center gap-3 p-4 rounded-lg border-2 text-left transition-all',
            value === option.value
              ? 'border-primary-600 bg-primary-50 dark:border-primary-500 dark:bg-primary-900/20'
              : 'border-slate-200 hover:border-slate-300 dark:border-slate-600 dark:hover:border-slate-500'
          )}
        >
          <span
            className={cn(
              'flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors',
              value === option.value
                ? 'border-primary-600 bg-primary-600 dark:border-primary-500 dark:bg-primary-500'
                : 'border-slate-300 dark:border-slate-500'
            )}
          >
            {value === option.value && <Check className="h-4 w-4 text-white" />}
          </span>
          <span className="text-slate-700 dark:text-slate-200">{option.label}</span>
        </button>
      ))}
    </div>
  );
}
