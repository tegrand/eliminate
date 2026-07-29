import { Clock, Activity } from "lucide-react";

export default function ClientRecentActivity({ activities = [] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-500" />
          Recent Activities
        </h2>
        <button className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">View All</button>
      </div>

      <div className="space-y-6">
        {activities.length > 0 ? activities.map((activity, index) => (
          <div key={activity.id || index} className="relative pl-6 pb-6 last:pb-0 group">
            {/* Timeline line */}
            {index !== activities.length - 1 && (
              <div className="absolute left-[11px] top-7 bottom-0 w-px bg-gray-100 group-hover:bg-blue-100 transition-colors"></div>
            )}
            
            {/* Timeline dot */}
            <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-blue-50 border-2 border-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            </div>

            <div>
              <p className="text-sm text-gray-900 font-medium group-hover:text-blue-600 transition-colors">{activity.title}</p>
              <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span>{new Date(activity.timestamp || new Date()).toLocaleString()}</span>
              </div>
            </div>
          </div>
        )) : (
          [
            { id: 'm1', title: 'Payment of ₹15,000 processed for Job #4301', timestamp: new Date(Date.now() - 3600000) },
            { id: 'm2', title: '5 workers allocated from Alpha Staffing', timestamp: new Date(Date.now() - 86400000) },
            { id: 'm3', title: 'New Job Requirement #4302 published', timestamp: new Date(Date.now() - 172800000) },
          ].map((activity, index, arr) => (
            <div key={activity.id} className="relative pl-6 pb-6 last:pb-0 group">
              {index !== arr.length - 1 && (
                <div className="absolute left-[11px] top-7 bottom-0 w-px bg-gray-100 group-hover:bg-blue-100 transition-colors"></div>
              )}
              <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-blue-50 border-2 border-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              </div>
              <div>
                <p className="text-sm text-gray-900 font-medium group-hover:text-blue-600 transition-colors">{activity.title}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(activity.timestamp).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
