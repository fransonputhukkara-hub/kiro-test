import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDocument, deleteDocument, getSettings } from '../utils/storage';
import { DOCUMENT_LABELS, STATUS_COLORS } from '../utils/documentLabels';
import DocumentPreview from '../components/document/DocumentPreview';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { useToast } from '../components/ui/Toast';
import { downloadPDF } from '../utils/pdfGenerator';
import {
  ArrowLeft, Edit2, Download, Trash2, Printer,
  Mail, MessageCircle, Copy
} from 'lucide-react';
import { duplicateDocument } from '../utils/storage';

export default function DocumentView() {
  const { id, docType } = useParams<{ id: string; docType: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [showDelete, setShowDelete] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const doc = id ? getDocument(id) : null;
  const settings = getSettings();

  if (!doc) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-slate-500">Document not found</p>
        <Button variant="secondary" icon={<ArrowLeft size={15} />} onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    );
  }

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const previewEl = document.getElementById('document-preview-root');
    if (!previewEl) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${doc.number}</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: Arial, sans-serif; }
            @page { size: A4; margin: 0; }
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>${previewEl.innerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 500);
  };

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      await downloadPDF(doc, settings.letterhead);
      showToast('PDF downloaded successfully', 'success');
    } catch (err) {
      showToast('Failed to generate PDF', 'error');
    } finally {
      setDownloading(false);
    }
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(`${DOCUMENT_LABELS[doc.type]} ${doc.number} from B2P International`);
    const body = encodeURIComponent(
      `Dear ${doc.customerName},\n\nPlease find attached ${DOCUMENT_LABELS[doc.type]} ${doc.number} for ₹${doc.grandTotal.toLocaleString('en-IN')}.\n\nThank you for your business!\n\nBest Regards,\nB2P International`
    );
    const email = doc.customerEmail || '';
    window.open(`mailto:${email}?subject=${subject}&body=${body}`);
    showToast('Email client opened', 'info');
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Hello ${doc.customerName},\n\nYour ${DOCUMENT_LABELS[doc.type]} *${doc.number}* from B2P International:\n\n💰 Amount: *₹${doc.grandTotal.toLocaleString('en-IN')}*\n📅 Date: ${doc.date}\n\nThank you for your business! 🙏`
    );
    const phone = (doc.customerPhone || '').replace(/\D/g, '');
    window.open(`https://wa.me/${phone ? '91' + phone : ''}?text=${message}`);
    showToast('WhatsApp message prepared', 'success');
  };

  const handleDuplicate = () => {
    if (!doc) return;
    const dup = duplicateDocument(doc.id);
    if (dup) {
      showToast('Document duplicated', 'success');
      navigate(`/documents/${dup.type}/${dup.id}/edit`);
    }
  };

  const handleDelete = () => {
    if (!doc) return;
    deleteDocument(doc.id);
    showToast('Document deleted', 'success');
    navigate(`/documents/${doc.type}`);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/documents/${doc.type}`)}
            className="p-2 rounded-xl glass-card hover:bg-blue-50 transition-colors"
          >
            <ArrowLeft size={18} className="text-slate-600" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-800">{doc.number}</h1>
              <Badge className={STATUS_COLORS[doc.status]}>{doc.status}</Badge>
            </div>
            <p className="text-sm text-slate-500">{DOCUMENT_LABELS[doc.type]} · {doc.customerName}</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={<Edit2 size={14} />}
            onClick={() => navigate(`/documents/${doc.type}/${doc.id}/edit`)}
          >
            Edit
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={<Copy size={14} />}
            onClick={handleDuplicate}
          >
            Duplicate
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={<Printer size={14} />}
            onClick={handlePrint}
          >
            Print
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<Download size={14} />}
            loading={downloading}
            onClick={handleDownloadPDF}
          >
            PDF
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={<Mail size={14} />}
            onClick={handleEmail}
          >
            Email
          </Button>
          <Button
            variant="success"
            size="sm"
            icon={<MessageCircle size={14} />}
            onClick={handleWhatsApp}
          >
            WhatsApp
          </Button>
          <Button
            variant="danger"
            size="sm"
            icon={<Trash2 size={14} />}
            onClick={() => setShowDelete(true)}
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Document Preview */}
      <div className="overflow-auto bg-slate-200 rounded-2xl p-4 lg:p-8" id="document-preview-root">
        <DocumentPreview document={doc} letterhead={settings.letterhead} />
      </div>

      <ConfirmDialog
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="Delete Document"
        message={`Are you sure you want to delete ${doc.number}? This action cannot be undone.`}
        confirmLabel="Delete"
      />
    </div>
  );
}
