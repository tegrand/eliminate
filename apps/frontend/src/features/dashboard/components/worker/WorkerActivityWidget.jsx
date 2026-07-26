import { Bell, Activity, CheckCircle, Info } from "lucide-react";

export default function WorkerActivityWidget({ notifications, recentActivities }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Notifications */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-widest flex items-center gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Bell className="w-5 h-5" />
            </div>
            Notifications
          </h3>
          <span className="bg-rose-50 text-rose-500 text-[11px] font-bold px-3 py-1 rounded-full">
            {notifications?.length || 0} New
          </span>
        </div>

        <div className="space-y-4">
          {notifications && notifications.length > 0 ? (
            notifications.map((notif) => (
              <div key={notif.id} className="flex gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100 hover:border-indigo-100 transition-colors group">
                <div className="mt-0.5">
                  {notif.type === "success" ? (
                    <div className="bg-emerald-50 text-emerald-500 rounded-full p-1.5">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="bg-blue-50 text-blue-500 rounded-full p-1.5">
                      <Info className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-[13px] font-bold text-slate-800 mb-1 group-hover:text-indigo-900 transition-colors">{notif.text}</p>
                  <p className="text-[11px] text-slate-500 font-medium">{notif.time}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">No new notifications.</p>
          )}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
        <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-widest flex items-center gap-3 mb-8">
          <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
            <Activity className="w-5 h-5" />
          </div>
          Recent Activity
        </h3>

        <div className="relative before:absolute before:inset-0 before:ml-[50%] before:-translate-x-px before:h-full before:w-[2px] before:bg-gradient-to-b before:from-slate-200 before:via-slate-200 before:to-transparent pl-4 pr-4 md:pl-0 md:pr-0">
          <div className="space-y-8 relative">
            {recentActivities && recentActivities.length > 0 ? (
              recentActivities.map((activity, idx) => (
                <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  {/* Timeline dot */}
                  <div className="flex items-center justify-center w-3 h-3 rounded-full border-[3px] border-white bg-indigo-500 shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-[50%] md:group-even:translate-x-[50%] absolute left-1/2 -translate-x-1/2 md:static" />
                  
                  {/* Content */}
                  <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-4 rounded-2xl border border-slate-100 bg-slate-50/50 shadow-sm hover:border-indigo-100 transition-colors">
                    <p className="text-[13px] font-bold text-slate-800 mb-1">{activity.action}</p>
                    <time className="text-[11px] text-slate-500 font-medium">{activity.time}</time>
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
