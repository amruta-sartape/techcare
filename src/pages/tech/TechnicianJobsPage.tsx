import React, { useState, useEffect } from 'react';
import { Search, Filter, Wrench, ChevronRight, Laptop, Clock } from 'lucide-react';
import { store } from '../../services/store';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge, UrgencyBadge } from '../../components/ui/Badges';
import { getDeviceVisual } from '../../utils/deviceImages';
import { ServiceRequest } from '../../types';

interface TechnicianJobsPageProps {
  onNavigate: (page: string, param?: string) => void;
}

export const TechnicianJobsPage: React.FC<TechnicianJobsPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('active');
  const [search, setSearch] = useState('');
  const [requests, setRequests] = useState<ServiceRequest[]>(() => store.getServiceRequests());

  useEffect(() => {
    const handleUpdate = () => {
      setRequests(store.getServiceRequests());
    };
    handleUpdate();
    const unsub = store.subscribe(handleUpdate);
    return () => unsub();
  }, [user]);

  const filtered = requests.filter((r) => {
    let matchesStatus = true;
    if (filter === 'active') matchesStatus = r.status !== 'Completed' && r.status !== 'Cancelled';
    else if (filter === 'completed') matchesStatus = r.status === 'Completed';

    const matchesSearch =
      r.request_number.toLowerCase().includes(search.toLowerCase()) ||
      r.service_name.toLowerCase().includes(search.toLowerCase()) ||
      r.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      (r.device?.model && r.device.model.toLowerCase().includes(search.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Technician Work Orders Queue</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Complete inventory of hardware repair jobs assigned to your cleanroom workbench.
        </p>
      </div>

      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {(['active', 'all', 'completed'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setFilter(mode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors ${
                filter === mode ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {mode} Jobs
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search client, ticket #, device..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 divide-y divide-slate-800 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Wrench className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-300">No jobs found</p>
            <p className="text-xs text-slate-500 mt-1">No work orders match the current filter or search criteria.</p>
          </div>
        ) : (
          filtered.map((r) => {
            const devVisual = getDeviceVisual(r.device?.device_type, r.device?.model);
            return (
              <div
                key={r.id}
                onClick={() => onNavigate('request-detail', r.id)}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/60 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-950 border border-slate-700/80 shrink-0 relative shadow-md">
                    <img
                      src={devVisual.url}
                      alt={devVisual.alt}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-emerald-400">{r.request_number}</span>
                      <StatusBadge status={r.status} />
                      <UrgencyBadge urgency={r.urgency} />
                    </div>
                    <h4 className="text-sm font-bold text-white mt-1 group-hover:text-emerald-300 transition-colors">
                      {r.service_name}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {r.device?.brand} {r.device?.model} • Client: {r.customer_name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Stage</span>
                    <p className="text-xs font-bold text-emerald-400">{r.status}</p>
                  </div>
                  <div className="flex items-center text-xs font-bold text-emerald-400">
                    <span>Open Workbench</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
