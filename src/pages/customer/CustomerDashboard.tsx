import React from 'react';
import {
  Laptop,
  ClipboardList,
  ShieldCheck,
  MessageSquare,
  PlusCircle,
  Clock,
  ArrowRight,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { store } from '../../services/store';
import { StatCard } from '../../components/ui/StatCard';
import { StatusBadge, UrgencyBadge, WarrantyBadge } from '../../components/ui/Badges';
import { StatusTimeline } from '../../components/ui/StatusTimeline';

interface CustomerDashboardProps {
  onNavigate: (page: string, param?: string) => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();

  const requests = store.getServiceRequests({ userId: user?.id });
  const devices = store.getDevices(user?.id);
  const warranties = store.getWarranties(user?.id);
  const appointments = store.getAppointments(user?.id);
  const unreadMessages = store.getMessages().filter((m) => m.receiver_id === user?.id && !m.read).length;

  const activeRequests = requests.filter((r) => r.status !== 'Completed' && r.status !== 'Cancelled');
  const activeWarranties = warranties.filter((w) => w.status === 'active');

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold bg-blue-500/30 text-blue-200 px-2 py-0.5 rounded-md border border-blue-400/30 uppercase tracking-wider">
              Customer Portal
            </span>
            <span className="text-xs text-blue-200">Account ID: {user?.id.slice(0, 10)}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Hello, {user?.full_name || user?.email?.split('@')[0] || 'Customer'}
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
            Track ongoing repairs, view diagnostic telemetry, manage hardware warranties, and chat directly with assigned lab technicians.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('new-request')}
          className="inline-flex items-center gap-2 bg-white hover:bg-blue-50 text-blue-700 font-bold text-xs px-5 py-3 rounded-xl shadow-md transition-all whitespace-nowrap"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Book New Service</span>
        </button>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Requests"
          value={activeRequests.length}
          subtitle={activeRequests.length > 0 ? 'Live in service pipeline' : 'All jobs completed'}
          icon={ClipboardList}
          iconColor="text-blue-600"
          bgColor="bg-blue-50"
        />

        <StatCard
          title="Registered Fleet"
          value={devices.length}
          subtitle="Hardware profiles logged"
          icon={Laptop}
          iconColor="text-indigo-600"
          bgColor="bg-indigo-50"
        />

        <StatCard
          title="Hardware Shield"
          value={activeWarranties.length}
          subtitle="Guaranteed active warranties"
          icon={ShieldCheck}
          iconColor="text-emerald-600"
          bgColor="bg-emerald-50"
        />

        <StatCard
          title="Messages"
          value={unreadMessages}
          subtitle={unreadMessages > 0 ? 'Unread technician updates' : 'No new messages'}
          icon={MessageSquare}
          iconColor="text-amber-600"
          bgColor="bg-amber-50"
        />
      </div>

      {/* Active Service Ticket Highlight (if any active) */}
      {activeRequests.length > 0 && (
        <div className="bg-white rounded-2xl border-2 border-blue-100 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {activeRequests[0].request_number}
                </span>
                <StatusBadge status={activeRequests[0].status} />
                <UrgencyBadge urgency={activeRequests[0].urgency} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-2">
                {activeRequests[0].service_name} — {activeRequests[0].device?.brand} {activeRequests[0].device?.model}
              </h3>
            </div>

            <button
              onClick={() => onNavigate('request-detail', activeRequests[0].id)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-xl transition-colors self-start sm:self-auto"
            >
              <span>View Full Ticket &amp; Chat</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="pt-2">
            <StatusTimeline currentStatus={activeRequests[0].status} history={activeRequests[0].history} />
          </div>
        </div>
      )}

      {/* Two Column Layout: Service Requests & Registered Fleet */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Service Requests Table */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Service Requests</h3>
              <p className="text-xs text-slate-500">History of all maintenance and repair tickets</p>
            </div>
            <button
              onClick={() => onNavigate('service-requests')}
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              View All
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {requests.slice(0, 4).map((r) => (
              <div
                key={r.id}
                onClick={() => onNavigate('request-detail', r.id)}
                className="py-3.5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/80 -mx-2 px-2 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                    <Laptop className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-800">{r.request_number}</span>
                      <StatusBadge status={r.status} />
                    </div>
                    <p className="text-xs font-bold text-slate-900 truncate mt-0.5">{r.service_name}</p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {r.device?.brand} {r.device?.model} • Submitted {new Date(r.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-xs font-black text-slate-900">₹{(r.final_cost || r.estimated_cost || 0).toLocaleString('en-IN')}</p>
                  <span className="text-[10px] text-blue-600 font-semibold flex items-center gap-0.5 justify-end">
                    Details <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Registered Devices List */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">My Hardware Fleet</h3>
              <p className="text-xs text-slate-500">{devices.length} Registered Devices</p>
            </div>
            <button
              onClick={() => onNavigate('my-devices')}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              Manage
            </button>
          </div>

          <div className="space-y-3">
            {devices.slice(0, 3).map((d) => (
              <div
                key={d.id}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-bold text-slate-900">{d.brand} {d.model}</p>
                  <p className="text-[11px] text-slate-500">{d.device_type}</p>
                  <div className="mt-1">
                    <WarrantyBadge status={d.warranty_status} />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('new-request')}
                  className="p-1.5 bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-lg border border-slate-200 transition-colors"
                  title="Book service for this device"
                >
                  <PlusCircle className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => onNavigate('my-devices')}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors text-center"
          >
            Add Another Device
          </button>
        </div>
      </div>
    </div>
  );
};
