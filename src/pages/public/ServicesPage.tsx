import React, { useState } from 'react';
import {
  Search,
  Clock,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Filter,
  Laptop,
  Smartphone,
  Wifi,
  HardDrive,
  Cpu,
  Terminal,
  Wrench,
  Sparkles,
  Zap
} from 'lucide-react';
import { store } from '../../services/store';
import { getServiceVisual } from '../../utils/deviceImages';

interface ServicesPageProps {
  onNavigate: (page: string, param?: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigate }) => {
  const allServices = store.getServices();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: 'All Services' },
    { id: 'Hardware', label: 'Hardware & Micro-Soldering' },
    { id: 'Mobile', label: 'Mobile & Tablet' },
    { id: 'Networking', label: 'Enterprise & Wi-Fi' },
    { id: 'Data Recovery', label: 'Data Recovery & Storage' },
    { id: 'Operating System', label: 'Software & OS Optimization' }
  ];

  const getServiceIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'hardware':
      case 'laptops':
        return Laptop;
      case 'mobile':
      case 'phones':
        return Smartphone;
      case 'networking':
        return Wifi;
      case 'data recovery':
        return HardDrive;
      case 'operating system':
        return Terminal;
      default:
        return Cpu;
    }
  };

  const filtered = allServices.filter((s) => {
    const matchesCat = selectedCategory === 'all' || s.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 text-slate-100 font-sans">
      {/* Title Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 bg-blue-500/10 border border-blue-500/20 px-3.5 py-1.5 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.15)]">
          <Zap className="w-3.5 h-3.5" />
          Certified Lab Capabilities
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          Professional Hardware &amp; IT Services
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          Transparent flat-rate baseline diagnostics, OEM certified parts, and guaranteed hardware warranty coverage.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0c101d]/90 p-4 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-xl">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all ${
                selectedCategory === c.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_12px_rgba(6,182,212,0.25)] font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search service, part, issue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors font-sans"
          />
        </div>
      </div>

      {/* Services Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-[#0c101d]/60 rounded-3xl border border-slate-800 p-8 space-y-4">
          <p className="text-base font-bold text-slate-300">No services match your criteria.</p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="text-xs font-mono text-cyan-400 hover:underline"
          >
            Clear filters and show all services
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((s) => {
            const Icon = getServiceIcon(s.category);
            const visual = getServiceVisual(s.id, s.name);
            return (
              <div
                key={s.id}
                className="bg-[#0c101d]/90 rounded-2xl border border-slate-800/80 overflow-hidden shadow-lg glow-card flex flex-col justify-between group"
              >
                {/* High-Resolution Service Device Visual Banner */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                  <img
                    src={visual.url}
                    alt={visual.alt}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-75"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c101d] via-[#0c101d]/40 to-transparent" />

                  {/* Category Pill */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#080d19]/90 border border-blue-500/30 flex items-center justify-center text-cyan-300 backdrop-blur-md">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#080d19]/80 border border-slate-700/60 text-slate-300 backdrop-blur-md">
                      {s.category}
                    </span>
                  </div>

                  {/* Starting Price */}
                  <div className="absolute top-3 right-3">
                    <span className="text-xs font-mono font-bold text-white bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-700 shadow-md">
                      From ₹{s.starting_price.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Visual Label */}
                  {visual.label && (
                    <div className="absolute bottom-2 left-3">
                      <span className="text-[9px] font-mono font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded">
                        {visual.label}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                      {s.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      {s.description}
                    </p>

                    {/* Highlights tag strip */}
                    <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-slate-800/50">
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        OEM Grade A
                      </span>
                      <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                        Class 100 Lab
                      </span>
                    </div>
                  </div>

                  <div className="pt-5 mt-5 border-t border-slate-800/80 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                      <span className="flex items-center gap-1.5 text-[11px]">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        {s.turnaround_time}
                      </span>
                      <span className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {s.warranty_duration_days}-Day Shield
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onNavigate('new-request', s.id)}
                      className="w-full py-2.5 btn-electric text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 border border-cyan-400/30"
                    >
                      <span>Book This Service</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
