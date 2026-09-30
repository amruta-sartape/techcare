import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, HelpCircle } from 'lucide-react';

interface FAQPageProps {
  onNavigate: (page: string) => void;
}

export const FAQPage: React.FC<FAQPageProps> = ({ onNavigate }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [search, setSearch] = useState('');

  const faqs = [
    {
      q: 'How does the TechCare 9-stage tracking system work?',
      a: 'Once your service request is submitted, our portal automatically logs every milestone in real time: from intake and courier dispatch to diagnostic bench measurements, customer pre-approval, micro-repair, burn-in testing, and completion. You receive notifications and can message your technician directly throughout.'
    },
    {
      q: 'What is included in the 90-Day TechCare Hardware Shield?',
      a: 'All parts replaced and labor performed are guaranteed for a minimum of 90 calendar days (some services up to 180 days). If any recurring defect arises on the repaired subsystem, we rectify it with zero labor or replacement fees.'
    },
    {
      q: 'How does the AI Service Assistant diagnose issues?',
      a: 'The TechCare AI Assistant uses our trained technical knowledge graph combined with Gemini reasoning to analyze symptom patterns. It provides preliminary categorization, recommended diagnostic checks, and urgency estimates. Final diagnosis is confirmed on our physical testing bench.'
    },
    {
      q: 'Will my data and personal files be looked at during repair?',
      a: 'Never. Our technicians operate under strict zero-data-access policies. For hardware diagnostics, we boot into dedicated RAM-based external diagnostic test suites that isolate and protect your storage drives.'
    },
    {
      q: 'Can I request express same-day or on-site service?',
      a: 'Yes! Select the "Critical" or "High" priority SLA during checkout. Our mobile dispatch van or priority laboratory bench will triage your equipment immediately.'
    },
    {
      q: 'How does billing and invoice payment work?',
      a: 'Once a repair is approved and marked Completed by the assigned technician, an itemized invoice is automatically generated in your customer portal. You can view, download PDF statements, and process secure payments with one click.'
    }
  ];

  const filtered = faqs.filter(
    (f) => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 text-slate-100">
      <div className="text-center space-y-3">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full shadow-[0_0_12px_rgba(6,182,212,0.15)]">
          Knowledge Base
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-slate-400">
          Everything you need to know about our certifications, turnaround times, and warranty coverage.
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-lg mx-auto">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          placeholder="Search questions (e.g. warranty, data, express)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#0c101d]/90 border border-slate-700/80 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 shadow-xl focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
        />
      </div>

      {/* Accordion */}
      <div className="space-y-3">
        {filtered.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-[#0c101d]/90 rounded-2xl border border-slate-800/80 overflow-hidden shadow-lg glow-card transition-all"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-100 hover:text-cyan-300 transition-colors"
              >
                <span>{faq.q}</span>
                {isOpen ? <ChevronUp className="w-4 h-4 shrink-0 text-cyan-400" /> : <ChevronDown className="w-4 h-4 shrink-0 text-slate-400" />}
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/80 pt-3 bg-slate-900/40">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
