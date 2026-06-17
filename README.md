# B2P International — Premium Document Management System

A complete, production-ready business document management platform with Apple-inspired premium UI design.

## 🚀 Features

### 9 Document Types (Fully Implemented)
- ✅ Quotation
- ✅ Invoice
- ✅ Proforma Invoice
- ✅ Work Order
- ✅ Payment Receipt
- ✅ Agreement
- ✅ Service Contract
- ✅ Job Sheet
- ✅ Custom Document

### Complete Document Workflow
- ✅ **Create** — Rich text editor with auto-calculations
- ✅ **Edit** — Full inline editing with customer search
- ✅ **View** — Exact preview matching PDF output
- ✅ **Print** — Opens browser print dialog with formatted document
- ✅ **PDF Download** — Professional A4 multi-page PDFs with jsPDF
- ✅ **Email** — Pre-filled mailto: links with document details
- ✅ **WhatsApp Share** — Direct wa.me links with formatted messages
- ✅ **Duplicate** — One-click duplication with new auto-number
- ✅ **Delete** — Confirmation dialog before removal

### Letterhead Management (Highest Priority ✅)
- ✅ Upload company header image (appears on every page)
- ✅ Upload company footer image (appears on every page)
- ✅ Upload company logo (fallback header)
- ✅ Upload company seal (appears on documents)
- ✅ Upload authorized signature (appears on documents)
- ✅ Edge-to-edge rendering for header/footer
- ✅ Proper alignment in both preview and PDF
- ✅ Multi-page support with repeated header/footer

### Document Numbering System
- ✅ Automatic sequential numbering per document type
- ✅ Customizable formats (prefix, separator, year, digits)
- ✅ Examples: `QTN-2026-0001`, `INV-2026-0001`, `WO-2026-0001`
- ✅ Counter reset functionality
- ✅ Independent sequences for each document type

### Customer Management
- ✅ Create/Edit/Delete customers
- ✅ Store: Name, Company, Contact Person, GST Number, Address, Mobile, WhatsApp, Email
- ✅ Search and filter customers
- ✅ Quick customer selection in document editor

### Company Management
- ✅ Multiple company profiles
- ✅ Store: Name, Address, GST, Phone, Email, Website
- ✅ Bank details (Bank Name, Account Number, IFSC Code, Account Holder)
- ✅ Default terms & conditions per company

### Document Builder
- ✅ Line items table with: Description, Quantity, Unit, Rate, Discount%, Tax/GST%
- ✅ 14 unit types: Nos, Pcs, Set, Lot, Unit, Kg, Ltr, Mtr, Sqft, Sqm, Day, Month, Hour, Job
- ✅ Tax rates: 0%, 5%, 12%, 18%, 28%
- ✅ Automatic calculations: Subtotal, Discount, Tax, Grand Total
- ✅ Amount in words (Indian numbering: Lakh, Crore)
- ✅ Rich notes and terms fields
- ✅ Status management: Draft, Sent, Approved, Rejected, Paid, Cancelled

### Reports & Analytics
- ✅ Date range filters
- ✅ Document type filters
- ✅ Total documents count
- ✅ Total revenue (all documents)
- ✅ Paid revenue
- ✅ Revenue breakdown by document type
- ✅ Top 5 customers by revenue
- ✅ Excel export (documents and customers)

### Dashboard
- ✅ Document count by type
- ✅ Revenue summary cards
- ✅ Recent documents table
- ✅ Quick navigation to create new documents
- ✅ Real-time statistics

## 🎨 UI/UX Design

