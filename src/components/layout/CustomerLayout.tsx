import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Laptop,
  ClipboardList,
  PlusCircle,
  Calendar,
  MessageSquare,
  Receipt,
  ShieldCheck,
  History,
  Bell,
  User,
  LogOut,
  Wrench,
  ChevronRight,
  Menu,
  X,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { store } from '../../services/store';
import { UserRole } from '../../types';
import { TechCareLogo } from '../ui/TechCareLogo';

interface CustomerLayoutProps {
  currentTab?: string;
  currentPage?: string;
  onNavigate: (tab: string, param?: string) => void;
  children: React.ReactNode;
}

export const CustomerLayout: React.FC<CustomerLayoutProps> = ({ currentTab, currentPage, onNavigate, children }) => {
  const rawTab = currentPage || currentTab || '';
  const activeTab = rawTab === 'warranties' ? 'warranty' : rawTab;
  const { user, logout } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [unreadMsgCount, setUnreadMsgCount] = useState(0);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);

  useEffect(() => {
    const updateBadges = () => {
      if (!user) return;
      const unreadMsgs = store.getMessages().filter((m) => m.receiver_id === user.id && !m.read).length;
      const unreadNotifs = store.getNotifications(user.id).filter((n) => !n.read).length;
      setUnreadMsgCount(unreadMsgs);
      setUnreadNotifCount(unreadNotifs);
    };

    updateBadges();
    const unsub = store.subscribe(updateBadges);
    return () => unsub();
  }, [user]);

  const navItems = [
    { id: 'customer-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'my-devices', label: 'My Devices', icon: Laptop },
    { id: 'service-requests', label: 'Service Requests', icon: ClipboardList },
    { id: 'new-request', label: 'New Service Request', icon: PlusCircle, highlight: true },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: unreadMsgCount },
    { id: 'invoices', label: 'Invoices', icon: Receipt },
    { id: 'warranty', label: 'Warranty Tracking', icon: ShieldCheck },
    { id: 'service-history', label: 'Service History', icon: History },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotifCount },
    { id: 'customer-profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen flex bg-[#07090e] text-slate-100">
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 lg:hidden backdrop-blur-xs"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed lg:sticky top-0 h-screen z-50 w-68 bg-[#0a0d16] text-slate-300 flex flex-col transition-transform duration-200 ease-in-out border-r border-slate-800/80 shadow-2xl ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-18 px-5 border-b border-slate-800/80 flex items-center justify-between">
          <div
            onClick={() => onNavigate('home')}
            className="cursor-pointer"
          >
            <TechCareLogo
              size="sm"
              badgeText="PORTAL"
              variant="cyan"
              subtitle="Customer Workspace"
            />
          </div>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="px-4 py-3 mx-3 my-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-3 shadow-inner">
          <img
            src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
            alt="Customer avatar"
            referrerPolicy="no-referrer"
            className="w-9 h-9 rounded-full object-cover border border-cyan-400/40 shadow-xs"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-100 truncate">
              {user?.full_name || user?.email?.split('@')[0] || 'Customer'}
            </p>
            <p className="text-[11px] text-slate-400 truncate font-mono">{user?.email}</p>
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
                    ? 'bg-blue-600/20 text-cyan-300 border border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.25)]'
                    : item.highlight
                    ? 'bg-blue-500/10 text-cyan-400 hover:bg-blue-500/20 border border-blue-500/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : item.highlight ? 'text-blue-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-cyan-500 text-slate-950 font-mono shadow-[0_0_8px_rgba(6,182,212,0.6)]">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-800/80 space-y-2">
          <div className="px-3 py-2 rounded-lg bg-blue-950/20 border border-blue-900/30 flex items-center justify-between">
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">Role Clearance</span>
            <span className="text-[10px] font-mono bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded font-bold">
              Customer
            </span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="text-[11px] text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
            >
              Public Website
            </button>
            <button
              type="button"
              onClick={async () => {
                await logout();
                onNavigate('customer-login');
              }}
              className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <LogOut className="w-3 h-3" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Bar */}
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
                {navItems.find((i) => i.id === activeTab)?.label || 'Customer Portal'}
              </h1>
              <p className="text-xs text-slate-400 hidden sm:block">
                Welcome back, {user?.full_name || user?.email?.split('@')[0] || 'Customer'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('notifications')}
              className="relative p-2 text-slate-400 hover:text-slate-100 rounded-xl hover:bg-slate-800/60 transition-colors border border-transparent hover:border-slate-800"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-[#0a0e1a] shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
              )}
            </button>

            <button
              type="button"
              onClick={() => onNavigate('new-request')}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.35)] transition-all border border-blue-400/30"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Book Service</span>
            </button>
          </div>
        </header>

        {/* Viewport Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto tech-grid">{children}</main>
      </div>
    </div>
  );
};
