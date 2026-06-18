import React from 'react';
import { Document } from '../../types';
import { Letterhead } from '../../types';
import { formatCurrency, numberToWords } from '../../utils/calculations';
import { DOCUMENT_LABELS } from '../../utils/documentLabels';
import { format } from 'date-fns';

interface DocumentPreviewProps {
  document: Document;
  letterhead: Letterhead;
}

export default function DocumentPreview({ document, letterhead }: DocumentPreviewProps) {
  const renderHeader = () => (
    <div className="document-header" style={{ width: '100%', margin: 0, padding: 0 }}>
      {letterhead.headerImage ? (
        <img
          src={letterhead.headerImage}
          alt="Header"
          className="w-full object-cover block"
          style={{ height: '50px', display: 'block', margin: 0, padding: 0 }}
        />
      ) : (
        <div className="bg-gradient-to-r from-blue-700 to-blue-600 px-8 py-4 flex items-center gap-5">
          {letterhead.logo && (
            <img src={letterhead.logo} alt="Logo" className="h-12 w-12 object-contain rounded-lg bg-white/10 p-1" />
          )}
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white">{letterhead.companyName || 'B2P International'}</h1>
            {letterhead.tagline && <p className="text-blue-200 text-xs mt-0.5">{letterhead.tagline}</p>}
          </div>
        </div>
      )}
    </div>
  );

  const renderFooter = () => (
    <div className="document-footer" style={{ width: '100%', margin: 0, padding: 0 }}>
      {letterhead.footerImage ? (
        <img 
          src={letterhead.footerImage} 
          alt="Footer" 
          className="w-full object-cover block" 
          style={{ height: '30px', display: 'block', margin: 0, padding: 0 }} 
        />
      ) : (
        <div className="border-t border-slate-200 px-8 py-2 bg-slate-50 text-center">
          <p className="text-xs text-slate-400">{letterhead.companyName} · Document Management System</p>
        </div>
      )}
    </div>
  );

  return (
    <div
      className="bg-white shadow-2xl rounded-xl overflow-hidden"
      style={{ width: '210mm', minHeight: '297mm', maxWidth: '100%', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}
    >
      {renderHeader()}

      <div className="px-8 py-6 space-y-5">
        {/* Title row */}
        <div className="flex items-start justify-between bg-slate-50 rounded-xl px-5 py-3">
          <div>
            <h2 className="text-xl font-bold text-blue-700 uppercase tracking-wide">
              {DOCUMENT_LABELS[document.type]}
            </h2>
            {document.title && <p className="text-sm text-slate-600 mt-0.5">{document.title}</p>}
          </div>
          <div className="text-right">
            <p className="font-bold text-slate-800 text-sm"># {document.number}</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Date: {document.date ? format(new Date(document.date), 'dd MMM yyyy') : ''}
            </p>
            {document.dueDate && (
              <p className="text-xs text-slate-500">
                Due: {format(new Date(document.dueDate), 'dd MMM yyyy')}
              </p>
            )}
          </div>
        </div>

        {/* Bill to */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-xl p-4">
            <p className="text-xs font-bold text-blue-600 uppercase mb-2">Bill To</p>
            <p className="font-semibold text-slate-800">{document.customerName || '—'}</p>
            {document.customerCompany && <p className="text-sm text-slate-600">{document.customerCompany}</p>}
            {document.customerAddress && <p className="text-sm text-slate-500 mt-1">{document.customerAddress}</p>}
            {document.customerGST && <p className="text-xs text-slate-500 mt-1">GST: {document.customerGST}</p>}
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-xs font-bold text-blue-600 uppercase mb-2">Contact</p>
            {document.customerEmail && (
              <p className="text-sm text-slate-600">✉ {document.customerEmail}</p>
            )}
            {document.customerPhone && (
              <p className="text-sm text-slate-600">📞 {document.customerPhone}</p>
            )}
          </div>
        </div>

        {/* Items Table */}
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="px-3 py-2.5 text-left text-xs font-semibold w-8">#</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold">Description</th>
                <th className="px-3 py-2.5 text-center text-xs font-semibold">Qty</th>
                <th className="px-3 py-2.5 text-center text-xs font-semibold">Unit</th>
                <th className="px-3 py-2.5 text-right text-xs font-semibold">Rate</th>
                <th className="px-3 py-2.5 text-center text-xs font-semibold">Disc</th>
                <th className="px-3 py-2.5 text-center text-xs font-semibold">Tax</th>
                <th className="px-3 py-2.5 text-right text-xs font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {document.items.map((item, idx) => (
                <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  <td className="px-3 py-2 text-slate-400 text-xs">{idx + 1}</td>
                  <td className="px-3 py-2 text-slate-700">{item.description}</td>
                  <td className="px-3 py-2 text-center text-slate-600">{item.quantity}</td>
                  <td className="px-3 py-2 text-center text-slate-500 text-xs">{item.unit}</td>
                  <td className="px-3 py-2 text-right text-slate-600">₹{item.rate.toLocaleString('en-IN')}</td>
                  <td className="px-3 py-2 text-center text-slate-500 text-xs">{item.discount}%</td>
                  <td className="px-3 py-2 text-center text-slate-500 text-xs">{item.taxRate}%</td>
                  <td className="px-3 py-2 text-right font-semibold text-slate-800">
                    ₹{item.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
              {document.items.length === 0 && (
                <tr><td colSpan={8} className="text-center py-6 text-slate-400 text-sm">No items</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-64 space-y-1.5">
            <div className="flex justify-between text-sm text-slate-600">
              <span>Subtotal</span>
              <span>{formatCurrency(document.subtotal)}</span>
            </div>
            {document.totalDiscount > 0 && (
              <div className="flex justify-between text-sm text-red-600">
                <span>Discount</span>
                <span>- {formatCurrency(document.totalDiscount)}</span>
              </div>
            )}
            {document.totalTax > 0 && (
              <div className="flex justify-between text-sm text-slate-600">
                <span>Tax / GST</span>
                <span>+ {formatCurrency(document.totalTax)}</span>
              </div>
            )}
            <div className="h-px bg-slate-300" />
            <div className="flex justify-between font-bold text-blue-700 text-base">
              <span>Grand Total</span>
              <span>{formatCurrency(document.grandTotal)}</span>
            </div>
            <p className="text-xs text-slate-500 italic">{numberToWords(document.grandTotal)}</p>
          </div>
        </div>

        {/* Notes / Terms */}
        {(document.notes || document.terms) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {document.notes && (
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase mb-1.5">Notes</p>
                <p className="text-sm text-slate-600 whitespace-pre-line">{document.notes}</p>
              </div>
            )}
            {document.terms && (
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase mb-1.5">Terms & Conditions</p>
                <p className="text-sm text-slate-600 whitespace-pre-line">{document.terms}</p>
              </div>
            )}
          </div>
        )}

        {/* Signature & Seal */}
        <div className="flex justify-between items-end pt-6 mt-6">
          <div>
            {letterhead.seal && (
              <div>
                <img src={letterhead.seal} alt="Seal" className="h-20 w-20 object-contain" />
                <p className="text-xs text-slate-500 mt-1">Company Seal</p>
              </div>
            )}
          </div>
          <div className="text-right">
            {letterhead.signature && (
              <img src={letterhead.signature} alt="Signature" className="h-10 object-contain ml-auto mb-2" style={{ maxWidth: '150px' }} />
            )}
            <div className="border-t border-slate-400 pt-1 w-44 ml-auto">
              <p className="text-xs text-slate-500">Authorized Signature</p>
            </div>
          </div>
        </div>
      </div>

      {renderFooter()}
    </div>
  );
}
