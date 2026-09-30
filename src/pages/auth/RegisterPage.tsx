import React, { useState, useRef } from 'react';
import {
  Wrench,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  Lock,
  User,
  Cpu,
  KeyRound,
  CheckCircle2,
  Info
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { UserRole, ADMIN_OWNER_EMAIL } from '../../types';

interface RegisterPageProps {
  onNavigate: (page: string) => void;
  portal?: 'customer' | 'technician' | 'admin';
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate, portal: initialPortal = 'customer' }) => {
  const { register } = useAuth();
  const { success, error } = useToast();

  const [portal, setPortal] = useState<'customer' | 'technician' | 'admin'>(initialPortal);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [adminPasskey, setAdminPasskey] = useState('');
  const [technicianSkill, setTechnicianSkill] = useState('Micro-Soldering & Logic Board');
  const [isLoading, setIsLoading] = useState(false);
  const isSubmittingRef = useRef(false);

  React.useEffect(() => {
    if (initialPortal) {
      setPortal(initialPortal);
    }
  }, [initialPortal]);

  const getPortalDetails = () => {
    switch (portal) {
      case 'technician':
        return {
          title: 'Certified Technician Registration',
          subtitle: 'Join TechCare Pandharpur cleanroom diagnostics & repair staff.',
          badge: 'TECHNICIAN ONBOARDING',
          badgeColor: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
          targetDashboard: 'tech-dashboard',
          loginRoute: 'tech-login',
          buttonClass: 'bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
        };
      case 'admin':
        return {
          title: 'Owner & Super Admin Provisioning',
          subtitle: 'Executive operations access. Requires cryptographic owner authorization passkey.',
          badge: 'ROOT ACCESS CLEARANCE',
          badgeColor: 'bg-purple-500/15 border-purple-500/30 text-purple-400',
          targetDashboard: 'admin-dashboard',
          loginRoute: 'admin-login',
          buttonClass: 'bg-purple-600 hover:bg-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.3)]'
        };
      case 'customer':
      default:
        return {
          title: 'Create Your TechCare Account',
          subtitle: 'Register your devices, track live hardware tickets, and view invoices.',
          badge: 'CUSTOMER REGISTRATION',
          badgeColor: 'bg-blue-500/15 border-blue-500/30 text-cyan-400',
          targetDashboard: 'customer-dashboard',
          loginRoute: 'customer-login',
          buttonClass: 'bg-blue-600 hover:bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]'
        };
    }
  };

  const details = getPortalDetails();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || isSubmittingRef.current) return;

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      error('Missing Fields', 'Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      error('Weak Password', 'Password must be at least 6 characters long.');
      return;
    }

    // Security Gate for Admin Registration
    if (portal === 'admin') {
      if (!adminPasskey.trim()) {
        error(
          'Passkey Required',
          'Owner clearance passkey is strictly required to provision an administrative account.'
        );
        return;
      }
    }

    isSubmittingRef.current = true;
    setIsLoading(true);
    try {
      const res = await register({
        full_name: fullName.trim(),
        email: email.trim(),
        password: password,
        role: portal,
        phone: phone.trim() || undefined,
        adminPasskey: portal === 'admin' ? adminPasskey.trim() : undefined
      });

      if (!res.success) {
        error('Registration Rejected', res.error || 'Failed to complete registration.');
        return;
      }

      if (res.requiresEmailConfirmation) {
        success(
          'Verification Link Dispatched',
          `Please check ${email} to verify your email address, then sign in.`
        );
        onNavigate(details.loginRoute);
      } else {
        success('Account Created', `Welcome to TechCare, ${fullName}!`);
        onNavigate(details.targetDashboard);
      }
    } catch (err: any) {
      error('Registration Error', err?.message || 'Unable to register at this time.');
    } finally {
      isSubmittingRef.current = false;
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-[#0c101d]/95 p-6 sm:p-8 rounded-3xl border border-slate-800/90 shadow-[0_20px_60px_rgba(0,0,0,0.85)] text-slate-100 relative overflow-hidden">
        {/* Decorative glow */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-cyan-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />

        {/* Portal Tabs (Only Customer and Technician - Admin registration is strictly prohibited) */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block text-center">
            Select Registration Type
          </span>
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900/90 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => setPortal('customer')}
              className={`py-2 px-2 text-center rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                portal === 'customer'
                  ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Customer</span>
            </button>

            <button
              type="button"
              onClick={() => setPortal('technician')}
              className={`py-2 px-2 text-center rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                portal === 'technician'
                  ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>Technician</span>
            </button>
          </div>
        </div>

        {/* Header */}
        <div className="text-center space-y-2 pt-1">
          <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border ${details.badgeColor}`}>
            {details.badge}
          </span>
          <h2 className="text-2xl font-black text-white tracking-tight">{details.title}</h2>
          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
            {details.subtitle}
          </p>
        </div>

        {/* If Admin portal accessed directly, show blocked registration panel */}
        {portal === 'admin' ? (
          <div className="bg-purple-950/40 border border-purple-800/60 rounded-2xl p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-900/60 border border-purple-700/60 flex items-center justify-center mx-auto text-purple-400">
              <Lock className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                Public Admin Registration Prohibited
              </h3>
              <p className="text-xs text-purple-200/80 leading-relaxed max-w-sm mx-auto">
                Administrative privileges are strictly restricted to the authorized owner account (<span className="font-mono text-purple-300 font-bold">{ADMIN_OWNER_EMAIL}</span>). Public self-registration for administrators is disabled.
              </p>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => onNavigate('admin-login')}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] cursor-pointer"
              >
                Go to Admin Sign In
              </button>
              <button
                type="button"
                onClick={() => setPortal('customer')}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
              >
                Register as Customer
              </button>
            </div>
          </div>
        ) : (
          <>
            {portal === 'technician' && (
              <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-2xl p-3 text-xs text-emerald-300 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                  <Cpu className="w-4 h-4" />
                  <span>Hardware Specialist Profile</span>
                </div>
                <p className="text-[11px] text-emerald-300/80">
                  Registered technicians gain access to cleanroom bench queues, diagnostic feeds, and assigned client work orders.
                </p>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-semibold text-slate-300 mb-1">
                  Full Legal / Business Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kulkarni"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-slate-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-slate-300 mb-1">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  placeholder="+91 94220 00000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                />
              </div>

              {portal === 'technician' && (
                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-300 mb-1">
                    Primary Specialty / Certification
                  </label>
                  <select
                    value={technicianSkill}
                    onChange={(e) => setTechnicianSkill(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-400"
                  >
                    <option>Micro-Soldering & Logic Board</option>
                    <option>Screen & Digitizer Replacement</option>
                    <option>Liquid Damage & Ultrasonic Restoration</option>
                    <option>Thermal Re-pasting & Cooling Systems</option>
                    <option>OS Deployment & Forensic Data Recovery</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-mono font-semibold text-slate-300 mb-1">
                  Create Password * (min 6 chars)
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-xl text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${details.buttonClass} ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Complete {portal === 'technician' ? 'Technician Sign Up' : 'Registration'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </>
        )}

        <div className="pt-2 border-t border-slate-800/80 text-center">
          <p className="text-xs text-slate-400">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => onNavigate(details.loginRoute)}
              className="text-cyan-400 hover:text-cyan-300 font-bold ml-1 transition-colors"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
