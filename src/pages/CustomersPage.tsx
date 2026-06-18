import React, { useState, useMemo } from 'react';
import { Customer } from '../types';
import { getCustomers, saveCustomer, deleteCustomer } from '../utils/storage';
import { v4 as uuidv4 } from 'uuid';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { useToast } from '../components/ui/Toast';
import { Plus, Search, Edit2, Trash2, Users, Phone, Mail, Building2 } from 'lucide-react';

const emptyCustomer = (): Customer => ({
  id: uuidv4(),
  name: '',
  company: '',
  contactPerson: '',
  gstNumber: '',
  address: '',
  mobile: '',
  whatsapp: '',
  email: '',
  createdAt: new Date().toISOString(),
});

export default function CustomersPage() {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<Customer>(emptyCustomer());
  const [, forceUpdate] = useState(0);

  const customers = useMemo(() => getCustomers(), [forceUpdate]);

  const filtered = useMemo(() => {
    if (!search) return customers;
    const q = search.toLowerCase();
    return customers.filter(c =>
      c.name.toLowerCase().includes(q) ||
      (c.company || '').toLowerCase().includes(q) ||
      c.mobile.includes(q) ||
      c.email.toLowerCase().includes(q)
    );
  }, [customers, search]);

  const openCreate = () => {
    setEditCustomer(null);
    setForm(emptyCustomer());
    setShowModal(true);
  };

  const openEdit = (customer: Customer) => {
    setEditCustomer(customer);
    setForm({ ...customer });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) { showToast('Name is required', 'error'); return; }
    if (!form.mobile.trim()) { showToast('Mobile is required', 'error'); return; }
    saveCustomer(form);
    setShowModal(false);
    forceUpdate(n => n + 1);
    showToast(editCustomer ? 'Customer updated' : 'Customer added', 'success');
  };

  const handleDelete = (id: string) => {
    deleteCustomer(id);
    forceUpdate(n => n + 1);
    showToast('Customer deleted', 'success');
  };

  const update = (field: keyof Customer, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Customers</h1>
          <p className="text-sm text-slate-500 mt-0.5">{customers.length} total customers</p>
        </div>
        <Button variant="primary" icon={<Plus size={16} />} onClick={openCreate}>
          Add Customer
        </Button>
      </div>

      {/* Search */}
      <Card padding={false}>
        <div className="p-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search customers..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white/80 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
            />
          </div>
        </div>
      </Card>

      {/* Customer grid */}
      {filtered.length === 0 ? (
        <Card>
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <Users size={40} className="opacity-30 mb-3" />
            <p className="text-sm font-medium">No customers found</p>
            <Button variant="primary" size="sm" className="mt-4" icon={<Plus size={14} />} onClick={openCreate}>
              Add Customer
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(customer => (
            <Card key={customer.id} hover>
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-700 font-bold text-sm">{customer.name.charAt(0).toUpperCase()}</span>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => openEdit(customer)} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => setDeleteId(customer.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <h3 className="font-semibold text-slate-800 mb-0.5">{customer.name}</h3>
              {customer.company && (
                <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-2">
                  <Building2 size={12} />
                  {customer.company}
                </div>
              )}
              <div className="space-y-1 mt-2">
                {customer.mobile && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Phone size={11} />
                    {customer.mobile}
                  </div>
                )}
                {customer.email && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Mail size={11} />
                    {customer.email}
                  </div>
                )}
              </div>
              {customer.gstNumber && (
                <div className="mt-2 px-2 py-1 bg-slate-50 rounded-lg text-xs text-slate-600 font-mono">
                  GST: {customer.gstNumber}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editCustomer ? 'Edit Customer' : 'Add Customer'}
        size="xl"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Full Name *" value={form.name} onChange={e => update('name', e.target.value)} placeholder="Customer name" />
          <Input label="Company" value={form.company || ''} onChange={e => update('company', e.target.value)} placeholder="Company name" />
          <Input label="Contact Person" value={form.contactPerson || ''} onChange={e => update('contactPerson', e.target.value)} placeholder="Contact person" />
          <Input label="GST Number" value={form.gstNumber || ''} onChange={e => update('gstNumber', e.target.value)} placeholder="GST/Tax number" />
          <Input label="Mobile *" value={form.mobile} onChange={e => update('mobile', e.target.value)} placeholder="Mobile number" />
          <Input label="WhatsApp" value={form.whatsapp || ''} onChange={e => update('whatsapp', e.target.value)} placeholder="WhatsApp number" />
          <Input label="Email" type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="Email address" />
          <div className="sm:col-span-2">
            <Input label="Address" value={form.address} onChange={e => update('address', e.target.value)} placeholder="Full address" />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <Button variant="secondary" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" className="flex-1" onClick={handleSave}>
            {editCustomer ? 'Update Customer' : 'Add Customer'}
          </Button>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && handleDelete(deleteId)}
        title="Delete Customer"
        message="Are you sure you want to delete this customer?"
        confirmLabel="Delete"
      />
    </div>
  );
}
