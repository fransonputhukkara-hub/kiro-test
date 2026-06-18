import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDocuments } from '../utils/storage';
import { formatCurrency } from '../utils/calculations';
import { DOCUMENT_LABELS, DOCUMENT_COLORS, STATUS_COLORS } from '../utils/documentLabels';
import { DocumentType } from '../types';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { format } from 'date-fns';
import {
  FileText, Receipt, FileCheck, Briefcase, CreditCard,
  FileSignature, Scroll, Wrench, File, TrendingUp,
  Plus, ArrowRight
} from 'lucide-react';

const docIcons: Record<DocumentType, React.ReactNode> = {
  quotation: <FileText size={20} />,
  invoice: <Receipt size={20} />,
  proforma_invoice: <FileCheck size={20} />,
  work_order: <Briefcase size={20} />,
  payment_receipt: <CreditCard size={20} />,
  agreement: <FileSignature size={20} />,
  service_contract: <Scroll size={20} />,
  job_sheet: <Wrench size={20} />,
  custom: <File size={20} />,
};

const docColors: Record<DocumentType, string> = {
  quotation: 'from-blue-500 to-blue-600',
  invoice: 'from-green-500 to-green-600',
  proforma_invoice: 'from-purple-500 to-purple-600',
  work_order: 'from-orange-500 to-orange-600',
  payment_receipt: 'from-emerald-500 to-emerald-600',
  agreement: 'from-red-500 to-red-600',
  service_contract: 'from-indigo-500 to-indigo-600',
  job_sheet: 'from-yellow-500 to-yellow-600',
  custom: 'from-slate-500 to-slate-600',
};

export default function Dashboard() {
  const navigate = useNavigate();
  const documents = useMemo(() => getDocuments(), []);

  const stats = useMemo(() => {
    const counts: Partial<Record<DocumentType, number>> = {};
    const revenue = { total: 0, paid: 0 };

    for (const doc of documents) {
      counts[doc.type] = (counts[doc.type] || 0) + 1;
      revenue.total += doc.grandTotal;
      if (doc.status === 'paid') revenue.paid += doc.grandTotal;
    }
    return { counts, revenue, total: documents.length };
  }, [documents]);

  const recentDocs = useMemo(() => documents.slice(0, 8), [documents]);

  const docTypes: DocumentType[] = [
    'quotation', 'invoice', 'proforma_invoice', 'work_order',
    'payment_receipt', 'agreement', 'service_contract', 'job_sheet', 'custom'
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {format(new Date(), 'EEEE, dd MMMM yyyy')} · B2P International
          </p>
        </div>
      </div>

      {/* Revenue summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm">Total Documents</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.total}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <FileText size={22} className="text-white" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-white mt-1">{formatCurrency(stats.revenue.total)}</p>
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
              <p className="text-2xl font-bold text-white mt-1">{formatCurrency(stats.revenue.paid)}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <CreditCard size={22} className="text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Document type cards */}
      <div>
        <h2 className="text-base font-semibold text-slate-700 mb-3">Document Overview</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {docTypes.map(type => (
            <Card
              key={type}
              hover
              className="cursor-pointer"
              padding={false}
            >
              <div
                className={`bg-gradient-to-br ${docColors[type]} p-4 rounded-2xl flex flex-col gap-2`}
                onClick={() => navigate(`/documents/${type}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white">
                    {docIcons[type]}
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/documents/${type}/new`); }}
                    className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.counts[type] || 0}</p>
                  <p className="text-xs text-white/80 font-medium">{DOCUMENT_LABELS[type]}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Documents */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-slate-700">Recent Documents</h2>
          <button
            onClick={() => navigate('/documents/invoice')}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            View all <ArrowRight size={14} />
          </button>
        </div>
        <Card padding={false}>
          {recentDocs.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <FileText size={36} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No documents yet. Create your first document!</p>
            </div>
          ) : (
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
                  {recentDocs.map((doc, idx) => (
                    <tr
                      key={doc.id}
                      className={`hover:bg-blue-50/50 cursor-pointer transition-colors ${idx % 2 === 0 ? '' : 'bg-slate-50/50'}`}
                      onClick={() => navigate(`/documents/${doc.type}/${doc.id}`)}
                    >
                      <td className="px-5 py-3 text-sm font-medium text-blue-600">{doc.number}</td>
                      <td className="px-5 py-3">
                        <Badge className={DOCUMENT_COLORS[doc.type]}>{DOCUMENT_LABELS[doc.type]}</Badge>
                      </td>
                      <td className="px-5 py-3 text-sm text-slate-700">{doc.customerName}</td>
                      <td className="px-5 py-3 text-sm text-slate-500">
                        {format(new Date(doc.date), 'dd MMM yyyy')}
                      </td>
                      <td className="px-5 py-3 text-sm font-semibold text-slate-800 text-right">
                        {formatCurrency(doc.grandTotal)}
                      </td>
                      <td className="px-5 py-3 text-center">
                        <Badge className={STATUS_COLORS[doc.status]}>{doc.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
