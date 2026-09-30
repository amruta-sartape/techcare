import React, { useState } from 'react';
import {
  Wrench,
  ShieldCheck,
  Clock,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Star,
  Laptop,
  Cpu,
  Activity,
  HardDrive,
  Smartphone,
  Wifi,
  CheckCircle2,
  Terminal,
  Zap,
  Layers,
  Search
} from 'lucide-react';
import { TechCareAIAssistant } from '../../components/ai/TechCareAIAssistant';
import { store } from '../../services/store';
import { getServiceVisual, DEVICE_TYPE_IMAGES } from '../../utils/deviceImages';

interface HomePageProps {
  onNavigate: (page: string, param?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const services = store.getServices().slice(0, 6);
  const reviews = store.getReviews().slice(0, 3);

  // Interactive Hero Bench Terminal state
  const [activeTab, setActiveTab] = useState<'telemetry' | 'signals' | 'specs'>('telemetry');
  const [selectedPreset, setSelectedPreset] = useState<string>('MacBook Pro M2');

  const benchPresets: Record<string, {
    device: string;
    stage: string;
    progress: number;
    tech: string;
    action: string;
    voltage: string;
    thermal: string;
    image: string;
    badge: string;
  }> = {
    'MacBook Pro M2': {
      device: 'MacBook Pro 16" (M2 Max)',
      stage: 'Stage 04: Precision Bench Diagnostics',
      progress: 45,
      tech: 'Rohan Deshmukh (Apple ACMT)',
      action: 'Oscilloscope voltage probe on 3.3V rail. Ultrasonic flux clean scheduled.',
      voltage: '3.31V / Stable',
      thermal: '32.4°C / Optimal',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=900',
      badge: 'LOGIC BOARD DIAGNOSTICS'
    },
    'Custom PC BSOD': {
      device: 'Threadripper 7980X Workstation',
      stage: 'Stage 05: Component Replacement',
      progress: 60,
      tech: 'Priya Patil (CompTIA Master)',
      action: 'Replacing VRM MOSFET array & running 48-hour AIDA64 stress test.',
      voltage: '12.04V / Verified',
      thermal: '48.1°C / Normal',
      image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=900',
      badge: 'PCIE & VRM POWER RAIL'
    },
    'Cleanroom Recovery': {
      device: 'Enterprise NVMe RAID-5 Array',
      stage: 'Stage 03: ISO Cleanroom Inspection',
      progress: 30,
      tech: 'Vikram Shinde (Storage Specialist)',
      action: 'Micro-head alignment under Class-100 laminar flow hood.',
      voltage: '5.01V / Nominal',
      thermal: '24.0°C / Controlled',
      image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&q=80&w=900',
      badge: 'ISO-5 CLEANROOM HEAD SWAP'
    }
  };

  const currentPreset = benchPresets[selectedPreset] || benchPresets['MacBook Pro M2'];

  const getServiceIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'laptops':
        return Laptop;
      case 'desktops':
        return Cpu;
      case 'phones':
      case 'mobile':
        return Smartphone;
      case 'networking':
        return Wifi;
      case 'data recovery':
        return HardDrive;
      default:
        return Wrench;
    }
  };

  return (
    <div className="space-y-20 pb-20 text-slate-100 font-sans">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-slate-800/80">
        {/* Subtle background ambient glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-gradient-to-tr from-blue-600/15 via-cyan-500/10 to-transparent blur-[140px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Authoritative Copy & Direct Booking */}
            <div className="lg:col-span-7 space-y-6">
              {/* Telemetry Status Badge */}
              <div className="inline-flex items-center gap-2.5 bg-[#090e1a] border border-blue-500/30 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
                </span>
                <span>LIVE ISO LAB DISPATCH • SLA 2.4H BENCH TRIAGE</span>
              </div>

              {/* Punchy High-Contrast Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-black tracking-tight text-white leading-[1.12]">
                Precision Hardware &amp; IT Service,{' '}
                <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-200 bg-clip-text text-transparent">
                  Engineered for Reliability.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-normal">
                Connecting enterprise IT directors, certified hardware engineers, and modern teams into one reactive ecosystem. Real-time telemetry, transparent diagnostics, and hardware warranty guarantees.
              </p>

              {/* Interactive Quick-Issue Presets */}
              <div className="pt-1">
                <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  Simulate Live Diagnostic Station:
                </p>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(benchPresets).map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setSelectedPreset(preset)}
                      className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition-all ${
                        selectedPreset === preset
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.25)] font-bold'
                          : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('new-request')}
                  className="inline-flex items-center gap-2.5 btn-electric text-white font-bold text-sm px-6 py-3.5 rounded-xl border border-cyan-400/30"
                >
                  <Sparkles className="w-4 h-4 text-cyan-100" />
                  <span>Book Certified Service</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('services')}
                  className="inline-flex items-center gap-2 bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-bold text-sm px-6 py-3.5 rounded-xl border border-slate-700/80 hover:border-cyan-500/40 shadow-xs transition-all"
                >
                  Explore Catalog
                </button>
              </div>

              {/* High-Impact Stat Strip */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800/80">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <p className="text-xl sm:text-2xl font-black text-white font-mono">99.4%</p>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium">First-Time Fix SLA</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    <p className="text-xl sm:text-2xl font-black text-cyan-300 font-mono">&lt; 2.4h</p>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium">Average Triage SLA</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <p className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">90 Days</p>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium">Hardware Shield</p>
                </div>
              </div>
            </div>

            {/* Right Column: High-Tech Interactive Bench Telemetry Terminal */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-3xl border border-slate-800 bg-[#0c101d] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] glow-card">
                {/* Terminal Header */}
                <div className="px-4 py-3 bg-[#080b13] border-b border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                    <span className="font-mono text-[11px] text-slate-400 font-semibold pl-1">
                      BENCH-04 • MAHARASHTRA LAB
                    </span>
                  </div>

                  {/* Terminal Nav Tabs */}
                  <div className="flex items-center gap-1 bg-slate-900/80 p-0.5 rounded-lg border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setActiveTab('telemetry')}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                        activeTab === 'telemetry' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Status
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('signals')}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                        activeTab === 'signals' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Sensors
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('specs')}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                        activeTab === 'specs' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Shield
                    </button>
                  </div>
                </div>

                {/* Hardware Photo with Real-Time Data Overlay */}
                <div className="relative h-64 sm:h-72 w-full overflow-hidden group">
                  <img
                    src={currentPreset.image}
                    alt={currentPreset.device}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c101d] via-[#0c101d]/50 to-transparent" />

                  {/* Live Target Crosshair */}
                  <div className="absolute top-4 right-4 bg-[#080d19]/90 border border-cyan-500/40 rounded-xl px-3 py-1.5 backdrop-blur-md">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                      <span className="text-[10px] font-mono font-bold text-cyan-300">{currentPreset.badge}</span>
                    </div>
                  </div>

                  {/* Bottom Image Overlay Tag */}
                  <div className="absolute bottom-3 left-4 right-4">
                    <p className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider font-bold">Target Device</p>
                    <p className="text-sm font-bold text-white tracking-tight">{currentPreset.device}</p>
                  </div>
                </div>

                {/* Tabbed Interactive Telemetry Data Body */}
                <div className="p-4 bg-[#0a0e1a]/95 space-y-3 border-t border-slate-800/80">
                  {activeTab === 'telemetry' && (
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-slate-400 font-medium">{currentPreset.stage}</span>
                          <span className="text-cyan-400 font-mono font-bold">{currentPreset.progress}% Complete</span>
                        </div>
                        <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                            style={{ width: `${currentPreset.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
                        <p className="text-slate-300 text-[11px] leading-relaxed">
                          <span className="text-cyan-400 font-mono font-semibold">Active: </span>
                          {currentPreset.action}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                        <span className="font-mono">Lead Tech: {currentPreset.tech}</span>
                        <span className="text-emerald-400 font-mono font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Bench Verified
                        </span>
                      </div>
                    </div>
                  )}

                  {activeTab === 'signals' && (
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                        <span className="text-[10px] font-mono text-slate-400 block uppercase">Oscilloscope Rail</span>
                        <span className="text-xs font-mono font-bold text-cyan-300 mt-1 block">{currentPreset.voltage}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                        <span className="text-[10px] font-mono text-slate-400 block uppercase">Thermal Profile</span>
                        <span className="text-xs font-mono font-bold text-emerald-300 mt-1 block">{currentPreset.thermal}</span>
                      </div>
                      <div className="col-span-2 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400">Flux Residuals</span>
                        <span className="text-[11px] font-mono text-emerald-400 font-bold">0.00 ppm (Cleanroom Grade)</span>
                      </div>
                    </div>
                  )}

                  {activeTab === 'specs' && (
                    <div className="space-y-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-[11px]">90-Day Unconditional Warranty Shield included with this device.</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                        <span>Original Parts: OEM Grade A</span>
                        <span className="text-cyan-400 font-mono">Serial Locked</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Hero Hardware Fleet Showcase: Laptop, Smartphone & Modern IT Hardware */}
          <div className="mt-14 pt-10 border-t border-slate-800/80">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                  Precision Hardware Fleet
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                  Engineered Support Across Modern Form Factors
                </h3>
              </div>
              <p className="text-xs text-slate-400 max-w-md">
                Certified cleanroom benches, OEM component stock, and real-time telemetry across laptops, smartphones, and enterprise IT infrastructure.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Laptop Card */}
              <div
                onClick={() => setSelectedPreset('MacBook Pro M2')}
                className="group relative rounded-2xl overflow-hidden border border-slate-800 bg-[#0c101d] hover:border-cyan-500/50 transition-all duration-300 shadow-lg glow-card cursor-pointer"
              >
                <div className="relative h-44 w-full overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800"
                    alt="Precision Laptop and Ultrabook Hardware"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c101d] via-[#0c101d]/40 to-transparent" />
                  <span className="absolute top-3 left-3 text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#080d19]/90 border border-blue-500/40 text-cyan-300 backdrop-blur-md">
                    Laptops &amp; Ultrabooks
                  </span>
                  <span className="absolute top-3 right-3 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                    Level 3 Micro-BGA
                  </span>
                </div>
                <div className="p-4 space-y-2">
                  <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                    Apple Mac &amp; PC Laptops
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Logic board diagnostics, power rail oscilloscope probes, liquid damage ultrasonic clean, and Retina display replacements.
                  </p>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800">
                    <span className="text-cyan-400">90-Day Warranty</span>
                    <span className="group-hover:translate-x-1 transition-transform text-slate-300 font-bold flex items-center gap-1">
                      Simulate Bench <ArrowRight className="w-3 h-3 text-cyan-400" />
                    </span>
                  </div>
                </div>
              </div>

              {/* Smartphone Card */}
              <div
                onClick={() => onNavigate('new-request')}
                className="group relative rounded-2xl overflow-hidden border border-slate-800 bg-[#0c101d] hover:border-cyan-500/50 transition-all duration-300 shadow-lg glow-card cursor-pointer"
              >
                <div className="relative h-44 w-full overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&q=80&w=800"
                    alt="Titanium Flagship Smartphone Hardware"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c101d] via-[#0c101d]/40 to-transparent" />
                  <span className="absolute top-3 left-3 text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#080d19]/90 border border-cyan-500/40 text-cyan-300 backdrop-blur-md">
                    Smartphones &amp; Mobile
                  </span>
                  <span className="absolute top-3 right-3 text-[10px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded">
                    IP68 Acoustic Seal
                  </span>
                </div>
                <div className="p-4 space-y-2">
                  <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                    Flagship Titanium Smartphones
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Precision OLED digitizer lamination, TrueDepth camera alignment, OEM battery cycle renewal, and micro-port soldering.
                  </p>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800">
                    <span className="text-cyan-400">Same-Day Express</span>
                    <span className="group-hover:translate-x-1 transition-transform text-slate-300 font-bold flex items-center gap-1">
                      Book Service <ArrowRight className="w-3 h-3 text-cyan-400" />
                    </span>
                  </div>
                </div>
              </div>

              {/* Modern IT Hardware & Infrastructure Card */}
              <div
                onClick={() => setSelectedPreset('Custom PC BSOD')}
                className="group relative rounded-2xl overflow-hidden border border-slate-800 bg-[#0c101d] hover:border-cyan-500/50 transition-all duration-300 shadow-lg glow-card cursor-pointer"
              >
                <div className="relative h-44 w-full overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=800"
                    alt="Modern IT Hardware, GPU and Server Architecture"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c101d] via-[#0c101d]/40 to-transparent" />
                  <span className="absolute top-3 left-3 text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#080d19]/90 border border-indigo-500/40 text-cyan-300 backdrop-blur-md">
                    Modern IT Hardware
                  </span>
                  <span className="absolute top-3 right-3 text-[10px] font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/30 px-2 py-0.5 rounded">
                    PCIe Gen5 &amp; Servers
                  </span>
                </div>
                <div className="p-4 space-y-2">
                  <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                    GPU Rigs, Servers &amp; Network
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Threadripper &amp; Xeon workstation repair, enterprise NVMe RAID arrays, multi-gigabit Wi-Fi 7 fabric, and server rack overhauls.
                  </p>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800">
                    <span className="text-cyan-400">On-Site &amp; Cleanroom</span>
                    <span className="group-hover:translate-x-1 transition-transform text-slate-300 font-bold flex items-center gap-1">
                      Simulate Bench <ArrowRight className="w-3 h-3 text-cyan-400" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Embedded AI Service Assistant */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-6">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full mb-2 shadow-[0_0_12px_rgba(6,182,212,0.15)]">
            <Sparkles className="w-3.5 h-3.5" />
            Natural Language Diagnostics
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Describe your device problem. Our AI will triage it.
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Get instant preliminary recommendations, probable causes, and booking prep tips powered by TechCare diagnostics.
          </p>
        </div>

        <TechCareAIAssistant
          onBookRecommendedService={(srvName, prob) => {
            onNavigate('new-request');
          }}
        />
      </section>

      {/* Featured Services Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">Certified Catalog</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Core Service Offerings</h2>
            <p className="text-xs text-slate-400 mt-1">ISO-certified lab technicians equipped with precision micro-soldering and diagnostic tools.</p>
          </div>
          <button
            onClick={() => onNavigate('services')}
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors group"
          >
            View all 12 services
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => {
            const Icon = getServiceIcon(s.category);
            const visual = getServiceVisual(s.id, s.name);
            return (
              <div
                key={s.id}
                className="bg-[#0c101d]/90 rounded-2xl border border-slate-800/80 overflow-hidden shadow-lg glow-card flex flex-col justify-between group"
              >
                {/* Dedicated High-Quality Service Hardware Visual Banner */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                  <img
                    src={visual.url}
                    alt={visual.alt}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-75"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c101d] via-[#0c101d]/40 to-transparent" />

                  {/* Floating Category Icon & Tag */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#080d19]/90 border border-blue-500/30 flex items-center justify-center text-cyan-300 backdrop-blur-md">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#080d19]/80 border border-slate-700/60 text-slate-300 backdrop-blur-md">
                      {s.category}
                    </span>
                  </div>

                  {/* Starting Price Pill */}
                  <div className="absolute top-3 right-3">
                    <span className="text-xs font-mono font-bold text-white bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-700 shadow-md">
                      From ₹{s.starting_price}
                    </span>
                  </div>

                  {/* Visual Hardware Label */}
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
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-2">
                      {s.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-800/80 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center gap-1 font-mono text-[11px]">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        {s.turnaround_time}
                      </span>
                      <span className="flex items-center gap-1 text-emerald-400 font-semibold font-mono text-[11px]">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {s.warranty_duration_days}-Day Shield
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onNavigate('new-request', s.id)}
                      className="w-full py-2.5 bg-slate-900 hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-600 text-slate-200 hover:text-white text-xs font-bold rounded-xl transition-all text-center border border-slate-700/80 hover:border-transparent shadow-xs"
                    >
                      Book Service
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 9-Stage Guided Lifecycle Section */}
      <section className="bg-[#05070c] border-y border-slate-800/80 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 tech-grid opacity-30 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">Total Transparency</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              The 9-Stage TechCare Service Lifecycle
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Every device logged into our portal is tracked across nine real-time verification stages with instant telemetry updates.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { num: '01', title: 'Request Created', desc: 'Detailed symptoms logged with high-res diagnostic photos.' },
              { num: '02', title: 'Tech Assigned', desc: 'Certification-matched dispatch to certified lab engineer.' },
              { num: '03', title: 'Express Dispatch', desc: 'Secure courier or mobile workbench travels to location.' },
              { num: '04', title: 'Lab Diagnosis', desc: 'Oscilloscope, thermal camera, and precision bench tests.' },
              { num: '05', title: 'Hardware Shield', desc: 'OEM parts calibrated & 90-day warranty issued.' }
            ].map((st) => (
              <div key={st.num} className="bg-[#0c101d]/90 p-5 rounded-2xl border border-slate-800 glow-card text-left">
                <span className="text-2xl font-black text-cyan-400 font-mono">{st.num}</span>
                <h4 className="text-sm font-bold text-white mt-2">{st.title}</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>

          {/* Service Tracking Live Device/Repair Visual Console */}
          <div className="mt-8 rounded-3xl border border-cyan-500/30 bg-[#080d19] overflow-hidden shadow-[0_0_40px_rgba(6,182,212,0.12)]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              <div className="lg:col-span-7 relative min-h-[260px] sm:min-h-[300px] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&q=80&w=1200"
                  alt="Live Bench Repair and Component Micro-Soldering"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-transparent via-[#080d19]/40 to-[#080d19]" />
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-slate-950/90 border border-cyan-500/40 px-3 py-1.5 rounded-xl backdrop-blur-md">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                  <span className="text-xs font-mono font-bold text-cyan-300">
                    STAGE 04: ACTIVE BENCH TELEMETRY
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 bg-slate-950/80 border border-slate-800 p-3 rounded-xl backdrop-blur-md hidden sm:flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-300">Workstation ID: MH-BENCH-08</span>
                  <span className="text-emerald-400">IPC-A-610 Verified</span>
                </div>
              </div>

              <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-cyan-300 border border-blue-500/30 font-bold">
                      Telemetry Dispatch
                    </span>
                    <span className="text-xs text-slate-400 font-mono">TK-90214-MBP</span>
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    Full Visual Audit &amp; Stage Inspection Log
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Track your device with optical proof: high-resolution microscope photos, power rail voltage readings, and replacement serial authentications delivered straight to your portal.
                  </p>

                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                      <span className="text-slate-300">Intake &amp; Triage</span>
                      <span className="text-emerald-400 font-mono font-bold">✓ Complete</span>
                    </div>
                    <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30">
                      <span className="text-cyan-200 font-semibold">Micro-Soldering &amp; Logic Repair</span>
                      <span className="text-cyan-400 font-mono font-bold animate-pulse">In Progress</span>
                    </div>
                    <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                      <span className="text-slate-400">90-Day Shield Certification</span>
                      <span className="text-slate-500 font-mono">Queued</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-800 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => onNavigate('service-requests')}
                    className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all text-center cursor-pointer"
                  >
                    Track Your Device Ticket
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Verified Client Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">Verified Client Outcomes</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Trusted by Engineering &amp; IT Teams</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">Real feedback from clients whose mission-critical workstations were restored.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <div key={r.id} className="bg-[#0c101d]/90 p-6 rounded-2xl border border-slate-800/80 shadow-lg glow-card flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic">"{r.comment}"</p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-100">{r.customer_name}</p>
                  <p className="text-[11px] text-slate-400">{r.service_name}</p>
                </div>
                <span className="text-[10px] text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded-full font-mono font-semibold">
                  Verified Client
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* High-Impact CTA Box */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden border border-blue-500/30 bg-gradient-to-r from-blue-950/60 via-slate-900/90 to-cyan-950/50 shadow-[0_0_40px_rgba(37,99,235,0.2)] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-black text-white">Have a device requiring urgent attention?</h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Our certified technicians are standing by with same-day emergency dispatch and ISO cleanroom diagnostics.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('new-request')}
            className="btn-electric text-white font-bold text-sm px-6 py-3.5 rounded-xl border border-cyan-400/30 whitespace-nowrap"
          >
            Start Service Request Now
          </button>
        </div>
      </section>
    </div>
  );
};

