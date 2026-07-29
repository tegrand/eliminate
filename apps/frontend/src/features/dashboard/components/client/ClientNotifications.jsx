import { Bell, AlertCircle, CheckCircle, Info, Clock, UserPlus, RefreshCcw, CheckCircle2, Wallet } from "lucide-react";
import { useTranslation } from "react-i18next";

const TYPE_META = {
  WORKER_ASSIGNED: { icon: UserPlus, color: "text-blue-500" },
  WORKER_REPLACED: { icon: RefreshCcw, color: "text-rose-500" },
  REQUIREMENT_ACCEPTED: { icon: CheckCircle2, color: "text-emerald-500" },
  ATTENDANCE_UPDATES: { icon: Clock, color: "text-amber-500" },
  PAYMENT_UPDATES: { icon: Wallet, color: "text-violet-500" },
};

export default function ClientNotifications({ notifications = [] }) {
  const { t } = useTranslation();
  
  const getIcon = (type) => {
    if (TYPE_META[type]) {
      const Icon = TYPE_META[type].icon;
      return <Icon className={`w-5 h-5 ${TYPE_META[type].color}`} />;
    }
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
          {t('clientDashboard.notifications')}
        </h2>
        <button className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">{t('clientDashboard.markAllRead')}</button>
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
          [
            { id: 'n1', type: 'WORKER_ASSIGNED', title: 'Workers Assigned', message: '3 workers have been assigned to Job #4301.', createdAt: new Date(Date.now() - 3600000) },
            { id: 'n2', type: 'REQUIREMENT_ACCEPTED', title: 'Requirement Accepted', message: 'Kerala Workforce has accepted your request.', createdAt: new Date(Date.now() - 86400000) },
            { id: 'n3', type: 'PAYMENT_UPDATES', title: 'Payment Due', message: 'Invoice #1024 for ₹45,000 is due tomorrow.', createdAt: new Date(Date.now() - 172800000) },
          ].map((notif) => (
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
          ))
        )}
      </div>
    </div>
  );
}
