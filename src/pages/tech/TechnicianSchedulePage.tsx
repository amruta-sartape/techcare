import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Wrench,
  ChevronRight,
  User,
  Laptop,
  AlertCircle
} from 'lucide-react';
import { store } from '../../services/store';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { Appointment, ServiceRequest } from '../../types';
import { StatusBadge } from '../../components/ui/Badges';

interface TechnicianSchedulePageProps {
  onNavigate: (page: string, param?: string) => void;
}

interface ScheduleEntry {
  id: string;
  appointmentId?: string;
  requestId: string;
  requestNumber: string;
  dateStr: string;
  rawDate: string;
  timeSlot: string;
  customerName: string;
  deviceInfo: string;
  serviceName: string;
  status: string;
  location: string;
  notes?: string;
  isAppointment: boolean;
}

export const TechnicianSchedulePage: React.FC<TechnicianSchedulePageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { success } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>(() => store.getAppointments());
  const [requests, setRequests] = useState<ServiceRequest[]>(() => store.getServiceRequests());
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'completed'>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const handleUpdate = () => {
      setAppointments(store.getAppointments());
      setRequests(store.getServiceRequests());
    };
    handleUpdate();
    const unsub = store.subscribe(handleUpdate);
    return () => unsub();
  }, []);

  const handleMarkComplete = (aptId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    store.updateAppointment(aptId, { status: 'completed' });
    success('Appointment Completed', 'Service schedule slot marked as fulfilled.');
  };

  // Compile unified technician schedule entries
  const scheduleEntries: ScheduleEntry[] = [];
  const processedRequestIds = new Set<string>();

  // 1. Process formal appointments
  appointments.forEach((apt) => {
    const linkedReq = requests.find(
      (r) => r.id === apt.request_id || r.request_number === apt.request_number
    );

    if (linkedReq) {
      processedRequestIds.add(linkedReq.id);
    }

    const rawDate = apt.scheduled_at || (linkedReq ? linkedReq.preferred_date : '');
    const dateFormatted = rawDate
      ? new Date(rawDate).toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      : 'Scheduled';

    const dev = linkedReq?.device
      ? `${linkedReq.device.brand} ${linkedReq.device.model}`.trim()
      : apt.device_info || 'Client Device';

    scheduleEntries.push({
      id: `apt-${apt.id}`,
      appointmentId: apt.id,
      requestId: linkedReq?.id || apt.request_id || 'req-1',
      requestNumber: linkedReq?.request_number || apt.request_number || 'TC-9482',
      dateStr: dateFormatted,
      rawDate: rawDate || '',
      timeSlot: apt.time_slot || linkedReq?.preferred_time_slot || '10:00 AM - 12:00 PM',
      customerName: linkedReq?.customer_name || apt.customer_name || 'Valued Client',
      deviceInfo: dev,
      serviceName: linkedReq?.service_name || apt.service_name || 'Hardware Repair',
      status: apt.status === 'completed' ? 'Completed' : linkedReq?.status || 'Scheduled',
      location: apt.location || 'TechCare Cleanroom Bench #04',
      notes: apt.notes || linkedReq?.problem_description,
      isAppointment: true
    });
  });

  // 2. Include any assigned requests for this technician that aren't already represented
  requests.forEach((req) => {
    const isAssigned =
      req.assigned_technician_id === 'tech-1' ||
      req.assigned_technician_id === user?.id ||
      !req.assigned_technician_id;

    if (isAssigned && !processedRequestIds.has(req.id)) {
      processedRequestIds.add(req.id);
      const rawDate = req.preferred_date || '';
      const dateFormatted = rawDate
        ? new Date(rawDate).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })
        : 'Assigned Bench Queue';

      const dev = req.device
        ? `${req.device.brand} ${req.device.model}`.trim()
        : 'Assigned Device';

      scheduleEntries.push({
        id: `req-${req.id}`,
        requestId: req.id,
        requestNumber: req.request_number,
        dateStr: dateFormatted,
        rawDate,
        timeSlot: req.preferred_time_slot || 'Bench Intake Slot',
        customerName: req.customer_name,
        deviceInfo: dev,
        serviceName: req.service_name,
        status: req.status,
        location: 'Cleanroom Station #04 • Central Hub',
        notes: req.problem_description,
        isAppointment: false
      });
    }
  });

  const filtered = scheduleEntries.filter((item) => {
    let matchesStatus = true;
    const isDone = item.status === 'Completed' || item.status === 'completed';
    if (filter === 'scheduled') matchesStatus = !isDone;
    if (filter === 'completed') matchesStatus = isDone;

    const matchesSearch =
      item.customerName.toLowerCase().includes(search.toLowerCase()) ||
      item.deviceInfo.toLowerCase().includes(search.toLowerCase()) ||
      item.serviceName.toLowerCase().includes(search.toLowerCase()) ||
      item.requestNumber.toLowerCase().includes(search.toLowerCase()) ||
      item.timeSlot.toLowerCase().includes(search.toLowerCase()) ||
      item.dateStr.toLowerCase().includes(search.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const activeCount = scheduleEntries.filter(
    (i) => i.status !== 'Completed' && i.status !== 'completed'
  ).length;
  const completedCount = scheduleEntries.filter(
    (i) => i.status === 'Completed' || i.status === 'completed'
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Technician Daily Service Schedule</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Scheduled cleanroom appointments, bench inspection drop-offs, and onsite dispatch windows.
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Total Scheduled Jobs</p>
            <p className="text-xl font-extrabold text-white">{scheduleEntries.length}</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Active / In-Bench</p>
            <p className="text-xl font-extrabold text-amber-400">{activeCount}</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Completed Windows</p>
            <p className="text-xl font-extrabold text-blue-400">{completedCount}</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {(['all', 'scheduled', 'completed'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setFilter(mode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors ${
                filter === mode
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {mode === 'scheduled' ? 'Active / Scheduled' : `${mode} Jobs`}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search client, device, ticket #..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Appointment Schedule List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 text-xs">
            No service schedule entries match your search criteria.
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => onNavigate('request-detail', item.requestId)}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-emerald-500/50 hover:bg-slate-850 transition-all cursor-pointer group shadow-xs"
            >
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 group-hover:border-emerald-500/40 flex flex-col items-center justify-center shrink-0 transition-colors">
                  <Clock className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                </div>

                <div className="space-y-1">
                  {/* Date & Time Row */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {item.timeSlot}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">• {item.dateStr}</span>
                    <StatusBadge status={item.status} />
                  </div>

                  {/* Customer, Service & Ticket # */}
                  <div className="flex items-center gap-3 text-xs text-slate-300 flex-wrap">
                    <span className="flex items-center gap-1 font-semibold text-slate-200">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      {item.customerName}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-300">{item.serviceName}</span>
                    <span className="text-slate-600">•</span>
                    <span className="font-mono text-emerald-400 font-bold">
                      #{item.requestNumber}
                    </span>
                  </div>

                  {/* Device & Location */}
                  <div className="flex items-center gap-4 text-[11px] text-slate-400 flex-wrap">
                    <span className="flex items-center gap-1 text-slate-300">
                      <Laptop className="w-3 h-3 text-emerald-500" />
                      <strong>Device:</strong> {item.deviceInfo}
                    </span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <MapPin className="w-3 h-3" />
                      {item.location}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                {item.appointmentId && item.status !== 'Completed' && (
                  <button
                    type="button"
                    onClick={(e) => handleMarkComplete(item.appointmentId!, e)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Mark Done
                  </button>
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate('request-detail', item.requestId);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 group-hover:bg-emerald-600 text-slate-200 group-hover:text-white text-xs font-bold transition-colors flex items-center gap-1"
                >
                  View Details
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
