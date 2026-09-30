import React, { useState, useEffect } from 'react';
import {
  Wrench,
  LayoutDashboard,
  Users,
  UserCheck,
  Laptop,
  Layers,
  ClipboardList,
  Calendar,
  Boxes,
  Receipt,
  Star,
  BarChart3,
  Bot,
  Settings,
  LogOut,
  Menu,
  X,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { store } from '../../services/store';
import { UserRole } from '../../types';
import { TechCareLogo } from '../ui/TechCareLogo';
import { ExecutiveAICopilotModal } from '../ai/ExecutiveAICopilotModal';

interface AdminLayoutProps {
  currentTab?: string;
  currentPage?: string;
  onNavigate: (tab: string, param?: string) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ currentTab, currentPage, onNavigate, children }) => {
  const activeTab = currentPage || currentTab || '';
  const { user, logout } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [openRequestsCount, setOpenRequestsCount] = useState(0);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  useEffect(() => {
    const updateStats = () => {
      const lowStock = store.getInventory().filter((i) => i.status === 'low_stock' || i.status === 'out_of_stock').length;
      const openReqs = store.getServiceRequests().filter((r) => r.status !== 'Completed' && r.status !== 'Cancelled').length;
      setLowStockCount(lowStock);
      setOpenRequestsCount(openReqs);
    };

    updateStats();
    const unsub = store.subscribe(updateStats);
    return () => unsub();
  }, []);

  const navItems = [
    { id: 'admin-dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'admin-requests', label: 'Service Requests', icon: ClipboardList, badge: openRequestsCount },
    { id: 'admin-technicians', label: 'Technicians', icon: UserCheck },
    { id: 'admin-customers', label: 'Customers', icon: Users },
    { id: 'admin-devices', label: 'Devices Fleet', icon: Laptop },
    { id: 'admin-services', label: 'Service Catalog', icon: Layers },
    { id: 'admin-appointments', label: 'Appointments', icon: Calendar },
    { id: 'admin-inventory', label: 'Inventory & Parts', icon: Boxes, badge: lowStockCount, badgeColor: 'bg-amber-500' },
    { id: 'admin-invoices', label: 'Invoices & Billing', icon: Receipt },
    { id: 'admin-reviews', label: 'Customer Reviews', icon: Star },
    { id: 'admin-analytics', label: 'Financial Analytics', icon: BarChart3 },
    { id: 'admin-ai', label: 'Executive AI Copilot', icon: Bot, highlight: true },
    { id: 'admin-settings', label: 'System Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-[#07090e] font-sans text-slate-100">
      {/* Mobile Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 lg:hidden backdrop-blur-xs"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Admin Sidebar */}
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
              badgeText="ADMIN"
              variant="purple"
              subtitle="Operations Command"
            />
          </div>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Admin User Card */}
        <div className="px-4 py-3 mx-3 my-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-3 shadow-inner">
          <img
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200"
            alt="Admin avatar"
            referrerPolicy="no-referrer"
            className="w-10 h-10 rounded-xl object-cover border border-purple-400/40 shadow-xs"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-100 truncate">{user?.full_name || 'Amruta Vaibhav Sartape'}</p>
            <p className="text-[10px] text-purple-400 font-mono">Owner &amp; Managing Director</p>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
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
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-purple-500/15 text-purple-300 border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                    : item.highlight
                    ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/10 text-purple-300 hover:bg-purple-500/30 border border-purple-500/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : item.highlight ? 'text-purple-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`px-1.5 py-0.2 text-[10px] font-bold rounded-full text-slate-950 font-mono ${
                      item.badgeColor || 'bg-purple-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800/80 space-y-2">
          <div className="px-3 py-2 rounded-lg bg-purple-950/20 border border-purple-900/30 flex items-center justify-between">
            <span className="text-[10px] font-mono text-purple-400 font-bold uppercase">Role Clearance</span>
            <span className="text-[10px] font-mono bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded font-bold">
              Owner / Admin
            </span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="text-[11px] text-slate-400 hover:text-purple-400 transition-colors cursor-pointer"
            >
              Public Site
            </button>
            <button
              type="button"
              onClick={async () => {
                await logout();
                onNavigate('admin-login');
              }}
              className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <LogOut className="w-3 h-3" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Viewport */}
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
                {navItems.find((i) => i.id === activeTab)?.label || 'Operations Center'}
              </h1>
              <p className="text-xs text-slate-400 hidden sm:block">Full SaaS Fleet, Revenue &amp; Logistics Control</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {lowStockCount > 0 && (
              <button
                type="button"
                onClick={() => onNavigate('admin-inventory')}
                className="hidden sm:inline-flex items-center gap-1.5 bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-mono font-semibold px-3 py-1.5 rounded-full hover:bg-amber-500/25 transition-colors"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>{lowStockCount} Parts Low Stock</span>
              </button>
            )}
            <button
              type="button"
              id="ask-executive-ai-header-button"
              onClick={() => setIsCopilotOpen(true)}
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-[0_0_15px_rgba(147,51,234,0.35)] transition-all border border-purple-400/30 cursor-pointer"
            >
              <Bot className="w-4 h-4" />
              <span>Ask Executive AI</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto tech-grid">{children}</main>
      </div>

      <ExecutiveAICopilotModal
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        onNavigate={onNavigate}
      />
    </div>
  );
};
