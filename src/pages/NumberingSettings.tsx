import React, { useState } from 'react';
import { getSettings, saveSettings } from '../utils/storage';
import { DocumentType, DocumentNumberFormat } from '../types';
import { DOCUMENT_LABELS, ALL_DOCUMENT_TYPES } from '../utils/documentLabels';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useToast } from '../components/ui/Toast';
import { Save, Hash } from 'lucide-react';
import { format } from 'date-fns';

export default function NumberingSettings() {
  const { showToast } = useToast();
  const settings = getSettings();
  const [numbering, setNumbering] = useState({ ...settings.numbering });
  const [counters, setCounters] = useState({ ...settings.counters });

  const updateFormat = (type: DocumentType, field: keyof DocumentNumberFormat, value: string | number | boolean) => {
    setNumbering(prev => ({
      ...prev,
      [type]: { ...prev[type], [field]: value }
    }));
  };

  const getPreview = (type: DocumentType) => {
    const fmt = numbering[type];
    const year = format(new Date(), 'yyyy');
    const num = String(counters[type] + 1).padStart(fmt.digits, '0');
    const sep = fmt.separator || '-';
    if (fmt.includeYear) return `${fmt.prefix}${sep}${year}${sep}${num}`;
    return `${fmt.prefix}${sep}${num}`;
  };

  const handleSave = () => {
    saveSettings({ ...settings, numbering, counters });
    showToast('Numbering settings saved', 'success');
  };

  return (
    <div className="space-y-5 animate-fade-in max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Document Numbering</h1>
          <p className="text-sm text-slate-500 mt-0.5">Configure numbering formats for each document type</p>
        </div>
        <Button variant="primary" icon={<Save size={15} />} onClick={handleSave}>Save Settings</Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {ALL_DOCUMENT_TYPES.map(type => (
          <Card key={type}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Hash size={14} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-700">{DOCUMENT_LABELS[type]}</h3>
                  <p className="text-xs text-blue-600 font-mono mt-0.5">Preview: {getPreview(type)}</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Input
                label="Prefix"
                value={numbering[type].prefix}
                onChange={e => updateFormat(type, 'prefix', e.target.value.toUpperCase())}
                placeholder="e.g. INV"
              />
              <Input
                label="Separator"
                value={numbering[type].separator}
                onChange={e => updateFormat(type, 'separator', e.target.value)}
                placeholder="-"
              />
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Digits</label>
                <select
                  value={numbering[type].digits}
                  onChange={e => updateFormat(type, 'digits', parseInt(e.target.value))}
                  className="px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-white/80 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
                >
                  {[3,4,5,6].map(d => <option key={d} value={d}>{d} digits</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Include Year</label>
                <button
                  onClick={() => updateFormat(type, 'includeYear', !numbering[type].includeYear)}
                  className={`px-3 py-2.5 text-sm rounded-xl border transition-all font-medium ${
                    numbering[type].includeYear
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                  }`}
                >
                  {numbering[type].includeYear ? 'Yes (2026)' : 'No'}
                </button>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-slate-500">Current counter: {counters[type]}</span>
              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-500">Reset to:</label>
                <input
                  type="number"
                  min="0"
                  value={counters[type]}
                  onChange={e => setCounters(prev => ({ ...prev, [type]: parseInt(e.target.value) || 0 }))}
                  className="w-20 px-2 py-1 text-xs rounded-lg border border-slate-200 text-center focus:border-blue-400 outline-none"
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button variant="primary" icon={<Save size={15} />} onClick={handleSave}>Save Settings</Button>
      </div>
    </div>
  );
}
