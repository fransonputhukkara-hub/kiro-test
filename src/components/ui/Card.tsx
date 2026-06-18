import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
  hover?: boolean;
}

export default function Card({ children, className = '', padding = true, hover = false }: CardProps) {
  return (
    <div className={`
      glass-card rounded-2xl
      ${padding ? 'p-5' : ''}
      ${hover ? 'hover:shadow-lg hover:-translate-y-0.5 cursor-pointer transition-all duration-200' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
}
