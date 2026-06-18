import { Document, Customer, Company, AppSettings, DocumentType, DocumentNumberFormat } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

const KEYS = {
  DOCUMENTS: 'b2p_documents',
  CUSTOMERS: 'b2p_customers',
  COMPANIES: 'b2p_companies',
  SETTINGS: 'b2p_settings',
};

const defaultNumbering: AppSettings['numbering'] = {
  quotation: { prefix: 'QTN', includeYear: true, digits: 4, separator: '-' },
  invoice: { prefix: 'INV', includeYear: true, digits: 4, separator: '-' },
  proforma_invoice: { prefix: 'PI', includeYear: true, digits: 4, separator: '-' },
  work_order: { prefix: 'WO', includeYear: true, digits: 4, separator: '-' },
  payment_receipt: { prefix: 'REC', includeYear: true, digits: 4, separator: '-' },
  agreement: { prefix: 'AGR', includeYear: true, digits: 4, separator: '-' },
  service_contract: { prefix: 'SC', includeYear: true, digits: 4, separator: '-' },
  job_sheet: { prefix: 'JOB', includeYear: true, digits: 4, separator: '-' },
  custom: { prefix: 'DOC', includeYear: true, digits: 4, separator: '-' },
};

const defaultCounters: AppSettings['counters'] = {
  quotation: 0,
  invoice: 0,
  proforma_invoice: 0,
  work_order: 0,
  payment_receipt: 0,
  agreement: 0,
  service_contract: 0,
  job_sheet: 0,
  custom: 0,
};

const defaultSettings: AppSettings = {
  letterhead: {
    companyName: 'B2P International',
    tagline: 'Excellence in Business Solutions',
  },
  numbering: defaultNumbering,
  counters: defaultCounters,
  defaultTerms: 'Payment is due within 30 days of invoice date.\nAll prices are in Indian Rupees (INR).\nGST as applicable.',
  defaultNotes: 'Thank you for your business!',
};

export function getSettings(): AppSettings {
  const raw = localStorage.getItem(KEYS.SETTINGS);
  if (!raw) return defaultSettings;
  try {
    const parsed = JSON.parse(raw);
    return {
      ...defaultSettings,
      ...parsed,
      letterhead: { ...defaultSettings.letterhead, ...(parsed.letterhead || {}) },
      numbering: { ...defaultSettings.numbering, ...(parsed.numbering || {}) },
      counters: { ...defaultSettings.counters, ...(parsed.counters || {}) },
    };
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(settings: AppSettings): void {
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
}

export function generateDocumentNumber(type: DocumentType): string {
  const settings = getSettings();
  const fmt: DocumentNumberFormat = settings.numbering[type];
  const counter = settings.counters[type] + 1;
  settings.counters[type] = counter;
  saveSettings(settings);

  const year = format(new Date(), 'yyyy');
  const num = String(counter).padStart(fmt.digits, '0');
  const sep = fmt.separator;

  if (fmt.includeYear) {
    return `${fmt.prefix}${sep}${year}${sep}${num}`;
  }
  return `${fmt.prefix}${sep}${num}`;
}

// Documents
export function getDocuments(): Document[] {
  const raw = localStorage.getItem(KEYS.DOCUMENTS);
  if (!raw) return [];
  try { return JSON.parse(raw); } catch { return []; }
}

export function saveDocument(doc: Document): void {
  const docs = getDocuments();
  const idx = docs.findIndex(d => d.id === doc.id);
  if (idx >= 0) docs[idx] = doc;
  else docs.unshift(doc);
  localStorage.setItem(KEYS.DOCUMENTS, JSON.stringify(docs));
}

export function deleteDocument(id: string): void {
  const docs = getDocuments().filter(d => d.id !== id);
  localStorage.setItem(KEYS.DOCUMENTS, JSON.stringify(docs));
}

export function duplicateDocument(id: string): Document | null {
  const docs = getDocuments();
  const original = docs.find(d => d.id === id);
  if (!original) return null;
  const newDoc: Document = {
    ...original,
    id: uuidv4(),
    number: generateDocumentNumber(original.type),
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  saveDocument(newDoc);
  return newDoc;
}

export function getDocument(id: string): Document | null {
  return getDocuments().find(d => d.id === id) ?? null;
}

// Customers
export function getCustomers(): Customer[] {
  const raw = localStorage.getItem(KEYS.CUSTOMERS);
  if (!raw) return [];
  try { return JSON.parse(raw); } catch { return []; }
}

export function saveCustomer(customer: Customer): void {
  const customers = getCustomers();
  const idx = customers.findIndex(c => c.id === customer.id);
  if (idx >= 0) customers[idx] = customer;
  else customers.unshift(customer);
  localStorage.setItem(KEYS.CUSTOMERS, JSON.stringify(customers));
}

export function deleteCustomer(id: string): void {
  const customers = getCustomers().filter(c => c.id !== id);
  localStorage.setItem(KEYS.CUSTOMERS, JSON.stringify(customers));
}

export function getCustomer(id: string): Customer | null {
  return getCustomers().find(c => c.id === id) ?? null;
}

// Companies
export function getCompanies(): Company[] {
  const raw = localStorage.getItem(KEYS.COMPANIES);
  if (!raw) return [];
  try { return JSON.parse(raw); } catch { return []; }
}

export function saveCompany(company: Company): void {
  const companies = getCompanies();
  const idx = companies.findIndex(c => c.id === company.id);
  if (idx >= 0) companies[idx] = company;
  else companies.unshift(company);
  localStorage.setItem(KEYS.COMPANIES, JSON.stringify(companies));
}

export function deleteCompany(id: string): void {
  const companies = getCompanies().filter(c => c.id !== id);
  localStorage.setItem(KEYS.COMPANIES, JSON.stringify(companies));
}

export function createNewDocument(type: DocumentType): Document {
  const settings = getSettings();
  return {
    id: uuidv4(),
    type,
    number: generateDocumentNumber(type),
    title: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    customerName: '',
    items: [],
    notes: settings.defaultNotes,
    terms: settings.defaultTerms,
    subtotal: 0,
    totalDiscount: 0,
    totalTax: 0,
    grandTotal: 0,
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
