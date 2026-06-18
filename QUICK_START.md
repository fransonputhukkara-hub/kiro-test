# Quick Start Guide — B2P International Document Management

Get up and running in 5 minutes.

## Step 1: Install & Run (1 minute)

```bash
cd b2p-docs
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Step 2: Configure Letterhead (2 minutes)

1. Click **Settings** → **Letterhead** in sidebar
2. Upload your images:

### Required Images (Recommended Dimensions)

| Image | Dimensions | Format | Priority |
|-------|-----------|--------|----------|
| **Header** | 794 x 150 px | JPG/PNG | ⭐⭐⭐ High |
| **Footer** | 794 x 75 px | JPG/PNG | ⭐⭐⭐ High |
| **Seal** | 200 x 200 px | PNG | ⭐⭐ Medium |
| **Signature** | 400 x 120 px | PNG | ⭐⭐⭐ High |
| **Logo** | 200 x 200 px | PNG | ⭐ Low |

3. Fill in:
   - Company Name: `B2P International`
   - Tagline: `Excellence in Business Solutions`

4. Click **Save Settings**

**Tip:** Use PNG with transparent backgrounds for seal and signature for best results.

## Step 3: Add Your First Customer (1 minute)

1. Click **Customers** in sidebar
2. Click **Add Customer**
3. Fill in required fields:
   - Full Name: `John Doe`
   - Mobile: `9876543210`
   - Email: `john@example.com`
   - Address: `123 Main Street, City`
4. Click **Add Customer**

## Step 4: Create Your First Document (1 minute)

1. Click **Documents** → **Invoices** in sidebar
2. Click **New Invoice**
3. Search and select your customer
4. Add line items:
   - Description: `Web Development Services`
   - Quantity: `1`
   - Unit: `Job`
   - Rate: `50000`
   - Tax%: `18%`
5. Click **Add Item**
6. Review totals (auto-calculated)
7. Click **Save**

## Step 5: Download PDF & Share (30 seconds)

On the document view page:

- 📄 **PDF** — Download professional A4 PDF
- 🖨️ **Print** — Open browser print dialog
- ✉️ **Email** — Open email client with pre-filled content
- 💬 **WhatsApp** — Share via WhatsApp
- 📋 **Duplicate** — Create copy with new number
- ✏️ **Edit** — Modify document
- 🗑️ **Delete** — Remove document

## You're Done! 🎉

Your first invoice is ready. The PDF will include:
- ✅ Your uploaded header (top of every page)
- ✅ Your uploaded footer (bottom of every page)
- ✅ Professional table with calculations
- ✅ GST breakdown
- ✅ Amount in words
- ✅ Company seal and signature
- ✅ Multi-page support (if needed)

## Next Steps

### Customize Document Numbering
1. Go to **Settings** → **Numbering**
2. Customize format for each document type:
   - Prefix: `INV`, `QTN`, `WO`, etc.
   - Separator: `-` or `/`
   - Include year: Yes/No
   - Digits: 3-6
3. Preview shows: `INV-2026-0001`
4. Click **Save Settings**

### Add More Document Types

Create any of these document types with same workflow:
- 📝 **Quotation** — Sales quotes
- 🧾 **Invoice** — Payment invoices
- 📋 **Proforma Invoice** — Pro forma invoices
- 🔧 **Work Order** — Job orders
- 💳 **Payment Receipt** — Payment confirmations
- 📑 **Agreement** — Contracts/agreements
- 🤝 **Service Contract** — Service agreements
- 🛠️ **Job Sheet** — Technical job sheets
- 📄 **Custom Document** — Any other document type

### View Reports
1. Click **Reports** in sidebar
2. Select date range
3. Filter by document type
4. See:
   - Revenue breakdown
   - Top customers
   - Document statistics
5. Export to Excel

### Add Company Details
1. Click **Companies** in sidebar
2. Add company with:
   - Name, address, GST number
   - Bank details (for invoices)
   - Default terms & conditions
3. Use for different business entities

## Common Tasks

### Edit Existing Document
1. Go to document list page
2. Click **Edit** icon on any document
3. Make changes
4. Click **Save**

### Search Documents
1. Use search bar on document list page
2. Search by:
   - Document number: `INV-2026-0001`
   - Customer name: `John Doe`
   - Company name

### Filter Documents
1. Use status dropdown
2. Filter by: Draft, Sent, Approved, Paid, etc.

### Change Document Status
1. Open document in edit mode
2. Change **Status** dropdown
3. Options: Draft → Sent → Approved → Paid
4. Save changes

## Keyboard Shortcuts

- `Ctrl+F` — Focus search field
- `Ctrl+S` — Save document (in editor)
- `Esc` — Close modal/dialog
- `Ctrl+P` — Print (when viewing document)

## Tips & Tricks

### 💡 Customer Quick Select
When creating documents, start typing customer name in search field to see dropdown with existing customers. Click to auto-fill all details.

### 💡 Duplicate for Templates
Create a template document with standard items/terms, then use **Duplicate** button to reuse.

### 💡 Amount Calculations
All calculations are automatic:
- Line item total = (Qty × Rate) - Discount + Tax
- Document total updates in real-time
- GST calculated automatically

### 💡 Multi-page Documents
Add as many line items as needed. PDF automatically:
- Splits across multiple pages
- Repeats header/footer on each page
- Maintains proper spacing

### 💡 Backup Your Data
1. Go to **Reports**
2. Export documents to Excel regularly
3. Export customers to Excel
4. Keep Excel files as backups

### 💡 Mobile Responsive
- Access from phone/tablet
- Responsive design adapts to screen size
- Touch-friendly buttons
- Hamburger menu on mobile

## Default Settings

The system comes pre-configured with:
- ✅ Document numbering formats
- ✅ Tax rates: 0%, 5%, 12%, 18%, 28%
- ✅ Units: Nos, Pcs, Set, Lot, Unit, Kg, Ltr, Mtr, Sqft, Sqm, Day, Month, Hour, Job
- ✅ Status options: Draft, Sent, Approved, Rejected, Paid, Cancelled
- ✅ Currency: ₹ INR (Indian Rupee)

## Important Notes

### ⚠️ Data Storage
- Currently uses browser LocalStorage
- Data stays on your device only
- Don't use incognito/private mode (data is temporary)
- LocalStorage limit: ~5-10MB (~1000 documents)
- For more data, upgrade to Supabase

### ⚠️ Image Sizes
- Keep header/footer images under 500KB
- Use transparent PNG for seal/signature
- Follow LETTERHEAD_GUIDE.md for best results

### ⚠️ Browser Support
- Works best in Chrome/Edge
- Firefox and Safari also supported
- Not compatible with Internet Explorer

## Need Help?

- 📖 **README.md** — Full documentation
- 🖼️ **LETTERHEAD_GUIDE.md** — Image specifications
- 🔧 **TROUBLESHOOTING.md** — Fix common issues

## Example Workflow

### Creating a Complete Invoice

```
1. Customers → Add Customer → Save
2. Documents → Invoices → New Invoice
3. Search customer name → Select from dropdown
4. Add line items (products/services)
5. Edit notes/terms if needed
6. Save
7. View → Download PDF
8. Email or WhatsApp to customer
```

**Time:** ~2 minutes per invoice

---

You're now ready to manage all your business documents professionally! 🚀

Create your first few documents to get comfortable with the workflow. The interface is intuitive and designed for speed.
