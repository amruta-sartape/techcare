import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, UserCheck, Wrench } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { store } from '../../services/store';
import { Message, ServiceRequest } from '../../types';

export const CustomerMessagesPage: React.FC = () => {
  const { user } = useAuth();
  const requests = store.getServiceRequests({ userId: user?.id });
  const [selectedRequestId, setSelectedRequestId] = useState<string>(requests[0]?.id || '');
  const [messages, setMessages] = useState<Message[]>(() => store.getMessages(selectedRequestId));
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    if (!selectedRequestId && requests.length > 0) {
      setSelectedRequestId(requests[0].id);
    }
  }, [requests, selectedRequestId]);

  useEffect(() => {
    const handleUpdate = () => {
      setMessages(store.getMessages(selectedRequestId));
    };
    handleUpdate();
    const unsub = store.subscribe(handleUpdate);
    return () => unsub();
  }, [selectedRequestId, user]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !user || !selectedRequestId) return;

    const currentReq = requests.find((r) => r.id === selectedRequestId);

    store.sendMessage({
      request_id: selectedRequestId,
      sender_id: user.id,
      sender_name: user.full_name,
      sender_role: user.role,
      receiver_id: currentReq?.assigned_technician_id || 'tech-1',
      content: inputText.trim()
    });

    setInputText('');
  };

  const activeReq = requests.find((r) => r.id === selectedRequestId);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Technician Dispatch Messenger</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Real-time encrypted chat with assigned laboratory specialists and couriers.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-12 overflow-hidden h-[540px]">
        {/* Ticket Selector Drawer */}
        <div className="md:col-span-4 border-r border-slate-200 overflow-y-auto divide-y divide-slate-100 bg-slate-50/50">
          <div className="p-3.5 bg-slate-100/70 text-xs font-bold text-slate-700">
            Active Ticket Channels
          </div>
          {requests.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelectedRequestId(r.id)}
              className={`w-full p-4 text-left transition-colors flex items-start gap-3 ${
                selectedRequestId === r.id ? 'bg-white shadow-xs border-l-4 border-blue-600' : 'hover:bg-slate-100/60'
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <Wrench className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">{r.request_number}</p>
                <p className="text-[11px] text-slate-500 truncate">{r.service_name}</p>
                <span className="text-[10px] font-semibold text-blue-600">{r.status}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Chat Feed */}
        <div className="md:col-span-8 flex flex-col h-full bg-white">
          {/* Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900">
                Channel: {activeReq?.request_number || 'General'}
              </h3>
              <p className="text-[11px] text-slate-500">
                Assigned Tech: {activeReq?.assigned_technician?.full_name || 'Rohan Deshmukh'}
              </p>
            </div>
            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
              Live Realtime Feed
            </span>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No messages yet. Send a query regarding this ticket.
              </div>
            ) : (
              messages.map((m) => {
                const isMe = m.sender_id === user?.id;
                return (
                  <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <span className="text-[10px] text-slate-400 mb-0.5">
                      {m.sender_name} • {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <div
                      className={`max-w-md p-3 rounded-2xl text-xs leading-relaxed ${
                        isMe ? 'bg-blue-600 text-white rounded-br-xs' : 'bg-slate-100 text-slate-800 rounded-bl-xs'
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Input Box */}
          <form onSubmit={handleSend} className="p-3 border-t border-slate-100 flex gap-2">
            <input
              type="text"
              placeholder="Send message to technician..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white p-2.5 rounded-xl transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
