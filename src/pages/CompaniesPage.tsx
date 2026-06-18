import React, { useState, useMemo } from 'react';
import { Company } from '../types';
import { getCompanies, saveCompany, deleteCompany } from '../utils/storage';
import { v4 as uuidv4 } from 'uuid';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { useToast } from '../components/ui/Toast';
import { Plus, Search, Edit2, Trash2, Building2, Phone, Mail, Globe } from 'lucide-react';

const emptyCompany = (): Company => ({
  id: uuidv4(),
  name: '',
  address: '',
  gstNumber: '',
  phone: '',
  email: '',
  website: '',
  bankName: '',
  accountNumber: '',
  ifscCode: '',
  accountHolder: '',
  terms: '',
  createdAt: new Date().toISOString(),
});

export default function CompaniesPage() {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editCompany, setEditCompany] = useState<Company | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<Company>(emptyCompany());
  const [, forceUpdate] = useState(0);

  const companies = useMemo(() => getCompanies(), [forceUpdate]);

  const filtered = useMemo(() => {
    if (!search) return companies;
    const q = search.toLowerCase();
    return companies.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.includes(q)
    );
  }, [companies, search]);

  const openCreate = () => {
    setEditCompany(null);
    setForm(emptyCompany());
    setShowModal(true);
  };

  const openEdit = (company: Company) => {
    setEditCompany(company);
    setForm({ ...company });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) { showToast('Company name is required', 'error'); return; }
    saveCompany(form);
    setShowModal(false);
    forceUpdate(n => n + 1);
    showToast(editCompany ? 'Company updated' : 'Company added', 'success');
  };

  const handleDelete = (id: string) => {
    deleteCompany(id);
    forceUpdate(n => n + 1);
    showToast('Company deleted', 'success');
  };

  const update = (field: keyof Company, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Companies</h1>
          <p className="text-sm text-slate-500 mt-0.5">{companies.length} total companies</p>
        </div>
        <Button variant="primary" icon={<Plus size={16} />} onClick={openCreate}>
          Add Company
        </Button>
      </div>

      <Card padding={false}>
        <div className="p-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search companies..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white/80 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
            />
          </div>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <Card>
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <Building2 size={40} className="opacity-30 mb-3" />
            <p className="text-sm font-medium">No companies found</p>
            <Button variant="primary" size="sm" className="mt-4" icon={<Plus size={14} />} onClick={openCreate}>
              Add Company
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(company => (
            <Card key={company.id} hover>
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <Building2 size={18} className="text-indigo-700" />
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => openEdit(company)} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => setDeleteId(company.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">{company.name}</h3>
              <p className="text-xs text-slate-500 mb-2">{company.address}</p>
              <div className="space-y-1">
                {company.phone && <div className="flex items-center gap-1.5 text-xs text-slate-500"><Phone size={11} />{company.phone}</div>}
                {company.email && <div className="flex items-center gap-1.5 text-xs text-slate-500"><Mail size={11} />{company.email}</div>}
                {company.website && <div className="flex items-center gap-1.5 text-xs text-slate-500"><Globe size={11} />{company.website}</div>}
              </div>
              {company.gstNumber && (
                <div className="mt-2 px-2 py-1 bg-slate-50 rounded-lg text-xs text-slate-600 font-mono">
                  GST: {company.gstNumber}
                </div>
              )}
              {company.bankName && (
                <div className="mt-2 px-2 py-1 bg-blue-50 rounded-lg text-xs text-blue-700">
                  Bank: {company.bankName} · {company.accountNumber}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editCompany ? 'Edit Company' : 'Add Company'} size="full">
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Company Name *" value={form.name} onChange={e => update('name', e.target.value)} placeholder="Company name" />
            <Input label="GST Number" value={form.gstNumber || ''} onChange={e => update('gstNumber', e.target.value)} placeholder="GST number" />
            <Input label="Phone" value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="Phone number" />
            <Input label="Email" type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="Email" />
            <Input label="Website" value={form.website || ''} onChange={e => update('website', e.target.value)} placeholder="Website URL" />
            <div className="sm:col-span-2">
              <Input label="Address" value={form.address} onChange={e => update('address', e.target.value)} placeholder="Full address" />
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide">Bank Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Bank Name" value={form.bankName || ''} onChange={e => update('bankName', e.target.value)} placeholder="Bank name" />
              <Input label="Account Holder" value={form.accountHolder || ''} onChange={e => update('accountHolder', e.target.value)} placeholder="Account holder name" />
              <Input label="Account Number" value={form.accountNumber || ''} onChange={e => update('accountNumber', e.target.value)} placeholder="Account number" />
              <Input label="IFSC Code" value={form.ifscCode || ''} onChange={e => update('ifscCode', e.target.value)} placeholder="IFSC code" />
            </div>
          </div>

          <Textarea label="Default Terms & Conditions" value={form.terms} onChange={e => update('terms', e.target.value)} rows={4} placeholder="Terms and conditions..." />
        </div>
        <div className="flex gap-3 mt-6">
          <Button variant="secondary" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" className="flex-1" onClick={handleSave}>
            {editCompany ? 'Update Company' : 'Add Company'}
          </Button>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && handleDelete(deleteId)}
        title="Delete Company"
        message="Are you sure you want to delete this company?"
        confirmLabel="Delete"
      />
    </div>
  );
}
