import React from 'react';
import { ShieldCheck, Calendar, Laptop, Download, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { store } from '../../services/store';
import { WarrantyBadge } from '../../components/ui/Badges';

export const WarrantyPage: React.FC<{ onNavigate?: (page: string) => void }> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { success } = useToast();
  const warranties = store.getWarranties(user?.id);

  const handleDownloadCert = (id: string) => {
    success('Warranty Certificate Downloaded', 'Official PDF certificate saved.');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">TechCare Hardware Shield Warranties</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Active OEM parts and labor protection plans tied to your registered hardware.
        </p>
      </div>

      {warranties.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">No Active Hardware Warranties</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
            Completed hardware repairs and covered devices automatically receive official TechCare CareShield™ warranty coverage.
          </p>
          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('new-request')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              Book Hardware Diagnostic
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {warranties.map((w) => (
            <div
              key={w.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <WarrantyBadge status={w.status} />
                  <span className="text-xs font-mono font-bold text-slate-400">
                    {w.service_request_id ? `Ref #${w.service_request_id}` : `Policy #${w.policy_number}`}
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{w.device_name || w.device_model || 'Hardware System'}</h3>
                    <p className="text-xs text-slate-500">{w.service_name || w.provider || 'Hardware Protection'}</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs space-y-2">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Coverage Starts</span>
                    <span className="font-semibold text-slate-900">{w.start_date}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Coverage Expiry</span>
                    <span className="font-semibold text-slate-900">{w.end_date}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 text-slate-600">
                    <span className="font-semibold text-slate-800">Coverage Scope:</span> {w.terms}
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleDownloadCert(w.id)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Certificate PDF</span>
                </button>

                {onNavigate && (
                  <button
                    type="button"
                    onClick={() => onNavigate('new-request')}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold rounded-xl transition-colors"
                  >
                    Claim Warranty
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
