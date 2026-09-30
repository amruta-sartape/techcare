import React from 'react';
import { TrendingUp, Clock, CheckCircle2, ShieldCheck, Award, Zap } from 'lucide-react';
import { StatCard } from '../../components/ui/StatCard';
import { BarChart, DonutChart } from '../../components/ui/Charts';

export const AdminAnalyticsPage: React.FC = () => {
  const weeklyThroughput = [
    { label: 'Week 1', value: 38 },
    { label: 'Week 2', value: 45 },
    { label: 'Week 3', value: 52 },
    { label: 'Week 4', value: 61 }
  ];

  const resolutionBreakdown = [
    { label: 'Component Replaced', value: 50, color: '#2563eb' },
    { label: 'Micro-Soldering Rework', value: 30, color: '#10b981' },
    { label: 'Cleanroom Ultrasonic Wash', value: 12, color: '#8b5cf6' },
    { label: 'OS & Firmware Recovery', value: 8, color: '#f59e0b' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Service Performance &amp; SLA Analytics</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Laboratory throughput, technician repair velocities, and hardware failure analytics.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Avg Triage-to-Close"
          value="3.1 hrs"
          subtitle="Enterprise target < 4.0 hrs"
          change={{ value: '-12% faster', isPositive: true }}
          icon={Clock}
          iconColor="text-blue-600"
          bgColor="bg-blue-50"
        />

        <StatCard
          title="First-Time Fix Rate"
          value="99.4%"
          subtitle="Zero rework guarantee"
          change={{ value: '+0.6%', isPositive: true }}
          icon={CheckCircle2}
          iconColor="text-emerald-600"
          bgColor="bg-emerald-50"
        />

        <StatCard
          title="Customer CSAT"
          value="4.92"
          subtitle="Out of 5.0 (214 responses)"
          icon={Award}
          iconColor="text-amber-600"
          bgColor="bg-amber-50"
        />

        <StatCard
          title="Active Warranty Liability"
          value="₹1,24,000"
          subtitle="Reserved parts hedge"
          icon={ShieldCheck}
          iconColor="text-purple-600"
          bgColor="bg-purple-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-1">Monthly Service Volume Growth</h3>
          <p className="text-xs text-slate-500 mb-4">Total hardware work orders processed per week</p>
          <BarChart data={weeklyThroughput} height={200} />
        </div>

        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-1">Resolution Types</h3>
          <p className="text-xs text-slate-500 mb-4">Engineering procedure breakdown</p>
          <DonutChart data={resolutionBreakdown} />
        </div>
      </div>
    </div>
  );
};
