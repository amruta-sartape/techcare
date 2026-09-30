import React, { useState } from 'react';
import { Users, UserCheck, ShieldCheck, Wrench, Search, Plus, Filter } from 'lucide-react';
import { store } from '../../services/store';
import { useToast } from '../../components/ui/Toast';
import { User, UserRole } from '../../types';
import { RoleBadge } from '../../components/ui/Badges';
import { Modal } from '../../components/ui/Modal';

export const AdminUsersPage: React.FC = () => {
  const { success, error } = useToast();
  const [users, setUsers] = useState<User[]>(() => store.getUsers());
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [modalOpen, setModalOpen] = useState(false);

  // Form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('customer');
  const [phone, setPhone] = useState('');

  const refresh = () => {
    setUsers(store.getUsers());
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      error('Fields Required', 'Please enter full name and email.');
      return;
    }

    if (role === 'admin') {
      error('Access Denied', 'Administrative privileges are restricted to the single Owner account (amrutasartape27@gmail.com).');
      return;
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      email: email.trim(),
      full_name: name.trim(),
      role,
      phone: phone.trim() || undefined,
      created_at: new Date().toISOString()
    };

    store.addUser(newUser);
    success('User Created', `${name} added to platform directory.`);
    setModalOpen(false);
    refresh();
  };

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    if (newRole === 'admin') {
      error('Role Elevation Blocked', 'Administrative clearance is restricted exclusively to the single Owner account (amrutasartape27@gmail.com).');
      return;
    }
    store.updateUser(userId, { role: newRole });
    success('Role Updated', `User permissions changed to ${newRole}`);
    refresh();
  };

  const filtered = users.filter((u) => {
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const term = search.toLowerCase();
    const matchesSearch =
      (u.full_name || '').toLowerCase().includes(term) ||
      (u.email || '').toLowerCase().includes(term);
    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">User &amp; Access Directory</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage customer accounts, technician credentials, and administrative permissions.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Provision User Profile</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {['all', 'customer', 'technician', 'admin'].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-colors ${
                roleFilter === r ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <th className="p-4">User</th>
              <th className="p-4">Role</th>
              <th className="p-4">Contact Phone</th>
              <th className="p-4">Date Registered</th>
              <th className="p-4 text-right">Role Management</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs">
                      {u.full_name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{u.full_name}</p>
                      <p className="text-slate-500 text-[11px]">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  {u.id === 'user-admin-1' || u.full_name.includes('Amruta') ? (
                    <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-900 border border-purple-200 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                      <ShieldCheck className="w-3 h-3 text-purple-600" />
                      Owner &amp; Super Admin
                    </span>
                  ) : (
                    <RoleBadge role={u.role} />
                  )}
                </td>
                <td className="p-4 text-slate-600">{u.phone || '—'}</td>
                <td className="p-4 text-slate-500">{new Date(u.created_at).toLocaleDateString()}</td>
                <td className="p-4 text-right">
                  {u.id === 'user-admin-1' || u.full_name.includes('Amruta') ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                      Owner (Root Access)
                    </span>
                  ) : (
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                      className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700 font-medium"
                    >
                      <option value="customer">Customer</option>
                      <option value="technician">Technician</option>
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Provision Platform User"
        subtitle="Create a customer profile or certified technician."
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Select Role *</label>
            <div className="grid grid-cols-2 gap-2">
              {(['customer', 'technician'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`py-2 text-xs font-bold capitalize rounded-xl border transition-colors ${
                    role === r
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Legal Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Rachel Sterling"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
            <input
              type="email"
              required
              placeholder="rachel.sterling@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone (Optional)</label>
            <input
              type="tel"
              placeholder="(415) 555-0182"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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
              Provision Account
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
