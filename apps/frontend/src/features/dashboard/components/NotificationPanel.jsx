import { Bell, UserPlus, RefreshCcw, CheckCircle2, Clock3, Wallet } from "lucide-react";

const TYPE_META = {
  WORKER_ASSIGNED: { icon: UserPlus, tone: "bg-blue-50 text-blue-600" },
  WORKER_REPLACED: { icon: RefreshCcw, tone: "bg-rose-50 text-rose-600" },
  REQUIREMENT_ACCEPTED: { icon: CheckCircle2, tone: "bg-emerald-50 text-emerald-600" },
  ATTENDANCE_UPDATES: { icon: Clock3, tone: "bg-amber-50 text-amber-600" },
  PAYMENT_UPDATES: { icon: Wallet, tone: "bg-violet-50 text-violet-600" },
};

export default function NotificationPanel() {
  const notifications = [];

  const getMeta = (type) => TYPE_META[type] || { icon: Bell, tone: "bg-gray-50 text-gray-500" };

  return (
    <div className="rounded-2xl bg-white h-full border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
      <div className="p-5">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-bold text-gray-900">Notifications</h3>
          <a href="#" className="text-xs font-semibold text-blue-600 hover:text-blue-700">View all</a>
        </div>
        
        <div className="space-y-6">
          {notifications.length === 0 ? (
            <div className="text-sm text-gray-500 py-4">No new notifications</div>
          ) : (
            notifications.map((notif) => (
              <div key={notif.id} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getMeta(notif.type).tone}`}>
                  {(() => {
                    const Icon = getMeta(notif.type).icon;
                    return <Icon className="w-4 h-4" />;
                  })()}
                </div>
                <div className="flex-1 flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-[13px] font-semibold text-gray-900 leading-tight">{notif.title}</h4>
                    <p className="text-[12px] text-gray-500 mt-0.5">{notif.desc}</p>
                  </div>
                  <span className="text-[11px] text-gray-500 whitespace-nowrap pt-0.5">{notif.time}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