**Apple iPhone Inspired Premium Interface**
- ✅ Glassmorphism effects
- ✅ Frosted glass cards with backdrop blur
- ✅ Smooth animations and transitions
- ✅ Premium shadows and rounded corners
- ✅ Modern SF Pro Display typography
- ✅ Clean white background
- ✅ Subtle blue accent colors (#3b82f6)
- ✅ Premium dark sidebar navigation
- ✅ Fully responsive (Desktop, Tablet, Mobile)

## 🛠 Technology Stack

- **Frontend:** React 18.3
- **Language:** TypeScript 5.5
- **Styling:** Tailwind CSS 3.4
- **Routing:** React Router DOM 6.26
- **PDF Generation:** jsPDF 2.5 + jspdf-autotable 3.8
- **Excel Export:** XLSX 0.18
- **Date Handling:** date-fns 3.6
- **Icons:** Lucide React 0.441
- **Build Tool:** Vite 5.4
- **Storage:** LocalStorage (Supabase-ready architecture)

## 📦 Installation

```bash
# Navigate to project directory
cd b2p-docs

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🚦 Getting Started

1. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open http://localhost:5173

2. **Configure Letterhead:**
   - Navigate to Settings → Letterhead
   - Upload your header, footer, logo, seal, and signature
   - See `LETTERHEAD_GUIDE.md` for optimal image specifications

3. **Set Up Numbering:**
   - Navigate to Settings → Numbering
   - Customize document number formats
   - Adjust counters as needed

4. **Add Customers:**
   - Navigate to Customers
   - Add customer details
   - Use customer search when creating documents

5. **Create Your First Document:**
   - Navigate to any document type (e.g., Quotations)
   - Click "New Quotation"
   - Fill in details, add line items
   - Save and download PDF

## 📄 PDF Output Features

✅ **A4 Layout** — Professional 210mm × 297mm format
✅ **Multi-page Support** — Automatic pagination for long documents
✅ **Header Repetition** — Company header on every page
✅ **Footer Repetition** — Company footer on every page
✅ **Edge-to-Edge Images** — Full-width header/footer rendering
✅ **Professional Tables** — Clean, alternating row colors
✅ **Proper Margins** — Balanced whitespace
✅ **GST/Tax Breakdown** — Clear totals section
✅ **Amount in Words** — Indian format (Lakhs, Crores)
✅ **Company Seal** — Bottom-left placement
✅ **Authorized Signature** — Bottom-right with line

## 💾 Data Storage

Currently uses **LocalStorage** for all data:
- Documents
- Customers
- Companies
- Settings (letterhead, numbering)

**Upgrade Path to Supabase:**
The storage layer (`src/utils/storage.ts`) is architected to easily swap LocalStorage with Supabase. All CRUD operations are centralized and can be replaced with API calls without changing component code.

## 🎯 All Buttons Are Functional

Every button in the UI has working backend logic:
- ✅ Create (all document types)
- ✅ Save
- ✅ Edit
- ✅ Delete (with confirmation)
- ✅ Duplicate
- ✅ Print
- ✅ PDF Download
- ✅ Email
- ✅ WhatsApp Share
- ✅ Search
- ✅ Filter
- ✅ Excel Export

**No placeholder buttons.** Everything works.

## 📱 Responsive Design

- **Desktop:** Full sidebar, wide tables, multi-column layouts
- **Tablet:** Collapsible sidebar, responsive grids
- **Mobile:** Hamburger menu, stacked cards, touch-optimized

## 🔐 Currency

- **Supported:** ₹ Indian Rupee (INR) only
- All calculations use INR
- Indian numbering format (Lakh, Crore)
- No multi-currency support (as requested)

## 📋 Project Structure

```
b2p-docs/
├── src/
│   ├── components/
│   │   ├── document/          # Document-specific components
│   │   │   ├── DocumentPreview.tsx
│   │   │   ├── LineItemsTable.tsx
│   │   │   └── TotalsPanel.tsx
│   │   ├── ui/                # Reusable UI components
│   │   │   ├── Badge.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── ConfirmDialog.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Textarea.tsx
│   │   │   └── Toast.tsx
│   │   ├── Layout.tsx
│   │   └── Sidebar.tsx
│   ├── pages/                 # Route pages
│   │   ├── CompaniesPage.tsx
│   │   ├── CustomersPage.tsx
│   │   ├── Dashboard.tsx
│   │   ├── DocumentEditor.tsx
│   │   ├── DocumentsPage.tsx
│   │   ├── DocumentView.tsx
│   │   ├── LetterheadSettings.tsx
│   │   ├── NumberingSettings.tsx
│   │   └── ReportsPage.tsx
│   ├── types/                 # TypeScript types
│   │   └── index.ts
│   ├── utils/                 # Utility functions
│   │   ├── calculations.ts
│   │   ├── documentLabels.ts
│   │   ├── excelExport.ts
│   │   ├── pdfGenerator.ts
│   │   └── storage.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── LETTERHEAD_GUIDE.md       # Image specifications guide
├── README.md                  # This file
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## 🐛 Known Limitations

- LocalStorage has ~5-10MB limit (use Supabase for large datasets)
- PDF generation is client-side (may be slow for very large documents)
- No authentication system (add Firebase/Supabase auth if needed)
- No cloud sync (upgrade to Supabase for multi-device access)

## 🔄 Future Enhancements

- [ ] Supabase integration for cloud storage
- [ ] User authentication and multi-tenancy
- [ ] Email sending via SendGrid/Mailgun
- [ ] Automated WhatsApp messaging via API
- [ ] Document templates library
- [ ] Recurring invoices
- [ ] Payment gateway integration
- [ ] Multi-language support
- [ ] Dark mode

## 📞 Support

For issues with letterhead alignment, see `LETTERHEAD_GUIDE.md`.

## 📜 License

Proprietary — B2P International

---

**Built with ❤️ for B2P International**

Production-ready · Fully functional · Zero placeholders · Premium UX
"# kiro-test" 
