import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export default function Textarea({ label, error, className = '', ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">
          {label}
        </label>
      )}
      <textarea
        {...props}
        className={`
          w-full px-3 py-2.5 text-sm rounded-xl border transition-all duration-200
          bg-white/80 backdrop-blur-sm resize-y
          border-slate-200 text-slate-800 placeholder-slate-400
          focus:border-blue-400 focus:ring-2 focus:ring-blue-100
          hover:border-slate-300
          ${error ? 'border-red-400' : ''}
          ${className}
        `}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
