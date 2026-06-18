import { DocumentType } from '../types';

export const DOCUMENT_LABELS: Record<DocumentType, string> = {
  quotation: 'Quotation',
  invoice: 'Invoice',
  proforma_invoice: 'Proforma Invoice',
  work_order: 'Work Order',
  payment_receipt: 'Payment Receipt',
  agreement: 'Agreement',
  service_contract: 'Service Contract',
  job_sheet: 'Job Sheet',
  custom: 'Custom Document',
};

export const DOCUMENT_COLORS: Record<DocumentType, string> = {
  quotation: 'bg-blue-100 text-blue-800',
  invoice: 'bg-green-100 text-green-800',
  proforma_invoice: 'bg-purple-100 text-purple-800',
  work_order: 'bg-orange-100 text-orange-800',
  payment_receipt: 'bg-emerald-100 text-emerald-800',
  agreement: 'bg-red-100 text-red-800',
  service_contract: 'bg-indigo-100 text-indigo-800',
  job_sheet: 'bg-yellow-100 text-yellow-800',
  custom: 'bg-gray-100 text-gray-800',
};

export const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700',
  sent: 'bg-blue-100 text-blue-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  paid: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-50 text-red-500',
};

export const ALL_DOCUMENT_TYPES: DocumentType[] = [
  'quotation', 'invoice', 'proforma_invoice', 'work_order',
  'payment_receipt', 'agreement', 'service_contract', 'job_sheet', 'custom'
];
