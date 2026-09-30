import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Bell, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';

export const CustomerProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { success } = useToast();

  const [fullName, setFullName] = useState(user?.full_name || 'Amit Shinde');
  const [phone, setPhone] = useState(user?.phone || '+91 94220 33819');
  const [email] = useState(user?.email || 'amit.shinde@example.com');
  const [address, setAddress] = useState(user?.address || 'Prabhat Nagar, Link Road');
  const [city, setCity] = useState(user?.city || 'Pandharpur');
  const [stateVal, setStateVal] = useState(user?.state || 'Maharashtra');
  const [postalCode, setPostalCode] = useState(user?.postal_code || '413304');
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      full_name: fullName,
      phone: phone,
      address: address,
      city: city,
      state: stateVal,
      postal_code: postalCode
    });
    success('Profile Updated', 'Your customer account and dispatch details have been saved.');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Customer Profile &amp; Preferences</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage your contact credentials, service location, and technician dispatch notification preferences.
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              Personal Credentials
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Legal / Business Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Registered Email Address</label>
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-500 cursor-not-allowed"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Primary security ID tied to Supabase Auth.</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              Dispatch &amp; On-Site Service Address (India)
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Dispatch Phone (+91)</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98220 14892"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">PIN / Postal Code</label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="413304"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Street Address / Landmark</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Shop 4, Station Road, Near Shivaji Chowk"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Pandharpur"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">State</label>
                  <input
                    type="text"
                    value={stateVal}
                    onChange={(e) => setStateVal(e.target.value)}
                    placeholder="Maharashtra"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-600" />
              Dispatch &amp; Milestone Alerts
            </h3>
            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={smsAlerts}
                  onChange={(e) => setSmsAlerts(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-slate-700 font-medium">Receive instant SMS alerts when technician starts transit</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={whatsappAlerts}
                  onChange={(e) => setWhatsappAlerts(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-slate-700 font-medium">Send diagnostic teardown photo links via WhatsApp</span>
              </label>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-xs transition-colors"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
