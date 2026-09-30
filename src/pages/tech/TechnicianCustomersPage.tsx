import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  Wrench,
  ChevronRight,
  CheckCircle2,
  Laptop,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { store } from '../../services/store';
import { StatusBadge } from '../../components/ui/Badges';
import { Profile, ServiceRequest } from '../../types';

interface TechnicianCustomersPageProps {
  onNavigate: (page: string, param?: string) => void;
}

export const TechnicianCustomersPage: React.FC<TechnicianCustomersPageProps> = ({ onNavigate }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [allRequests, setAllRequests] = useState<ServiceRequest[]>(() => store.getServiceRequests());
  const [profiles, setProfiles] = useState<Profile[]>(() => store.getProfiles());

  useEffect(() => {
    const handleUpdate = () => {
      setAllRequests(store.getServiceRequests());
      setProfiles(store.getProfiles());
    };
    handleUpdate();
    const unsub = store.subscribe(handleUpdate);
    return () => unsub();
  }, []);

  // Filter customer profiles and associate with service requests
  const customerProfiles = profiles.filter((p) => p.role === 'customer');

  // Augment customers with request data
  const customersWithStats = customerProfiles.map((customer) => {
    const customerRequests = allRequests.filter(
      (r) =>
        r.user_id === customer.id ||
        r.customer_name.toLowerCase() === customer.full_name.toLowerCase()
    );
    const activeRequests = customerRequests.filter(
      (r) => r.status !== 'Completed' && r.status !== 'Cancelled'
    );
    const completedRequests = customerRequests.filter((r) => r.status === 'Completed');

    return {
      profile: customer,
      requests: customerRequests,
      activeRequests,
      completedRequests,
      latestRequest: customerRequests[0]
    };
  });

  const filtered = customersWithStats.filter((c) => {
    if (filter === 'active' && c.activeRequests.length === 0) return false;
    if (filter === 'completed' && c.completedRequests.length === 0) return false;

    const matchesSearch =
      c.profile.full_name.toLowerCase().includes(search.toLowerCase()) ||
      c.profile.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.profile.phone && c.profile.phone.toLowerCase().includes(search.toLowerCase())) ||
      (c.profile.city && c.profile.city.toLowerCase().includes(search.toLowerCase())) ||
      (c.profile.address && c.profile.address.toLowerCase().includes(search.toLowerCase())) ||
      c.requests.some(
        (r) =>
          r.request_number.toLowerCase().includes(search.toLowerCase()) ||
          r.service_name.toLowerCase().includes(search.toLowerCase()) ||
          (r.device?.model && r.device.model.toLowerCase().includes(search.toLowerCase())) ||
          (r.device?.brand && r.device.brand.toLowerCase().includes(search.toLowerCase())) ||
          r.status.toLowerCase().includes(search.toLowerCase())
      );

    return matchesSearch;
  });

  const totalClients = customerProfiles.length;
  const totalActiveTickets = allRequests.filter(
    (r) => r.status !== 'Completed' && r.status !== 'Cancelled'
  ).length;
  const totalCompletedTickets = allRequests.filter((r) => r.status === 'Completed').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Customer &amp; Client Directory</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Registered client profiles, contact channels, and device service history assigned to your bench.
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Registered Clients</p>
            <p className="text-xl font-extrabold text-white">{totalClients}</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Active Repair Tickets</p>
            <p className="text-xl font-extrabold text-amber-400">{totalActiveTickets}</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Serviced Devices</p>
            <p className="text-xl font-extrabold text-blue-400">{totalCompletedTickets}</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {(['all', 'active', 'completed'] as const).map((mode) => (
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
              {mode} Clients
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search client name, email, device, ticket #..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Customer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 text-xs">
            No customer profiles match your search criteria.
          </div>
        ) : (
          filtered.map(({ profile, requests, activeRequests, completedRequests, latestRequest }) => {
            const targetReqId = activeRequests[0]?.id || requests[0]?.id;

            return (
              <div
                key={profile.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition-colors flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Client Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          profile.avatar_url ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
                        }
                        alt={profile.full_name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-white">{profile.full_name}</h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            Verified Client
                          </span>
                          {activeRequests.length > 0 && (
                            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                              {activeRequests.length} Active Job{activeRequests.length > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {targetReqId && (
                        <button
                          type="button"
                          onClick={() => onNavigate('tech-messages', targetReqId)}
                          className="p-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition-colors flex items-center gap-1.5 text-xs font-semibold"
                          title="Open Customer Chat"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span className="hidden sm:inline">Chat</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Contact Details */}
                  <div className="space-y-1.5 text-xs text-slate-400 border-t border-slate-800/80 pt-3">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">{profile.email}</span>
                    </div>
                    {profile.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>{profile.phone}</span>
                      </div>
                    )}
                    {(profile.city || profile.address) && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate">
                          {profile.city ? `${profile.city}${profile.state ? `, ${profile.state}` : ''}` : profile.address}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Related Device & Service Tickets */}
                  <div className="border-t border-slate-800/80 pt-3 space-y-2">
                    <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                      Related Hardware &amp; Tickets ({requests.length})
                    </p>

                    {requests.length === 0 ? (
                      <p className="text-[11px] text-slate-500 italic">No historical service requests registered.</p>
                    ) : (
                      <div className="space-y-1.5">
                        {requests.slice(0, 3).map((req) => (
                          <div
                            key={req.id}
                            onClick={() => onNavigate('request-detail', req.id)}
                            className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-2.5 flex items-center justify-between gap-2 hover:border-emerald-500/40 hover:bg-slate-900 cursor-pointer transition-colors group"
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-mono text-xs font-bold text-emerald-400 group-hover:text-emerald-300">
                                  #{req.request_number}
                                </span>
                                <span className="text-[11px] font-medium text-slate-200 truncate">
                                  {req.device?.brand} {req.device?.model}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-400 truncate mt-0.5">
                                {req.service_name}
                              </p>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <StatusBadge status={req.status} />
                              <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Primary Action Button */}
                {targetReqId && (
                  <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">
                      {completedRequests.length} Serviced • {activeRequests.length} In Progress
                    </span>
                    <button
                      type="button"
                      onClick={() => onNavigate('request-detail', targetReqId)}
                      className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 group py-1"
                    >
                      <span>Open Customer Work Order</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
