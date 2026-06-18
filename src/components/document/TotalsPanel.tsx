import React from 'react';
import { formatCurrency, numberToWords } from '../../utils/calculations';

interface TotalsPanelProps {
  subtotal: number;
  totalDiscount: number;
  totalTax: number;
  grandTotal: number;
}

export default function TotalsPanel({ subtotal, totalDiscount, totalTax, grandTotal }: TotalsPanelProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="ml-auto w-full max-w-xs space-y-2">
        <div className="glass-card rounded-xl p-4 space-y-2">
          <div className="flex justify-between text-sm text-slate-600">
            <span>Subtotal</span>
            <span className="font-medium">{formatCurrency(subtotal)}</span>
          </div>
          {totalDiscount > 0 && (
            <div className="flex justify-between text-sm text-red-600">
              <span>Discount</span>
              <span className="font-medium">- {formatCurrency(totalDiscount)}</span>
            </div>
          )}
          {totalTax > 0 && (
            <div className="flex justify-between text-sm text-slate-600">
              <span>Tax / GST</span>
              <span className="font-medium">+ {formatCurrency(totalTax)}</span>
            </div>
          )}
          <div className="h-px bg-slate-200 my-1" />
          <div className="flex justify-between">
            <span className="font-bold text-slate-800">Grand Total</span>
            <span className="font-bold text-blue-700 text-lg">{formatCurrency(grandTotal)}</span>
          </div>
        </div>
        <div className="text-xs text-slate-500 italic px-1">
          {numberToWords(grandTotal)}
        </div>
      </div>
    </div>
  );
}
