import React, { useState, useMemo } from 'react';
import { getDocuments, getCustomers } from '../utils/storage';
import { formatCurrency } from '../utils/calculations';
import { DOCUMENT_LABELS, DOCUMENT_COLORS, STATUS_COLORS, ALL_DOCUMENT_TYPES } from '../utils/documentLabels';
import { DocumentType } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { exportDocumentsToExcel, exportCustomersToExcel } from '../utils/excelExport';
import { useToast } from '../components/ui/Toast';
import { format, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';
import { Download, FileSpreadsheet, BarChart3, TrendingUp, Users } from 'lucide-react';

export default function ReportsPage() {
  const { showToast } = useToast();
  const [dateFrom, setDateFrom] = useState(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
  const [dateTo, setDateTo] = useState(format(endOfMonth(new Date()), 'yyyy-MM-dd'));
  const [typeFilter, setTypeFilter] = useState<DocumentType | 'all'>('all');

  const allDocs = useMemo(() => getDocuments(), []);
  const customers = useMemo(() => getCustomers(), []);

  const filteredDocs = useMemo(() => {
    return allDocs.filter(doc => {
      const docDate = parseISO(doc.date);
      const inRange = isWithinInterval(docDate, {
        start: parseISO(dateFrom),
        end: parseISO(dateTo)
      });
      const matchesType = typeFilter === 'all' || doc.type === typeFilter;
      return inRange && matchesType;
    });
  }, [allDocs, dateFrom, dateTo, typeFilter]);

  const stats = useMemo(() => {
    const byType: Partial<Record<DocumentType, { count: number; total: number }>> = {};
    let totalRevenue = 0;
    let paidRevenue = 0;

    for (const doc of filteredDocs) {
      if (!byType[doc.type]) byType[doc.type] = { count: 0, total: 0 };
      byType[doc.type]!.count++;
      byType[doc.type]!.total += doc.grandTotal;
      totalRevenue += doc.grandTotal;
      if (doc.status === 'paid') paidRevenue += doc.grandTotal;
    }

    return { byType, totalRevenue, paidRevenue };
  }, [filteredDocs]);

  const topCustomers = useMemo(() => {
    const map: Record<string, { name: string; total: number; count: number }> = {};
    for (const doc of filteredDocs) {
      if (!map[doc.customerName]) map[doc.customerName] = { name: doc.customerName, total: 0, count: 0 };
      map[doc.customerName].total += doc.grandTotal;
      map[doc.customerName].count++;
    }
    return Object.values(map).sort((a, b) => b.total - a.total).slice(0, 5);
  }, [filteredDocs]);

  const handleExportDocs = () => {
    exportDocumentsToExcel(filteredDocs, `documents_report_${dateFrom}_${dateTo}`);
    showToast('Excel exported', 'success');
  };

  const handleExportCustomers = () => {
    exportCustomersToExcel(customers, 'customers_report');
    showToast('Customers exported', 'success');
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Reports</h1>
        <p className="text-sm text-slate-500 mt-0.5">Analytics and export for your business documents</p>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="text-xs font-medium text-slate-600 uppercase tracking-wide block mb-1">From Date</label>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
              className="px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-white/80 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 uppercase tracking-wide block mb-1">To Date</label>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
              className="px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-white/80 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 uppercase tracking-wide block mb-1">Document Type</label>
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value as DocumentType | 'all')}
              className="px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-white/80 focus:border-blue-400 outline-none">
              <option value="all">All Types</option>
              {ALL_DOCUMENT_TYPES.map(t => <option key={t} value={t}>{DOCUMENT_LABELS[t]}</option>)}
            </select>
          </div>
          <div className="flex gap-2 ml-auto">
            <Button variant="secondary" size="sm" icon={<FileSpreadsheet size={14} />} onClick={handleExportDocs}>
              Export Docs
            </Button>
            <Button variant="secondary" size="sm" icon={<Users size={14} />} onClick={handleExportCustomers}>
              Export Customers
            </Button>
          </div>
        </div>
      </Card>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm">Total Documents</p>
              <p className="text-3xl font-bold text-white mt-1">{filteredDocs.length}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <BarChart3 size={22} className="text-white" />
            </div>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm">Total Revenue</p>
              <p className="text-xl font-bold text-white mt-1">{formatCurrency(stats.totalRevenue)}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <TrendingUp size={22} className="text-white" />
            </div>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-violet-500 to-violet-600 border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-violet-100 text-sm">Paid Revenue</p>
              <p className="text-xl font-bold text-white mt-1">{formatCurrency(stats.paidRevenue)}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <Download size={22} className="text-white" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* By document type */}
        <Card>
          <h3 className="font-semibold text-slate-700 mb-4">By Document Type</h3>
          <div className="space-y-3">
            {ALL_DOCUMENT_TYPES.map(type => {
              const data = stats.byType[type];
              if (!data) return null;
              const pct = stats.totalRevenue > 0 ? (data.total / stats.totalRevenue) * 100 : 0;
              return (
                <div key={type}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Badge className={DOCUMENT_COLORS[type]}>{DOCUMENT_LABELS[type]}</Badge>
                      <span className="text-xs text-slate-500">{data.count} docs</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-800">{formatCurrency(data.total)}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
            {Object.keys(stats.byType).length === 0 && (
              <p className="text-sm text-slate-400 text-center py-6">No documents in selected date range</p>
            )}
          </div>
        </Card>

        {/* Top Customers */}
        <Card>
          <h3 className="font-semibold text-slate-700 mb-4">Top Customers</h3>
          {topCustomers.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-6">No data available</p>
          ) : (
            <div className="space-y-3">
              {topCustomers.map((c, idx) => (
                <div key={c.name} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800">{c.name}</p>
                    <p className="text-xs text-slate-500">{c.count} documents</p>
                  </div>
                  <span className="text-sm font-bold text-slate-700">{formatCurrency(c.total)}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Detailed table */}
      <Card padding={false}>
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-700">Document Details ({filteredDocs.length})</h3>
          <Button variant="secondary" size="sm" icon={<FileSpreadsheet size={14} />} onClick={handleExportDocs}>
            Export Excel
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Number</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Type</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Customer</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Date</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Amount</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-slate-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.slice(0, 50).map((doc, idx) => (
                <tr key={doc.id} className={idx % 2 !== 0 ? 'bg-slate-50/50' : ''}>
                  <td className="px-5 py-3 text-sm font-medium text-blue-600">{doc.number}</td>
                  <td className="px-5 py-3"><Badge className={DOCUMENT_COLORS[doc.type]}>{DOCUMENT_LABELS[doc.type]}</Badge></td>
                  <td className="px-5 py-3 text-sm text-slate-700">{doc.customerName}</td>
                  <td className="px-5 py-3 text-sm text-slate-500">{format(parseISO(doc.date), 'dd MMM yyyy')}</td>
                  <td className="px-5 py-3 text-sm font-bold text-slate-800 text-right">{formatCurrency(doc.grandTotal)}</td>
                  <td className="px-5 py-3 text-center"><Badge className={STATUS_COLORS[doc.status]}>{doc.status}</Badge></td>
                </tr>
              ))}
              {filteredDocs.length === 0 && (
                <tr><td colSpan={6} className="text-center py-10 text-slate-400 text-sm">No documents in selected range</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
