import { useQuery } from "@tanstack/react-query";
import { Bell, UserPlus, RefreshCcw, CheckCircle2, Clock3, Wallet, Briefcase, Activity, CheckCircle, XCircle } from "lucide-react";
import api from "../../../api/axios";

const TYPE_META = {
  WORKER_ASSIGNED: { icon: UserPlus, tone: "bg-blue-50 text-blue-600" },
  WORKER_REPLACED: { icon: RefreshCcw, tone: "bg-rose-50 text-rose-600" },
  REQUIREMENT_ACCEPTED: { icon: CheckCircle2, tone: "bg-emerald-50 text-emerald-600" },
  ATTENDANCE_REMINDER: { icon: Clock3, tone: "bg-amber-50 text-amber-600" },
  PAYMENT_PROCESSED: { icon: Wallet, tone: "bg-violet-50 text-violet-600" },
  HIRING_ACCEPTED: { icon: CheckCircle, tone: "bg-emerald-50 text-emerald-600" },
  HIRING_REJECTED: { icon: XCircle, tone: "bg-red-50 text-red-600" },
  ASSIGNMENT_STARTED: { icon: Activity, tone: "bg-blue-50 text-blue-600" },
  ASSIGNMENT_COMPLETED: { icon: CheckCircle2, tone: "bg-emerald-50 text-emerald-600" },
  SYSTEM: { icon: Bell, tone: "bg-gray-50 text-gray-500" }
};

export default function NotificationPanel() {
  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await api.get("/notifications");
      return res.data?.data || res.data || [];
    },
    refetchInterval: 30000 // Refetch every 30s
  });

  const getMeta = (type) => TYPE_META[type] || TYPE_META.SYSTEM;

  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="rounded-2xl bg-white h-full border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
      <div className="p-5">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-bold text-gray-900">Notifications</h3>
          <button className="text-xs font-semibold text-blue-600 hover:text-blue-700">View all</button>
        </div>
        
        <div className="space-y-6 max-h-[400px] overflow-y-auto scrollbar-hide">
          {notifications.length === 0 ? (
            <div className="text-sm text-gray-500 py-4 text-center">No new notifications</div>
          ) : (
            notifications.map((notif) => (
              <div key={notif.id} className={`flex items-start gap-3 p-2 rounded-xl transition-colors ${!notif.isRead ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getMeta(notif.type).tone}`}>
                  {(() => {
                    const Icon = getMeta(notif.type).icon;
                    return <Icon className="w-4 h-4" />;
                  })()}
                </div>
                <div className="flex-1 flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-[13px] font-semibold text-gray-900 leading-tight">{notif.title}</h4>
                    <p className="text-[12px] text-gray-500 mt-0.5">{notif.message}</p>
                  </div>
                  <span className="text-[11px] text-gray-500 whitespace-nowrap pt-0.5">{timeAgo(notif.createdAt)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
