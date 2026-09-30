import React, { useState, useEffect } from 'react';
import { Receipt, CheckCircle2, Download, CreditCard, Clock, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { store } from '../../services/store';
import { Invoice } from '../../types';
import { Modal } from '../../components/ui/Modal';

export const CustomerInvoicesPage: React.FC = () => {
  const { user } = useAuth();
  const { success } = useToast();

  const [invoices, setInvoices] = useState<Invoice[]>(() => store.getInvoices(user?.id));
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [viewInvoiceModal, setViewInvoiceModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    setInvoices(store.getInvoices(user?.id));
  }, [user]);

  const refreshList = () => {
    setInvoices(store.getInvoices(user?.id));
  };

  const handlePay = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setPayModalOpen(true);
  };

  const handleExecutePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;

    setIsProcessingPayment(true);
    setTimeout(() => {
      store.payInvoice(selectedInvoice.id);
      success('Payment Authorized', `Invoice ${selectedInvoice.invoice_number} has been settled in full.`);
      setIsProcessingPayment(false);
      setPayModalOpen(false);
      refreshList();
    }, 800);
  };

  const handleViewDetails = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setViewInvoiceModal(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Invoices &amp; Billing History</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          View transparent repair charges, download tax statements, and settle balances.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {invoices.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No invoices generated yet. Invoices appear automatically upon service completion.
          </div>
        ) : (
          invoices.map((inv) => (
            <div
              key={inv.id}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900">{inv.invoice_number}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                        inv.status === 'paid'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mt-1">{inv.service_name}</h4>
                  <p className="text-xs text-slate-500">
                    Due: {inv.due_date} • Ref: {inv.request_number}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Amount</span>
                  <p className="text-base font-black text-slate-900">₹{inv.total.toLocaleString('en-IN')}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleViewDetails(inv)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                  >
                    View Breakdown
                  </button>

                  {inv.status !== 'paid' && (
                    <button
                      type="button"
                      onClick={() => handlePay(inv)}
                      className="px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-colors shadow-xs"
                    >
                      Pay Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Payment Modal */}
      <Modal
        isOpen={payModalOpen}
        onClose={() => setPayModalOpen(false)}
        title="Secure Invoice Payment"
        subtitle={`Pay ${selectedInvoice?.invoice_number} • ₹${selectedInvoice?.total?.toLocaleString('en-IN')}`}
      >
        <form onSubmit={handleExecutePayment} className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
            <div className="flex justify-between font-semibold text-slate-700">
              <span>Service Subtotal</span>
              <span>₹{selectedInvoice?.subtotal?.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>GST (18%) &amp; E-Waste Handling</span>
              <span>₹{selectedInvoice?.tax?.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-slate-900 pt-2 border-t border-slate-200">
              <span>Total Payable</span>
              <span>₹{selectedInvoice?.total?.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Method</label>
            <div className="p-3 bg-white border-2 border-blue-600 rounded-xl flex items-center justify-between text-xs font-bold text-slate-800">
              <span className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-blue-600" />
                UPI / NetBanking / RuPay / Cards (Razorpay Secure Gateway)
              </span>
              <span className="text-emerald-600 text-[10px]">Verified</span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setPayModalOpen(false)}
              className="text-xs font-semibold text-slate-600 px-4 py-2 rounded-xl hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessingPayment}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2 rounded-xl shadow-xs"
            >
              {isProcessingPayment ? 'Authorizing Payment...' : `Authorize ₹${selectedInvoice?.total?.toLocaleString('en-IN')}`}
            </button>
          </div>
        </form>
      </Modal>

      {/* Invoice Breakdown Modal */}
      <Modal
        isOpen={viewInvoiceModal}
        onClose={() => setViewInvoiceModal(false)}
        title="Official Service Statement"
        subtitle={selectedInvoice?.invoice_number}
      >
        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <p className="font-bold text-slate-900">{selectedInvoice?.service_name}</p>
              <p className="text-slate-500">Ticket #{selectedInvoice?.request_number}</p>
            </div>
            <span className="font-mono text-sm font-bold text-slate-900">
              ₹{selectedInvoice?.total?.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="space-y-2">
            <p className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Line Item Breakdown</p>
            {selectedInvoice?.items.map((it) => (
              <div key={it.id} className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-700">{it.description} (x{it.quantity})</span>
                <span className="font-bold text-slate-900">₹{it.amount?.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-3">
            <button
              onClick={() => {
                success('Statement Downloaded', 'PDF invoice sent to your browser download queue.');
                setViewInvoiceModal(false);
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-xl transition-colors"
            >
              <Download className="w-4 h-4" />
              Download PDF Invoice
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
