export type DocumentType =
  | 'quotation'
  | 'invoice'
  | 'proforma_invoice'
  | 'work_order'
  | 'payment_receipt'
  | 'agreement'
  | 'service_contract'
  | 'job_sheet'
  | 'custom';

export interface DocumentNumberFormat {
  prefix: string;
  includeYear: boolean;
  digits: number;
  separator: string;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  rate: number;
  discount: number;
  taxRate: number;
  subtotal: number;
}

export interface Document {
  id: string;
  type: DocumentType;
  number: string;
  title: string;
  date: string;
  dueDate?: string;
  customerId?: string;
  customerName: string;
  customerCompany?: string;
  customerAddress?: string;
  customerGST?: string;
  customerEmail?: string;
  customerPhone?: string;
  items: LineItem[];
  notes: string;
  terms: string;
  subtotal: number;
  totalDiscount: number;
  totalTax: number;
  grandTotal: number;
  status: 'draft' | 'sent' | 'approved' | 'rejected' | 'paid' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  customContent?: string;
}

export interface Customer {
  id: string;
  name: string;
  company?: string;
  contactPerson?: string;
  gstNumber?: string;
  address: string;
  mobile: string;
  whatsapp?: string;
  email: string;
  createdAt: string;
}

export interface Company {
  id: string;
  name: string;
  address: string;
  gstNumber?: string;
  phone: string;
  email: string;
  website?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  accountHolder?: string;
  terms: string;
  createdAt: string;
}

export interface Letterhead {
  headerImage?: string;
  footerImage?: string;
  logo?: string;
  seal?: string;
  signature?: string;
  companyName: string;
  tagline?: string;
}

export interface NumberingConfig {
  quotation: DocumentNumberFormat;
  invoice: DocumentNumberFormat;
  proforma_invoice: DocumentNumberFormat;
  work_order: DocumentNumberFormat;
  payment_receipt: DocumentNumberFormat;
  agreement: DocumentNumberFormat;
  service_contract: DocumentNumberFormat;
  job_sheet: DocumentNumberFormat;
  custom: DocumentNumberFormat;
}

export interface DocumentCounter {
  quotation: number;
  invoice: number;
  proforma_invoice: number;
  work_order: number;
  payment_receipt: number;
  agreement: number;
  service_contract: number;
  job_sheet: number;
  custom: number;
}

export interface AppSettings {
  letterhead: Letterhead;
  numbering: NumberingConfig;
  counters: DocumentCounter;
  defaultTerms: string;
  defaultNotes: string;
}
