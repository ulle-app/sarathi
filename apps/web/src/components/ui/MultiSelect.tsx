import React, { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui';
import { Check } from 'lucide-react';

type Option = {
  value: string;
  label: string;
};

type MultiSelectProps = {
  id?: string;
  label?: string;
  placeholder?: string;
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  className?: string;
};

export const MultiSelect: React.FC<MultiSelectProps> = ({
  id,
  label,
  placeholder = 'Select...',
  options,
  selected,
  onChange,
  className = '',
}) => {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const ref = useRef<HTMLDivElement | null>(null);
  const filterRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  const toggleValue = (val: string) => {
    if (selected.includes(val)) onChange(selected.filter((s) => s !== val));
    else onChange([...selected, val]);
  };

  const filtered = options.filter((o) => o.label.toLowerCase().includes(filter.toLowerCase()));

  const handleButtonKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setTimeout(() => filterRef.current?.focus(), 0);
    }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen((s) => !s);
      setTimeout(() => filterRef.current?.focus(), 0);
    }
  };

  return (
    <div className={`relative ${className}`} ref={ref}>
      {label && (
        <label htmlFor={id} className="block text-sm text-slate-600 dark:text-slate-400 mb-1">
          {label}
        </label>
      )}

      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        id={id}
        onClick={() => setOpen((s) => !s)}
        onKeyDown={handleButtonKeyDown}
        className="w-56 min-w-[12rem] rounded-lg border border-slate-300 bg-white px-3 py-2 text-left text-sm dark:border-slate-600 dark:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0">
            {selected.length === 0 ? (
              <span className="text-slate-500 dark:text-slate-400">{placeholder}</span>
            ) : (
              <div className="flex flex-wrap gap-1">
                {options
                  .filter((o) => selected.includes(o.value))
                  .map((o) => (
                    <span
                      key={o.value}
                      className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-800 dark:bg-slate-700 dark:text-slate-200"
                    >
                      {o.label}
                    </span>
                  ))}
              </div>
            )}
          </div>
          <div className="ml-2 text-slate-400">▾</div>
        </div>
      </button>

      {open && (
        <div className="absolute z-40 mt-2 w-56 min-w-[12rem] rounded-md border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
          <div className="p-2">
            <Input
              id={`${id}-filter`}
              ref={filterRef}
              aria-label="Filter options"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter..."
              className="w-full"
            />
          </div>
          <ul role="listbox" aria-multiselectable className="max-h-60 overflow-auto px-1 pb-1">
            {filtered.length === 0 && (
              <li className="px-3 py-2 text-sm text-slate-500">No options</li>
            )}
            {filtered.map((opt, i) => {
              const checked = selected.includes(opt.value);
              return (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={checked}
                  tabIndex={0}
                  className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                  onClick={() => toggleValue(opt.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleValue(opt.value);
                    }
                    if (e.key === 'ArrowDown') {
                      const next = (e.currentTarget.nextElementSibling as HTMLElement) || null;
                      next?.focus();
                    }
                    if (e.key === 'ArrowUp') {
                      const prev = (e.currentTarget.previousElementSibling as HTMLElement) || null;
                      prev?.focus();
                    }
                    if (e.key === 'Escape') {
                      setOpen(false);
                    }
                  }}
                >
                  <span className="flex h-4 w-4 items-center justify-center rounded-sm border border-slate-300 bg-white text-slate-900 dark:border-slate-600 dark:bg-slate-900">
                    {checked ? <Check className="h-3 w-3" /> : null}
                  </span>
                  <span className="text-sm text-slate-800 dark:text-slate-200">{opt.label}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
