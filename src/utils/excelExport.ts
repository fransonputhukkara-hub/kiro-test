import * as XLSX from 'xlsx';
import { Document, Customer } from '../types';
import { DOCUMENT_LABELS } from './documentLabels';
import { format } from 'date-fns';

export function exportDocumentsToExcel(documents: Document[], filename = 'documents_report'): void {
  const data = documents.map(doc => ({
    'Document Number': doc.number,
    'Type': DOCUMENT_LABELS[doc.type],
    'Customer': doc.customerName,
    'Company': doc.customerCompany || '',
    'Date': format(new Date(doc.date), 'dd/MM/yyyy'),
    'Due Date': doc.dueDate ? format(new Date(doc.dueDate), 'dd/MM/yyyy') : '',
    'Subtotal (₹)': doc.subtotal,
    'Discount (₹)': doc.totalDiscount,
    'Tax (₹)': doc.totalTax,
    'Grand Total (₹)': doc.grandTotal,
    'Status': doc.status,
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Documents');
  XLSX.writeFile(wb, `${filename}.xlsx`);
}

export function exportCustomersToExcel(customers: Customer[], filename = 'customers_report'): void {
  const data = customers.map(c => ({
    'Name': c.name,
    'Company': c.company || '',
    'Contact Person': c.contactPerson || '',
    'GST Number': c.gstNumber || '',
    'Address': c.address,
    'Mobile': c.mobile,
    'WhatsApp': c.whatsapp || '',
    'Email': c.email,
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Customers');
  XLSX.writeFile(wb, `${filename}.xlsx`);
}
