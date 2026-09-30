import React, { useState } from 'react';
import { Search, PlusCircle, Laptop, Clock, ChevronRight, Filter } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { store } from '../../services/store';
import { RequestStatus, ServiceRequest } from '../../types';
import { StatusBadge, UrgencyBadge } from '../../components/ui/Badges';
import { getDeviceVisual } from '../../utils/deviceImages';

interface CustomerRequestsPageProps {
  onNavigate: (page: string, param?: string) => void;
  isHistory?: boolean;
}

export const CustomerRequestsPage: React.FC<CustomerRequestsPageProps> = ({ onNavigate, isHistory = false }) => {
  const { user } = useAuth();
  const allRequests = store.getServiceRequests({ userId: user?.id });

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const filterOptions = [
    { id: 'all', label: isHistory ? 'All Records' : 'All Tickets' },
    { id: 'active', label: 'Active in Pipeline' },
    { id: 'Completed', label: 'Completed' },
    { id: 'Cancelled', label: 'Cancelled' }
  ];

  const filtered = allRequests.filter((r) => {
    let matchesStatus = true;
    if (statusFilter === 'active') {
      matchesStatus = r.status !== 'Completed' && r.status !== 'Cancelled';
    } else if (statusFilter !== 'all') {
      matchesStatus = r.status === statusFilter;
    }

    const matchesSearch =
      r.request_number.toLowerCase().includes(search.toLowerCase()) ||
      r.service_name.toLowerCase().includes(search.toLowerCase()) ||
      (r.device?.model && r.device.model.toLowerCase().includes(search.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {isHistory ? 'Service & Repair History' : 'Service Request Tickets'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isHistory
              ? 'Complete historical record of all diagnostic tickets, past maintenance, and closed hardware services.'
              : 'Monitor real-time repair progress, view bench diagnostics, and message technicians.'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('new-request')}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Service Intake</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {filterOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setStatusFilter(opt.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === opt.id ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search ticket #, device, service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Ticket List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            {isHistory
              ? 'No service history records found matching your filter criteria.'
              : 'No service requests found matching your filter criteria.'}
          </div>
        ) : (
          filtered.map((req) => {
            const devVisual = getDeviceVisual(req.device?.device_type, req.device?.model);
            return (
              <div
                key={req.id}
                onClick={() => onNavigate('request-detail', req.id)}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors cursor-pointer group"
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shrink-0 relative shadow-xs">
                    <img
                      src={devVisual.url}
                      alt={devVisual.alt}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                        {req.request_number}
                      </span>
                      <StatusBadge status={req.status} />
                      <UrgencyBadge urgency={req.urgency} />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">{req.service_name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {req.device?.brand} {req.device?.model} • Dispatched {new Date(req.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Cost</span>
                  <p className="text-sm font-black text-slate-900">
                    ₹{(req.final_cost || req.estimated_cost || 0).toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="flex items-center text-xs font-bold text-blue-600">
                  <span>View Details</span>
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
