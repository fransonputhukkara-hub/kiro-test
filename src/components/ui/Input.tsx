import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export default function Input({ label, error, hint, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">
          {label}
        </label>
      )}
      <input
        {...props}
        className={`
          w-full px-3 py-2.5 text-sm rounded-xl border transition-all duration-200
          bg-white/80 backdrop-blur-sm
          border-slate-200 text-slate-800 placeholder-slate-400
          focus:border-blue-400 focus:ring-2 focus:ring-blue-100
          hover:border-slate-300
          ${error ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : ''}
          ${className}
        `}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
      {hint && !error && <span className="text-xs text-slate-400">{hint}</span>}
    </div>
  );
}
