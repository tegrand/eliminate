import { Bell, Activity, CheckCircle, Info, UserPlus, RefreshCcw, CheckCircle2, Clock3, Wallet } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const TYPE_META = {
  WORKER_ASSIGNED: { icon: UserPlus, color: "text-blue-500 bg-blue-50" },
  WORKER_REPLACED: { icon: RefreshCcw, color: "text-rose-500 bg-rose-50" },
  REQUIREMENT_ACCEPTED: { icon: CheckCircle2, color: "text-emerald-500 bg-emerald-50" },
  ATTENDANCE_UPDATES: { icon: Clock3, color: "text-amber-500 bg-amber-50" },
  PAYMENT_UPDATES: { icon: Wallet, color: "text-violet-500 bg-violet-50" },
};

export default function WorkerActivityWidget({ recentActivities }) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
      <div className="flex px-4 pt-4 border-b border-gray-100">
        <div className="flex-1 text-[11px] font-bold uppercase tracking-widest pb-3 border-b-2 transition-colors border-indigo-500 text-indigo-600 text-center">
          {t('workerDashboard.recentActivity')}
        </div>
      </div>

      <div className="p-4 overflow-y-auto">
          <div className="relative before:absolute before:inset-0 before:ml-[50%] before:-translate-x-px before:h-full before:w-[2px] before:bg-gradient-to-b before:from-slate-200 before:via-slate-200 before:to-transparent pl-3 pr-3 md:pl-0 md:pr-0">
            <div className="space-y-4 relative">
              {recentActivities && recentActivities.length > 0 ? (
                recentActivities.map((activity) => (
                  <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                    <div className="flex items-center justify-center w-2 h-2 rounded-full border border-white bg-indigo-500 shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-[50%] md:group-even:translate-x-[50%] absolute left-1/2 -translate-x-1/2 md:static" />
                    <div className="w-[calc(100%-1.5rem)] md:w-[calc(50%-1rem)] p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 shadow-sm hover:border-indigo-100 transition-colors">
                      <p className="text-[11px] font-bold text-slate-800 mb-0.5">{activity.action}</p>
                      <time className="text-[9px] text-slate-500 font-medium">{activity.time}</time>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-sm text-slate-500 italic">
                  {t('workerDashboard.noActivity')}
                </div>
              )}
            </div>
          </div>
      </div>
    </div>
  );
}
