import React, { useState, useEffect } from 'react';
import {
  Laptop,
  Search,
  Plus,
  ShieldCheck,
  ShieldAlert,
  Smartphone,
  Server,
  Monitor,
  HardDrive,
  Cpu,
  ChevronRight,
  Clock,
  Wrench
} from 'lucide-react';
import { store } from '../../services/store';
import { useToast } from '../../components/ui/Toast';
import { Device, DeviceType, WarrantyStatus, ServiceRequest } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { StatCard } from '../../components/ui/StatCard';
import { getDeviceVisual } from '../../utils/deviceImages';

interface AdminDevicesPageProps {
  onNavigate: (page: string, param?: string) => void;
}

export const AdminDevicesPage: React.FC<AdminDevicesPageProps> = ({ onNavigate }) => {
  const { success, error } = useToast();
  const [devices, setDevices] = useState<Device[]>(() => store.getDevices());
  const [requests, setRequests] = useState<ServiceRequest[]>(() => store.getServiceRequests());
  const [profiles, setProfiles] = useState(() => store.getProfiles());

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [warrantyFilter, setWarrantyFilter] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);

  // Form states for new device
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [deviceType, setDeviceType] = useState<DeviceType>('laptop');
  const [serialNumber, setSerialNumber] = useState('');
  const [warrantyStatus, setWarrantyStatus] = useState<WarrantyStatus>('active');
  const [userId, setUserId] = useState('');
  const [notes, setNotes] = useState('');

  const refresh = () => {
    setDevices(store.getDevices());
    setRequests(store.getServiceRequests());
    setProfiles(store.getProfiles());
  };

  useEffect(() => {
    const unsub = store.subscribe(refresh);
    return () => unsub();
  }, []);

  const handleCreateDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand.trim() || !model.trim()) {
      error('Missing Information', 'Brand and Model are required.');
      return;
    }

    const targetUser = userId || profiles.find((p) => p.role === 'customer')?.id || 'usr-cust-1';

    const newDevice: Device = {
      id: `dev-${Date.now()}`,
      user_id: targetUser,
      brand: brand.trim(),
      model: model.trim(),
      device_type: deviceType,
      serial_number: serialNumber.trim() || `SN-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      warranty_status: warrantyStatus,
      purchase_date: new Date().toISOString().split('T')[0],
      notes: notes.trim() || undefined,
      created_at: new Date().toISOString()
    };

    store.addDevice(newDevice);
    success('Hardware Enrolled', `${brand} ${model} has been registered in the fleet system.`);
    setModalOpen(false);
    setBrand('');
    setModel('');
    setSerialNumber('');
    setNotes('');
    refresh();
  };

  const filtered = devices.filter((d) => {
    const ownerName = profiles.find((p) => p.id === d.user_id)?.full_name || '';
    const matchesSearch =
      (d.brand || '').toLowerCase().includes(search.toLowerCase()) ||
      (d.model || '').toLowerCase().includes(search.toLowerCase()) ||
      (d.serial_number && d.serial_number.toLowerCase().includes(search.toLowerCase())) ||
      ownerName.toLowerCase().includes(search.toLowerCase());

    const matchesType = typeFilter === 'all' || d.device_type === typeFilter;
    const matchesWarranty = warrantyFilter === 'all' || d.warranty_status === warrantyFilter;

    return matchesSearch && matchesType && matchesWarranty;
  });

  const getDeviceIcon = (type: DeviceType) => {
    switch (type) {
      case 'Mobile':
      case 'Tablet':
        return <Smartphone className="w-5 h-5 text-blue-500" />;
      case 'Server':
        return <Server className="w-5 h-5 text-purple-500" />;
      case 'Desktop':
        return <Monitor className="w-5 h-5 text-indigo-500" />;
      default:
        return <Laptop className="w-5 h-5 text-cyan-500" />;
    }
  };

  const activeUnderWarranty = devices.filter((d) => d.warranty_status === 'active').length;
  const inServiceNow = devices.filter((d) =>
    requests.some((r) => r.device_id === d.id && r.status !== 'Completed' && r.status !== 'Cancelled')
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Enrolled Hardware Fleet</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Registry of all customer &amp; corporate IT assets, serial numbers, and diagnostic histories.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Enroll New Hardware Asset</span>
        </button>
      </div>

      {/* Fleet KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Fleet Size"
          value={devices.length}
          subtitle="Registered customer assets"
          icon={Laptop}
          iconColor="text-blue-600"
          bgColor="bg-blue-50"
        />
        <StatCard
          title="Active Laboratory Service"
          value={inServiceNow}
          subtitle="Machines undergoing repair"
          icon={Wrench}
          iconColor="text-emerald-600"
          bgColor="bg-emerald-50"
        />
        <StatCard
          title="Under Active Warranty"
          value={activeUnderWarranty}
          subtitle="Full OEM / TechCare coverage"
          icon={ShieldCheck}
          iconColor="text-cyan-600"
          bgColor="bg-cyan-50"
        />
        <StatCard
          title="Coverage Ratio"
          value={`${Math.round((activeUnderWarranty / (devices.length || 1)) * 100)}%`}
          subtitle="Warranty protection density"
          icon={Cpu}
          iconColor="text-purple-600"
          bgColor="bg-purple-50"
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Device Classes</option>
            <option value="laptop">Laptops / MacBooks</option>
            <option value="desktop">Desktops / Workstations</option>
            <option value="mobile">Smartphones</option>
            <option value="tablet">Tablets / iPads</option>
            <option value="server">Servers &amp; Rackmounts</option>
          </select>

          <select
            value={warrantyFilter}
            onChange={(e) => setWarrantyFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Warranty Statuses</option>
            <option value="active">Active Warranty</option>
            <option value="expired">Expired Warranty</option>
            <option value="voided">Voided Coverage</option>
          </select>
        </div>

        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search model, serial, client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Fleet Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-4">Hardware Profile</th>
                <th className="p-4">Registered Owner</th>
                <th className="p-4">Serial Identifier</th>
                <th className="p-4">Warranty Status</th>
                <th className="p-4">Service Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 text-xs">
                    No hardware assets found matching your criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((dev) => {
                  const owner = profiles.find((p) => p.id === dev.user_id);
                  const activeJob = requests.find(
                    (r) => r.device_id === dev.id && r.status !== 'Completed' && r.status !== 'Cancelled'
                  );
                  const visual = getDeviceVisual(dev.device_type, `${dev.brand} ${dev.model}`);

                  return (
                    <tr key={dev.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center p-0.5 border border-slate-200 shrink-0 overflow-hidden">
                            {visual?.url ? (
                              <img
                                src={visual.url}
                                alt={dev.brand}
                                className="w-full h-full object-cover rounded-lg"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              getDeviceIcon(dev.device_type)
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">
                              {dev.brand} {dev.model}
                            </p>
                            <span className="text-[11px] text-slate-500 capitalize">
                              {dev.device_type} • Enrolled {dev.purchase_date || 'Standard'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-slate-800">{owner?.full_name || 'Enterprise Pool'}</p>
                        <p className="text-[11px] text-slate-500">{owner?.email || '—'}</p>
                      </td>
                      <td className="p-4">
                        <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {dev.serial_number || 'N/A'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                            dev.warranty_status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : dev.warranty_status === 'expired'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          {dev.warranty_status === 'active' ? (
                            <ShieldCheck className="w-3 h-3" />
                          ) : (
                            <ShieldAlert className="w-3 h-3" />
                          )}
                          <span className="capitalize">{dev.warranty_status}</span>
                        </span>
                      </td>
                      <td className="p-4">
                        {activeJob ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                            Bench Ticket: {activeJob.request_number}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Normal Operations</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          type="button"
                          onClick={() => onNavigate('new-request')}
                          className="inline-flex items-center gap-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-semibold px-2.5 py-1.5 rounded-lg text-xs transition-colors"
                        >
                          <span>Open Ticket</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Enroll Hardware */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Enroll Client Hardware Asset"
        subtitle="Register machine specifications, serial identity, and warranty coverage."
      >
        <form onSubmit={handleCreateDevice} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Manufacturer Brand *</label>
              <input
                type="text"
                required
                placeholder="e.g., Apple, Dell, Lenovo"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Exact Model *</label>
              <input
                type="text"
                required
                placeholder="e.g., MacBook Pro 16 M3 Max"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Device Form Factor</label>
              <select
                value={deviceType}
                onChange={(e) => setDeviceType(e.target.value as DeviceType)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="laptop">Laptop / Notebook</option>
                <option value="desktop">Desktop / Workstation</option>
                <option value="mobile">Smartphone</option>
                <option value="tablet">Tablet / iPad</option>
                <option value="server">Server / Infrastructure</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Warranty Status</label>
              <select
                value={warrantyStatus}
                onChange={(e) => setWarrantyStatus(e.target.value as WarrantyStatus)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Active Warranty</option>
                <option value="expired">Expired Warranty</option>
                <option value="voided">Voided Coverage</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Serial / Asset Tag</label>
            <input
              type="text"
              placeholder="e.g., C02G89XYMD6R"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Assign to Client Account</label>
            <select
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select registered customer profile...</option>
              {profiles
                .filter((p) => p.role === 'customer')
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.full_name} ({p.email})
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Hardware Condition Notes</label>
            <textarea
              rows={2}
              placeholder="Prior liquid damage history, cosmetic dents, customer-reported symptoms..."
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
              Save Hardware Asset
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
