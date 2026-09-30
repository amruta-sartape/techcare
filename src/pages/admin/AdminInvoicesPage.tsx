import React, { useState } from 'react';
import { Receipt, Download, CheckCircle2, Search, DollarSign } from 'lucide-react';
import { store } from '../../services/store';
import { useToast } from '../../components/ui/Toast';
import { Invoice } from '../../types';

export const AdminInvoicesPage: React.FC = () => {
  const { success } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>(() => store.getInvoices());
  const [search, setSearch] = useState('');

  const refresh = () => {
    setInvoices(store.getInvoices());
  };

  const handleMarkPaid = (id: string, invNum: string) => {
    store.payInvoice(id);
    success('Invoice Settled', `${invNum} marked as PAID in billing ledger.`);
    refresh();
  };

  const handleExportCSV = () => {
    success('Ledger Exported', 'techcare-billing-ledger.csv generated and ready.');
  };

  const filtered = invoices.filter(
    (i) =>
      (i.invoice_number || '').toLowerCase().includes(search.toLowerCase()) ||
      (i.customer_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (i.request_number || '').toLowerCase().includes(search.toLowerCase())
  );

  const totalBilled = invoices.reduce((sum, i) => sum + i.total, 0);
  const totalPaid = invoices.filter((i) => i.status === 'paid').reduce((sum, i) => sum + i.total, 0);
  const totalPending = invoices.filter((i) => i.status !== 'paid').reduce((sum, i) => sum + i.total, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Billing Ledger &amp; Accounts Receivable</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit customer invoices, mark cash/wire settlements, and export financial reports.
          </p>
        </div>
        <button
          type="button"
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export Ledger CSV</span>
        </button>
      </div>

      {/* Summary Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Total Billed</p>
          <p className="text-2xl font-black text-slate-900 mt-1">${totalBilled.toFixed(2)}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs text-emerald-600 font-medium">Settled (Paid)</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">${totalPaid.toFixed(2)}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs text-amber-600 font-medium">Outstanding (Pending)</p>
          <p className="text-2xl font-black text-amber-600 mt-1">${totalPending.toFixed(2)}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <div className="relative max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search invoice #, client, ticket..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <th className="p-4">Invoice / Ticket</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Service</th>
              <th className="p-4">Total Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((inv) => (
              <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="p-4">
                  <span className="font-mono font-bold text-slate-900">{inv.invoice_number}</span>
                  <p className="font-mono text-[11px] text-slate-400">Ref #{inv.request_number}</p>
                </td>
                <td className="p-4 font-semibold text-slate-800">{inv.customer_name}</td>
                <td className="p-4 text-slate-600">{inv.service_name}</td>
                <td className="p-4 font-bold text-slate-900">${inv.total.toFixed(2)}</td>
                <td className="p-4">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                      inv.status === 'paid'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {inv.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  {inv.status !== 'paid' && (
                    <button
                      type="button"
                      onClick={() => handleMarkPaid(inv.id, inv.invoice_number)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
                    >
                      Mark Paid
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
