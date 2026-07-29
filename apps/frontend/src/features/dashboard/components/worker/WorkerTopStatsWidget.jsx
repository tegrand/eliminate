import { CheckCircle2, DollarSign, Wallet, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function WorkerTopStatsWidget({ stats }) {
  const { t } = useTranslation();
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      {/* Completed Work */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex items-start gap-3 hover:border-indigo-100 transition-colors group">
        <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{t('workerDashboard.completedWork')}</p>
          <h4 className="text-xl font-bold text-slate-900 leading-none mb-1.5">{stats.totalCompletedWork}</h4>
          <p className="text-[11px] text-slate-500 font-medium">{t('workerDashboard.tasksCompleted')}</p>
        </div>
      </div>

      {/* Total Revenue */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex items-start gap-3 hover:border-emerald-100 transition-colors group">
        <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
          <DollarSign className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{t('workerDashboard.totalRevenue')}</p>
          <h4 className="text-xl font-bold text-slate-900 leading-none mb-1.5">{stats.totalRevenue}</h4>
          <p className="text-[11px] text-slate-500 font-medium">{t('workerDashboard.thisMonth')}</p>
        </div>
      </div>

      {/* Pending Amount */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex items-start gap-3 hover:border-orange-100 transition-colors group">
        <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
          <Wallet className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{t('workerDashboard.pendingAmount')}</p>
          <h4 className="text-xl font-bold text-slate-900 leading-none mb-1.5">{stats.pendingAmount}</h4>
          <p className="text-[11px] text-slate-500 font-medium">Due by May 30, 2025</p>
        </div>
      </div>

      {/* Attendance Summary */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex items-start gap-3 hover:border-blue-100 transition-colors group">
        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{t('workerDashboard.attendance')}</p>
          <div className="flex gap-3 mb-1.5">
            <span className="text-sm font-bold text-emerald-600">{stats.attendanceSummary?.present || 0} <span className="text-[10px] text-slate-500 font-medium">P</span></span>
            <span className="text-sm font-bold text-red-600">{stats.attendanceSummary?.absent || 0} <span className="text-[10px] text-slate-500 font-medium">A</span></span>
            <span className="text-sm font-bold text-blue-600">{stats.attendanceSummary?.onLeave || 0} <span className="text-[10px] text-slate-500 font-medium">L</span></span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">{t('workerDashboard.thisMonth')}</p>
        </div>
      </div>
    </div>
  );
}
