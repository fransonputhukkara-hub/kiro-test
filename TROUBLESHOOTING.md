# Troubleshooting Guide

## Letterhead Alignment Issues

### Problem: Header/Footer appear too small or too large in PDF
**Solution:**
1. Check your image dimensions match recommendations:
   - Header: 794 x 150 pixels (5.3:1 ratio)
   - Footer: 794 x 75 pixels (10.5:1 ratio)
2. Use image editing software to resize to exact dimensions
3. Re-upload the corrected images

### Problem: Seal or Signature appears stretched
**Solution:**
1. Ensure proper aspect ratios:
   - Seal: 200 x 200 pixels (1:1 square)
   - Signature: 400 x 120 pixels (3:1 horizontal)
2. Use PNG format with transparent background
3. Don't use images with excessive whitespace around edges

### Problem: Header/Footer don't appear edge-to-edge
**Solution:**
This is now fixed in the latest version. Header and footer images automatically stretch from edge to edge (0 margins). If you still see gaps:
1. Clear browser cache (Ctrl+F5)
2. Rebuild the app: `npm run build`
3. Restart dev server: `npm run dev`

### Problem: Preview looks different from PDF
**Solution:**
The preview should now match PDF output exactly. If you see differences:
1. Ensure you've uploaded the same letterhead images
2. Check that your header/footer images are the correct dimensions
3. Try downloading the PDF and comparing side-by-side

## PDF Download Issues

### Problem: PDF download button doesn't work
**Solution:**
1. Check browser console for errors (F12)
2. Ensure you have items added to the document
3. Verify customer name is filled (required field)
4. Try a different browser (Chrome/Edge recommended)

### Problem: PDF is blank or missing content
**Solution:**
1. Check that document has line items
2. Verify letterhead images are properly loaded (not broken links)
3. Try removing letterhead images temporarily to isolate the issue
4. Check browser console for image loading errors

### Problem: PDF takes too long to generate
**Solution:**
1. Reduce letterhead image file sizes (compress images)
2. Keep images under 500KB each
3. Use JPG instead of PNG for photos (header/footer)
4. Use PNG only for logo/seal/signature (transparent background needed)

## Data Issues

### Problem: Documents disappear after browser refresh
**Solution:**
1. Check LocalStorage isn't full (browser limit: ~5-10MB)
2. Don't use private/incognito mode (LocalStorage is temporary)
3. Check browser settings allow LocalStorage
4. Try exporting data to Excel as backup before clearing

### Problem: Can't delete a document
**Solution:**
1. Close any open modals/dialogs
2. Try refreshing the page
3. Check browser console for JavaScript errors
4. Ensure you clicked "Delete" in the confirmation dialog

### Problem: Document numbers reset to 1
**Solution:**
This shouldn't happen. If it does:
1. Go to Settings → Numbering
2. Check the counter value for the affected document type
3. Manually reset to the correct number
4. Save settings

## Customer/Company Issues

### Problem: Customer search doesn't show results
**Solution:**
1. Ensure customers are actually added (check Customers page)
2. Type at least 2 characters to trigger search
3. Search matches: name, company name, phone, email
4. Check for typos in customer data

