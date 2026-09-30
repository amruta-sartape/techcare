import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Search,
  Plus,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
  User,
  Wrench
} from 'lucide-react';
import { store } from '../../services/store';
import { useToast } from '../../components/ui/Toast';
import { Appointment, ServiceRequest } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { StatCard } from '../../components/ui/StatCard';

interface AdminAppointmentsPageProps {
  onNavigate: (page: string, param?: string) => void;
}

export const AdminAppointmentsPage: React.FC<AdminAppointmentsPageProps> = ({ onNavigate }) => {
  const { success, error } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>(() => store.getAppointments());
  const [requests, setRequests] = useState<ServiceRequest[]>(() => store.getServiceRequests());
  const [technicians, setTechnicians] = useState(() => store.getTechnicians());

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'scheduled' | 'completed' | 'cancelled'>('all');
  const [modalOpen, setModalOpen] = useState(false);

  // Form states for new appointment
  const [requestId, setRequestId] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 12:00 PM');
  const [location, setLocation] = useState('San Francisco Main Lab - Bench 4');
  const [technicianId, setTechnicianId] = useState('');
  const [notes, setNotes] = useState('');

  const refresh = () => {
    setAppointments(store.getAppointments());
    setRequests(store.getServiceRequests());
    setTechnicians(store.getTechnicians());
  };

  useEffect(() => {
    const unsub = store.subscribe(refresh);
    return () => unsub();
  }, []);

  const handleUpdateStatus = (id: string, newStatus: Appointment['status']) => {
    store.updateAppointment(id, { status: newStatus });
    success('Appointment Updated', `Session status changed to ${newStatus}.`);
    refresh();
  };

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const req = requests.find((r) => r.id === requestId);
    if (!req) {
      error('Selection Required', 'Please associate a service request ticket.');
      return;
    }

    const tech = technicians.find((t) => t.id === technicianId);

    const newAppt: Appointment = {
      id: `appt-${Date.now()}`,
      request_id: req.id,
      request_number: req.request_number,
      user_id: req.user_id,
      customer_name: req.customer_name,
      technician_id: tech?.id,
      technician_name: tech?.full_name || req.assigned_technician?.full_name || 'Assigned Specialist',
      scheduled_at: scheduledAt || new Date(Date.now() + 86400000).toISOString().split('T')[0],
      time_slot: timeSlot,
      status: 'scheduled',
      location: location.trim(),
      notes: notes.trim() || undefined,
      service_name: req.service_name,
      device_info: `${req.device?.brand || ''} ${req.device?.model || ''}`.trim() || 'Client Device'
    };

    store.addAppointment(newAppt);
    success('Appointment Scheduled', `Booked for ${req.customer_name} on ${newAppt.scheduled_at}`);
    setModalOpen(false);
    setRequestId('');
    setNotes('');
    refresh();
  };

  const filtered = appointments.filter((a) => {
    const term = search.toLowerCase();
    const matchesSearch =
      (a.customer_name || '').toLowerCase().includes(term) ||
      (a.request_number || '').toLowerCase().includes(term) ||
      (a.service_name || '').toLowerCase().includes(term) ||
      (a.technician_name || '').toLowerCase().includes(term) ||
      (a.location || '').toLowerCase().includes(term);

    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const scheduledCount = appointments.filter((a) => a.status === 'scheduled').length;
  const completedCount = appointments.filter((a) => a.status === 'completed').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Lab Appointments &amp; On-Site Dispatch</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Customer in-person intake slots, bench triage sessions, and enterprise dispatch calendar.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Book Appointment Slot</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Scheduled Appointments"
          value={scheduledCount}
          subtitle="Upcoming customer bookings"
          icon={Calendar}
          iconColor="text-blue-600"
          bgColor="bg-blue-50"
        />
        <StatCard
          title="Completed Sessions"
          value={completedCount}
          subtitle="Fulfillments recorded"
          icon={CheckCircle2}
          iconColor="text-emerald-600"
          bgColor="bg-emerald-50"
        />
        <StatCard
          title="Active Field Techs"
          value={technicians.filter((t) => t.active_status).length}
          subtitle="Certified engineers on roster"
          icon={User}
          iconColor="text-purple-600"
          bgColor="bg-purple-50"
        />
        <StatCard
          title="Attendance Rate"
          value={`${Math.round((completedCount / (appointments.length || 1)) * 100)}%`}
          subtitle="SLA fulfillment adherence"
          icon={Clock}
          iconColor="text-amber-600"
          bgColor="bg-amber-50"
        />
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              statusFilter === 'all' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Bookings ({appointments.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('scheduled')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              statusFilter === 'scheduled' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Upcoming Scheduled ({scheduledCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              statusFilter === 'completed' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search ticket #, customer, tech..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-4">Appointment Schedule</th>
                <th className="p-4">Customer &amp; Ticket</th>
                <th className="p-4">Service &amp; Hardware</th>
                <th className="p-4">Assigned Engineer</th>
                <th className="p-4">Status &amp; Actions</th>
                <th className="p-4 text-right">Ticket Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 text-xs">
                    No appointments found matching your query.
                  </td>
                </tr>
              ) : (
                filtered.map((appt) => (
                  <tr key={appt.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4">
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{appt.scheduled_at}</p>
                          <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                            <Clock className="w-3 h-3" />
                            <span>{appt.time_slot}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate max-w-[150px]">{appt.location}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-slate-900">{appt.customer_name}</p>
                      <span className="font-mono text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {appt.request_number}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-slate-800">{appt.service_name}</p>
                      <p className="text-[11px] text-slate-500">{appt.device_info}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-[10px]">
                          {appt.technician_name ? appt.technician_name[0] : 'T'}
                        </div>
                        <span className="font-medium text-slate-700">
                          {appt.technician_name || 'Unassigned'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                            appt.status === 'scheduled'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : appt.status === 'completed'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          {appt.status}
                        </span>

                        {appt.status === 'scheduled' && (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(appt.id, 'completed')}
                              title="Mark Completed"
                              className="p-1 hover:bg-emerald-100 text-emerald-700 rounded transition-colors"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(appt.id, 'cancelled')}
                              title="Cancel Session"
                              className="p-1 hover:bg-rose-100 text-rose-700 rounded transition-colors"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        type="button"
                        onClick={() => onNavigate('request-detail', appt.request_id)}
                        className="inline-flex items-center gap-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-semibold px-2.5 py-1.5 rounded-lg text-xs transition-colors"
                      >
                        <span>Open Ticket</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Book Appointment */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Schedule Lab or On-Site Appointment"
        subtitle="Book a formal triage session or customer hardware drop-off."
      >
        <form onSubmit={handleCreateAppointment} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Associated Service Request *
            </label>
            <select
              required
              value={requestId}
              onChange={(e) => setRequestId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select ticket...</option>
              {requests.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.request_number} — {r.customer_name} ({r.service_name})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Date *</label>
              <input
                type="date"
                required
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Time Slot</label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM</option>
                <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM</option>
                <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
                <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Technician</label>
            <select
              value={technicianId}
              onChange={(e) => setTechnicianId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Auto-assign / Request default</option>
              {technicians.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.full_name} ({t.rating} ★)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Lab / Site Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Appointment Notes</label>
            <textarea
              rows={2}
              placeholder="Drop-off instructions, customer symptom details..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
            >
              Confirm Appointment
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
