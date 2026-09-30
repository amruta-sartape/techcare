import React, { useState, useEffect } from 'react';
import {
  Wrench,
  LayoutDashboard,
  Briefcase,
  Calendar,
  Users,
  MessageSquare,
  TrendingUp,
  User,
  LogOut,
  Menu,
  X,
  UserCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { store } from '../../services/store';
import { UserRole } from '../../types';
import { TechCareLogo } from '../ui/TechCareLogo';

interface TechnicianLayoutProps {
  currentTab?: string;
  currentPage?: string;
  onNavigate: (tab: string, param?: string) => void;
  children: React.ReactNode;
}

export const TechnicianLayout: React.FC<TechnicianLayoutProps> = ({ currentTab, currentPage, onNavigate, children }) => {
  const activeTab = currentPage || currentTab || '';
  const { user, logout } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeJobCount, setActiveJobCount] = useState(0);

  useEffect(() => {
    const updateStats = () => {
      // Find technician profile
      const techProfile = store.getTechnicians().find((t) => t.id === 'tech-1' || t.user_id === user?.id);
      const jobs = store.getServiceRequests({ technicianId: techProfile?.id || 'tech-1' });
      const active = jobs.filter((j) => j.status !== 'Completed' && j.status !== 'Cancelled').length;
      setActiveJobCount(active);
    };

    updateStats();
    const unsub = store.subscribe(updateStats);
    return () => unsub();
  }, [user]);

  const navItems = [
    { id: 'tech-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tech-jobs', label: 'Assigned Jobs', icon: Briefcase, badge: activeJobCount },
    { id: 'tech-schedule', label: 'Daily Schedule', icon: Calendar },
    { id: 'tech-customers', label: 'Customer Directory', icon: Users },
    { id: 'tech-messages', label: 'Customer Chat', icon: MessageSquare },
    { id: 'tech-performance', label: 'Performance & Metrics', icon: TrendingUp },
    { id: 'tech-profile', label: 'Technician Profile', icon: User },
  ];

  return (
    <div className="min-h-screen flex bg-[#07090e] font-sans text-slate-100">
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 lg:hidden backdrop-blur-xs"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Technician Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 h-screen z-50 w-68 bg-[#0a0d16] border-r border-slate-800/80 text-slate-300 flex flex-col transition-transform duration-200 ease-in-out shadow-2xl ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-18 px-5 border-b border-slate-800/80 flex items-center justify-between">
          <div
            onClick={() => onNavigate('home')}
            className="cursor-pointer"
          >
            <TechCareLogo
              size="sm"
              badgeText="BENCH"
              variant="emerald"
              subtitle="Technician Workspace"
            />
          </div>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Technician Badge Card */}
        <div className="px-4 py-3 mx-3 my-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-3 shadow-inner">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
            alt="Technician avatar"
            referrerPolicy="no-referrer"
            className="w-10 h-10 rounded-xl object-cover border border-emerald-500/40 shadow-xs"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-bold text-slate-100 truncate">{user?.full_name || 'Rohan Deshmukh'}</p>
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]" title="Online" />
            </div>
            <p className="text-[10px] text-emerald-400 font-mono">Senior Logic &amp; Hardware Lead</p>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onNavigate(item.id);
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500 text-slate-950 font-mono shadow-[0_0_8px_rgba(16,185,129,0.6)]">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800/80 space-y-2">
          <div className="px-3 py-2 rounded-lg bg-emerald-950/20 border border-emerald-900/30 flex items-center justify-between">
            <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">Role Clearance</span>
            <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-bold">
              Technician
            </span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="text-[11px] text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Public Site
            </button>
            <button
              type="button"
              onClick={async () => {
                await logout();
                onNavigate('tech-login');
              }}
              className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <LogOut className="w-3 h-3" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Workbench Viewport */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#07090e]">
        <header className="sticky top-0 z-30 bg-[#0a0e1a]/85 backdrop-blur-xl border-b border-slate-800/80 h-18 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 shadow-md shadow-black/40">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base font-bold text-slate-100 capitalize">
                {navItems.find((i) => i.id === activeTab)?.label || 'Technician Workbench'}
              </h1>
              <p className="text-xs text-slate-400 hidden sm:block">Live Repair Queue &amp; Multi-Stage Telemetry</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full text-xs font-mono font-semibold shadow-[0_0_10px_rgba(16,185,129,0.2)]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Available for Dispatch</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto tech-grid">{children}</main>
      </div>
    </div>
  );
};
