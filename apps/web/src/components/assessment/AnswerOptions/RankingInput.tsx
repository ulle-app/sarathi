'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { GripVertical, ArrowUp, ArrowDown } from 'lucide-react';

interface Option {
  value: string | number;
  label: string;
}

interface RankingInputProps {
  value: (string | number)[] | null;
  onChange: (value: (string | number)[]) => void;
  options: Option[];
}

export function RankingInput({ value, onChange, options }: RankingInputProps) {
  const [items, setItems] = useState<Option[]>(() => {
    if (value && value.length > 0) {
      // Sort options based on the ranking in value
      return value
        .map((v) => options.find((o) => o.value === v))
        .filter((o): o is Option => o !== undefined);
    }
    return options;
  });

  useEffect(() => {
    if (value && value.length > 0) {
      const sorted = value
        .map((v) => options.find((o) => o.value === v))
        .filter((o): o is Option => o !== undefined);
      setItems(sorted);
    }
  }, [value, options]);

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...items];
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= items.length) return;

    [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
    setItems(newItems);
    onChange(newItems.map((item) => item.value));
  };

  return (
    <div className="space-y-2">
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
        Rank the following in order of preference (1 = most preferred)
      </p>
      {items.map((item, index) => (
        <div
          key={item.value}
          className={cn(
            'flex items-center gap-3 p-3 rounded-lg border-2 bg-white dark:bg-slate-800',
            'border-slate-200 dark:border-slate-600'
          )}
        >
          <GripVertical className="h-5 w-5 text-slate-400 cursor-grab" />
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center font-medium text-primary-600 dark:text-primary-400">
            {index + 1}
          </span>
          <span className="flex-1 text-slate-700 dark:text-slate-200">{item.label}</span>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => moveItem(index, 'up')}
              disabled={index === 0}
              className={cn(
                'p-1 rounded transition-colors',
                index === 0
                  ? 'text-slate-300 dark:text-slate-600'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-700'
              )}
            >
              <ArrowUp className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => moveItem(index, 'down')}
              disabled={index === items.length - 1}
              className={cn(
                'p-1 rounded transition-colors',
                index === items.length - 1
                  ? 'text-slate-300 dark:text-slate-600'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-700'
              )}
            >
              <ArrowDown className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
