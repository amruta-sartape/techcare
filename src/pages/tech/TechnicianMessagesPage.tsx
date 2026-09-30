import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Send,
  User,
  Laptop,
  Wrench,
  ChevronRight,
  CheckCircle2,
  Clock,
  Search
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { store } from '../../services/store';
import { Message, ServiceRequest } from '../../types';
import { StatusBadge } from '../../components/ui/Badges';

interface TechnicianMessagesPageProps {
  onNavigate: (page: string, param?: string) => void;
  initialRequestId?: string;
}

export const TechnicianMessagesPage: React.FC<TechnicianMessagesPageProps> = ({
  onNavigate,
  initialRequestId
}) => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<ServiceRequest[]>(() => store.getServiceRequests());
  const [selectedRequestId, setSelectedRequestId] = useState<string>(() => {
    if (initialRequestId && requests.some((r) => r.id === initialRequestId)) {
      return initialRequestId;
    }
    return requests[0]?.id || '';
  });
  const [messages, setMessages] = useState<Message[]>(() => store.getMessages(selectedRequestId));
  const [inputText, setInputText] = useState('');
  const [channelSearch, setChannelSearch] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync if initialRequestId prop changes
  useEffect(() => {
    if (initialRequestId && requests.some((r) => r.id === initialRequestId)) {
      setSelectedRequestId(initialRequestId);
    }
  }, [initialRequestId, requests]);

  // Subscribe to store updates for real-time messages & requests
  useEffect(() => {
    const handleUpdate = () => {
      const latest = store.getServiceRequests();
      setRequests(latest);
      setSelectedRequestId((prev) => {
        if (prev && latest.some((r) => r.id === prev)) return prev;
        if (initialRequestId && latest.some((r) => r.id === initialRequestId)) return initialRequestId;
        return latest[0]?.id || '';
      });
      setMessages(store.getMessages(selectedRequestId));
    };
    handleUpdate();
    const unsub = store.subscribe(handleUpdate);
    return () => unsub();
  }, [selectedRequestId, initialRequestId, user]);

  useEffect(() => {
    if (selectedRequestId) {
      setMessages(store.getMessages(selectedRequestId));
    }
  }, [selectedRequestId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const activeReq = requests.find((r) => r.id === selectedRequestId);

  const handleSelectChannel = (reqId: string) => {
    setSelectedRequestId(reqId);
    // Update hash for deep link preservation on refresh without breaking router
    window.location.hash = `tech-messages?id=${reqId}`;
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedRequestId || !activeReq) return;

    store.sendMessage({
      request_id: selectedRequestId,
      sender_id: user?.id || 'user-tech-1',
      sender_name: user?.full_name || 'Rohan Deshmukh',
      sender_role: 'technician',
      receiver_id: activeReq.user_id || 'user-customer-1',
      content: inputText.trim()
    });

    setInputText('');
  };

  const filteredRequests = requests.filter((r) => {
    if (!channelSearch) return true;
    const term = channelSearch.toLowerCase();
    return (
      r.customer_name.toLowerCase().includes(term) ||
      r.request_number.toLowerCase().includes(term) ||
      (r.device?.model && r.device.model.toLowerCase().includes(term)) ||
      r.service_name.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Technician Dispatch Messenger &amp; Customer Chat</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Encrypted live communication channel with device owners and cleanroom station intake.
        </p>
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl grid grid-cols-1 md:grid-cols-12 overflow-hidden h-[640px]">
        {/* Ticket Selector Channels */}
        <div className="md:col-span-4 border-r border-slate-800 flex flex-col bg-slate-950/60 overflow-hidden">
          <div className="p-3.5 border-b border-slate-800 bg-slate-900/80 space-y-2">
            <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>Work Order Channels</span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                {requests.length} Active
              </span>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2" />
              <input
                type="text"
                placeholder="Search ticket # or client..."
                value={channelSearch}
                onChange={(e) => setChannelSearch(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/80">
            {filteredRequests.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                No matching customer tickets found.
              </div>
            ) : (
              filteredRequests.map((r) => {
                const isSelected = r.id === selectedRequestId;
                const reqMsgs = store.getMessages(r.id);
                const lastMsg = reqMsgs[reqMsgs.length - 1];

                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleSelectChannel(r.id)}
                    className={`w-full text-left p-3.5 transition-colors flex items-start gap-3 ${
                      isSelected
                        ? 'bg-emerald-950/40 border-l-2 border-emerald-500'
                        : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 text-emerald-400">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-xs font-bold text-white truncate">{r.customer_name}</p>
                        <span className="text-[10px] font-mono text-emerald-400 font-bold shrink-0">
                          #{r.request_number}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {r.device?.brand} {r.device?.model}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate mt-1">
                        {lastMsg ? lastMsg.content : 'No messages yet in this ticket'}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Message Thread */}
        <div className="md:col-span-8 flex flex-col h-full bg-slate-900">
          {activeReq ? (
            <>
              {/* Header */}
              <div className="p-3.5 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xs font-bold text-white truncate">{activeReq.customer_name}</h4>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                        #{activeReq.request_number}
                      </span>
                      <StatusBadge status={activeReq.status} />
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">
                      {activeReq.device?.brand} {activeReq.device?.model} • {activeReq.service_name}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigate('request-detail', activeReq.id)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center gap-1 shrink-0"
                >
                  Workbench
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Message History */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/40">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                    <MessageSquare className="w-10 h-10 text-slate-700 mb-2" />
                    <p className="text-xs font-semibold text-slate-400">
                      No correspondence logged yet for ticket #{activeReq.request_number}
                    </p>
                    <p className="text-[11px] text-slate-600 mt-1 max-w-sm">
                      Send a diagnostic update, repair milestone, or status inquiry to {activeReq.customer_name} below.
                    </p>
                  </div>
                ) : (
                  messages.map((m) => {
                    const isTechSender = m.sender_role === 'technician' || m.sender_id === user?.id;
                    const timeStr = m.created_at
                      ? new Date(m.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : '';

                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col ${isTechSender ? 'items-end' : 'items-start'}`}
                      >
                        <div className="flex items-center gap-1.5 mb-1 px-1">
                          <span className="text-[10px] font-bold text-slate-400">
                            {isTechSender ? 'You (Technician Bench)' : m.sender_name}
                          </span>
                          <span className="text-[10px] text-slate-600">{timeStr}</span>
                        </div>
                        <div
                          className={`max-w-md rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-sm ${
                            isTechSender
                              ? 'bg-emerald-600 text-white rounded-tr-xs'
                              : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-xs'
                          }`}
                        >
                          {m.content}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Form */}
              <form onSubmit={handleSend} className="p-3 border-t border-slate-800 bg-slate-900/90 flex gap-2">
                <input
                  type="text"
                  placeholder={`Reply to ${activeReq.customer_name} about #${activeReq.request_number}...`}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-center p-6 text-slate-500">
              <p className="text-xs">Select a customer work order from the left to view messages.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
