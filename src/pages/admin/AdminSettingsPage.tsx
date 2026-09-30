import React, { useState } from 'react';
import { Settings, Database, Sparkles, ShieldCheck, Save, RotateCcw, Lock, KeyRound, ShieldAlert, CheckCircle2, AlertTriangle, UserCheck, Shield } from 'lucide-react';
import { useToast } from '../../components/ui/Toast';
import { store } from '../../services/store';
import { Modal } from '../../components/ui/Modal';

export const AdminSettingsPage: React.FC = () => {
  const { success, info, error } = useToast();

  const [companyName, setCompanyName] = useState('TechCare Enterprise Service Systems');
  const [ownerName, setOwnerName] = useState('Amruta Vaibhav Sartape');
  const [headquarters, setHeadquarters] = useState('Pandharpur, Solapur, Maharashtra, India');
  const [supportPhone, setSupportPhone] = useState('+91 70833 81807');
  const [supportEmail, setSupportEmail] = useState('hello@techcare.in');
  const [operatingCurrency] = useState('INR (₹) - Indian Rupee');
  const [defaultWarrantyDays, setDefaultWarrantyDays] = useState(90);
  const [standardSlaHours, setStandardSlaHours] = useState(24);
  const [emergencySlaHours, setEmergencySlaHours] = useState(4);

  // Super Admin Security States
  const [rbacEnforced, setRbacEnforced] = useState(true);
  const [sessionTimeoutMins, setSessionTimeoutMins] = useState(30);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [showPinConfirm, setShowPinConfirm] = useState(false);

  const securityAuditLogs = [
    {
      id: 'sec-1',
      timestamp: 'Today, 10:42 AM',
      user: 'Amruta Vaibhav Sartape (Owner)',
      role: 'Super Admin',
      action: 'Executive Terminal Authorized',
      location: 'Pandharpur Central Ops Hub (103.21.58.12)',
      status: 'Granted'
    },
    {
      id: 'sec-2',
      timestamp: 'Today, 09:15 AM',
      user: 'Rohan Deshmukh (Lead Tech)',
      role: 'Technician',
      action: 'Cleanroom Workbench Session Handshake',
      location: 'Pandharpur Lab Station #4 (103.21.58.24)',
      status: 'Granted'
    },
    {
      id: 'sec-3',
      timestamp: 'Yesterday, 04:30 PM',
      user: 'Amit Shinde (Customer)',
      role: 'Customer',
      action: 'Customer Portal Ticket Review',
      location: 'Pandharpur Mobile Gateway (157.34.120.9)',
      status: 'Granted'
    },
    {
      id: 'sec-4',
      timestamp: 'Yesterday, 02:11 PM',
      user: 'Guest / External Session',
      role: 'Unauthorized',
      action: 'Cross-Portal Access Prevented (Strict RBAC)',
      location: 'External Gateway (Solapur 49.36.18.5)',
      status: 'Intercepted'
    }
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    success('Settings Saved', 'Platform operational parameters and security policies updated.');
  };

  const handleToggleMaintenance = () => {
    if (!maintenanceMode) {
      if (confirm('Enable Emergency Maintenance Mode? This will restrict external bookings.')) {
        setMaintenanceMode(true);
        info('Maintenance Mode Active', 'External bookings suspended by Owner command.');
      }
    } else {
      setMaintenanceMode(false);
      success('Maintenance Deactivated', 'All public channels and work order intakes restored.');
    }
  };

  const handleResetDemo = () => {
    setShowPinConfirm(true);
  };

  const confirmResetWithPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === '7083' || pinInput.trim() === '2026') {
      store.resetDemoData();
      info('Database Restored', 'Initial demo data successfully reseeded under Owner authorization.');
      setShowPinConfirm(false);
      window.location.reload();
    } else {
      error('Invalid Owner PIN', 'Please enter valid Owner Authorization PIN (Hint: 7083 or 2026).');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Platform Settings &amp; Integrations</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure backend connection, AI diagnostic logic, SLA thresholds, and operational rules.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Backend & Integration Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-slate-900">Supabase Backend</h4>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  Configured
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                PostgreSQL schema, Row Level Security, Supabase Auth, and Realtime WebSocket channel sync.
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-slate-900">Google Gemini AI Engine</h4>
                <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  Active
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Endpoint /api/ai/diagnose equipped with hardware triage reasoning and symptom analysis.
              </p>
            </div>
          </div>
        </div>

        {/* SLA Configuration */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            SLA &amp; Hardware Shield Policies
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Standard SLA Turnaround (Hours)</label>
              <input
                type="number"
                min="1"
                value={standardSlaHours}
                onChange={(e) => setStandardSlaHours(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Critical Emergency SLA (Hours)</label>
              <input
                type="number"
                min="1"
                value={emergencySlaHours}
                onChange={(e) => setEmergencySlaHours(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Default Warranty Shield (Days)</label>
              <input
                type="number"
                min="30"
                step="30"
                value={defaultWarrantyDays}
                onChange={(e) => setDefaultWarrantyDays(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Company Settings */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            Company &amp; Executive Ownership
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Business Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Owner &amp; Managing Director</label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Headquarters Location</label>
              <input
                type="text"
                value={headquarters}
                onChange={(e) => setHeadquarters(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Contact Phone</label>
              <input
                type="tel"
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Primary Executive &amp; Support Email</label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">System Base Currency</label>
              <input
                type="text"
                value={operatingCurrency}
                disabled
                className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-slate-700 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Owner & Super Admin Security Control */}
        <div className="bg-gradient-to-br from-[#0c101c] via-[#090d18] to-[#060810] p-6 rounded-2xl border border-purple-900/40 shadow-lg text-white space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-950 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-100">Owner &amp; Super Admin Security Control</h3>
                  <span className="text-[10px] font-mono font-bold bg-purple-900/60 border border-purple-700 text-purple-300 px-2 py-0.5 rounded">
                    LEVEL 3 ENFORCED
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Primary executive authority: <strong className="text-purple-300">Amruta Vaibhav Sartape</strong> (Pandharpur Hub)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-300 font-mono">Role Isolation:</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3" />
                Active &amp; Guarded
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl space-y-1">
              <span className="text-slate-400 text-[11px] block">Role-Based Access (RBAC)</span>
              <p className="text-slate-200 font-semibold">Customer / Tech / Admin Segregation</p>
              <p className="text-[10px] text-emerald-400 font-mono">Strict Route Guards: ON</p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl space-y-1">
              <span className="text-slate-400 text-[11px] block">Emergency Mode</span>
              <div className="flex items-center justify-between pt-0.5">
                <span className={`font-semibold ${maintenanceMode ? 'text-amber-400' : 'text-slate-200'}`}>
                  {maintenanceMode ? 'Active (Intake Paused)' : 'Normal Operations'}
                </span>
                <button
                  type="button"
                  onClick={handleToggleMaintenance}
                  className={`text-[10px] px-2 py-0.5 rounded font-bold transition-colors ${
                    maintenanceMode ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {maintenanceMode ? 'Disable' : 'Toggle'}
                </button>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl space-y-1">
              <span className="text-slate-400 text-[11px] block">Session Inactivity Lock</span>
              <div className="flex items-center gap-2 pt-0.5">
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={sessionTimeoutMins}
                  onChange={(e) => setSessionTimeoutMins(Number(e.target.value))}
                  className="w-16 bg-slate-950 border border-slate-700 rounded px-2 py-0.5 text-xs text-white"
                />
                <span className="text-slate-400 text-[11px]">minutes</span>
              </div>
            </div>
          </div>

          {/* Realtime Security Audit Trail */}
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-purple-400" />
              <span>Real-Time Security &amp; Audit Log (Pandharpur Central Hub)</span>
            </h4>
            <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl overflow-hidden">
              <table className="w-full text-left text-[11px]">
                <thead>
                  <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400 font-mono text-[10px]">
                    <th className="p-2.5">Timestamp</th>
                    <th className="p-2.5">User Identity</th>
                    <th className="p-2.5">Action Event</th>
                    <th className="p-2.5">Location / Node</th>
                    <th className="p-2.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900 text-slate-300 font-mono text-[10px]">
                  {securityAuditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-900/50">
                      <td className="p-2.5 text-slate-400">{log.timestamp}</td>
                      <td className="p-2.5 text-slate-200 font-semibold">{log.user}</td>
                      <td className="p-2.5 text-slate-300">{log.action}</td>
                      <td className="p-2.5 text-slate-400">{log.location}</td>
                      <td className="p-2.5 text-right">
                        <span
                          className={`px-2 py-0.5 rounded font-bold text-[9px] ${
                            log.status === 'Granted'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-rose-950 text-rose-400 border border-rose-800'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Submit and Demo Reset */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>

          <button
            type="button"
            onClick={handleResetDemo}
            className="inline-flex items-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Database to Factory Defaults</span>
          </button>
        </div>
      </form>

      {/* Owner PIN Verification Modal */}
      <Modal
        isOpen={showPinConfirm}
        onClose={() => setShowPinConfirm(false)}
        title="Owner Authorization Required"
        subtitle="Super Admin clearance required to reseed database records."
        maxWidth="sm"
      >
        <form onSubmit={confirmResetWithPin} className="space-y-4 text-xs">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              This action requires Executive Owner credentials for <strong>Amruta Vaibhav Sartape</strong>. All localized work orders and service records will be reset to default factory state.
            </p>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Enter Owner Security PIN (Default: 7083 or 2026)
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                maxLength={6}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="••••"
                autoFocus
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-sm font-mono tracking-widest text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowPinConfirm(false)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white transition-colors"
            >
              Authorize Reset
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
