import React, { useState } from 'react';
import { Sparkles, ArrowRight, AlertTriangle, ShieldCheck, Clock, CheckCircle2, RefreshCw } from 'lucide-react';
import { AIDiagnosisResult } from '../../types';
import { getDeviceVisual } from '../../utils/deviceImages';

interface TechCareAIAssistantProps {
  onBookRecommendedService: (serviceName: string, prefillProblem?: string) => void;
  compact?: boolean;
}

export const TechCareAIAssistant: React.FC<TechCareAIAssistantProps> = ({
  onBookRecommendedService,
  compact = false
}) => {
  const [deviceType, setDeviceType] = useState('Laptop');
  const [brand, setBrand] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AIDiagnosisResult | null>(null);

  const samplePrompts = [
    'My laptop turns on and fans spin, but the display stays completely black.',
    'Accidentally dropped water on my keyboard. Now it will not boot up.',
    'PC is making a loud buzzing rattle sound and shutting off during games.',
    'Phone battery drops from 60% to 10% in under an hour.'
  ];

  const handleDiagnose = async (overridePrompt?: string) => {
    const textToAnalyze = overridePrompt || problemDescription;
    if (!textToAnalyze.trim()) return;

    if (overridePrompt) {
      setProblemDescription(overridePrompt);
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceType,
          brand,
          problemDescription: textToAnalyze
        })
      });

      if (!res.ok) {
        throw new Error('Triage service error');
      }

      const data: AIDiagnosisResult = await res.json();
      setResult(data);
    } catch (e) {
      console.error('Triage error', e);
      // Client-side fallback if server is unreachable
      setResult({
        issueCategory: 'Display & Power Subsystem',
        recommendedService: deviceType === 'Mobile' ? 'Mobile Device Repair' : 'Laptop Repair',
        urgency: 'Medium',
        preliminaryAssessment: 'The symptoms suggest an intermittent display interface handshake or power rail drop. An oscilloscope bench probe will check if signals reach the inverter.',
        potentialCauses: ['Backlight enable pin tension loss', 'eDP ribbon cable wear', 'Graphics driver lockup'],
        recommendedCustomerPrep: ['Keep charger ready for bench power test', 'Do not shake or apply pressure to chassis'],
        estimatedDiagnosticTime: '30 - 45 mins',
        priceRangeEstimate: '₹1,499 - ₹2,999'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`bg-[#0c101d]/95 text-white rounded-2xl border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.12)] overflow-hidden ${compact ? 'p-5' : 'p-6 sm:p-8'}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold tracking-tight text-white">TechCare AI Triage Assistant</h3>
            <span className="text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-400/30">
              Gemini Diagnostics
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Describe your hardware or IT issue in natural language for instant bench triage &amp; scoping.
          </p>
        </div>
      </div>

      {/* Device + AI Interface Visual Telemetry Banner */}
      {!compact && (
        <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden relative group">
          <div className="relative h-44 sm:h-52 w-full overflow-hidden">
            <img
              src={getDeviceVisual(deviceType, brand).url}
              alt={getDeviceVisual(deviceType, brand).alt}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-65"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

            {/* AI HUD Overlay Elements */}
            <div className="absolute top-3 left-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-[11px] font-mono font-bold text-cyan-300 bg-[#080d19]/90 border border-cyan-500/40 px-2.5 py-1 rounded-lg backdrop-blur-md">
                ACTIVE AI TELEMETRY INTERFACE
              </span>
            </div>

            <div className="absolute top-3 right-4 hidden sm:flex items-center gap-2">
              <span className="text-[10px] font-mono text-slate-300 bg-slate-900/90 border border-slate-700 px-2.5 py-1 rounded-lg backdrop-blur-md">
                Neural Kernel 2.5 • ISO Precision
              </span>
            </div>

            <div className="absolute bottom-3 left-4 right-4 flex flex-wrap items-end justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block">
                  Target Telemetry Vector
                </span>
                <span className="text-base sm:text-lg font-black text-white">
                  {brand || 'Hardware Architecture'}: {deviceType} Ecosystem
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[11px]">
                <span className="text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
                  42,000+ Schematics
                </span>
                <span className="text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  Live Diagnostics
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Input Section */}
      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-mono font-semibold text-slate-300 mb-1">Device Type</label>
            <select
              value={deviceType}
              onChange={(e) => setDeviceType(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
            >
              <option value="Laptop">Laptop (Mac / PC / Chromebook)</option>
              <option value="Desktop">Desktop / Custom Workstation</option>
              <option value="Mobile">Mobile Phone / Smartphone</option>
              <option value="Tablet">iPad / Android Tablet</option>
              <option value="Printer">Laser / Inkjet Printer</option>
              <option value="Networking">Router / Mesh Wi-Fi</option>
              <option value="Server">Server / NAS Storage</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-mono font-semibold text-slate-300 mb-1">Brand & Model (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Dell XPS 15, MacBook Pro M2"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono font-semibold text-slate-300 mb-1">Describe the problem</label>
          <textarea
            rows={compact ? 2 : 3}
            placeholder="e.g. My laptop turns on and keyboard lights up, but the screen stays totally black..."
            value={problemDescription}
            onChange={(e) => setProblemDescription(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 resize-none"
          />
        </div>

        {/* Quick Suggestion Chips */}
        {!result && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="text-[11px] text-slate-400 self-center mr-1 font-mono">Try example:</span>
            {samplePrompts.slice(0, compact ? 2 : 3).map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleDiagnose(prompt)}
                className="text-[11px] bg-slate-900/70 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 px-2.5 py-1 rounded-lg border border-slate-700/80 hover:border-cyan-500/40 transition-colors text-left truncate max-w-xs"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        <div className="flex justify-end pt-1">
          <button
            type="button"
            disabled={isLoading || !problemDescription.trim()}
            onClick={() => handleDiagnose()}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-50 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:scale-[1.02]"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Analyzing Telemetry...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-cyan-200" />
                Run AI Diagnosis
              </>
            )}
          </button>
        </div>
      </div>

      {/* Structured Result Display */}
      {result && (
        <div className="mt-6 pt-6 border-t border-slate-800 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="bg-[#080b14] rounded-xl p-5 border border-cyan-500/30 shadow-[0_0_25px_rgba(6,182,212,0.1)] space-y-4">
            {/* Top recommendation line */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-wider text-cyan-400 uppercase">
                  Identified Issue Category
                </span>
                <h4 className="text-base font-bold text-white mt-0.5">{result.issueCategory}</h4>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-400/30">
                  {result.recommendedService}
                </span>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                    result.urgency === 'Critical'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-400/30'
                      : result.urgency === 'High'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                  }`}
                >
                  {result.urgency} Urgency
                </span>
              </div>
            </div>

            {/* Assessment & disclaimer */}
            <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-700/80">
              <p className="text-xs text-slate-300 leading-relaxed">{result.preliminaryAssessment}</p>
              <div className="flex items-center gap-1.5 mt-2.5 text-[11px] text-amber-400">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>Preliminary AI triage estimate — physical lab inspection confirms exact repair scope.</span>
              </div>
            </div>

            {/* Potential Causes & Customer prep */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="font-semibold text-slate-300 flex items-center gap-1.5 mb-2">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  Likely Root Causes:
                </span>
                <ul className="space-y-1.5 text-slate-400">
                  {result.potentialCauses.map((cause, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-blue-400 mt-0.5">•</span>
                      <span>{cause}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="font-semibold text-slate-300 flex items-center gap-1.5 mb-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  Recommended Customer Prep:
                </span>
                <ul className="space-y-1.5 text-slate-400">
                  {result.recommendedCustomerPrep.map((prep, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{prep}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CTA to Book Recommended Service */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-700/60">
              <div className="text-xs text-slate-400">
                Est. Turnaround: <span className="text-white font-semibold">{result.estimatedDiagnosticTime}</span> • Est. Cost: <span className="text-white font-semibold">{result.priceRangeEstimate}</span>
              </div>
              <button
                type="button"
                onClick={() => onBookRecommendedService(result.recommendedService, problemDescription)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md shadow-emerald-950/40"
              >
                Book Recommended Service
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
