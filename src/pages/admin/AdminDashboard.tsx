import React from 'react';
import {
  DollarSign,
  ClipboardList,
  Users,
  Wrench,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Sparkles,
  PackageCheck
} from 'lucide-react';
import { store } from '../../services/store';
import { StatCard } from '../../components/ui/StatCard';
import { StatusBadge, UrgencyBadge } from '../../components/ui/Badges';
import { BarChart, DonutChart } from '../../components/ui/Charts';

interface AdminDashboardProps {
  onNavigate: (page: string, param?: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const requests = store.getServiceRequests();
  const invoices = store.getInvoices();
  const inventory = store.getInventory();
  const users = store.getUsers();

  const totalRevenue = invoices
    .filter((i) => i.status === 'paid')
    .reduce((sum, i) => sum + i.total, 0);

  const activeJobs = requests.filter((r) => r.status !== 'Completed' && r.status !== 'Cancelled');
  const lowStockItems = inventory.filter((item) => (item.stock_quantity || 0) <= (item.reorder_threshold ?? item.min_stock ?? 5));

  const chartData = [
    { label: 'Mon', value: 2450 },
    { label: 'Tue', value: 3100 },
    { label: 'Wed', value: 2800 },
    { label: 'Thu', value: 4200 },
    { label: 'Fri', value: 3900 },
    { label: 'Sat', value: 1950 },
    { label: 'Sun', value: 1400 }
  ];

  const categoryDistribution = [
    { label: 'Hardware & Micro-Soldering', value: 45, color: '#2563eb' },
    { label: 'Mobile & Tablet', value: 25, color: '#10b981' },
    { label: 'Enterprise & Wi-Fi', value: 15, color: '#8b5cf6' },
    { label: 'Data Recovery & Storage', value: 15, color: '#f59e0b' }
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold bg-blue-500/20 text-blue-300 px-2.5 py-0.5 rounded-full border border-blue-400/30 uppercase tracking-wider">
              Operations Control Center
            </span>
            <span className="text-xs text-slate-400">Enterprise SLA Active</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5">
            TechCare Business Command
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-1">
            Real-time pipeline diagnostics, technician dispatch load balancing, automated parts inventory, and revenue billing ledger.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('admin-requests')}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-lg shadow-blue-900/50 transition-all whitespace-nowrap"
          >
            Dispatch Workboard
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Settled Revenue"
          value={`₹${totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
          subtitle="This billing cycle"
          change={{ value: '+18.4%', isPositive: true }}
          icon={DollarSign}
          iconColor="text-emerald-600"
          bgColor="bg-emerald-50"
        />

        <StatCard
          title="Active Service Jobs"
          value={activeJobs.length}
          subtitle="In laboratory queue"
          icon={ClipboardList}
          iconColor="text-blue-600"
          bgColor="bg-blue-50"
        />

        <StatCard
          title="Client Base &amp; Techs"
          value={users.length}
          subtitle="Managed user accounts"
          icon={Users}
          iconColor="text-purple-600"
          bgColor="bg-purple-50"
        />

        <StatCard
          title="Inventory Low Alerts"
          value={lowStockItems.length}
          subtitle={lowStockItems.length > 0 ? 'Requires immediate restock' : 'All stocks healthy'}
          icon={AlertTriangle}
          iconColor="text-amber-600"
          bgColor="bg-amber-50"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Revenue Velocity (Past 7 Days)</h3>
              <p className="text-xs text-slate-500">Daily billed and authorized hardware services</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
              +24% vs last week
            </span>
          </div>
          <BarChart data={chartData} height={200} />
        </div>

        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-1">Service Demand Mix</h3>
          <p className="text-xs text-slate-500 mb-4">Distribution by repair specialty</p>
          <DonutChart data={categoryDistribution} />
        </div>
      </div>

      {/* Live Dispatch Work Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Service Requests</h3>
            <p className="text-xs text-slate-500">Live operational dispatch status across all laboratory benches</p>
          </div>
          <button
            onClick={() => onNavigate('admin-requests')}
            className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
          >
            Manage All Tickets
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-100 overflow-x-auto">
          {requests.slice(0, 5).map((r) => (
            <div
              key={r.id}
              onClick={() => onNavigate('request-detail', r.id)}
              className="py-3.5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/80 -mx-2 px-2 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded border border-blue-200 shrink-0">
                  {r.request_number}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {r.service_name} • {r.device?.brand} {r.device?.model}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    Customer: {r.customer_name} • Tech: {r.assigned_technician?.full_name || 'Unassigned'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <StatusBadge status={r.status} />
                <UrgencyBadge urgency={r.urgency} />
                <span className="text-xs font-black text-slate-900 w-20 text-right font-mono">
                  ₹{(r.final_cost || r.estimated_cost || 0).toLocaleString('en-IN')}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
