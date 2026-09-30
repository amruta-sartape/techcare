import React, { useState } from 'react';
import { Search, Filter, UserCheck, Wrench, ChevronRight, Laptop, Clock, ArrowRight } from 'lucide-react';
import { store } from '../../services/store';
import { useToast } from '../../components/ui/Toast';
import { ServiceRequest, RequestStatus } from '../../types';
import { StatusBadge, UrgencyBadge } from '../../components/ui/Badges';
import { Modal } from '../../components/ui/Modal';
import { STAGES } from '../../components/ui/StatusTimeline';

interface AdminRequestsPageProps {
  onNavigate: (page: string, param?: string) => void;
}

export const AdminRequestsPage: React.FC<AdminRequestsPageProps> = ({ onNavigate }) => {
  const { success } = useToast();
  const [requests, setRequests] = useState<ServiceRequest[]>(() => store.getServiceRequests());
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  // Reassign Modal State
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedReq, setSelectedReq] = useState<ServiceRequest | null>(null);
  const [selectedTechId, setSelectedTechId] = useState<string>('tech-1');

  const refresh = () => {
    setRequests(store.getServiceRequests());
  };

  const storedTechs = store.getTechnicians();
  const technicians = storedTechs.length > 0
    ? storedTechs.map((t) => ({ id: t.id, name: t.full_name || 'Technician', role: t.specialties?.[0] || t.certifications?.[0] || 'Hardware Specialist' }))
    : [
        { id: 'tech-1', name: 'Rohan Deshmukh', role: 'Lead Micro-Soldering Specialist (ACMT)' },
        { id: 'tech-2', name: 'Priya Patil', role: 'Enterprise Wi-Fi & Network Architect (CCNA)' },
        { id: 'tech-3', name: 'Vikram Kadam', role: 'Cleanroom Data Recovery Engineer' }
      ];

  const handleOpenAssign = (req: ServiceRequest, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedReq(req);
    setSelectedTechId(req.assigned_technician_id || 'tech-1');
    setAssignModalOpen(true);
  };

  const handleConfirmAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReq) return;

    const techObj = technicians.find((t) => t.id === selectedTechId);
    store.assignTechnician(selectedReq.id, selectedTechId, techObj?.name || 'Assigned Tech');

    success('Technician Assigned', `${techObj?.name} assigned to work order ${selectedReq.request_number}`);
    setAssignModalOpen(false);
    refresh();
  };

  const filtered = requests.filter((r) => {
    let matchesStatus = true;
    if (statusFilter === 'active') {
      matchesStatus = r.status !== 'Completed' && r.status !== 'Cancelled';
    } else if (statusFilter !== 'all') {
      matchesStatus = r.status === statusFilter;
    }

    const matchesUrgency = urgencyFilter === 'all' || r.urgency === urgencyFilter;

    const matchesSearch =
      r.request_number.toLowerCase().includes(search.toLowerCase()) ||
      r.service_name.toLowerCase().includes(search.toLowerCase()) ||
      r.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      (r.device?.model && r.device.model.toLowerCase().includes(search.toLowerCase()));

    return matchesStatus && matchesUrgency && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Central Service Work Orders</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Dispatch, track SLA, balance technician workloads, and oversee bench operations.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('new-request')}
          className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
        >
          Create Manual Intake
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Stages</option>
            <option value="active">Active Pipeline Only</option>
            {STAGES.map((s) => (
              <option key={s.status} value={s.status}>
                {s.label}
              </option>
            ))}
          </select>

          <select
            value={urgencyFilter}
            onChange={(e) => setUrgencyFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Urgency SLAs</option>
            <option value="low">Standard / Low</option>
            <option value="medium">Normal / Medium</option>
            <option value="high">High Priority</option>
            <option value="critical">Critical Emergency</option>
          </select>
        </div>

        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search order #, client, device..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {filtered.map((r) => (
          <div
            key={r.id}
            onClick={() => onNavigate('request-detail', r.id)}
            className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors cursor-pointer"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Laptop className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                    {r.request_number}
                  </span>
                  <StatusBadge status={r.status} />
                  <UrgencyBadge urgency={r.urgency} />
                </div>
                <h4 className="text-sm font-bold text-slate-900 mt-1">
                  {r.service_name} — {r.device?.brand} {r.device?.model}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Client: <span className="text-slate-800 font-semibold">{r.customer_name}</span> • Assigned Tech:{' '}
                  <span className="text-blue-700 font-semibold">
                    {r.assigned_technician?.full_name || 'Unassigned'}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
              <div className="text-left md:text-right">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Billed</span>
                <p className="text-sm font-black text-slate-900">
                  ${(r.final_cost || r.estimated_cost || 0).toFixed(2)}
                </p>
              </div>

              <button
                type="button"
                onClick={(e) => handleOpenAssign(r, e)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Dispatch Tech
              </button>

              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        ))}
      </div>

      {/* Dispatch Reassign Modal */}
      <Modal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        title="Dispatch Technician to Work Order"
        subtitle={`Order: ${selectedReq?.request_number} • ${selectedReq?.service_name}`}
      >
        <form onSubmit={handleConfirmAssign} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Select Certified Technician
            </label>
            <div className="space-y-2">
              {technicians.map((t) => (
                <label
                  key={t.id}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                    selectedTechId === t.id
                      ? 'border-blue-600 bg-blue-50/60'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="tech"
                      value={t.id}
                      checked={selectedTechId === t.id}
                      onChange={() => setSelectedTechId(t.id)}
                      className="text-blue-600"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{t.name}</p>
                      <p className="text-[11px] text-slate-500">{t.role}</p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setAssignModalOpen(false)}
              className="text-xs font-semibold text-slate-600 px-4 py-2 rounded-xl hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-2 rounded-xl shadow-xs"
            >
              Confirm Dispatch Assignment
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
