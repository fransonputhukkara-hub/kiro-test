import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export default function Select({ label, error, options, className = '', ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">
          {label}
        </label>
      )}
      <select
        {...props}
        className={`
          w-full px-3 py-2.5 text-sm rounded-xl border transition-all duration-200
          bg-white/80 backdrop-blur-sm
          border-slate-200 text-slate-800
          focus:border-blue-400 focus:ring-2 focus:ring-blue-100
          hover:border-slate-300
          ${error ? 'border-red-400' : ''}
          ${className}
        `}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
