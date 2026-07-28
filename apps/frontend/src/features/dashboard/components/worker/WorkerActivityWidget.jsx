import { Bell, Activity, CheckCircle, Info, UserPlus, RefreshCcw, CheckCircle2, Clock3, Wallet } from "lucide-react";

const TYPE_META = {
  WORKER_ASSIGNED: { icon: UserPlus, color: "text-blue-500 bg-blue-50" },
  WORKER_REPLACED: { icon: RefreshCcw, color: "text-rose-500 bg-rose-50" },
  REQUIREMENT_ACCEPTED: { icon: CheckCircle2, color: "text-emerald-500 bg-emerald-50" },
  ATTENDANCE_UPDATES: { icon: Clock3, color: "text-amber-500 bg-amber-50" },
  PAYMENT_UPDATES: { icon: Wallet, color: "text-violet-500 bg-violet-50" },
};

export default function WorkerActivityWidget({ notifications, recentActivities }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
      {/* Notifications */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[11px] font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
            <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <Bell className="w-3.5 h-3.5" />
            </div>
            Notifications
          </h3>
          <span className="bg-rose-50 text-rose-500 text-[10px] font-bold px-2.5 py-1 rounded-full">
            {notifications?.length || 0} New
          </span>
        </div>

        <div className="space-y-2">
          {notifications && notifications.length > 0 ? (
            notifications.map((notif) => (
              <div key={notif.id} className="flex gap-2.5 p-2.5 rounded-xl bg-slate-50/50 border border-slate-100 hover:border-indigo-100 transition-colors group">
                <div className="mt-0.5">
                  {(() => {
                    const meta = TYPE_META[notif.type];
                    const Icon = meta?.icon || Info;
                    return (
                      <div className={`${meta?.color || "bg-blue-50 text-blue-500"} rounded-full p-1`}>
                        <Icon className="w-3 h-3" />
                      </div>
                    );
                  })()}
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-800 mb-0.5 group-hover:text-indigo-900 transition-colors">{notif.text}</p>
                  <p className="text-[9px] text-slate-500 font-medium">{notif.time}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">No new notifications.</p>
          )}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
        <h3 className="text-[11px] font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2 mb-5">
          <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
            <Activity className="w-3.5 h-3.5" />
          </div>
          Recent Activity
        </h3>

        <div className="relative before:absolute before:inset-0 before:ml-[50%] before:-translate-x-px before:h-full before:w-[2px] before:bg-gradient-to-b before:from-slate-200 before:via-slate-200 before:to-transparent pl-3 pr-3 md:pl-0 md:pr-0">
          <div className="space-y-4 relative">
            {recentActivities && recentActivities.length > 0 ? (
              recentActivities.map((activity, idx) => (
                <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  {/* Timeline dot */}
                  <div className="flex items-center justify-center w-2 h-2 rounded-full border border-white bg-indigo-500 shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-[50%] md:group-even:translate-x-[50%] absolute left-1/2 -translate-x-1/2 md:static" />
                  
                  {/* Content */}
                  <div className="w-[calc(100%-1.5rem)] md:w-[calc(50%-1rem)] p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 shadow-sm hover:border-indigo-100 transition-colors">
                    <p className="text-[11px] font-bold text-slate-800 mb-0.5">{activity.action}</p>
                    <time className="text-[9px] text-slate-500 font-medium">{activity.time}</time>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4 relative z-10 bg-white">No recent activities.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
