import React, { useState, useEffect } from 'react';
import { Laptop, Plus, Wrench, ShieldCheck, Trash2, Edit3, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { store } from '../../services/store';
import { Device, WarrantyStatus } from '../../types';
import { WarrantyBadge } from '../../components/ui/Badges';
import { Modal } from '../../components/ui/Modal';
import { getDeviceVisual } from '../../utils/deviceImages';

interface MyDevicesPageProps {
  onNavigate: (page: string, param?: string) => void;
}

export const MyDevicesPage: React.FC<MyDevicesPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [devices, setDevices] = useState<Device[]>(() => store.getDevices(user?.id));
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);

  useEffect(() => {
    setDevices(store.getDevices(user?.id));
  }, [user]);

  // Form State
  const [deviceType, setDeviceType] = useState('Laptop');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [serialNumber, setSerialNumber] = useState('');

  const refreshList = () => {
    setDevices(store.getDevices(user?.id));
  };

  const openAddModal = () => {
    setEditingDevice(null);
    setDeviceType('Laptop');
    setBrand('');
    setModel('');
    setSerialNumber('');
    setModalOpen(true);
  };

  const openEditModal = (dev: Device) => {
    setEditingDevice(dev);
    setDeviceType(dev.device_type);
    setBrand(dev.brand);
    setModel(dev.model);
    setSerialNumber(dev.serial_number || '');
    setModalOpen(true);
  };

  const handleSaveDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand.trim() || !model.trim()) {
      error('Fields Required', 'Please enter both brand and model.');
      return;
    }

    if (editingDevice) {
      store.updateDevice(editingDevice.id, {
        device_type: deviceType,
        brand: brand.trim(),
        model: model.trim(),
        serial_number: serialNumber.trim() || undefined
      });
      success('Device Updated', `${brand} ${model} profile has been saved.`);
    } else {
      store.addDevice({
        user_id: user?.id || 'demo-user',
        device_type: deviceType,
        brand: brand.trim(),
        model: model.trim(),
        serial_number: serialNumber.trim() || undefined,
        warranty_status: 'none'
      });
      success('Device Registered', `${brand} ${model} added to your equipment fleet.`);
    }

    setModalOpen(false);
    refreshList();
  };

  const handleDeleteDevice = (id: string, name: string) => {
    if (confirm(`Remove ${name} from your equipment fleet?`)) {
      store.deleteDevice(id);
      success('Device Removed', `${name} has been removed.`);
      refreshList();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Hardware Fleet Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Register and manage your devices, track hardware warranties, and dispatch repairs.
          </p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Device</span>
        </button>
      </div>

      {/* Grid of Devices */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {devices.map((d) => {
          const visual = getDeviceVisual(d.device_type, d.model);
          return (
            <div
              key={d.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group"
            >
              {/* Realistic Device Visual Banner */}
              <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                <img
                  src={visual.url}
                  alt={visual.alt}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />

                {/* Device Type Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-slate-900/90 border border-slate-700/80 text-cyan-300 backdrop-blur-md">
                    {d.device_type}
                  </span>
                </div>

                {/* Quick Action Floating Controls */}
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-slate-900/80 border border-slate-700/60 p-1 rounded-lg backdrop-blur-md">
                  <button
                    onClick={() => openEditModal(d)}
                    className="p-1 text-slate-300 hover:text-white rounded hover:bg-slate-800"
                    title="Edit device details"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteDevice(d.id, `${d.brand} ${d.model}`)}
                    className="p-1 text-slate-300 hover:text-rose-400 rounded hover:bg-rose-950/50"
                    title="Delete device"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Brand & Model Floating Header */}
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase block">{d.brand}</span>
                  <h3 className="text-base font-bold text-white leading-tight">{d.model}</h3>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-slate-500 font-medium">Serial Number</span>
                    <span className="font-mono font-bold text-slate-800">{d.serial_number || 'Unspecified'}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-slate-500 font-medium">Hardware Shield</span>
                    <WarrantyBadge status={d.warranty_status} />
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => onNavigate('new-request')}
                    className="w-full py-2.5 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 border border-blue-100 hover:border-transparent"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Book Service for this Device</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingDevice ? 'Edit Device Details' : 'Register New Hardware Device'}
        subtitle="Log device information for fast automated service dispatch."
      >
        <form onSubmit={handleSaveDevice} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Device Category *</label>
            <select
              value={deviceType}
              onChange={(e) => setDeviceType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
            >
              <option value="Laptop">Laptop (Mac / Windows / Chromebook)</option>
              <option value="Desktop">Desktop / Custom Workstation</option>
              <option value="Mobile">Smartphone (iPhone / Android)</option>
              <option value="Tablet">Tablet / iPad</option>
              <option value="Networking">Networking / Router / Mesh</option>
              <option value="Server">Server / Storage NAS</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Brand *</label>
            <input
              type="text"
              required
              placeholder="e.g. Apple, Dell, Lenovo"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Model Name / Number *</label>
            <input
              type="text"
              required
              placeholder="e.g. ThinkPad X1 Carbon Gen 11"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Serial Number (Optional)</label>
            <input
              type="text"
              placeholder="e.g. PF-3R9X2"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="text-xs font-semibold text-slate-600 px-4 py-2 rounded-xl hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-2 rounded-xl shadow-xs"
            >
              {editingDevice ? 'Save Changes' : 'Register Device'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
