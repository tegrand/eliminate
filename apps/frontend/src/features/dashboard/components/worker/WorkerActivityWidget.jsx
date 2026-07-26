import { Bell, Activity, CheckCircle, Info } from "lucide-react";

export default function WorkerActivityWidget({ notifications, recentActivities }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Notifications */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
            <Bell className="w-4 h-4 text-rose-500" />
            Notifications
          </h3>
          <span className="bg-rose-100 text-rose-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
            {notifications?.length || 0} New
          </span>
        </div>

        <div className="space-y-4">
          {notifications && notifications.length > 0 ? (
            notifications.map((notif) => (
              <div key={notif.id} className="flex gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                <div className="mt-0.5">
                  {notif.type === "success" ? (
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Info className="w-4 h-4 text-blue-500" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 leading-snug mb-1">{notif.text}</p>
                  <p className="text-xs text-gray-400">{notif.time}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">No new notifications.</p>
          )}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-5 flex items-center gap-2">
          <Activity className="w-4 h-4 text-violet-500" />
          Recent Activity
        </h3>

        <div className="relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
          <div className="space-y-6 relative">
            {recentActivities && recentActivities.length > 0 ? (
              recentActivities.map((activity, idx) => (
                <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  {/* Timeline dot */}
                  <div className="flex items-center justify-center w-4 h-4 rounded-full border-2 border-white bg-violet-200 group-hover:bg-violet-500 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 transition-colors" />
                  
                  {/* Content */}
                  <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-xl border border-gray-100 bg-gray-50/50 shadow-sm">
                    <p className="text-xs font-semibold text-gray-800 mb-1">{activity.action}</p>
                    <time className="text-[10px] text-gray-500">{activity.time}</time>
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
