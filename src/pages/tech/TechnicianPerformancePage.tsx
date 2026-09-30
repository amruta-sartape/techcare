import React from 'react';
import { Award, TrendingUp, Clock, CheckCircle2, DollarSign, ShieldAlert, Star } from 'lucide-react';
import { StatCard } from '../../components/ui/StatCard';

export const TechnicianPerformancePage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Technician Bench SLA &amp; Quality Metrics</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Laboratory audit scorecard, repair turnaround statistics, and customer review scores.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="First-Time Fix Rate"
          value="99.4%"
          subtitle="Audit compliance target > 95%"
          icon={CheckCircle2}
          iconColor="text-emerald-400"
          bgColor="bg-emerald-950/40"
        />

        <StatCard
          title="SLA Compliance"
          value="98.8%"
          subtitle="Repairs finished within window"
          icon={Clock}
          iconColor="text-blue-400"
          bgColor="bg-blue-950/40"
        />

        <StatCard
          title="Warranty Recall Rate"
          value="0.35%"
          subtitle="Extremely low return rate"
          icon={ShieldAlert}
          iconColor="text-purple-400"
          bgColor="bg-purple-950/40"
        />

        <StatCard
          title="Client Satisfaction"
          value="4.96"
          subtitle="Based on 48 verified reviews"
          icon={Star}
          iconColor="text-amber-400"
          bgColor="bg-amber-950/40"
        />
      </div>

      {/* Breakdown Card */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
        <h3 className="text-base font-bold text-white">Active Laboratory Certifications</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <p className="text-xs font-bold text-emerald-400">Apple ACMT 2024</p>
            <p className="text-xs text-slate-300 mt-1">Certified Mac Technician</p>
            <span className="text-[10px] text-slate-500 block mt-2">Active • Valid until Dec 2026</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <p className="text-xs font-bold text-blue-400">CompTIA A+ &amp; Network+</p>
            <p className="text-xs text-slate-300 mt-1">Enterprise Hardware &amp; LAN</p>
            <span className="text-[10px] text-slate-500 block mt-2">Active • Recertified</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <p className="text-xs font-bold text-purple-400">IPC J-STD-001</p>
            <p className="text-xs text-slate-300 mt-1">Micro-Soldering &amp; BGA Rework</p>
            <span className="text-[10px] text-slate-500 block mt-2">Active • Master Level</span>
          </div>
        </div>
      </div>
    </div>
  );
};
