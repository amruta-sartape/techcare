import React from 'react';
import {
  Wrench,
  Sparkles,
  ClipboardList,
  Truck,
  Search,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Zap,
  Lock,
  Package
} from 'lucide-react';
import { HOW_IT_WORKS_VISUALS } from '../../utils/deviceImages';

interface HowItWorksPageProps {
  onNavigate: (page: string) => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onNavigate }) => {
  const steps = [
    {
      step: '01',
      title: 'Digital Intake & Instant AI Triage',
      desc: 'Submit your device symptoms through our portal or speak directly to the TechCare AI Assistant for preliminary hardware telemetry and prep advice.',
      icon: Sparkles,
      visual: HOW_IT_WORKS_VISUALS[0]
    },
    {
      step: '02',
      title: 'Dispatch & White-Glove Logistics',
      desc: 'Choose between our secure express courier pickup, mobile on-site technician dispatch, or walk-in service at our certified cleanroom lab.',
      icon: Truck,
      visual: HOW_IT_WORKS_VISUALS[1]
    },
    {
      step: '03',
      title: 'Bench Telemetry & Precision Diagnosis',
      desc: 'Certified technicians utilize thermal imaging cameras, precision power rail oscilloscopes, and logic analyzer probes to isolate the exact defect.',
      icon: Search,
      visual: HOW_IT_WORKS_VISUALS[2]
    },
    {
      step: '04',
      title: 'Customer Transparent Approval',
      desc: 'We present full high-resolution inspection photos, exact component breakdown, and fixed pricing for your digital approval before any work proceeds.',
      icon: CheckCircle2,
      visual: HOW_IT_WORKS_VISUALS[3]
    },
    {
      step: '05',
      title: 'OEM Component Micro-Repair',
      desc: 'Repairs performed under ESD-safe static dissipative mats, filtered airflow, and IPC-certified micro-soldering standards.',
      icon: Wrench,
      visual: HOW_IT_WORKS_VISUALS[4]
    },
    {
      step: '06',
      title: 'Hardware Shield & Delivery',
      desc: '24-hour stress testing followed by clean repackaging with an official 90-day TechCare Hardware Shield warranty certificate.',
      icon: ShieldCheck,
      visual: HOW_IT_WORKS_VISUALS[5]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 text-slate-100">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full shadow-[0_0_12px_rgba(6,182,212,0.15)]">
          Workflow Architecture
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white">
          How TechCare Operates
        </h1>
        <p className="text-sm sm:text-base text-slate-400">
          Designed from the ground up to replace outdated repair shops with an enterprise SaaS experience.
        </p>
      </div>

      {/* Grid of Steps with Subtle Technical Visuals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {steps.map((st) => {
          const Icon = st.icon;
          return (
            <div
              key={st.step}
              className="bg-[#0c101d]/90 rounded-2xl border border-slate-800/80 overflow-hidden shadow-lg glow-card relative flex flex-col justify-between group"
            >
              {/* Subtle Technical Visual Thumbnail Banner */}
              <div className="relative h-40 w-full overflow-hidden bg-slate-950">
                <img
                  src={st.visual.url}
                  alt={st.visual.alt}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c101d] via-[#0c101d]/50 to-transparent" />

                {/* Step Pill */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#080d19]/90 border border-cyan-500/30 flex items-center justify-center text-cyan-300 backdrop-blur-md">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#080d19]/80 border border-slate-700/60 text-slate-300 backdrop-blur-md">
                    Phase {st.step}
                  </span>
                </div>

                <span className="text-3xl font-mono font-black text-slate-700/60 absolute top-3 right-4 select-none">
                  {st.step}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                    {st.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mt-2">
                    {st.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-cyan-400">
                  <span>Standard SLA Verified</span>
                  <span className="text-slate-500 font-normal">ISO 9001 Protocol</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quality Standards Guarantee with Cleanroom Imagery */}
      <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden border border-emerald-500/30 bg-gradient-to-br from-[#080d16] via-slate-900 to-emerald-950/30 shadow-[0_0_40px_rgba(16,185,129,0.15)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4 text-left">
            <div className="inline-flex items-center gap-2 bg-emerald-500/15 text-emerald-400 text-xs font-mono font-bold px-3 py-1 rounded-full border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
              <Lock className="w-3.5 h-3.5" />
              Zero Data Compromise Guarantee
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Your Personal &amp; Corporate Data Stays 100% Protected</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              All technicians sign strict non-disclosure agreements, bench systems boot into isolated live hardware testing kernels without accessing customer storage drives, and biometric drives are quarantined under strict chain-of-custody protocols.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('new-request')}
                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all inline-flex items-center gap-2 border border-blue-400/30 hover:scale-[1.02]"
              >
                Book Your Service Intake
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative rounded-2xl overflow-hidden border border-slate-800 shadow-xl group">
            <img
              src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800"
              alt="Class 100 Cleanroom Hardware Lab"
              referrerPolicy="no-referrer"
              className="w-full h-56 sm:h-64 object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080d16] via-[#080d16]/40 to-transparent" />
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] font-mono">
              <span className="text-white font-bold">Class-100 Cleanroom Lab</span>
              <span className="text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">
                Active Protocol
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

