import { CheckCircle2, DollarSign, Wallet, Clock } from "lucide-react";

export default function WorkerTopStatsWidget({ stats }) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      {/* Completed Work */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Completed Work</p>
          <h4 className="text-xl font-bold text-slate-800">{stats.totalCompletedWork}</h4>
        </div>
      </div>

      {/* Total Revenue */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <DollarSign className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Total Revenue</p>
          <h4 className="text-xl font-bold text-slate-800">{stats.totalRevenue}</h4>
        </div>
      </div>

      {/* Pending Amount */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
          <Wallet className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Pending Amount</p>
          <h4 className="text-xl font-bold text-slate-800">{stats.pendingAmount}</h4>
        </div>
      </div>

      {/* Total Hours */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <Clock className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Hours Logged</p>
          <h4 className="text-xl font-bold text-slate-800">{stats.totalHoursLogged}</h4>
        </div>
      </div>
    </div>
  );
}
