import React, { useState } from 'react';
import {
  Menu,
  X,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { TechCareLogo } from '../ui/TechCareLogo';

interface PublicLayoutProps {
  currentPage: string;
  onNavigate: (page: string, param?: string) => void;
  children: React.ReactNode;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ currentPage, onNavigate, children }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'about', label: 'About' },
    { id: 'faq', label: 'FAQ' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#07090e] text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Announcement Bar */}
      <div className="bg-[#090d16] text-slate-400 text-xs py-1.5 px-4 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 bg-blue-500/15 text-blue-400 text-[11px] font-bold px-2 py-0.5 rounded-full border border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              SLA Live Engine
            </span>
            <span className="text-slate-300 text-xs hidden sm:inline">Certified Express Hardware &amp; IT Services in Pandharpur, Solapur, Maharashtra.</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-slate-400">
              <Phone className="w-3 h-3 text-cyan-400" />
              24/7 Priority Desk: <span className="text-slate-200 font-mono font-bold">+91 70833 81807</span>
            </span>

            {isAuthenticated && (
              <div className="flex items-center gap-2 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="text-slate-300 text-xs font-medium">
                  Signed in: <span className="text-cyan-400 font-mono font-bold capitalize">{user?.role}</span>
                </span>
                <button
                  type="button"
                  onClick={() => logout()}
                  className="text-[10px] text-rose-400 hover:text-rose-300 font-mono underline ml-1 cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 bg-[#080c16]/85 backdrop-blur-xl border-b border-slate-800/80 transition-all shadow-lg shadow-black/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          {/* Logo */}
          <div
            onClick={() => onNavigate('home')}
            className="cursor-pointer"
          >
            <TechCareLogo
              size="md"
              variant="cyan"
              subtitle="Enterprise Hardware & IT Care"
            />
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => onNavigate(link.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                  currentPage === link.id
                    ? 'text-cyan-300 bg-blue-500/15 border border-blue-500/30 shadow-[0_0_12px_rgba(59,130,246,0.2)]'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden sm:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (user?.role === 'technician') onNavigate('tech-dashboard');
                    else if (user?.role === 'admin') onNavigate('admin-dashboard');
                    else onNavigate('customer-dashboard');
                  }}
                  className="text-xs font-bold text-slate-200 bg-slate-900/90 hover:bg-slate-800 px-3.5 py-2 rounded-xl transition-all border border-slate-700/80 hover:border-slate-600 flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <span>Go to {user?.role === 'admin' ? 'Admin Portal' : user?.role === 'technician' ? 'Tech Workbench' : 'Customer Portal'}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
                </button>
                <button
                  type="button"
                  onClick={() => logout()}
                  className="text-xs font-medium text-slate-400 hover:text-rose-400 px-2 py-2 transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="text-xs font-bold text-slate-200 hover:text-white bg-slate-900/90 hover:bg-slate-800 px-4 py-2.5 rounded-xl transition-all border border-slate-700/80 hover:border-cyan-400/50 cursor-pointer shadow-xs"
              >
                Sign In
              </button>
            )}

            <button
              type="button"
              onClick={() => onNavigate('new-request')}
              className="inline-flex items-center gap-2 btn-electric text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-cyan-400/30 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
              <span>Book a Service</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex sm:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/80 border border-slate-800"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-[#0a0e1a] px-4 pt-3 pb-5 space-y-2 animate-in slide-in-from-top-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => {
                  onNavigate(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  currentPage === link.id ? 'bg-blue-500/15 text-cyan-300 border border-blue-500/30' : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                {link.label}
              </button>
            ))}
            <div className="pt-3 border-t border-slate-800/80 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  onNavigate('new-request');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center btn-electric text-white font-bold text-sm py-2.5 rounded-xl shadow-lg shadow-blue-500/20"
              >
                Book a Service
              </button>
              {isAuthenticated ? (
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (user?.role === 'technician') onNavigate('tech-dashboard');
                      else if (user?.role === 'admin') onNavigate('admin-dashboard');
                      else onNavigate('customer-dashboard');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-center text-slate-200 bg-slate-900 border border-slate-700 font-semibold text-xs py-2.5 rounded-xl cursor-pointer"
                  >
                    Go to {user?.role === 'admin' ? 'Admin Portal' : user?.role === 'technician' ? 'Tech Workbench' : 'Customer Portal'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-center text-rose-400 hover:text-rose-300 text-xs py-2 cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center text-slate-200 hover:text-white bg-slate-900/90 border border-slate-700/80 font-bold text-xs py-2.5 rounded-xl cursor-pointer transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Page Body */}
      <main className="flex-1 tech-grid">{children}</main>

      {/* Professional Dark Tech Footer */}
      <footer className="bg-[#05070c] text-slate-400 border-t border-slate-800/80 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-800/80">
            {/* Column 1: Brand */}
            <div className="lg:col-span-2 space-y-4">
              <TechCareLogo
                size="md"
                variant="cyan"
              />
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                Next-generation IT infrastructure &amp; device care management platform. Unifying enterprise clients, certified field engineers, and precision diagnostic labs through automated SLA pipelines.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[10px] font-mono font-semibold bg-slate-900 text-cyan-300 px-2.5 py-1 rounded-md border border-slate-800">
                  Apple ACMT Certified
                </span>
                <span className="text-[10px] font-mono font-semibold bg-slate-900 text-blue-300 px-2.5 py-1 rounded-md border border-slate-800">
                  CompTIA A+ Platinum
                </span>
                <span className="text-[10px] font-mono font-semibold bg-slate-900 text-emerald-300 px-2.5 py-1 rounded-md border border-slate-800">
                  Cisco CCNA
                </span>
                <span className="text-[10px] font-mono font-semibold bg-slate-900 text-purple-300 px-2.5 py-1 rounded-md border border-slate-800">
                  SOC-2 Aligned
                </span>
              </div>
            </div>

            {/* Column 2: Services */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Service Catalog</h4>
              <ul className="space-y-2 text-xs">
                <li><button onClick={() => onNavigate('services')} className="hover:text-cyan-400 transition-colors">Laptop Logic Board Repair</button></li>
                <li><button onClick={() => onNavigate('services')} className="hover:text-cyan-400 transition-colors">Custom Desktop Diagnostics</button></li>
                <li><button onClick={() => onNavigate('services')} className="hover:text-cyan-400 transition-colors">Mobile Screen &amp; Battery</button></li>
                <li><button onClick={() => onNavigate('services')} className="hover:text-cyan-400 transition-colors">Enterprise Wi-Fi 7 Mesh</button></li>
                <li><button onClick={() => onNavigate('services')} className="hover:text-cyan-400 transition-colors">Cleanroom Data Recovery</button></li>
                <li><button onClick={() => onNavigate('services')} className="hover:text-cyan-400 transition-colors">Workstation Rollouts</button></li>
              </ul>
            </div>

            {/* Column 3: Platform */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Platform</h4>
              <ul className="space-y-2 text-xs">
                <li><button type="button" onClick={() => onNavigate('home')} className="hover:text-cyan-400 transition-colors cursor-pointer">Home</button></li>
                <li><button type="button" onClick={() => onNavigate('services')} className="hover:text-cyan-400 transition-colors cursor-pointer">Services</button></li>
                <li><button type="button" onClick={() => onNavigate('how-it-works')} className="hover:text-cyan-400 transition-colors cursor-pointer">How It Works</button></li>
                <li><button type="button" onClick={() => onNavigate('about')} className="hover:text-cyan-400 transition-colors cursor-pointer">About TechCare</button></li>
                <li><button type="button" onClick={() => onNavigate('faq')} className="hover:text-cyan-400 transition-colors cursor-pointer">Knowledge Base &amp; FAQ</button></li>
                <li><button type="button" onClick={() => onNavigate('login')} className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors cursor-pointer">Sign In</button></li>
              </ul>
            </div>

            {/* Column 4: Contact & Location */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Headquarters</h4>
              <ul className="space-y-2.5 text-xs">
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>Pandharpur, Solapur,<br />Maharashtra, India</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="font-mono">+91 70833 81807</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="font-mono">hello@techcare.in</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>© 2026 TechCare — All Rights Reserved | Owned &amp; Operated by Amruta Vaibhav Sartape</p>
            <div className="flex items-center gap-6">
              <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
              <span className="hover:text-slate-400 cursor-pointer">Service Level Agreement</span>
              <span className="hover:text-slate-400 cursor-pointer">Hardware Warranty Terms</span>
              <span className="hover:text-slate-400 cursor-pointer">Cloud Telemetry</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
