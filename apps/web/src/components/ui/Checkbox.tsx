import React from 'react';

type CheckboxProps = {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  className?: string;
};

export const Checkbox: React.FC<CheckboxProps> = ({ id, checked, onChange, label, className = '' }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 dark:border-slate-600"
      />
      {label && <label htmlFor={id} className="text-sm text-slate-600 dark:text-slate-400">{label}</label>}
    </div>
  );
};

export default Checkbox;
