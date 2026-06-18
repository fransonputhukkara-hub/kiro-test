import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import DocumentsPage from './pages/DocumentsPage';
import DocumentEditor from './pages/DocumentEditor';
import DocumentView from './pages/DocumentView';
import CustomersPage from './pages/CustomersPage';
import CompaniesPage from './pages/CompaniesPage';
import LetterheadSettings from './pages/LetterheadSettings';
import NumberingSettings from './pages/NumberingSettings';
import ReportsPage from './pages/ReportsPage';
import { ToastProvider } from './components/ui/Toast';
import { ALL_DOCUMENT_TYPES } from './utils/documentLabels';

export default function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />

          {ALL_DOCUMENT_TYPES.map(type => (
            <React.Fragment key={type}>
              <Route path={`documents/${type}`} element={<DocumentsPage docType={type} />} />
              <Route path={`documents/${type}/new`} element={<DocumentEditor docType={type} />} />
              <Route path={`documents/${type}/:id/edit`} element={<DocumentEditor docType={type} />} />
              <Route path={`documents/${type}/:id`} element={<DocumentView />} />
            </React.Fragment>
          ))}

          <Route path="customers" element={<CustomersPage />} />
          <Route path="companies" element={<CompaniesPage />} />
          <Route path="settings/letterhead" element={<LetterheadSettings />} />
          <Route path="settings/numbering" element={<NumberingSettings />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </ToastProvider>
  );
}
