import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, FileText, Users, Building2, Settings,
  ChevronDown, ChevronRight, BarChart3, X, Receipt,
  ClipboardList, FileCheck, Briefcase, FileSignature,
  Scroll, Wrench, File, CreditCard
} from 'lucide-react';

interface SidebarProps {
  onClose?: () => void;
}

const docTypeConfig = [
  { type: 'quotation', label: 'Quotations', icon: FileText },
  { type: 'invoice', label: 'Invoices', icon: Receipt },
  { type: 'proforma_invoice', label: 'Proforma Invoices', icon: FileCheck },
  { type: 'work_order', label: 'Work Orders', icon: Briefcase },
  { type: 'payment_receipt', label: 'Payment Receipts', icon: CreditCard },
  { type: 'agreement', label: 'Agreements', icon: FileSignature },
  { type: 'service_contract', label: 'Service Contracts', icon: Scroll },
  { type: 'job_sheet', label: 'Job Sheets', icon: Wrench },
  { type: 'custom', label: 'Custom Documents', icon: File },
];

export default function Sidebar({ onClose }: SidebarProps) {
  const location = useLocation();
  const [docsExpanded, setDocsExpanded] = useState(true);
  const [settingsExpanded, setSettingsExpanded] = useState(false);

  const isDocsActive = location.pathname.startsWith('/documents');
  const isSettingsActive = location.pathname.startsWith('/settings');

  return (
    <div className="flex flex-col h-full glass-dark text-white shadow-2xl">
      {/* Logo area */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">B2</span>
          </div>
          <div>
            <div className="font-bold text-sm text-white">B2P International</div>
            <div className="text-xs text-slate-400">Document Manager</div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg hover:bg-white/10 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {/* Dashboard */}
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `sidebar-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isActive
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
                : 'text-slate-300 hover:bg-white/10 hover:text-white'
            }`
          }
        >
          <LayoutDashboard size={17} />
          Dashboard
        </NavLink>

        {/* Documents */}
        <div>
          <button
            onClick={() => setDocsExpanded(!docsExpanded)}
            className={`w-full sidebar-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isDocsActive && !docsExpanded
                ? 'bg-blue-600/50 text-white'
                : 'text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <ClipboardList size={17} />
            <span className="flex-1 text-left">Documents</span>
            {docsExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>

          {docsExpanded && (
            <div className="mt-1 ml-3 pl-3 border-l border-white/10 space-y-0.5">
              {docTypeConfig.map(({ type, label, icon: Icon }) => (
                <NavLink
                  key={type}
                  to={`/documents/${type}`}
                  className={({ isActive }) =>
                    `sidebar-item flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-blue-500/80 text-white shadow-md'
                        : 'text-slate-400 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  <Icon size={14} />
                  {label}
                </NavLink>
              ))}
            </div>
          )}
        </div>

        {/* Customers */}
        <NavLink
          to="/customers"
          className={({ isActive }) =>
            `sidebar-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isActive
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
                : 'text-slate-300 hover:bg-white/10 hover:text-white'
            }`
          }
        >
          <Users size={17} />
          Customers
        </NavLink>

        {/* Companies */}
        <NavLink
          to="/companies"
          className={({ isActive }) =>
            `sidebar-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isActive
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
                : 'text-slate-300 hover:bg-white/10 hover:text-white'
            }`
          }
        >
          <Building2 size={17} />
          Companies
        </NavLink>

        {/* Reports */}
        <NavLink
          to="/reports"
          className={({ isActive }) =>
            `sidebar-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isActive
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
                : 'text-slate-300 hover:bg-white/10 hover:text-white'
            }`
          }
        >
          <BarChart3 size={17} />
          Reports
        </NavLink>

        {/* Settings */}
        <div>
          <button
            onClick={() => setSettingsExpanded(!settingsExpanded)}
            className={`w-full sidebar-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isSettingsActive && !settingsExpanded
                ? 'bg-blue-600/50 text-white'
                : 'text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Settings size={17} />
            <span className="flex-1 text-left">Settings</span>
            {settingsExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>

          {settingsExpanded && (
            <div className="mt-1 ml-3 pl-3 border-l border-white/10 space-y-0.5">
              <NavLink
                to="/settings/letterhead"
                className={({ isActive }) =>
                  `sidebar-item flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-500/80 text-white shadow-md'
                      : 'text-slate-400 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <FileText size={14} />
                Letterhead
              </NavLink>
              <NavLink
                to="/settings/numbering"
                className={({ isActive }) =>
                  `sidebar-item flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-500/80 text-white shadow-md'
                      : 'text-slate-400 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <Settings size={14} />
                Numbering
              </NavLink>
            </div>
          )}
        </div>
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/10">
        <div className="text-xs text-slate-500 text-center">v1.0.0 · B2P International</div>
      </div>
    </div>
  );
}
