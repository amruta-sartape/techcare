import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, CheckCircle2, XCircle, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { store } from '../../services/store';
import { Appointment } from '../../types';
import { Modal } from '../../components/ui/Modal';

export const AppointmentsPage: React.FC = () => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [appointments, setAppointments] = useState<Appointment[]>(() => store.getAppointments(user?.id));
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [targetAppt, setTargetAppt] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTimeSlot, setNewTimeSlot] = useState('09:00 AM - 12:00 PM');

  useEffect(() => {
    setAppointments(store.getAppointments(user?.id));
  }, [user]);

  const refreshList = () => {
    setAppointments(store.getAppointments(user?.id));
  };

  const handleCancelAppt = (id: string) => {
    if (confirm('Cancel this scheduled service appointment?')) {
      store.updateAppointment(id, { status: 'cancelled' });
      success('Appointment Cancelled', 'Your time window has been released.');
      refreshList();
    }
  };

  const openReschedule = (appt: Appointment) => {
    setTargetAppt(appt);
    setNewDate(appt.scheduled_at.split('T')[0]);
    setNewTimeSlot(appt.time_slot);
    setRescheduleModalOpen(true);
  };

  const handleSaveReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetAppt || !newDate) return;

    store.updateAppointment(targetAppt.id, {
      scheduled_at: `${newDate}T10:00:00Z`,
      time_slot: newTimeSlot,
      status: 'scheduled'
    });

    success('Appointment Rescheduled', `Updated to ${newDate} (${newTimeSlot})`);
    setRescheduleModalOpen(false);
    refreshList();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Service Appointments &amp; Dispatch Calendar</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          View scheduled technician bench arrivals and lab drop-off windows.
        </p>
      </div>

      {appointments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">No Scheduled Appointments</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            You currently have no pending lab bench visits or on-site technician dispatch appointments.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {appointments.map((appt) => (
            <div
              key={appt.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {appt.request_number}
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full capitalize ${
                      appt.status === 'completed'
                        ? 'bg-emerald-50 text-emerald-700'
                        : appt.status === 'cancelled'
                        ? 'bg-rose-50 text-rose-700'
                        : 'bg-blue-50 text-blue-700'
                    }`}
                  >
                    {appt.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{appt.service_name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{appt.device_info}</p>

                <div className="mt-4 space-y-2 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-700 font-semibold">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span>Date: {new Date(appt.scheduled_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 font-semibold">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>Window: {appt.time_slot}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 font-semibold">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span>{appt.location}</span>
                  </div>
                </div>
              </div>

              {appt.status === 'scheduled' && (
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => handleCancelAppt(appt.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => openReschedule(appt)}
                    className="px-3 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition-colors"
                  >
                    Reschedule
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Reschedule Modal */}
      <Modal
        isOpen={rescheduleModalOpen}
        onClose={() => setRescheduleModalOpen(false)}
        title="Reschedule Appointment"
        subtitle={`Request ${targetAppt?.request_number} (${targetAppt?.service_name})`}
      >
        <form onSubmit={handleSaveReschedule} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">New Date</label>
            <input
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">New Time Window</label>
            <select
              value={newTimeSlot}
              onChange={(e) => setNewTimeSlot(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
            >
              <option value="09:00 AM - 12:00 PM">Morning (09:00 AM - 12:00 PM)</option>
              <option value="01:00 PM - 04:00 PM">Afternoon (01:00 PM - 04:00 PM)</option>
              <option value="04:00 PM - 07:00 PM">Late Afternoon (04:00 PM - 07:00 PM)</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setRescheduleModalOpen(false)}
              className="text-xs font-semibold text-slate-600 px-4 py-2 rounded-xl hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-2 rounded-xl shadow-xs"
            >
              Confirm Reschedule
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
