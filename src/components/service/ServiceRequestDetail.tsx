import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Laptop,
  UserCheck,
  ShieldCheck,
  FileText,
  Send,
  MessageSquare,
  CheckCircle2,
  Wrench,
  DollarSign,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Download
} from 'lucide-react';
import { store } from '../../services/store';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../ui/Toast';
import { ServiceRequest, RequestStatus } from '../../types';
import { StatusTimeline, STAGES } from '../ui/StatusTimeline';
import { StatusBadge, UrgencyBadge } from '../ui/Badges';
import { Modal } from '../ui/Modal';
import { getDeviceVisual, getServiceVisual } from '../../utils/deviceImages';

interface ServiceRequestDetailProps {
  requestId: string;
  onBack: () => void;
  onNavigate?: (page: string, param?: string) => void;
}

export const ServiceRequestDetail: React.FC<ServiceRequestDetailProps> = ({
  requestId,
  onBack,
  onNavigate
}) => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [request, setRequest] = useState<ServiceRequest | undefined>(() =>
    store.getServiceRequestById(requestId)
  );
  const [messages, setMessages] = useState(() => store.getMessages(requestId));
  const [newMsgText, setNewMsgText] = useState('');
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState<RequestStatus>('Diagnosis');
  const [statusNotes, setStatusNotes] = useState('');
  const [diagnosticText, setDiagnosticText] = useState('');
  const [finalCostInput, setFinalCostInput] = useState('');

  useEffect(() => {
    const handleStoreChange = () => {
      const updated = store.getServiceRequestById(requestId);
      if (updated) setRequest(updated);
      setMessages(store.getMessages(requestId));
    };

    handleStoreChange();
    const unsub = store.subscribe(handleStoreChange);
    return () => unsub();
  }, [requestId]);

  if (!request) {
    return (
      <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
        <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-800">Service Request Not Found</h3>
        <p className="text-xs text-slate-500 mt-1 mb-4">The ticket may have been archived or does not exist.</p>
        <button
          onClick={onBack}
          className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
        >
          Return to List
        </button>
      </div>
    );
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsgText.trim() || !user) return;

    const receiverId =
      user.role === 'customer'
        ? request.assigned_technician_id || 'tech-1'
        : request.user_id;

    store.sendMessage({
      request_id: request.id,
      sender_id: user.id,
      sender_name: user.full_name,
      sender_role: user.role,
      receiver_id: receiverId,
      content: newMsgText.trim()
    });

    setNewMsgText('');
  };

  const handleApplyStatusUpdate = () => {
    if (!user) return;

    const costNum = finalCostInput ? parseFloat(finalCostInput) : undefined;

    store.updateRequestStatus(
      request.id,
      targetStatus,
      statusNotes || `Technician updated stage to ${targetStatus}`,
      user.full_name,
      user.role,
      {
        diagnosis: diagnosticText || undefined,
        finalCost: costNum
      }
    );

    success('Status Updated', `Ticket ${request.request_number} transitioned to "${targetStatus}"`);
    setStatusModalOpen(false);
    setStatusNotes('');
  };

  const openStatusModal = (status: RequestStatus) => {
    setTargetStatus(status);
    setDiagnosticText(request.diagnosis || '');
    setFinalCostInput(request.final_cost ? request.final_cost.toString() : (request.estimated_cost || 99).toString());
    setStatusModalOpen(true);
  };

  const currentStageIndex = STAGES.findIndex((s) => s.status === request.status);
  const nextStage = currentStageIndex >= 0 && currentStageIndex < STAGES.length - 1 ? STAGES[currentStageIndex + 1] : null;

  const deviceVisual = getDeviceVisual(request.device?.device_type, request.device?.model);
  const serviceVisual = getServiceVisual(request.service_id, request.service_name);

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tickets
        </button>

        <div className="flex items-center gap-2">
          {/* Technician Quick Action */}
          {(user?.role === 'technician' || user?.role === 'admin') && nextStage && (
            <button
              type="button"
              onClick={() => openStatusModal(nextStage.status)}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              Advance to: {nextStage.label}
            </button>
          )}

          {(user?.role === 'technician' || user?.role === 'admin') && (
            <button
              type="button"
              onClick={() => openStatusModal(request.status)}
              className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all"
            >
              <Wrench className="w-4 h-4" />
              Update Stage / Notes
            </button>
          )}
        </div>
      </div>

      {/* Prominent Large Service & Device Visual Showcase Hero */}
      <div className="rounded-3xl border border-slate-800 bg-[#0c101d] overflow-hidden shadow-xl text-white relative glow-card">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Main Device Image with Diagnostic HUD Overlay */}
          <div className="lg:col-span-7 relative h-64 sm:h-80 overflow-hidden group">
            <img
              src={deviceVisual.url}
              alt={deviceVisual.alt}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0c101d]/40 to-[#0c101d]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c101d] via-transparent to-transparent" />

            {/* Live Bench Diagnostic Crosshair */}
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-[#080d19]/90 border border-cyan-500/40 px-3 py-1.5 rounded-xl backdrop-blur-md shadow-md">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-[10px] font-mono font-bold text-cyan-300">BENCH TELEMETRY ACTIVE</span>
            </div>

            <div className="absolute bottom-4 left-4">
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                {request.device?.device_type || 'Hardware Profile'}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                {request.device?.brand} {request.device?.model}
              </h3>
              <p className="text-xs font-mono text-slate-400">
                SN: {request.device?.serial_number || 'TC-LAB-SERIAL-7721'}
              </p>
            </div>
          </div>

          {/* Service & Repair Lab Teardown Visual + Telemetry Specs */}
          <div className="lg:col-span-5 p-6 flex flex-col justify-between bg-[#0a0e1a]/95 border-t lg:border-t-0 lg:border-l border-slate-800 space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-mono text-[11px] uppercase tracking-wider text-cyan-400">Assigned Service Spec</span>
                <span className="text-emerald-400 font-mono text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                  OEM Grade A
                </span>
              </div>
              <h4 className="text-base font-bold text-white">{request.service_name}</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                {request.problem_description}
              </p>
            </div>

            {/* Diagnostic Bench Telemetry Indicators */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Subsystem Rail</span>
                <span className="text-xs font-mono font-bold text-cyan-300 mt-0.5 block">3.3V / 12V Nominal</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Cleanroom Status</span>
                <span className="text-xs font-mono font-bold text-emerald-300 mt-0.5 block">ISO-5 Bench Ready</span>
              </div>
            </div>

            {/* Secondary Macro Lab Repair Visual Preview */}
            <div className="relative rounded-xl overflow-hidden h-24 border border-slate-800 group">
              <img
                src={serviceVisual.url}
                alt={serviceVisual.alt}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-300 font-semibold">{serviceVisual.label || 'Macro Inspection'}</span>
                <span className="text-cyan-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  90-Day Shield
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Ticket Summary Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                {request.request_number}
              </span>
              <StatusBadge status={request.status} />
              <UrgencyBadge urgency={request.urgency} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-2">{request.service_name}</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Target Device: <span className="font-semibold text-slate-700">{request.device?.brand} {request.device?.model}</span> ({request.device?.device_type})
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-right">
            <div className="text-left sm:text-right">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Estimated Total</span>
              <p className="text-2xl font-black text-slate-900">₹{(request.final_cost || request.estimated_cost || 0).toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>

        {/* 9-Stage Progress Timeline */}
        <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Lifecycle Progress Tracker</span>
            <span className="text-xs font-semibold text-blue-600 font-mono">Stage {currentStageIndex + 1} of 9</span>
          </div>
          <StatusTimeline currentStatus={request.status} history={request.history} />
        </div>

        {/* Detail Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Column 1: Customer & Technician */}
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Client Information</span>
              <p className="text-sm font-bold text-slate-900 mt-1">{request.customer_name}</p>
              <p className="text-xs text-slate-600">{request.customer_email}</p>
              <p className="text-xs text-slate-600">{request.customer_phone || 'Phone not provided'}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assigned Certified Tech</span>
              {request.assigned_technician ? (
                <div className="flex items-center gap-3 mt-2">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
                    alt="Technician avatar"
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-xl object-cover border border-emerald-400/40"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-900">{request.assigned_technician.full_name}</p>
                    <p className="text-[10px] text-emerald-600 font-semibold">{request.assigned_technician.certification_level}</p>
                    <p className="text-[10px] text-slate-500">Dispatch Unit #3</p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500 mt-1">Pending auto-assignment</p>
              )}
            </div>
          </div>

          {/* Column 2: Problem & Diagnosis */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Intake Problem Description</span>
              <p className="text-xs text-slate-800 mt-1.5 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                {request.problem_description}
              </p>
            </div>

            {request.diagnosis && (
              <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200">
                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Bench Diagnostic Findings</span>
                <p className="text-xs text-slate-800 mt-1.5 leading-relaxed bg-white p-3 rounded-lg border border-blue-200">
                  {request.diagnosis}
                </p>
              </div>
            )}

            {/* Attachments */}
            {request.attachments && request.attachments.length > 0 && (
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Diagnostic Media &amp; Logs</span>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {request.attachments.map((att, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700"
                    >
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold truncate max-w-xs">{att.file_name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Two Column Section: Live Messenger & Audit History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Realtime Chat Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col h-[480px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Direct Ticket Communication</h3>
            </div>
            <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
              Supabase Realtime Channel
            </span>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1">
            {messages.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No messages yet. Send a query to the technician or customer.
              </div>
            ) : (
              messages.map((m) => {
                const isMe = m.sender_id === user?.id || (user?.role === 'technician' && m.sender_role === 'technician');
                return (
                  <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] font-bold text-slate-600">{m.sender_name}</span>
                      <span className="text-[9px] text-slate-400 font-mono">
                        {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div
                      className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                        isMe
                          ? 'bg-blue-600 text-white rounded-br-xs'
                          : 'bg-slate-100 text-slate-800 rounded-bl-xs'
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-100 flex gap-2">
            <input
              type="text"
              placeholder="Type message regarding ticket..."
              value={newMsgText}
              onChange={(e) => setNewMsgText(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!newMsgText.trim()}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white p-2 rounded-xl transition-colors shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Audit Log / History List */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col h-[480px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-600" />
              <h3 className="text-sm font-bold text-slate-900">Ticket Audit History</h3>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              {request.history.length} Event(s) Recorded
            </span>
          </div>

          <div className="flex-1 overflow-y-auto py-3 space-y-4">
            {request.history.map((h, i) => (
              <div key={h.id || i} className="flex items-start gap-3 relative">
                {i !== request.history.length - 1 && (
                  <div className="absolute left-3.5 top-7 bottom-0 w-0.5 bg-slate-200" />
                )}
                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 text-xs font-bold z-10">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{h.status}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(h.created_at).toLocaleDateString()} {new Date(h.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-1 leading-relaxed">{h.notes}</p>
                  <p className="text-[10px] text-slate-400 mt-1.5">
                    Authorized by: <span className="font-semibold text-slate-600">{h.changed_by_name}</span> ({h.changed_by_role})
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stage Transition Modal */}
      <Modal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        title="Advance Ticket Workflow Stage"
        subtitle={`Request ${request.request_number} • Current: ${request.status}`}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Target Stage</label>
            <select
              value={targetStatus}
              onChange={(e) => setTargetStatus(e.target.value as RequestStatus)}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900"
            >
              {STAGES.map((st) => (
                <option key={st.status} value={st.status}>
                  {st.label}
                </option>
              ))}
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Status Note / Work Summary</label>
            <textarea
              rows={3}
              value={statusNotes}
              onChange={(e) => setStatusNotes(e.target.value)}
              placeholder="e.g. Ultrasonic bath completed, replaced shorted capacitor C243. Bench burn-in test running..."
              className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Laboratory Diagnosis (Optional)</label>
            <textarea
              rows={2}
              value={diagnosticText}
              onChange={(e) => setDiagnosticText(e.target.value)}
              placeholder="Technical diagnostic findings for customer report..."
              className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-900"
            />
          </div>

          {targetStatus === 'Completed' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Final Total Price (₹)</label>
              <input
                type="number"
                step="0.01"
                value={finalCostInput}
                onChange={(e) => setFinalCostInput(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Marking Completed will automatically generate an invoice and warranty certificate for the customer.
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStatusModalOpen(false)}
              className="text-xs font-semibold text-slate-600 px-4 py-2 rounded-xl hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApplyStatusUpdate}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-2 rounded-xl shadow-xs"
            >
              Confirm Stage Transition
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
