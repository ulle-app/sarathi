'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SliderInputProps {
  value: number | null;
  onChange: (value: number) => void;
  scale?: { min: number; max: number; step: number };
  minLabel?: string;
  maxLabel?: string;
}

export function SliderInput({
  value,
  onChange,
  scale = { min: 1, max: 10, step: 1 },
  minLabel = 'Low',
  maxLabel = 'High',
}: SliderInputProps) {
  const [localValue, setLocalValue] = useState(value ?? Math.floor((scale.min + scale.max) / 2));

  useEffect(() => {
    if (value !== null) {
      setLocalValue(value);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    setLocalValue(newValue);
    onChange(newValue);
  };

  const percentage = ((localValue - scale.min) / (scale.max - scale.min)) * 100;

  return (
    <div className="space-y-4">
      <div className="relative pt-6 pb-2">
        <div
          className="absolute top-0 transform -translate-x-1/2 bg-primary-600 text-white px-2 py-1 rounded text-sm font-medium"
          style={{ left: `${percentage}%` }}
        >
          {localValue}
        </div>
        <input
          type="range"
          min={scale.min}
          max={scale.max}
          step={scale.step}
          value={localValue}
          onChange={handleChange}
          className={cn(
            'w-full h-2 rounded-lg appearance-none cursor-pointer',
            'bg-slate-200 dark:bg-slate-700',
            '[&::-webkit-slider-thumb]:appearance-none',
            '[&::-webkit-slider-thumb]:w-5',
            '[&::-webkit-slider-thumb]:h-5',
            '[&::-webkit-slider-thumb]:rounded-full',
            '[&::-webkit-slider-thumb]:bg-primary-600',
            '[&::-webkit-slider-thumb]:cursor-pointer',
            '[&::-webkit-slider-thumb]:shadow-md',
            '[&::-webkit-slider-thumb]:transition-transform',
            '[&::-webkit-slider-thumb]:hover:scale-110',
            '[&::-moz-range-thumb]:w-5',
            '[&::-moz-range-thumb]:h-5',
            '[&::-moz-range-thumb]:rounded-full',
            '[&::-moz-range-thumb]:bg-primary-600',
            '[&::-moz-range-thumb]:cursor-pointer',
            '[&::-moz-range-thumb]:border-0'
          )}
        />
      </div>
      <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
        <span>{scale.min} - {minLabel}</span>
        <span>{scale.max} - {maxLabel}</span>
      </div>
    </div>
  );
}
