import React from 'react';
import { ShieldAlert, Lock, ArrowRight, LogOut, UserCheck, CheckCircle2 } from 'lucide-react';
import { UserRole } from '../../types';
import { TechCareLogo } from './TechCareLogo';

interface AccessRestrictedProps {
  requiredRole: 'admin' | 'technician' | 'customer';
  currentRole?: UserRole;
  currentUserName?: string;
  onNavigate: (page: string) => void;
  onSwitchRole: (role: UserRole) => void;
  onLogout: () => void;
}

export const AccessRestricted: React.FC<AccessRestrictedProps> = ({
  requiredRole,
  currentRole,
  currentUserName,
  onNavigate,
  onSwitchRole,
  onLogout
}) => {
  const getRoleDetails = () => {
    switch (requiredRole) {
      case 'admin':
        return {
          title: 'Owner & Super Admin Clearance Required',
          badgeText: 'ADMIN CLEARANCE REQUIRED',
          badgeColor: 'bg-purple-500/15 border-purple-500/30 text-purple-400',
          iconGlow: 'bg-purple-600/20 border-purple-500/40 text-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.3)]',
          description:
            'This operations console contains financial ledgers, system settings, inventory management, and technician dispatch telemetry. It is strictly restricted to TechCare Owner & Super Administrator (Amruta Vaibhav Sartape).',
          authorizedRoute: currentRole === 'technician' ? 'tech-dashboard' : 'customer-dashboard',
          authorizedLabel: currentRole === 'technician' ? 'Technician Workbench' : 'Customer Portal',
          roleToSwitch: 'admin' as UserRole,
          switchLabel: 'Authenticate as Owner / Admin'
        };
      case 'technician':
        return {
          title: 'Certified Technician Credentials Required',
          badgeText: 'HARDWARE BENCH RESTRICTED',
          badgeColor: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
          iconGlow: 'bg-emerald-600/20 border-emerald-500/40 text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.3)]',
          description:
            'The Technician Workbench is reserved for certified micro-soldering and cleanroom repair specialists. Customer accounts cannot view live internal diagnostic feeds or unassigned hardware benches.',
          authorizedRoute: currentRole === 'admin' ? 'admin-dashboard' : 'customer-dashboard',
          authorizedLabel: currentRole === 'admin' ? 'Executive Operations' : 'Customer Portal',
          roleToSwitch: 'technician' as UserRole,
          switchLabel: 'Switch to Technician Persona'
        };
      case 'customer':
      default:
        return {
          title: 'Customer Session Required',
          badgeText: 'CUSTOMER PORTAL',
          badgeColor: 'bg-blue-500/15 border-blue-500/30 text-blue-400',
          iconGlow: 'bg-blue-600/20 border-blue-500/40 text-blue-400 shadow-[0_0_25px_rgba(59,130,246,0.3)]',
          description:
            'You are currently authenticated with staff credentials. To view customer service requests, device registrations, and personal invoices, please switch to a customer profile.',
          authorizedRoute: currentRole === 'admin' ? 'admin-dashboard' : 'tech-dashboard',
          authorizedLabel: currentRole === 'admin' ? 'Admin Operations' : 'Technician Workbench',
          roleToSwitch: 'customer' as UserRole,
          switchLabel: 'Switch to Customer Persona'
        };
    }
  };

  const details = getRoleDetails();

  return (
    <div className="min-h-screen bg-[#07090e] flex flex-col justify-between p-4 sm:p-6 lg:p-8 text-slate-100 font-sans">
      {/* Header Bar */}
      <div className="max-w-4xl w-full mx-auto flex items-center justify-between py-2">
        <div onClick={() => onNavigate('home')} className="cursor-pointer">
          <TechCareLogo size="sm" />
        </div>
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="text-xs text-slate-400 hover:text-cyan-400 transition-colors"
        >
          Back to Public Site
        </button>
      </div>

      {/* Main Guard Card */}
      <div className="max-w-md w-full mx-auto my-auto bg-[#0a0d16] border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
        {/* Glow backdrop accent */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-purple-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />

        {/* Security Badge & Icon */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center ${details.iconGlow}`}>
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border ${details.badgeColor}`}>
              {details.badgeText}
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight">{details.title}</h2>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
            {details.description}
          </p>

          {/* Active Session Card */}
          <div className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 text-left text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium">Active Session:</span>
              <span className="font-bold text-slate-200">{currentUserName || 'Anonymous'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium">Active Role:</span>
              <span className="capitalize font-mono font-bold text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-2 py-0.5 rounded text-[11px]">
                {currentRole || 'Guest'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium">Required Clearance:</span>
              <span className="capitalize font-mono font-bold text-amber-400 bg-amber-950/40 border border-amber-800/40 px-2 py-0.5 rounded text-[11px]">
                {requiredRole === 'admin' ? 'Owner / Admin' : requiredRole}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full space-y-2.5 pt-2">
            <button
              type="button"
              onClick={() => onNavigate(details.authorizedRoute)}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Return to My {details.authorizedLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={async () => {
                await onLogout();
                const targetLogin = requiredRole === 'admin' ? 'admin-login' : requiredRole === 'technician' ? 'tech-login' : 'customer-login';
                onNavigate(targetLogin);
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-amber-400" />
              <span>Authenticate with {requiredRole === 'admin' ? 'Admin / Owner' : requiredRole === 'technician' ? 'Technician' : 'Customer'} Credentials</span>
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="w-full py-2 text-[11px] text-rose-400 hover:text-rose-300 font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out Completely</span>
            </button>
          </div>
        </div>

        {/* Security Footer Notice */}
        <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-center gap-1.5 text-[10px] text-slate-500 text-center font-mono">
          <ShieldAlert className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>RBAC Enforcement Active • Pandharpur Operations Lab</span>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="max-w-4xl w-full mx-auto text-center text-[11px] text-slate-500 py-3">
        © 2026 TechCare — All Rights Reserved | Owned &amp; Operated by Amruta Vaibhav Sartape
      </div>
    </div>
  );
};
