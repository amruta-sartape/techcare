import React from 'react';
import { ShieldCheck, Award, Users, Wrench, CheckCircle2, ArrowRight, Zap, Sparkles } from 'lucide-react';
import { LAB_FACILITY_VISUALS } from '../../utils/deviceImages';

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20 text-slate-100">
      {/* Hero */}
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full shadow-[0_0_12px_rgba(6,182,212,0.15)]">
          About TechCare
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
          Modernizing Device Care with Enterprise Rigor.
        </h1>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          Founded by hardware engineers and enterprise systems architects, TechCare bridges the gap between chaotic local repair counters and enterprise IT needs.
        </p>
      </div>

      {/* Facilities and Philosophy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-5 text-xs sm:text-sm text-slate-400 leading-relaxed">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Precision Diagnostic Laboratories
          </h2>
          <p>
            Our central facility houses Class 100 cleanroom hoods for mechanical hard disk head swaps, thermal imaging benches for short-circuit detection, and high-purity ultrasonic wash stations for liquid damage recovery.
          </p>
          <p>
            Every technician in our network is thoroughly vetted and holds active certifications from Apple (ACMT), CompTIA (A+, Network+, Security+), or IPC (J-STD-001 Soldering).
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-4 bg-[#0c101d]/90 rounded-xl border border-slate-800 shadow-md glow-card">
              <p className="text-2xl font-mono font-black text-cyan-400">12,000+</p>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">Devices Restored</p>
            </div>
            <div className="p-4 bg-[#0c101d]/90 rounded-xl border border-slate-800 shadow-md glow-card">
              <p className="text-2xl font-mono font-black text-emerald-400">4.9 / 5.0</p>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">Customer Satisfaction</p>
            </div>
          </div>
        </div>

        <div className="relative group">
          <div className="rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.8)] border border-slate-800 bg-[#0c101d]">
            <img
              src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=900"
              alt="Hardware Engineering Lab"
              referrerPolicy="no-referrer"
              className="object-cover w-full h-80 sm:h-96 opacity-85 group-hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="absolute bottom-4 left-4 right-4 bg-[#080d19]/90 border border-slate-700/80 p-3 rounded-2xl backdrop-blur-md flex items-center justify-between text-xs font-mono">
            <span className="text-white font-semibold">Central Facility • ISO 14644-1</span>
            <span className="text-cyan-400">Active Telemetry</span>
          </div>
        </div>
      </div>

      {/* Professional Lab Facilities Infrastructure Showcase */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">Lab Infrastructure</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Certified Diagnostic Technology</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Our specialized test equipment isolates component-level faults with nanosecond precision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {LAB_FACILITY_VISUALS.map((fac, idx) => (
            <div
              key={idx}
              className="bg-[#0c101d]/90 rounded-2xl border border-slate-800/80 overflow-hidden shadow-lg glow-card flex flex-col justify-between group"
            >
              <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                <img
                  src={fac.url}
                  alt={fac.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c101d] via-[#0c101d]/40 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-cyan-300 bg-[#080d19]/90 border border-cyan-500/40 px-2 py-0.5 rounded backdrop-blur-md">
                    {fac.tag}
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {fac.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {fac.desc}
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono text-cyan-400">
                  <span>Lab Rig #{idx + 1}</span>
                  <span className="text-emerald-400">Calibrated</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Guarantees */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-[#0c101d]/90 rounded-2xl border border-slate-800/80 shadow-lg glow-card">
          <ShieldCheck className="w-8 h-8 text-cyan-400 mb-3" />
          <h3 className="text-base font-bold text-white mb-2">90-Day Hardware Shield</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            All replacement parts and micro-soldering repairs are covered under our comprehensive 90-day parts and labor warranty.
          </p>
        </div>

        <div className="p-6 bg-[#0c101d]/90 rounded-2xl border border-slate-800/80 shadow-lg glow-card">
          <Award className="w-8 h-8 text-emerald-400 mb-3" />
          <h3 className="text-base font-bold text-white mb-2">OEM Certified Quality</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            We partner directly with original equipment suppliers to guarantee genuine grade-A displays, batteries, and chipsets.
          </p>
        </div>

        <div className="p-6 bg-[#0c101d]/90 rounded-2xl border border-slate-800/80 shadow-lg glow-card">
          <Users className="w-8 h-8 text-indigo-400 mb-3" />
          <h3 className="text-base font-bold text-white mb-2">Dedicated Dispatch Support</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Live technical supervisors monitor every queue to resolve questions and coordinate on-site logistics.
          </p>
        </div>
      </div>
    </div>
  );
};
