import React, { useState, useRef } from 'react';
import { getSettings, saveSettings } from '../utils/storage';
import { Letterhead } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useToast } from '../components/ui/Toast';
import { Upload, X, Save, Image, Eye } from 'lucide-react';

type ImageField = 'headerImage' | 'footerImage' | 'logo' | 'seal' | 'signature';

const IMAGE_FIELDS: { field: ImageField; label: string; description: string }[] = [
  { field: 'headerImage', label: 'Company Header', description: 'Full-width header image (A4: 794x150px recommended, will stretch edge-to-edge)' },
  { field: 'footerImage', label: 'Company Footer', description: 'Full-width footer image (A4: 794x75px recommended, will stretch edge-to-edge)' },
  { field: 'logo', label: 'Company Logo', description: 'Square logo for fallback header (200x200px or 1:1 ratio recommended)' },
  { field: 'seal', label: 'Company Seal', description: 'Circular/square company seal (200x200px or 1:1 ratio recommended)' },
  { field: 'signature', label: 'Authorized Signature', description: 'Signature image (400x120px or 3:1 ratio recommended, transparent PNG best)' },
];

export default function LetterheadSettings() {
  const { showToast } = useToast();
  const settings = getSettings();
  const [letterhead, setLetterhead] = useState<Letterhead>({ ...settings.letterhead });
  const [previewField, setPreviewField] = useState<ImageField | null>(null);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleImageUpload = (field: ImageField, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setLetterhead(prev => ({ ...prev, [field]: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    saveSettings({ ...settings, letterhead });
    showToast('Letterhead settings saved', 'success');
  };

  return (
    <div className="space-y-5 animate-fade-in max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Letterhead Settings</h1>
          <p className="text-sm text-slate-500 mt-0.5">Configure your company letterhead for all documents</p>
        </div>
        <Button variant="primary" icon={<Save size={15} />} onClick={handleSave}>Save Settings</Button>
      </div>

      <Card>
        <h3 className="font-semibold text-slate-700 mb-4">Company Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Company Name" value={letterhead.companyName}
            onChange={e => setLetterhead(prev => ({ ...prev, companyName: e.target.value }))} placeholder="Your company name" />
          <Input label="Tagline / Slogan" value={letterhead.tagline || ''}
            onChange={e => setLetterhead(prev => ({ ...prev, tagline: e.target.value }))} placeholder="Your company tagline" />
        </div>
      </Card>

      {IMAGE_FIELDS.map(({ field, label, description }) => (
        <Card key={field}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-700">{label}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{description}</p>
            </div>
            {letterhead[field] && (
              <button onClick={() => setPreviewField(previewField === field ? null : field)}
                className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700">
                <Eye size={14} />{previewField === field ? 'Hide' : 'Preview'}
              </button>
            )}
          </div>
          {previewField === field && letterhead[field] && (
            <div className="mb-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <img src={letterhead[field]} alt={label} className="max-w-full object-contain rounded-lg max-h-32" />
            </div>
          )}
          <div className="flex items-center gap-3">
            {letterhead[field] ? (
              <div className="flex items-center gap-2 flex-1">
                <div className="flex-1 px-3 py-2 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2">
                  <Image size={14} className="text-green-600" />
                  <span className="text-sm text-green-700 font-medium">{label} uploaded</span>
                </div>
                <button onClick={() => setLetterhead(prev => ({ ...prev, [field]: undefined }))}
                  className="p-2 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-colors"><X size={14} /></button>
                <button onClick={() => fileRefs.current[field]?.click()}
                  className="px-3 py-2 text-sm rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">Replace</button>
              </div>
            ) : (
              <button onClick={() => fileRefs.current[field]?.click()}
                className="flex-1 flex flex-col items-center gap-2 py-6 border-2 border-dashed border-slate-300 rounded-xl hover:border-blue-400 hover:bg-blue-50/50 transition-all text-slate-500 hover:text-blue-600">
                <Upload size={22} />
                <span className="text-sm font-medium">Click to upload {label}</span>
                <span className="text-xs opacity-70">PNG, JPG, JPEG supported</span>
              </button>
            )}
            <input ref={el => { fileRefs.current[field] = el; }} type="file" accept="image/*" className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(field, f); e.target.value = ''; }} />
          </div>
        </Card>
      ))}

      <Card className="border border-blue-200 bg-blue-50/50">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Eye size={16} className="text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-blue-800 text-sm">Header & Footer on Every Page</h4>
            <p className="text-xs text-blue-600 mt-1">
              Header and footer appear on every page of documents in both preview and PDF/print output.
              Without a header image, a professional gradient header with your company name is used automatically.
            </p>
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button variant="primary" icon={<Save size={15} />} onClick={handleSave}>Save Settings</Button>
      </div>
    </div>
  );
}
