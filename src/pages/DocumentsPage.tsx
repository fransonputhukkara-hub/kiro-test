import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DocumentType } from '../types';
import { getDocuments, deleteDocument, duplicateDocument } from '../utils/storage';
import { DOCUMENT_LABELS, DOCUMENT_COLORS, STATUS_COLORS } from '../utils/documentLabels';
import { formatCurrency } from '../utils/calculations';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { useToast } from '../components/ui/Toast';
import { format } from 'date-fns';
import {
  Plus, Search, Eye, Edit2, Trash2, Copy, Download,
  Filter, FileText
} from 'lucide-react';
import { downloadPDF } from '../utils/pdfGenerator';
import { getSettings } from '../utils/storage';

interface DocumentsPageProps {
  docType: DocumentType;
}

const STATUS_OPTIONS = ['all', 'draft', 'sent', 'approved', 'rejected', 'paid', 'cancelled'];

export default function DocumentsPage({ docType }: DocumentsPageProps) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [, forceUpdate] = useState(0);

  const allDocs = useMemo(() => getDocuments().filter(d => d.type === docType), [docType, forceUpdate]);

  const filtered = useMemo(() => {
    let result = allDocs;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(d =>
        d.number.toLowerCase().includes(q) ||
        d.customerName.toLowerCase().includes(q) ||
        (d.customerCompany || '').toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'all') {
      result = result.filter(d => d.status === statusFilter);
    }
    return result;
  }, [allDocs, search, statusFilter]);

  const handleDelete = (id: string) => {
    deleteDocument(id);
    forceUpdate(n => n + 1);
    showToast('Document deleted', 'success');
  };

  const handleDuplicate = (id: string) => {
    const dup = duplicateDocument(id);
    if (dup) {
      forceUpdate(n => n + 1);
      showToast('Document duplicated successfully', 'success');
    }
  };

  const handleDownloadPDF = async (id: string) => {
    const docs = getDocuments();
    const doc = docs.find(d => d.id === id);
    if (!doc) return;
    const settings = getSettings();
    try {
      await downloadPDF(doc, settings.letterhead);
      showToast('PDF downloaded', 'success');
    } catch {
      showToast('Failed to generate PDF', 'error');
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{DOCUMENT_LABELS[docType]}</h1>
          <p className="text-sm text-slate-500 mt-0.5">{allDocs.length} total documents</p>
        </div>
        <Button
          variant="primary"
          icon={<Plus size={16} />}
          onClick={() => navigate(`/documents/${docType}/new`)}
        >
          New {DOCUMENT_LABELS[docType]}
        </Button>
      </div>

      {/* Filters */}
      <Card padding={false}>
        <div className="flex flex-col sm:flex-row gap-3 p-4">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by number, customer..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white/80 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={15} className="text-slate-400" />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-white/80 focus:border-blue-400 outline-none capitalize"
            >
              {STATUS_OPTIONS.map(s => (
                <option key={s} value={s}>{s === 'all' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Documents list */}
      <Card padding={false}>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <FileText size={40} className="opacity-30 mb-3" />
            <p className="text-sm font-medium">No {DOCUMENT_LABELS[docType].toLowerCase()} found</p>
            <p className="text-xs mt-1">Create your first one to get started</p>
            <Button
              variant="primary"
              size="sm"
              className="mt-4"
              icon={<Plus size={14} />}
              onClick={() => navigate(`/documents/${docType}/new`)}
            >
              Create {DOCUMENT_LABELS[docType]}
            </Button>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Number</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Customer</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Date</th>
                    <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Amount</th>
                    <th className="px-5 py-3 text-center text-xs font-semibold text-slate-500 uppercase">Status</th>
                    <th className="px-5 py-3 text-center text-xs font-semibold text-slate-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((doc, idx) => (
                    <tr key={doc.id} className={`hover:bg-blue-50/40 transition-colors ${idx % 2 !== 0 ? 'bg-slate-50/50' : ''}`}>
                      <td className="px-5 py-3.5 text-sm font-semibold text-blue-600">{doc.number}</td>
                      <td className="px-5 py-3.5">
                        <p className="text-sm font-medium text-slate-800">{doc.customerName}</p>
                        {doc.customerCompany && <p className="text-xs text-slate-400">{doc.customerCompany}</p>}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-slate-500">
                        {format(new Date(doc.date), 'dd MMM yyyy')}
                      </td>
                      <td className="px-5 py-3.5 text-sm font-bold text-slate-800 text-right">
                        {formatCurrency(doc.grandTotal)}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <Badge className={STATUS_COLORS[doc.status]}>{doc.status}</Badge>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => navigate(`/documents/${docType}/${doc.id}`)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="View"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => navigate(`/documents/${docType}/${doc.id}/edit`)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDuplicate(doc.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                            title="Duplicate"
                          >
                            <Copy size={14} />
                          </button>
                          <button
                            onClick={() => handleDownloadPDF(doc.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                            title="Download PDF"
                          >
                            <Download size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteId(doc.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="lg:hidden space-y-3 p-4">
              {filtered.map(doc => (
                <div key={doc.id} className="glass-card rounded-xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-blue-600 text-sm">{doc.number}</p>
                      <p className="font-medium text-slate-800">{doc.customerName}</p>
                    </div>
                    <Badge className={STATUS_COLORS[doc.status]}>{doc.status}</Badge>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-slate-500">{format(new Date(doc.date), 'dd MMM yyyy')}</span>
                    <span className="font-bold text-slate-800">{formatCurrency(doc.grandTotal)}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => navigate(`/documents/${docType}/${doc.id}`)} className="flex-1 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100">View</button>
                    <button onClick={() => navigate(`/documents/${docType}/${doc.id}/edit`)} className="flex-1 py-1.5 text-xs font-medium text-slate-600 bg-slate-50 rounded-lg hover:bg-slate-100">Edit</button>
                    <button onClick={() => handleDuplicate(doc.id)} className="flex-1 py-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100">Copy</button>
                    <button onClick={() => handleDownloadPDF(doc.id)} className="flex-1 py-1.5 text-xs font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100">PDF</button>
                    <button onClick={() => setDeleteId(doc.id)} className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100"><Trash2 size={12} /></button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>

      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && handleDelete(deleteId)}
        title="Delete Document"
        message="Are you sure you want to delete this document? This action cannot be undone."
        confirmLabel="Delete"
      />
    </div>
  );
}
