import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../components/ui/Toast';

export const ContactPage: React.FC = () => {
  const { success } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    success('Message Sent', 'Our technical dispatch team will reply within 30 minutes.');
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 text-slate-100">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full shadow-[0_0_12px_rgba(6,182,212,0.15)]">
          Direct Inquiries
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          Contact Our Dispatch &amp; Support Operations
        </h1>
        <p className="text-sm text-slate-400">
          Have questions about an ongoing service, enterprise fleet maintenance, or partnership?
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0c101d]/90 p-6 rounded-2xl border border-slate-800/80 shadow-lg glow-card space-y-6">
            <h3 className="text-base font-bold text-white">Central Laboratory &amp; Dispatch</h3>

            <div className="space-y-4 text-xs sm:text-sm text-slate-400">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">Central Operations Hub</p>
                  <p className="text-xs text-slate-400">Pandharpur, Solapur, Maharashtra, India</p>
                  <p className="text-[11px] text-cyan-400/90 font-medium mt-0.5">Owned &amp; Operated by Amruta Vaibhav Sartape</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">Direct &amp; Priority Line</p>
                  <p className="text-xs text-slate-400 font-mono">+91 70833 81807</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">Official Correspondence</p>
                  <p className="text-xs text-slate-400 font-mono">hello@techcare.in</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">Lab &amp; Service Hours</p>
                  <p className="text-xs text-slate-400">Monday - Saturday: 9:00 AM – 8:00 PM IST</p>
                  <p className="text-xs text-slate-400">Sunday: Emergency Dispatch On-Call</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#080d16] text-white p-6 rounded-2xl border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.1)] space-y-2">
            <h4 className="text-sm font-bold text-cyan-300">Enterprise Fleet Inquiries</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Need SLA support for more than 50 company laptops or workstations? Ask about our TechCare Corporate fleet contract.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7">
          <div className="bg-[#0c101d]/90 p-8 rounded-2xl border border-slate-800/80 shadow-lg glow-card">
            {submitted ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Message Received</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  A certified dispatch coordinator has received your inquiry and will follow up shortly.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setName('');
                    setEmail('');
                    setSubject('');
                    setMessage('');
                  }}
                  className="text-xs font-bold text-cyan-400 hover:text-cyan-300 pt-2 transition-colors"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-base font-bold text-white mb-2">Send an Inquiry</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-300 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-300 mb-1">Work or Personal Email *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-300 mb-1">Subject / Device Type *</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Bulk laptop battery replacement quote"
                    className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-300 mb-1">Message *</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can our technical team assist you?"
                    className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.25)] transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
