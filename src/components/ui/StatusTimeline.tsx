import React from 'react';
import {
  FileText,
  UserCheck,
  CheckCircle,
  Truck,
  PackageCheck,
  Search,
  Wrench,
  Sparkles,
  CheckCheck,
  Clock
} from 'lucide-react';
import { RequestStatus } from '../../types';

interface StatusTimelineProps {
  currentStatus: RequestStatus;
  history?: Array<{
    status: RequestStatus;
    notes?: string;
    created_at?: string;
    changed_by_name?: string;
  }>;
  compact?: boolean;
}

export const STAGES: { status: RequestStatus; label: string; icon: React.ElementType }[] = [
  { status: 'Request Created', label: 'Request Created', icon: FileText },
  { status: 'Technician Assigned', label: 'Tech Assigned', icon: UserCheck },
  { status: 'Technician Accepted', label: 'Tech Accepted', icon: CheckCircle },
  { status: 'Technician On The Way', label: 'On The Way', icon: Truck },
  { status: 'Device Received', label: 'Device Received', icon: PackageCheck },
  { status: 'Diagnosis', label: 'Diagnosis', icon: Search },
  { status: 'Repair In Progress', label: 'Repairing', icon: Wrench },
  { status: 'Ready', label: 'Ready for Pickup', icon: Sparkles },
  { status: 'Completed', label: 'Completed', icon: CheckCheck }
];

export const StatusTimeline: React.FC<StatusTimelineProps> = ({ currentStatus, history = [], compact = false }) => {
  const currentIndex = STAGES.findIndex((s) => s.status === currentStatus);

  if (compact) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-2">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            {currentStatus}
          </span>
          <span className="text-slate-500 font-mono">{Math.max(1, Math.min(9, currentIndex + 1))} / 9 Stages</span>
        </div>
        <div className="w-full bg-slate-900/90 rounded-full h-2 overflow-hidden flex border border-slate-800">
          <div
            className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-400 h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_12px_rgba(6,182,212,0.4)]"
            style={{ width: `${((Math.max(0, currentIndex) + 1) / STAGES.length) * 100}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-4">
      {/* Desktop/Tablet Horizontal Tracker */}
      <div className="hidden lg:block overflow-x-auto pb-4">
        <div className="flex items-center justify-between min-w-[760px] relative">
          {/* Background Connecting Line */}
          <div className="absolute top-6 left-6 right-6 h-0.5 bg-slate-800 -z-0" />
          {/* Active Filled Line */}
          <div
            className="absolute top-6 left-6 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-400 shadow-[0_0_10px_rgba(59,130,246,0.6)] transition-all duration-500 -z-0"
            style={{
              width: currentIndex >= 0 ? `${(currentIndex / (STAGES.length - 1)) * 92}%` : '0%'
            }}
          />

          {STAGES.map((stage, idx) => {
            const isCompleted = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            const Icon = stage.icon;

            const historyEntry = history.find((h) => h.status === stage.status);

            return (
              <div key={stage.status} className="flex flex-col items-center relative z-10 w-24 text-center">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    isCurrent
                      ? 'bg-blue-600 text-white ring-4 ring-blue-500/20 scale-110 shadow-[0_0_20px_rgba(59,130,246,0.5)] border border-blue-400'
                      : isCompleted
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                      : 'bg-slate-900/90 border border-slate-800 text-slate-500'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`text-xs mt-3 font-semibold leading-tight tracking-tight ${
                    isCurrent ? 'text-blue-400 font-bold' : isCompleted ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  {stage.label}
                </span>
                {historyEntry && (
                  <span className="text-[10px] text-slate-400 mt-1 flex items-center gap-0.5 font-mono">
                    <Clock className="w-2.5 h-2.5" />
                    {new Date(historyEntry.created_at || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile/Small Screen Vertical Timeline */}
      <div className="block lg:hidden space-y-4">
        {STAGES.map((stage, idx) => {
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const Icon = stage.icon;
          const historyEntry = history.find((h) => h.status === stage.status);

          return (
            <div key={stage.status} className="flex items-start gap-3.5 relative">
              {idx !== STAGES.length - 1 && (
                <div
                  className={`absolute left-4 top-9 bottom-0 w-0.5 -ml-px ${
                    isCompleted ? 'bg-emerald-500/50' : 'bg-slate-800'
                  }`}
                />
              )}
              <div
                className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center relative z-10 ${
                  isCurrent
                    ? 'bg-blue-600 text-white ring-4 ring-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.5)] border border-blue-400'
                    : isCompleted
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/40'
                    : 'bg-slate-900 text-slate-500 border border-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0 pt-0.5 pb-2">
                <div className="flex items-center justify-between">
                  <p className={`text-sm font-semibold ${isCurrent ? 'text-blue-400 font-bold' : isCompleted ? 'text-slate-200' : 'text-slate-500'}`}>
                    {stage.label}
                  </p>
                  {isCurrent && (
                    <span className="text-[10px] font-bold bg-blue-500/15 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/30">
                      In Progress
                    </span>
                  )}
                </div>
                {historyEntry?.notes && (
                  <p className="text-xs text-slate-300 mt-1.5 bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 text-slate-300">
                    {historyEntry.notes}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
