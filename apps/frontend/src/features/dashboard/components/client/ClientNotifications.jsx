import { Bell, AlertCircle, CheckCircle, Info, Clock } from "lucide-react";

export default function ClientNotifications({ notifications = [] }) {
  
  const getIcon = (type) => {
    switch(type) {
      case 'ALERT': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'SUCCESS': return <CheckCircle className="w-5 h-5 text-green-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Bell className="w-5 h-5 text-orange-500" />
          Notifications
        </h2>
        <button className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">Mark all read</button>
      </div>

      <div className="space-y-4">
        {notifications.length > 0 ? notifications.map((notif) => (
          <div key={notif.id} className="group flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="p-2 bg-white rounded-full shadow-sm border border-gray-100 shrink-0 group-hover:scale-110 transition-transform">
              {getIcon(notif.type)}
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{notif.title}</h4>
              <p className="text-sm text-gray-500 mt-0.5">{notif.message}</p>
              <span className="text-xs text-gray-400 mt-2 block flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(notif.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        )) : (
          <div className="text-center py-8 text-gray-500 text-sm flex flex-col items-center">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
              <Bell className="w-6 h-6 text-gray-300" />
            </div>
            You're all caught up!
          </div>
        )}
      </div>
    </div>
  );
}
