import React from 'react';
import { RequestStatus, UrgencyLevel, WarrantyStatus, UserRole } from '../../types';

export const StatusBadge: React.FC<{ status: RequestStatus }> = ({ status }) => {
  const getStyle = () => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]';
      case 'Ready':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.15)]';
      case 'Repair In Progress':
      case 'Diagnosis':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.15)]';
      case 'Technician On The Way':
      case 'Technician Accepted':
      case 'Technician Assigned':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30 shadow-[0_0_12px_rgba(59,130,246,0.15)]';
      case 'Device Received':
        return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
      case 'Cancelled':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'Request Created':
      default:
        return 'bg-slate-800/60 text-slate-300 border-slate-700/60';
    }
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide border backdrop-blur-xs ${getStyle()}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current shadow-xs animate-pulse" />
      {status}
    </span>
  );
};

export const UrgencyBadge: React.FC<{ urgency: UrgencyLevel }> = ({ urgency }) => {
  const getStyle = () => {
    switch (urgency) {
      case 'Critical':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.2)]';
      case 'High':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/40';
      case 'Medium':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/40';
      case 'Low':
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700/50';
    }
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getStyle()}`}>
      {urgency} Priority
    </span>
  );
};

export const WarrantyBadge: React.FC<{ status: WarrantyStatus }> = ({ status }) => {
  switch (status) {
    case 'active':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.15)]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          Shield Active
        </span>
      );
    case 'expiring_soon':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
          Expiring Soon
        </span>
      );
    case 'expired':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800/80 text-slate-400 border border-slate-700/50">
          Expired
        </span>
      );
    case 'none':
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-900/60 text-slate-500 border border-slate-800">
          No Warranty
        </span>
      );
  }
};

export const RoleBadge: React.FC<{ role: UserRole }> = ({ role }) => {
  switch (role) {
    case 'admin':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
          Administrator
        </span>
      );
    case 'technician':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.15)]">
          Certified Technician
        </span>
      );
    case 'customer':
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700/60">
          Customer
        </span>
      );
  }
};

