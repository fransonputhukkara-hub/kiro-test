import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Document, DocumentType, Customer } from '../types';
import { getDocument, saveDocument, createNewDocument, getCustomers, getSettings } from '../utils/storage';
import { calculateTotals } from '../utils/calculations';
import { DOCUMENT_LABELS } from '../utils/documentLabels';
import LineItemsTable from '../components/document/LineItemsTable';
import TotalsPanel from '../components/document/TotalsPanel';
import DocumentPreview from '../components/document/DocumentPreview';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Select from '../components/ui/Select';
import { useToast } from '../components/ui/Toast';
import { Save, Eye, EyeOff, ArrowLeft, Search } from 'lucide-react';

interface DocumentEditorProps {
  docType: DocumentType;
}

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'sent', label: 'Sent' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'paid', label: 'Paid' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function DocumentEditor({ docType }: DocumentEditorProps) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();
  const [showPreview, setShowPreview] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [doc, setDoc] = useState<Document>(() => {
    if (id) {
      const existing = getDocument(id);
      if (existing) return existing;
    }
    return createNewDocument(docType);
  });

  const customers = getCustomers();
  const settings = getSettings();

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    (c.company || '').toLowerCase().includes(customerSearch.toLowerCase())
  );

  const updateDoc = (field: keyof Document, value: unknown) => {
    setDoc(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'items') {
        const totals = calculateTotals(updated.items);
        return { ...updated, ...totals };
      }
      return updated;
    });
  };

  const selectCustomer = (customer: Customer) => {
    setDoc(prev => ({
      ...prev,
      customerId: customer.id,
      customerName: customer.name,
      customerCompany: customer.company || '',
      customerAddress: customer.address,
      customerGST: customer.gstNumber || '',
      customerEmail: customer.email,
      customerPhone: customer.mobile,
    }));
    setCustomerSearch(customer.name);
    setShowCustomerDropdown(false);
  };

  const handleSave = () => {
    if (!doc.customerName.trim()) {
      showToast('Please enter customer name', 'error');
      return;
    }
    const toSave = { ...doc, updatedAt: new Date().toISOString() };
    saveDocument(toSave);
    showToast('Document saved successfully', 'success');
    navigate(`/documents/${docType}/${doc.id}`);
  };

  useEffect(() => {
    if (doc.customerId) {
      const c = customers.find(c => c.id === doc.customerId);
      if (c) setCustomerSearch(c.name);
    }
  }, []);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/documents/${docType}`)}
            className="p-2 rounded-xl glass-card hover:bg-blue-50 transition-colors"
          >
            <ArrowLeft size={18} className="text-slate-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800">
              {id ? `Edit ${DOCUMENT_LABELS[docType]}` : `New ${DOCUMENT_LABELS[docType]}`}
            </h1>
            <p className="text-sm text-slate-500"># {doc.number}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            icon={showPreview ? <EyeOff size={15} /> : <Eye size={15} />}
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? 'Hide' : 'Preview'}
          </Button>
          <Button
            variant="primary"
            icon={<Save size={15} />}
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Form */}
        <div className="space-y-4">
          {/* Basic Info */}
          <Card>
            <h3 className="font-semibold text-slate-700 mb-4">Document Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Document Number"
                value={doc.number}
                onChange={e => updateDoc('number', e.target.value)}
              />
              <Input
                label="Document Title"
                value={doc.title}
                onChange={e => updateDoc('title', e.target.value)}
                placeholder="Optional title"
              />
              <Input
                label="Date"
                type="date"
                value={doc.date}
                onChange={e => updateDoc('date', e.target.value)}
              />
              <Input
                label="Due Date"
                type="date"
                value={doc.dueDate || ''}
                onChange={e => updateDoc('dueDate', e.target.value)}
              />
              <Select
                label="Status"
                value={doc.status}
                onChange={e => updateDoc('status', e.target.value)}
                options={STATUS_OPTIONS}
              />
            </div>
          </Card>

          {/* Customer */}
          <Card>
            <h3 className="font-semibold text-slate-700 mb-4">Customer Details</h3>
            <div className="space-y-4">
              {/* Customer search */}
              <div className="relative">
                <label className="text-xs font-medium text-slate-600 uppercase tracking-wide block mb-1">
                  Search Customer
                </label>
                <div className="relative">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={customerSearch}
                    onChange={e => { setCustomerSearch(e.target.value); setShowCustomerDropdown(true); }}
                    onFocus={() => setShowCustomerDropdown(true)}
                    placeholder="Search existing customers..."
                    className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white/80 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
                  />
                </div>
                {showCustomerDropdown && filteredCustomers.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden max-h-48 overflow-y-auto">
                    {filteredCustomers.map(c => (
                      <button
                        key={c.id}
                        onClick={() => selectCustomer(c)}
                        className="w-full px-4 py-2.5 text-left hover:bg-blue-50 transition-colors"
                      >
                        <p className="text-sm font-medium text-slate-800">{c.name}</p>
                        {c.company && <p className="text-xs text-slate-500">{c.company}</p>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Customer Name *"
                  value={doc.customerName}
                  onChange={e => updateDoc('customerName', e.target.value)}
                  placeholder="Full name"
                />
                <Input
                  label="Company"
                  value={doc.customerCompany || ''}
                  onChange={e => updateDoc('customerCompany', e.target.value)}
                  placeholder="Company name"
                />
                <Input
                  label="GST Number"
                  value={doc.customerGST || ''}
                  onChange={e => updateDoc('customerGST', e.target.value)}
                  placeholder="GST/Tax number"
                />
                <Input
                  label="Phone"
                  value={doc.customerPhone || ''}
                  onChange={e => updateDoc('customerPhone', e.target.value)}
                  placeholder="Mobile number"
                />
                <Input
                  label="Email"
                  type="email"
                  value={doc.customerEmail || ''}
                  onChange={e => updateDoc('customerEmail', e.target.value)}
                  placeholder="Email address"
                />
              </div>
              <Textarea
                label="Address"
                value={doc.customerAddress || ''}
                onChange={e => updateDoc('customerAddress', e.target.value)}
                rows={2}
                placeholder="Customer address"
              />
            </div>
          </Card>

          {/* Items */}
          <Card>
            <h3 className="font-semibold text-slate-700 mb-4">Items / Services</h3>
            <LineItemsTable
              items={doc.items}
              onChange={items => updateDoc('items', items)}
            />
          </Card>

          {/* Totals */}
          <Card>
            <TotalsPanel
              subtotal={doc.subtotal}
              totalDiscount={doc.totalDiscount}
              totalTax={doc.totalTax}
              grandTotal={doc.grandTotal}
            />
          </Card>

          {/* Notes & Terms */}
          <Card>
            <h3 className="font-semibold text-slate-700 mb-4">Notes & Terms</h3>
            <div className="space-y-3">
              <Textarea
                label="Notes"
                value={doc.notes}
                onChange={e => updateDoc('notes', e.target.value)}
                rows={3}
                placeholder="Additional notes..."
              />
              <Textarea
                label="Terms & Conditions"
                value={doc.terms}
                onChange={e => updateDoc('terms', e.target.value)}
                rows={4}
                placeholder="Terms and conditions..."
              />
            </div>
          </Card>
        </div>

        {/* Preview */}
        <div className={`${showPreview ? 'block' : 'hidden xl:block'}`}>
          <div className="sticky top-0">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-slate-700">Live Preview</h3>
              <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full">A4 format</span>
            </div>
            <div className="overflow-auto max-h-[80vh] rounded-xl border border-slate-200 bg-slate-100 p-4">
              <DocumentPreview document={doc} letterhead={settings.letterhead} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
