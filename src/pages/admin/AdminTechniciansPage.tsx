import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  Search,
  Plus,
  Star,
  Award,
  CheckCircle2,
  Wrench,
  Clock,
  Briefcase,
  Mail,
  Phone,
  Shield,
  ChevronRight
} from 'lucide-react';
import { store } from '../../services/store';
import { useToast } from '../../components/ui/Toast';
import { Technician, ServiceRequest } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { StatCard } from '../../components/ui/StatCard';

interface AdminTechniciansPageProps {
  onNavigate: (page: string, param?: string) => void;
}

export const AdminTechniciansPage: React.FC<AdminTechniciansPageProps> = ({ onNavigate }) => {
  const { success, error } = useToast();
  const [technicians, setTechnicians] = useState<Technician[]>(() => store.getTechnicians());
  const [requests, setRequests] = useState<ServiceRequest[]>(() => store.getServiceRequests());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'on_leave'>('all');
  const [modalOpen, setModalOpen] = useState(false);

  // Form for new technician
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [experience, setExperience] = useState(5);
  const [specialtiesStr, setSpecialtiesStr] = useState('Micro-Soldering, Logic Board Rework');
  const [certificationsStr, setCertificationsStr] = useState('Apple Certified (ACMT), CompTIA A+');

  const refresh = () => {
    setTechnicians(store.getTechnicians());
    setRequests(store.getServiceRequests());
  };

  useEffect(() => {
    const unsub = store.subscribe(refresh);
    return () => unsub();
  }, []);

  const handleToggleStatus = (id: string, currentStatus: boolean, name: string) => {
    store.updateTechnician(id, { active_status: !currentStatus });
    success(
      'Status Updated',
      `${name} is now ${!currentStatus ? 'Active on Bench Duty' : 'Set to On Leave'}`
    );
    refresh();
  };

  const handleCreateTechnician = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      error('Required Fields', 'Full name and email are mandatory.');
      return;
    }

    const newTech: Technician = {
      id: `tech-${Date.now()}`,
      profile_id: `usr-tech-${Date.now()}`,
      full_name: fullName.trim(),
      email: email.trim(),
      phone: phone.trim() || '+1 (415) 555-0100',
      specialties: specialtiesStr
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      certifications: certificationsStr
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean),
      experience_years: Number(experience) || 3,
      rating: 5.0,
      completed_jobs_count: 0,
      active_status: true,
      current_workload: 0
    };

    store.addTechnician(newTech);
    success('Technician Onboarded', `${fullName} has been certified and added to the roster.`);
    setModalOpen(false);
    setFullName('');
    setEmail('');
    setPhone('');
    refresh();
  };

  const filtered = technicians.filter((t) => {
    const matchesSearch =
      (t.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (t.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (t.specialties || []).some((s) => (s || '').toLowerCase().includes(search.toLowerCase()));

    if (statusFilter === 'active') return matchesSearch && t.active_status;
    if (statusFilter === 'on_leave') return matchesSearch && !t.active_status;
    return matchesSearch;
  });

  const totalCompletedJobs = technicians.reduce((acc, t) => acc + t.completed_jobs_count, 0);
  const avgCsat = (
    technicians.reduce((acc, t) => acc + t.rating, 0) / (technicians.length || 1)
  ).toFixed(2);
  const activeTechsCount = technicians.filter((t) => t.active_status).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Certified Engineering Specialists</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Roster of lead bench engineers, workload capacity balance, and repair quality CSAT.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Onboard Certified Technician</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active On-Duty Techs"
          value={`${activeTechsCount} of ${technicians.length}`}
          subtitle="Available for laboratory dispatch"
          icon={UserCheck}
          iconColor="text-emerald-600"
          bgColor="bg-emerald-50"
        />
        <StatCard
          title="Average CSAT Rating"
          value={`${avgCsat} / 5.0`}
          subtitle="Verified post-repair customer reviews"
          icon={Star}
          iconColor="text-amber-600"
          bgColor="bg-amber-50"
        />
        <StatCard
          title="Total Lifetime Repairs"
          value={totalCompletedJobs}
          subtitle="Completed hardware work orders"
          icon={CheckCircle2}
          iconColor="text-blue-600"
          bgColor="bg-blue-50"
        />
        <StatCard
          title="Laboratory Capacity"
          value={`${Math.round((activeTechsCount / (technicians.length || 1)) * 100)}%`}
          subtitle="Triage & cleanroom readiness"
          icon={Briefcase}
          iconColor="text-purple-600"
          bgColor="bg-purple-50"
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
            All Technicians ({technicians.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              statusFilter === 'active' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Active On-Duty ({activeTechsCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('on_leave')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              statusFilter === 'on_leave' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            On Leave ({technicians.length - activeTechsCount})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search technician name, specialty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Technicians Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((tech) => {
          const assignedJobs = requests.filter(
            (r) =>
              (r.assigned_technician_id === tech.id ||
                r.assigned_technician?.full_name === tech.full_name) &&
              r.status !== 'Completed' &&
              r.status !== 'Cancelled'
          );

          return (
            <div
              key={tech.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 text-cyan-400 font-bold flex items-center justify-center text-base border border-slate-800 shadow-xs">
                      {tech.full_name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{tech.full_name}</h3>
                      <p className="text-xs text-slate-500 font-mono">
                        {tech.experience_years} yrs exp • CSAT {tech.rating.toFixed(1)} ★
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleStatus(tech.id, tech.active_status, tech.full_name)}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all ${
                      tech.active_status
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {tech.active_status ? 'Active Duty' : 'On Leave'}
                  </button>
                </div>

                {/* Workload Status */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs">
                    <Wrench className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold text-slate-700">Current Bench Load</span>
                  </div>
                  <span
                    className={`font-mono text-xs font-bold px-2 py-0.5 rounded-md ${
                      assignedJobs.length > 3
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {assignedJobs.length} Active Orders
                  </span>
                </div>

                {/* Contact info */}
                <div className="space-y-1.5 text-xs text-slate-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{tech.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{tech.phone}</span>
                  </div>
                </div>

                {/* Specialties tags */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Engineering Disciplines
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {tech.specialties.map((s) => (
                      <span
                        key={s}
                        className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Certifications */}
                {tech.certifications && tech.certifications.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
                    <Shield className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span className="truncate">{tech.certifications.join(' • ')}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">
                  {tech.completed_jobs_count} closed tickets
                </span>
                <button
                  type="button"
                  onClick={() => onNavigate('admin-requests')}
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
                >
                  <span>View Bench Work</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Onboard Technician */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Onboard Certified Specialist"
        subtitle="Add a licensed hardware technician to the dispatch & laboratory system."
      >
        <form onSubmit={handleCreateTechnician} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Technician Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g., Jonathan Vance"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Direct Email *</label>
            <input
              type="email"
              required
              placeholder="jonathan.v@techcare.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone</label>
              <input
                type="tel"
                placeholder="+1 (415) 555-0182"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Years Experience</label>
              <input
                type="number"
                min="1"
                max="40"
                value={experience}
                onChange={(e) => setExperience(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Specialties (Comma Separated)
            </label>
            <input
              type="text"
              placeholder="e.g. Micro-Soldering, Cleanroom Recovery, Enterprise Wi-Fi"
              value={specialtiesStr}
              onChange={(e) => setSpecialtiesStr(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Certifications &amp; Accreditations
            </label>
            <input
              type="text"
              placeholder="Apple Certified ACMT, Cisco CCNA, CompTIA Security+"
              value={certificationsStr}
              onChange={(e) => setCertificationsStr(e.target.value)}
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
              Onboard Technician
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