### Problem: Customer details don't auto-fill
**Solution:**
1. Make sure you select from the dropdown (don't just type and move on)
2. Click on the customer name in the dropdown to select
3. If dropdown doesn't appear, click in the search field to focus it

## Excel Export Issues

### Problem: Excel file is empty
**Solution:**
1. Ensure you have documents in the selected date range
2. Check filters (document type, status)
3. Try exporting "All Types" with a wider date range
4. Use a recent version of Excel or Google Sheets to open

### Problem: Excel download doesn't start
**Solution:**
1. Check browser pop-up blocker
2. Try a different browser
3. Ensure JavaScript is enabled
4. Check browser download settings

## Email/WhatsApp Issues

### Problem: Email button doesn't open email client
**Solution:**
1. This requires a default email client (Outlook, Thunderbird, Mail app)
2. If using web email only (Gmail, Yahoo), manually copy the message
3. On mobile, ensure you have an email app installed
4. Check browser permissions for opening external applications

### Problem: WhatsApp link doesn't work
**Solution:**
1. Ensure WhatsApp is installed (desktop or web.whatsapp.com open)
2. Customer phone number must be in correct format
3. WhatsApp Web requires phone to be connected
4. Try adding country code +91 if not automatically added

## Performance Issues

### Problem: App is slow
**Solution:**
1. Check number of documents (LocalStorage performs poorly >1000 docs)
2. Clear browser cache
3. Close other browser tabs
4. Consider upgrading to Supabase for large datasets

### Problem: Build fails with memory error
**Solution:**
1. Close other applications
2. Increase Node.js memory: `NODE_OPTIONS=--max-old-space-size=4096 npm run build`
3. Run `npm cache clean --force`
4. Delete `node_modules` and run `npm install` again

## Image Upload Issues

### Problem: Image upload fails silently
**Solution:**
1. Check file size (keep under 2MB)
2. Use supported formats: PNG, JPG, JPEG
3. Try converting to JPG if PNG fails
4. Use online image compressor to reduce file size

### Problem: Uploaded image looks blurry in PDF
**Solution:**
1. Use higher resolution source images (minimum 150 DPI)
2. Ensure images are not upscaled from small originals
3. Use vector formats (SVG) where possible, convert to PNG
4. Don't save JPG with too much compression

## Build/Development Issues

### Problem: `npm install` fails
**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Problem: `npm run dev` shows port already in use
**Solution:**
1. Kill the existing process:
   - Windows: `netstat -ano | findstr :5173` then `taskkill /PID <PID> /F`
   - Mac/Linux: `lsof -ti:5173 | xargs kill`
2. Or change port in `vite.config.ts`:
   ```ts
   export default defineConfig({
     plugins: [react()],
     server: { port: 3000 }
   })
   ```

### Problem: TypeScript errors after update
**Solution:**
```bash
# Rebuild TypeScript
npx tsc --noEmit

# If still errors, delete and reinstall types
rm -rf node_modules/@types
npm install
```

## Browser Compatibility

### Supported Browsers
- ✅ Chrome 90+ (Recommended)
- ✅ Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ❌ Internet Explorer (Not supported)

### Problem: UI looks broken in older browser
**Solution:**
1. Update to latest browser version
2. Clear browser cache
3. Try Chrome/Edge if using Firefox/Safari
4. Check browser console for JavaScript errors

## Still Having Issues?

1. **Check browser console** (F12 → Console tab) for error messages
2. **Clear all site data** (Settings → Privacy → Clear browsing data)
3. **Try different browser** to isolate browser-specific issues
4. **Check LETTERHEAD_GUIDE.md** for image specifications
5. **Rebuild from scratch**: `rm -rf node_modules dist && npm install && npm run build`

## Quick Fixes Checklist

- [ ] Clear browser cache (Ctrl+F5)
- [ ] Check browser console for errors
- [ ] Verify letterhead images are correct dimensions
- [ ] Ensure customer name is filled in documents
- [ ] Try different browser (Chrome recommended)
- [ ] Check LocalStorage isn't full
- [ ] Restart dev server (`npm run dev`)
- [ ] Rebuild app (`npm run build`)

## Getting Help

If none of these solutions work:
1. Note the exact error message from browser console
2. Document steps to reproduce the issue
3. Take screenshots showing the problem
4. Check if issue happens in different browsers
5. Contact B2P International support with details

---

Most issues are related to:
1. **Image dimensions** not matching recommendations → See LETTERHEAD_GUIDE.md
2. **Browser cache** showing old version → Hard refresh (Ctrl+F5)
3. **LocalStorage limits** with large datasets → Consider Supabase upgrade
