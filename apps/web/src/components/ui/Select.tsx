import React, { useEffect, useRef, useState } from 'react';

type Option = { value: string; label: string };

type SelectProps = {
  id?: string;
  label?: string;
  value?: string;
  placeholder?: string;
  options: Option[];
  onChange: (value: string) => void;
  className?: string;
};

export const Select: React.FC<SelectProps> = ({ id, label, value, placeholder = 'Select...', options, onChange, className = '' }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div className={`relative ${className}`} ref={ref}>
      {label && <label htmlFor={id} className="mb-1 block text-sm text-slate-600 dark:text-slate-400">{label}</label>}
      <button
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((s) => !s)}
        className="w-56 min-w-[12rem] rounded-lg border border-slate-300 bg-white px-3 py-2 text-left text-sm dark:border-slate-600 dark:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
      >
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-800 dark:text-slate-200">{selected ? selected.label : <span className="text-slate-500">{placeholder}</span>}</span>
          <span className="text-slate-400">▾</span>
        </div>
      </button>
      {open && (
        <ul role="listbox" className="absolute z-40 mt-2 w-56 min-w-[12rem] rounded-md border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
          {options.map((opt) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              tabIndex={0}
              className="cursor-pointer px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onChange(opt.value);
                  setOpen(false);
                }
              }}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Select;
