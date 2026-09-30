import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { store } from '../../services/store';
import { useToast } from '../../components/ui/Toast';
import { ServiceOffering } from '../../types';
import { Modal } from '../../components/ui/Modal';

export const AdminServicesPage: React.FC = () => {
  const { success, error } = useToast();
  const [services, setServices] = useState<ServiceOffering[]>(() => store.getServices());
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceOffering | null>(null);

  // Form
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Hardware');
  const [description, setDescription] = useState('');
  const [startingPrice, setStartingPrice] = useState(99);
  const [turnaround, setTurnaround] = useState('24-48 Hours');
  const [warrantyDays, setWarrantyDays] = useState(90);

  const refresh = () => {
    setServices(store.getServices());
  };

  const openAdd = () => {
    setEditingService(null);
    setName('');
    setCategory('Hardware');
    setDescription('');
    setStartingPrice(149);
    setTurnaround('24-48 Hours');
    setWarrantyDays(90);
    setModalOpen(true);
  };

  const openEdit = (s: ServiceOffering) => {
    setEditingService(s);
    setName(s.name);
    setCategory(s.category);
    setDescription(s.description);
    setStartingPrice(s.starting_price);
    setTurnaround(s.turnaround_time);
    setWarrantyDays(s.warranty_duration_days);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      error('Service Name Required', 'Please enter a name for the service.');
      return;
    }

    if (editingService) {
      store.updateService(editingService.id, {
        name: name.trim(),
        category,
        description: description.trim(),
        starting_price: Number(startingPrice),
        turnaround_time: turnaround,
        warranty_duration_days: Number(warrantyDays)
      });
      success('Service Updated', `${name} catalog entry updated.`);
    } else {
      store.addService({
        name: name.trim(),
        category,
        description: description.trim(),
        starting_price: Number(startingPrice),
        turnaround_time: turnaround,
        warranty_duration_days: Number(warrantyDays),
        is_active: true
      });
      success('Service Created', `${name} published to public catalog.`);
    }

    setModalOpen(false);
    refresh();
  };

  const handleDelete = (id: string, sName: string) => {
    if (confirm(`Delete ${sName} from catalog?`)) {
      store.deleteService(id);
      success('Service Deleted', `${sName} removed from offerings.`);
      refresh();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Service Offerings &amp; Flat-Rate Catalog</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure diagnostic rates, parts warranty policies, and repair turnarounds.
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service Offering</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s) => (
          <div
            key={s.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">
                  {s.category}
                </span>
                <span className="text-base font-black text-slate-900">₹{s.starting_price.toLocaleString('en-IN')}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">{s.name}</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">{s.description}</p>
            </div>

            <div className="pt-5 mt-5 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-blue-500" />
                  {s.turnaround_time}
                </span>
                <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {s.warranty_duration_days}-Day Shield
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => openEdit(s)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(s.id, s.name)}
                  className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingService ? 'Edit Service Offering' : 'Add New Service Offering'}
        subtitle="Configure public catalog information, baseline pricing, and warranty terms."
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Service Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
              >
                <option value="Hardware">Hardware &amp; Micro-Soldering</option>
                <option value="Mobile">Mobile &amp; Tablet</option>
                <option value="Networking">Enterprise &amp; Wi-Fi</option>
                <option value="Data Recovery">Data Recovery &amp; Storage</option>
                <option value="Operating System">Operating System &amp; Security</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Starting Price (₹)</label>
              <input
                type="number"
                min="0"
                step="5"
                required
                value={startingPrice}
                onChange={(e) => setStartingPrice(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Turnaround Time</label>
              <input
                type="text"
                value={turnaround}
                onChange={(e) => setTurnaround(e.target.value)}
                placeholder="e.g. 24-48 Hours"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Warranty Days</label>
              <input
                type="number"
                min="0"
                step="30"
                value={warrantyDays}
                onChange={(e) => setWarrantyDays(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
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
              {editingService ? 'Save Changes' : 'Create Service'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
