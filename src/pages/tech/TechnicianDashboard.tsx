import React, { useState, useEffect } from 'react';
import {
  Wrench,
  CheckCircle2,
  Clock,
  Laptop,
  UserCheck,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Calendar
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { store } from '../../services/store';
import { ServiceRequest, RequestStatus } from '../../types';
import { StatCard } from '../../components/ui/StatCard';
import { StatusBadge, UrgencyBadge } from '../../components/ui/Badges';
import { STAGES } from '../../components/ui/StatusTimeline';

interface TechnicianDashboardProps {
  onNavigate: (page: string, param?: string) => void;
}

export const TechnicianDashboard: React.FC<TechnicianDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { success } = useToast();

  const [myJobs, setMyJobs] = useState<ServiceRequest[]>(() => {
    return store.getServiceRequests();
  });

  useEffect(() => {
    const handleUpdate = () => {
      setMyJobs(store.getServiceRequests());
    };
    handleUpdate();
    const unsub = store.subscribe(handleUpdate);
    return () => unsub();
  }, [user]);

  const activeJobs = myJobs.filter((r) => r.status !== 'Completed' && r.status !== 'Cancelled');
  const completedJobs = myJobs.filter((r) => r.status === 'Completed');

  const handleQuickAdvance = (req: ServiceRequest) => {
    const currentIndex = STAGES.findIndex((s) => s.status === req.status);
    if (currentIndex >= 0 && currentIndex < STAGES.length - 1) {
      const next = STAGES[currentIndex + 1].status;
      store.updateRequestStatus(
        req.id,
        next,
        `Technician advanced job to ${next}`,
        user?.full_name || 'Rohan Deshmukh',
        'technician'
      );
      success('Workflow Advanced', `${req.request_number} moved to ${next}`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 border border-emerald-800/40 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30 uppercase tracking-wider">
              Bench Status: Active
            </span>
            <span className="text-xs text-slate-400">Station #04 • Cleanroom Class-100</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5">
            Welcome to the Workbench, Marcus
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-1">
            You have <span className="text-emerald-400 font-bold">{activeJobs.length} hardware repair jobs</span> in your active queue. Update stage milestones to notify clients instantly.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('tech-jobs')}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-lg shadow-emerald-950/50 transition-all"
        >
          View Full Job Queue
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Workbench Jobs"
          value={activeJobs.length}
          subtitle="In pipeline"
          icon={Wrench}
          iconColor="text-emerald-400"
          bgColor="bg-emerald-950/40"
        />

        <StatCard
          title="Completed This Month"
          value={completedJobs.length + 18}
          subtitle="100% Quality Passed"
          change={{ value: '+14%', isPositive: true }}
          icon={CheckCircle2}
          iconColor="text-blue-400"
          bgColor="bg-blue-950/40"
        />

        <StatCard
          title="Avg Turnaround SLA"
          value="2.8 hrs"
          subtitle="Target < 4.0 hrs"
          icon={Clock}
          iconColor="text-purple-400"
          bgColor="bg-purple-950/40"
        />

        <StatCard
          title="Quality Score"
          value="4.96"
          subtitle="Customer satisfaction"
          icon={TrendingUp}
          iconColor="text-amber-400"
          bgColor="bg-amber-950/40"
        />
      </div>

      {/* Live Workbench Active Queue */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">Active Bench Queue</h3>
            <p className="text-xs text-slate-400">Step-by-step stage verification and triage</p>
          </div>
          <span className="text-xs text-emerald-400 font-mono font-bold">
            {activeJobs.length} Assigned Orders
          </span>
        </div>

        <div className="space-y-4">
          {activeJobs.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              All assigned service jobs are completed. Cleanroom bench is clear!
            </div>
          ) : (
            activeJobs.map((req) => {
              const currentIdx = STAGES.findIndex((s) => s.status === req.status);
              const nextStage = currentIdx >= 0 && currentIdx < STAGES.length - 1 ? STAGES[currentIdx + 1] : null;

              return (
                <div
                  key={req.id}
                  className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4 hover:border-slate-700 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-800/60">
                          {req.request_number}
                        </span>
                        <StatusBadge status={req.status} />
                        <UrgencyBadge urgency={req.urgency} />
                      </div>
                      <h4 className="text-base font-bold text-white mt-1">
                        {req.service_name} — {req.device?.brand} {req.device?.model}
                      </h4>
                      <p className="text-xs text-slate-400">
                        Client: <span className="text-slate-200 font-semibold">{req.customer_name}</span> ({req.customer_email})
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <button
                        onClick={() => onNavigate('request-detail', req.id)}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-750 text-white text-xs font-bold rounded-xl transition-colors"
                      >
                        Open Ticket
                      </button>

                      {nextStage && (
                        <button
                          onClick={() => handleQuickAdvance(req)}
                          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-emerald-950/40 flex items-center gap-1.5"
                        >
                          <span>Advance to: {nextStage.label}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Problem statement */}
                  <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
                    <span className="font-semibold text-slate-400">Intake Statement:</span> {req.problem_description}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
