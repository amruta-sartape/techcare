import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Lock,
  User,
  Cpu,
  KeyRound,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { UserRole, ADMIN_OWNER_EMAIL } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { supabase, isSupabaseConfigured, getAuthRedirectUrl } from '../../lib/supabase';
import { TechCareLogo } from '../../components/ui/TechCareLogo';

interface LoginPageProps {
  onNavigate: (page: string, param?: string) => void;
  portal?: 'customer' | 'technician' | 'admin';
  initialPortal?: 'customer' | 'technician' | 'admin';
  initialMode?: 'login' | 'forgot';
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onNavigate,
  portal: propPortal,
  initialPortal = 'customer',
  initialMode = 'login'
}) => {
  const { login } = useAuth();
  const { success, error } = useToast();

  const activeInitial = propPortal || initialPortal;
  const [portal, setPortal] = useState<'customer' | 'technician' | 'admin'>(activeInitial);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(initialMode === 'forgot');
  const [resetEmail, setResetEmail] = useState('');

  useEffect(() => {
    if (propPortal) {
      setPortal(propPortal);
    } else if (initialPortal) {
      setPortal(initialPortal);
    }
  }, [propPortal, initialPortal]);

  const getPortalInfo = () => {
    switch (portal) {
      case 'technician':
        return {
          title: 'Technician Login',
          subtitle: 'Cleanroom diagnostics, bench work orders, and client service chat.',
          badge: 'CERTIFIED TECHNICIAN BENCH',
          badgeColor: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
          accentColor: 'emerald',
          buttonClass: 'bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]',
          targetDashboard: 'tech-dashboard',
          registerRoute: 'tech-register',
          registerPrompt: "Don't have an account?",
          registerLinkText: 'Register as a Technician',
          demoAccount: {
            email: 'rohan.deshmukh@techcare.in',
            pass: 'demo123456',
            label: 'Certified Tech: Rohan Deshmukh'
          }
        };
      case 'admin':
        return {
          title: 'Admin Login',
          subtitle: 'Pandharpur Operations, inventory telemetry, and platform security.',
          badge: 'LEVEL 3 OWNER & ROOT ACCESS',
          badgeColor: 'bg-purple-500/15 border-purple-500/30 text-purple-400',
          accentColor: 'purple',
          buttonClass: 'bg-purple-600 hover:bg-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.3)]',
          targetDashboard: 'admin-dashboard',
          registerRoute: '',
          registerPrompt: '',
          registerLinkText: '',
          demoAccount: null
        };
      case 'customer':
      default:
        return {
          title: 'Customer Login',
          subtitle: 'Track live repairs, manage device warranties, and pay invoices.',
          badge: 'CUSTOMER SELF-SERVICE HUB',
          badgeColor: 'bg-blue-500/15 border-blue-500/30 text-cyan-400',
          accentColor: 'cyan',
          buttonClass: 'bg-blue-600 hover:bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]',
          targetDashboard: 'customer-dashboard',
          registerRoute: 'customer-register',
          registerPrompt: "Don't have an account?",
          registerLinkText: 'Register as a Customer',
          demoAccount: undefined
        };
    }
  };

  const info = getPortalInfo();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      error('Credentials Required', 'Please enter your email and password.');
      return;
    }

    setIsLoading(true);
    try {
      await login(email.trim(), password, portal);
      success('Authentication Successful', `Welcome to the ${info.title}.`);
      onNavigate(info.targetDashboard);
    } catch (err: any) {
      const msg = err?.message || 'Please check your login credentials.';
      error('Access Denied', msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = () => {
    if (info.demoAccount) {
      setEmail(info.demoAccount.email);
      setPassword(info.demoAccount.pass);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetEmail = resetEmail.trim() || email.trim();
    if (!targetEmail) {
      error('Email Required', 'Please enter your email address to reset your password.');
      return;
    }
    try {
      if (isSupabaseConfigured) {
        const redirectUrl = getAuthRedirectUrl();
        await supabase.auth.resetPasswordForEmail(targetEmail, {
          redirectTo: redirectUrl,
        });
      }
      success('Reset Link Dispatched', `A secure recovery link has been sent to ${targetEmail}`);
      setForgotModalOpen(false);
    } catch (err: any) {
      error('Password Reset Failed', err?.message || 'Unable to send password reset email.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-[#0c101d]/95 p-6 sm:p-8 rounded-3xl border border-slate-800/90 shadow-[0_20px_60px_rgba(0,0,0,0.85)] text-slate-100 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-cyan-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />

        {/* Main Branding Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-1">
            <TechCareLogo size="md" variant="cyan" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Sign in to TechCare
          </h1>
          <p className="text-xs text-slate-400">
            Select your role to access your dedicated portal
          </p>
        </div>

        {/* Three Clearly Presented Options */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block text-center">
            Authentication Options
          </span>
          <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-900/90 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => {
                setPortal('customer');
                setEmail('');
                setPassword('');
              }}
              className={`py-2.5 px-2 text-center rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                portal === 'customer'
                  ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.35)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Customer</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setPortal('technician');
                setEmail('');
                setPassword('');
              }}
              className={`py-2.5 px-2 text-center rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                portal === 'technician'
                  ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.35)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>Technician</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setPortal('admin');
                setEmail('');
                setPassword('');
              }}
              className={`py-2.5 px-2 text-center rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                portal === 'admin'
                  ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.35)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Selected Portal Banner */}
        <div className="text-center space-y-1 pt-1">
          <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border ${info.badgeColor}`}>
            {info.badge}
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight">{info.title}</h2>
          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
            {info.subtitle}
          </p>
        </div>

        {/* Auto-Fill Test Account (Only for Customer & Technician) or Owner Verification Panel (for Admin) */}
        {info.demoAccount ? (
          <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800/80 flex items-center justify-between gap-2">
            <div className="text-left">
              <span className="text-[10px] font-mono text-slate-400 block">Auto-Fill Test Account</span>
              <span className="text-xs font-semibold text-slate-200">{info.demoAccount.label}</span>
            </div>
            <button
              type="button"
              onClick={handleQuickFill}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-mono font-bold transition-colors shrink-0 cursor-pointer"
            >
              Auto-Fill
            </button>
          </div>
        ) : portal === 'admin' ? (
          <div className="bg-purple-950/40 p-3 rounded-2xl border border-purple-800/60 text-left space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-purple-300 uppercase tracking-wider">
                Authorized Admin Owner
              </span>
              <button
                type="button"
                onClick={() => {
                  setEmail(ADMIN_OWNER_EMAIL);
                  setPassword('');
                }}
                className="px-2 py-1 rounded bg-purple-900/70 hover:bg-purple-800 text-purple-200 text-[10px] font-mono font-bold transition-colors cursor-pointer"
              >
                Pre-Fill Email
              </button>
            </div>
            <p className="text-xs font-semibold text-white font-mono">{ADMIN_OWNER_EMAIL}</p>
            <p className="text-[11px] text-purple-300/80 leading-snug">
              Access is strictly restricted to this account. Authenticated directly with Supabase Auth password.
            </p>
          </div>
        ) : null}

        {/* Real Sign In Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-semibold text-slate-300 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              placeholder={portal === 'admin' ? ADMIN_OWNER_EMAIL : "e.g. name@techcare.in"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-mono font-semibold text-slate-300">
                Password *
              </label>
              <button
                type="button"
                onClick={() => setForgotModalOpen(true)}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
            />
          </div>

          {portal === 'admin' && (
            <div className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-800/40 text-[11px] text-purple-300 leading-relaxed">
              <span className="font-bold">Security Notice:</span> Only the single authorized owner account ({ADMIN_OWNER_EMAIL}) can access the Admin Portal.
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-xl text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${info.buttonClass} ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In as {portal === 'admin' ? 'Admin / Owner' : portal === 'technician' ? 'Technician' : 'Customer'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Portal-specific registration link */}
        <div className="pt-2 border-t border-slate-800/80 text-center space-y-2">
          {portal === 'admin' ? (
            <p className="text-xs text-purple-300/80 leading-relaxed">
              Public Admin registration is disabled. Administrative access is strictly restricted to the single owner account.
            </p>
          ) : (
            <p className="text-xs text-slate-400">
              {info.registerPrompt}{' '}
              <button
                type="button"
                onClick={() => onNavigate(info.registerRoute)}
                className="text-cyan-400 hover:text-cyan-300 font-bold ml-1 transition-colors cursor-pointer underline"
              >
                {info.registerLinkText}
              </button>
            </p>
          )}

          <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Strict Role-Based Access Control Active</span>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        title="Reset Account Password"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleForgotSubmit} className="space-y-4">
          <p className="text-xs text-slate-400 leading-relaxed">
            Enter your account email. If configured, we'll send a password reset verification link to recover your credentials.
          </p>
          <div>
            <label className="block text-xs font-mono font-semibold text-slate-300 mb-1">
              Registered Email Address
            </label>
            <input
              type="email"
              required
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setForgotModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Send Reset Link
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
