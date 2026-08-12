import { useState, useEffect, useRef } from "react";
import { Bell, Check, Loader2, UserPlus, RefreshCcw, CheckCircle2, Clock3, Wallet, Briefcase, XCircle, CheckCircle, AlertTriangle } from "lucide-react";
import api from "../../../api/axios";
import { formatDistanceToNow, parseISO } from "date-fns";
import { Link } from "react-router-dom";
import { useSocket } from "../../../context/SocketContext";
import { toast } from "sonner";

const TYPE_META = {
  CLIENT_REQUIREMENT: { label: "Client Requirement", icon: Briefcase, tone: "text-blue-600 bg-blue-50" },
  WORKER_ACCEPTED: { label: "Worker Accepted", icon: CheckCircle2, tone: "text-emerald-600 bg-emerald-50" },
  WORKER_REJECTED: { label: "Worker Rejected", icon: XCircle, tone: "text-red-600 bg-red-50" },
  ASSIGNMENT_COMPLETED: { label: "Assignment Completed", icon: CheckCircle, tone: "text-purple-600 bg-purple-50" },
  ATTENDANCE_ISSUES: { label: "Attendance Issues", icon: AlertTriangle, tone: "text-orange-600 bg-orange-50" },
  // Existing
  WORKER_ASSIGNED: { label: "Worker Assigned", icon: UserPlus, tone: "text-blue-600 bg-blue-50" },
  WORKER_REPLACED: { label: "Worker Replaced", icon: RefreshCcw, tone: "text-rose-600 bg-rose-50" },
  REQUIREMENT_ACCEPTED: { label: "Requirement Accepted", icon: CheckCircle2, tone: "text-emerald-600 bg-emerald-50" },
  ATTENDANCE_UPDATES: { label: "Attendance Updates", icon: Clock3, tone: "text-amber-600 bg-amber-50" },
  PAYMENT_UPDATES: { label: "Payment Updates", icon: Wallet, tone: "text-violet-600 bg-violet-50" },
};

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { socket } = useSocket();
  
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchNotifications();

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
      
      toast(notification.title, {
        description: notification.message,
      });
    };

    socket.on("new_notification", handleNewNotification);

    return () => {
      socket.off("new_notification", handleNewNotification);
    };
  }, [socket]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data.data || []);
      setUnreadCount((res.data.data || []).filter(n => !n.isRead).length);
    } catch (error) {
      console.error("Failed to fetch notifications");
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark as read");
    }
  };

  const markAllAsRead = async () => {
    try {
      setLoading(true);
      await api.put("/notifications/read-all");
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all as read");
    } finally {
      setLoading(false);
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      fetchNotifications();
    }
  };

  const getTypeMeta = (type) => TYPE_META[type] || { label: type || "Notification", icon: Bell, tone: "text-slate-600 bg-slate-50" };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={toggleDropdown}
        className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors relative" 
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full border border-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2">
          <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <h3 className="font-semibold text-slate-800">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead} 
                disabled={loading}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
              >
                {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                Mark all read
              </button>
            )}
          </div>
          
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-sm">
                No notifications yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {notifications.map(notif => (
                  <div 
                    key={notif.id} 
                    onClick={() => !notif.isRead && markAsRead(notif.id)}
                    className={`p-3 hover:bg-slate-50 transition-colors cursor-pointer flex flex-col gap-1 ${!notif.isRead ? 'bg-indigo-50/50' : ''}`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex items-start gap-2">
                        {(() => {
                          const meta = getTypeMeta(notif.type);
                          const Icon = meta.icon;
                          return (
                            <span className={`mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full ${meta.tone}`}>
                              <Icon className="h-3.5 w-3.5" />
                            </span>
                          );
                        })()}
                        <div>
                          <h4 className={`text-sm ${!notif.isRead ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'}`}>
                            {notif.title}
                          </h4>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                            {getTypeMeta(notif.type).label}
                          </p>
                        </div>
                      </div>
                      {!notif.isRead && <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0 mt-1.5" />}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {notif.message}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] text-slate-400 font-medium">
                        {formatDistanceToNow(parseISO(notif.createdAt), { addSuffix: true })}
                      </span>
                      {notif.link && (
                        <Link to={notif.link} className="text-[10px] text-indigo-600 hover:underline">
                          View details
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
