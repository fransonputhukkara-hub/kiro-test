import React from 'react';
import { LineItem } from '../../types';
import { calculateLineItem } from '../../utils/calculations';
import { Trash2, Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface LineItemsTableProps {
  items: LineItem[];
  onChange: (items: LineItem[]) => void;
}

const UNITS = ['Nos', 'Pcs', 'Set', 'Lot', 'Unit', 'Kg', 'Ltr', 'Mtr', 'Sqft', 'Sqm', 'Day', 'Month', 'Hour', 'Job'];
const TAX_RATES = [0, 5, 12, 18, 28];

export default function LineItemsTable({ items, onChange }: LineItemsTableProps) {
  const addItem = () => {
    const newItem: LineItem = {
      id: uuidv4(),
      description: '',
      quantity: 1,
      unit: 'Nos',
      rate: 0,
      discount: 0,
      taxRate: 18,
      subtotal: 0,
    };
    onChange([...items, calculateLineItem(newItem)]);
  };

  const updateItem = (id: string, field: keyof LineItem, value: string | number) => {
    const updated = items.map(item => {
      if (item.id !== id) return item;
      const updated = { ...item, [field]: value };
      return calculateLineItem(updated);
    });
    onChange(updated);
  };

  const removeItem = (id: string) => {
    onChange(items.filter(item => item.id !== id));
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Desktop table */}
      <div className="hidden lg:block overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="px-3 py-2.5 text-left text-xs font-semibold w-8">#</th>
              <th className="px-3 py-2.5 text-left text-xs font-semibold">Description</th>
              <th className="px-3 py-2.5 text-center text-xs font-semibold w-16">Qty</th>
              <th className="px-3 py-2.5 text-center text-xs font-semibold w-20">Unit</th>
              <th className="px-3 py-2.5 text-right text-xs font-semibold w-24">Rate (₹)</th>
              <th className="px-3 py-2.5 text-center text-xs font-semibold w-16">Disc%</th>
              <th className="px-3 py-2.5 text-center text-xs font-semibold w-16">Tax%</th>
              <th className="px-3 py-2.5 text-right text-xs font-semibold w-24">Amount (₹)</th>
              <th className="px-3 py-2.5 w-8"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                <td className="px-3 py-2 text-slate-500 text-xs">{idx + 1}</td>
                <td className="px-3 py-2">
                  <input
                    type="text"
                    value={item.description}
                    onChange={e => updateItem(item.id, 'description', e.target.value)}
                    className="w-full text-sm bg-transparent border-0 outline-none focus:bg-blue-50 focus:rounded px-1"
                    placeholder="Item description..."
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={e => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                    className="w-full text-sm bg-transparent border-0 outline-none text-center focus:bg-blue-50 focus:rounded px-1"
                    min="0"
                  />
                </td>
                <td className="px-3 py-2">
                  <select
                    value={item.unit}
                    onChange={e => updateItem(item.id, 'unit', e.target.value)}
                    className="w-full text-xs bg-transparent border-0 outline-none text-center focus:bg-blue-50 focus:rounded"
                  >
                    {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    value={item.rate}
                    onChange={e => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                    className="w-full text-sm bg-transparent border-0 outline-none text-right focus:bg-blue-50 focus:rounded px-1"
                    min="0"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    value={item.discount}
                    onChange={e => updateItem(item.id, 'discount', parseFloat(e.target.value) || 0)}
                    className="w-full text-sm bg-transparent border-0 outline-none text-center focus:bg-blue-50 focus:rounded px-1"
                    min="0" max="100"
                  />
                </td>
                <td className="px-3 py-2">
                  <select
                    value={item.taxRate}
                    onChange={e => updateItem(item.id, 'taxRate', parseFloat(e.target.value))}
                    className="w-full text-xs bg-transparent border-0 outline-none text-center focus:bg-blue-50 focus:rounded"
                  >
                    {TAX_RATES.map(r => <option key={r} value={r}>{r}%</option>)}
                  </select>
                </td>
                <td className="px-3 py-2 text-right font-medium text-slate-800 text-sm">
                  {item.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
                <td className="px-2 py-2">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-400 hover:text-red-600 transition-colors p-1 rounded"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center py-8 text-slate-400 text-sm">
                  No items added. Click "Add Item" to start.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="lg:hidden space-y-3">
        {items.map((item, idx) => (
          <div key={item.id} className="glass-card rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-blue-600 uppercase">Item {idx + 1}</span>
              <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600">
                <Trash2 size={14} />
              </button>
            </div>
            <input
              type="text"
              value={item.description}
              onChange={e => updateItem(item.id, 'description', e.target.value)}
              placeholder="Description"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-slate-500">Qty</label>
                <input type="number" value={item.quantity} onChange={e => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                  className="w-full px-2 py-1.5 text-sm rounded-lg border border-slate-200 focus:border-blue-400" />
              </div>
              <div>
                <label className="text-xs text-slate-500">Unit</label>
                <select value={item.unit} onChange={e => updateItem(item.id, 'unit', e.target.value)}
                  className="w-full px-2 py-1.5 text-sm rounded-lg border border-slate-200 focus:border-blue-400">
                  {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500">Rate (₹)</label>
                <input type="number" value={item.rate} onChange={e => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                  className="w-full px-2 py-1.5 text-sm rounded-lg border border-slate-200 focus:border-blue-400" />
              </div>
              <div>
                <label className="text-xs text-slate-500">Disc%</label>
                <input type="number" value={item.discount} onChange={e => updateItem(item.id, 'discount', parseFloat(e.target.value) || 0)}
                  min="0" max="100"
                  className="w-full px-2 py-1.5 text-sm rounded-lg border border-slate-200 focus:border-blue-400" />
              </div>
              <div>
                <label className="text-xs text-slate-500">Tax%</label>
                <select value={item.taxRate} onChange={e => updateItem(item.id, 'taxRate', parseFloat(e.target.value))}
                  className="w-full px-2 py-1.5 text-sm rounded-lg border border-slate-200 focus:border-blue-400">
                  {TAX_RATES.map(r => <option key={r} value={r}>{r}%</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500">Amount</label>
                <div className="px-2 py-1.5 text-sm font-semibold text-slate-800 bg-slate-50 rounded-lg">
                  ₹{item.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addItem}
        className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-blue-600 border-2 border-dashed border-blue-200 rounded-xl hover:bg-blue-50 hover:border-blue-400 transition-all"
      >
        <Plus size={16} />
        Add Item
      </button>
    </div>
  );
}
