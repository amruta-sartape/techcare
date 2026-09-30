import React, { useState, useEffect } from 'react';
import {
  Bell,
  CheckCheck,
  CheckCircle2,
  Clock,
  MessageSquare,
  Receipt,
  ShieldCheck,
  Wrench,
  ChevronRight,
  Filter,
  Calendar,
  Sparkles,
  Info
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { store } from '../../services/store';
import { NotificationItem } from '../../types';

interface NotificationsPageProps {
  onNavigate?: (page: string, param?: string) => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { success } = useToast();

  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    user ? store.getNotifications(user.id) : []
  );
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'status_update' | 'message' | 'invoice'>('all');

  useEffect(() => {
    const handleUpdate = () => {
      if (user) {
        setNotifications(store.getNotifications(user.id));
      }
    };
    handleUpdate();
    const unsub = store.subscribe(handleUpdate);
    return () => unsub();
  }, [user]);

  const handleMarkAsRead = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    store.markNotificationRead(id);
  };

  const handleMarkAllAsRead = () => {
    if (!user) return;
    store.markAllNotificationsRead(user.id);
    success('Notifications Updated', 'All system notifications marked as read.');
  };

  const handleItemClick = (notif: NotificationItem) => {
    if (!notif.read) {
      store.markNotificationRead(notif.id);
    }
    if (!onNavigate || !notif.link) return;

    if (notif.link.startsWith('/requests/')) {
      const reqId = notif.link.replace('/requests/', '');
      onNavigate('request-detail', reqId);
    } else if (notif.link.startsWith('/')) {
      const page = notif.link.slice(1);
      onNavigate(page);
    } else {
      onNavigate(notif.link);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((item) => {
    if (activeFilter === 'unread') return !item.read;
    if (activeFilter === 'status_update') return item.type === 'status_update' || item.type === 'technician_assigned';
    if (activeFilter === 'message') return item.type === 'message';
    if (activeFilter === 'invoice') return item.type === 'invoice';
    return true;
  });

  const getNotificationIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'status_update':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'technician_assigned':
        return <Wrench className="w-4 h-4 text-cyan-600" />;
      case 'appointment':
        return <Calendar className="w-4 h-4 text-purple-600" />;
      case 'invoice':
        return <Receipt className="w-4 h-4 text-emerald-600" />;
      case 'warranty':
        return <ShieldCheck className="w-4 h-4 text-teal-600" />;
      case 'message':
        return <MessageSquare className="w-4 h-4 text-amber-600" />;
      default:
        return <Info className="w-4 h-4 text-slate-600" />;
    }
  };

  const getNotificationBadgeClass = (type: NotificationItem['type']) => {
    switch (type) {
      case 'status_update':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'technician_assigned':
        return 'bg-cyan-50 border-cyan-200 text-cyan-700';
      case 'appointment':
        return 'bg-purple-50 border-purple-200 text-purple-700';
      case 'invoice':
        return 'bg-emerald-50 border-emerald-200 text-emerald-700';
      case 'warranty':
        return 'bg-teal-50 border-teal-200 text-teal-700';
      case 'message':
        return 'bg-amber-50 border-amber-200 text-amber-700';
      default:
        return 'bg-slate-50 border-slate-200 text-slate-700';
    }
  };

  const formatTimestamp = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-slate-900">Notifications &amp; Activity Log</h2>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold font-mono rounded-full bg-cyan-100 text-cyan-800 border border-cyan-300">
                {unreadCount} unread
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time tracking alerts, lab status transitions, and technician communication logs.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllAsRead}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs transition-colors self-start sm:self-auto"
          >
            <CheckCheck className="w-4 h-4 text-cyan-600" />
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: 'All Alerts', count: notifications.length },
          { id: 'unread', label: 'Unread', count: unreadCount },
          { id: 'status_update', label: 'Service Updates' },
          { id: 'message', label: 'Messages' },
          { id: 'invoice', label: 'Invoices' }
        ].map((tab) => {
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id as typeof activeFilter)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 hover:text-slate-900'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    isActive ? 'bg-slate-700 text-cyan-300' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Notifications List Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden divide-y divide-slate-100">
        {filteredNotifications.length === 0 ? (
          <div className="py-16 px-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Bell className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">No notifications found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              {activeFilter === 'unread'
                ? "You are all caught up! You don't have any unread notifications at the moment."
                : 'Activity milestones, technician notes, and invoice updates will appear here.'}
            </p>
          </div>
        ) : (
          filteredNotifications.map((item) => (
            <div
              key={item.id}
              onClick={() => handleItemClick(item)}
              className={`p-4.5 sm:p-5 flex items-start gap-3.5 transition-colors cursor-pointer ${
                item.read ? 'hover:bg-slate-50/80' : 'bg-blue-50/30 hover:bg-blue-50/50'
              }`}
            >
              {/* Status Indicator Icon */}
              <div
                className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${getNotificationBadgeClass(
                  item.type
                )}`}
              >
                {getNotificationIcon(item.type)}
              </div>

              {/* Body */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs font-bold text-slate-900">{item.title}</span>
                  {!item.read && (
                    <span className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_6px_rgba(6,182,212,0.6)]" />
                  )}
                  <span className="text-[11px] font-mono text-slate-400 ml-auto shrink-0">
                    {formatTimestamp(item.created_at)}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{item.message}</p>

                {item.link && (
                  <div className="mt-2.5 flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700">
                    <span>View associated record</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                )}
              </div>

              {/* Item Action */}
              {!item.read && (
                <button
                  type="button"
                  onClick={(e) => handleMarkAsRead(item.id, e)}
                  title="Mark as read"
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors shrink-0 ml-1"
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
