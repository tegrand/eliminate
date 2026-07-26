
import { UserPlus, CheckCircle2, Building, UserX } from "lucide-react";

export default function RecentActivity() {
  const activities = [];

  return (
    <div className="rounded-2xl bg-white h-full border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
      <div className="p-5">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-bold text-gray-900">Recent Activity</h3>
          <a href="#" className="text-xs font-semibold text-blue-600 hover:text-blue-700">View all</a>
        </div>
        
        <div className="relative border-l-2 border-gray-100 ml-3 space-y-6">
          {activities.length === 0 ? (
            <div className="text-sm text-gray-500 py-4 pl-4">No recent activity</div>
          ) : (
            activities.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="relative pl-6">
                  <span className="absolute -left-[5px] top-3 w-2 h-2 rounded-full bg-gray-400 border-2 border-white ring-4 ring-white" />
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${activity.bg}`}>
                        <Icon className={`w-4 h-4 ${activity.color}`} />
                      </div>
                      <div>
                        <p className="text-[13px] text-gray-900 leading-tight">
                          <span className="font-semibold">{activity.title}</span> <span className="text-gray-500">{activity.desc}</span>
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] text-gray-500 whitespace-nowrap pt-1">{activity.time}</span>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  );
}
