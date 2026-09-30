import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Plus,
  Mail,
  Phone,
  Laptop,
  ClipboardList,
  ChevronRight,
  ShieldCheck,
  DollarSign
} from 'lucide-react';
import { store } from '../../services/store';
import { useToast } from '../../components/ui/Toast';
import { Profile, ServiceRequest, Device, Invoice } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { StatCard } from '../../components/ui/StatCard';

interface AdminCustomersPageProps {
  onNavigate: (page: string, param?: string) => void;
}

export const AdminCustomersPage: React.FC<AdminCustomersPageProps> = ({ onNavigate }) => {
  const { success, error } = useToast();
  const [customers, setCustomers] = useState<Profile[]>(() =>
    store.getProfiles().filter((p) => p.role === 'customer')
  );
  const [requests, setRequests] = useState<ServiceRequest[]>(() => store.getServiceRequests());
  const [devices, setDevices] = useState<Device[]>(() => store.getDevices());
  const [invoices, setInvoices] = useState<Invoice[]>(() => store.getInvoices());

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'active_orders' | 'has_devices'>('all');
  const [modalOpen, setModalOpen] = useState(false);

  // Form for adding new customer
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const refresh = () => {
    setCustomers(store.getProfiles().filter((p) => p.role === 'customer'));
    setRequests(store.getServiceRequests());
    setDevices(store.getDevices());
    setInvoices(store.getInvoices());
  };

  useEffect(() => {
    const unsub = store.subscribe(refresh);
    return () => unsub();
  }, []);

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      error('Required Fields', 'Please provide a full name and email address.');
      return;
    }

    const newProfile: Profile = {
      id: `usr-${Date.now()}`,
      full_name: fullName.trim(),
      email: email.trim(),
      role: 'customer',
      phone: phone.trim() || undefined,
      created_at: new Date().toISOString()
    };

    store.addUser(newProfile);
    success('Customer Provisioned', `${fullName} has been registered to the client directory.`);
    setModalOpen(false);
    setFullName('');
    setEmail('');
    setPhone('');
    refresh();
  };

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      (c.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.phone && c.phone.includes(search));

    const userRequests = requests.filter(
      (r) => (r.user_id === c.id || (r.customer_email || '').toLowerCase() === (c.email || '').toLowerCase()) &&
             r.status !== 'Completed' && r.status !== 'Cancelled'
    );
    const userDevices = devices.filter((d) => d.user_id === c.id);

    if (filterType === 'active_orders') {
      return matchesSearch && userRequests.length > 0;
    }
    if (filterType === 'has_devices') {
      return matchesSearch && userDevices.length > 0;
    }
    return matchesSearch;
  });

  const totalActiveClientCount = customers.filter((c) =>
    requests.some(
      (r) => (r.user_id === c.id || r.customer_email.toLowerCase() === c.email.toLowerCase()) &&
             r.status !== 'Completed' && r.status !== 'Cancelled'
    )
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Customer Accounts &amp; Enterprise Clients</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Directory of registered clients, hardware fleet holdings, and active work orders.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Customer</span>
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Registered Clients"
          value={customers.length}
          subtitle="Consumer & Enterprise accounts"
          icon={Users}
          iconColor="text-blue-600"
          bgColor="bg-blue-50"
        />
        <StatCard
          title="Clients with Active Orders"
          value={totalActiveClientCount}
          subtitle="Currently in laboratory service"
          icon={ClipboardList}
          iconColor="text-emerald-600"
          bgColor="bg-emerald-50"
        />
        <StatCard
          title="Enrolled Hardware Fleet"
          value={devices.length}
          subtitle="Tracked client machines"
          icon={Laptop}
          iconColor="text-purple-600"
          bgColor="bg-purple-50"
        />
        <StatCard
          title="Lifetime Revenue Billed"
          value={`$${invoices.reduce((acc, inv) => acc + inv.total, 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          subtitle="Customer billing ledger"
          icon={DollarSign}
          iconColor="text-amber-600"
          bgColor="bg-amber-50"
        />
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              filterType === 'all' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Clients ({customers.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('active_orders')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              filterType === 'active_orders' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            With Active Orders ({totalActiveClientCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('has_devices')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              filterType === 'has_devices' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Hardware Fleet Owners
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Customer Directory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-4">Customer Profile</th>
                <th className="p-4">Contact Details</th>
                <th className="p-4">Registered Hardware</th>
                <th className="p-4">Active Orders</th>
                <th className="p-4">Total Billed</th>
                <th className="p-4 text-right">Quick Navigation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 text-xs">
                    No customer accounts found matching your query.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => {
                  const custRequests = requests.filter(
                    (r) => r.user_id === cust.id || r.customer_email.toLowerCase() === cust.email.toLowerCase()
                  );
                  const activeReqs = custRequests.filter(
                    (r) => r.status !== 'Completed' && r.status !== 'Cancelled'
                  );
                  const custDevices = devices.filter((d) => d.user_id === cust.id);
                  const custInvoices = invoices.filter(
                    (i) => i.user_id === cust.id || i.customer_name === cust.full_name
                  );
                  const totalSpent = custInvoices.reduce((sum, i) => sum + i.total, 0);

                  return (
                    <tr key={cust.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm border border-blue-200">
                            {cust.full_name[0]}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{cust.full_name}</p>
                            <span className="text-[10px] text-slate-400 font-mono">
                              Joined {new Date(cust.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[180px]">{cust.email}</span>
                        </div>
                        {cust.phone && (
                          <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[11px]">
                            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{cust.phone}</span>
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          <Laptop className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                          <span className="font-bold text-slate-800">{custDevices.length} Machines</span>
                        </div>
                        {custDevices.length > 0 && (
                          <p className="text-[10px] text-slate-400 truncate max-w-[160px] mt-0.5">
                            {custDevices.map((d) => `${d.brand} ${d.model}`).join(', ')}
                          </p>
                        )}
                      </td>
                      <td className="p-4">
                        {activeReqs.length > 0 ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            {activeReqs.length} Active in Lab
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-medium">
                            {custRequests.length} Total Historical
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="font-mono font-bold text-slate-900">
                          ${totalSpent.toFixed(2)}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => onNavigate('admin-requests')}
                            className="inline-flex items-center gap-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-semibold px-2.5 py-1.5 rounded-lg text-xs transition-colors"
                          >
                            <span>Work Orders</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onNavigate('admin-devices')}
                            className="inline-flex items-center gap-1 bg-slate-100 hover:bg-purple-50 hover:text-purple-600 text-slate-700 font-semibold px-2.5 py-1.5 rounded-lg text-xs transition-colors"
                          >
                            <span>Fleet</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Provision Customer */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Register New Customer"
        subtitle="Provision an enterprise client profile for service tracking and billing."
      >
        <form onSubmit={handleCreateCustomer} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g., Katherine Reynolds"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
            <input
              type="email"
              required
              placeholder="katherine@enterprise.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone</label>
            <input
              type="tel"
              placeholder="+1 (415) 555-0199"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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
              Save Customer Account
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
