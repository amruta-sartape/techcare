import React, { useState } from 'react';
import { User, CheckCircle2, ShieldCheck, Wrench, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';

export const TechnicianProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { success } = useToast();

  const [isAvailable, setIsAvailable] = useState(true);
  const [specialty, setSpecialty] = useState('Logic Board Micro-Soldering & Ultrasonic Liquid Cleaning');

  const handleToggle = () => {
    setIsAvailable(!isAvailable);
    success('Dispatch Status Updated', `You are now marked as ${!isAvailable ? 'AVAILABLE for incoming jobs' : 'BUSY / IN-BENCH'}`);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Technician Credentials &amp; Bench Status</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure active dispatch availability and laboratory bench assignment.
        </p>
      </div>

      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-6">
        {/* Availability Toggle */}
        <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800">
          <div>
            <p className="text-xs font-bold text-white">Active Dispatch Status</p>
            <p className="text-[11px] text-slate-400">
              When available, the central dispatch automated queue assigns new emergency intakes to your bench.
            </p>
          </div>
          <button
            type="button"
            onClick={handleToggle}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              isAvailable ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
            }`}
          >
            {isAvailable ? 'Available' : 'Busy / In-Lab'}
          </button>
        </div>

        {/* Info */}
        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Technician Name</label>
            <input
              type="text"
              disabled
              value={user?.full_name || 'Rohan Deshmukh'}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-300"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Assigned Cleanroom Station</label>
            <input
              type="text"
              disabled
              value="Bench Station #04 — Micro-Soldering & Optical Diagnostics"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-300"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Core Specialization</label>
            <input
              type="text"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
