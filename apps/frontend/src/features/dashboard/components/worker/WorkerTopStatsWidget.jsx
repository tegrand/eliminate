import { CheckCircle2, DollarSign, Wallet, Clock } from "lucide-react";

export default function WorkerTopStatsWidget({ stats }) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      {/* Completed Work */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex items-start gap-4 hover:border-indigo-100 transition-colors group">
        <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Completed Work</p>
          <h4 className="text-2xl font-bold text-slate-900 leading-none mb-2">{stats.totalCompletedWork}</h4>
          <p className="text-xs text-slate-500 font-medium">Tasks completed</p>
        </div>
      </div>

      {/* Total Revenue */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex items-start gap-4 hover:border-emerald-100 transition-colors group">
        <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
          <DollarSign className="w-6 h-6" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Total Revenue</p>
          <h4 className="text-2xl font-bold text-slate-900 leading-none mb-2">{stats.totalRevenue}</h4>
          <p className="text-xs text-slate-500 font-medium">This month</p>
        </div>
      </div>

      {/* Pending Amount */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex items-start gap-4 hover:border-orange-100 transition-colors group">
        <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
          <Wallet className="w-6 h-6" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Pending Amount</p>
          <h4 className="text-2xl font-bold text-slate-900 leading-none mb-2">{stats.pendingAmount}</h4>
          <p className="text-xs text-slate-500 font-medium">Due by May 30, 2025</p>
        </div>
      </div>

      {/* Total Hours */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex items-start gap-4 hover:border-blue-100 transition-colors group">
        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
          <Clock className="w-6 h-6" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Hours Logged</p>
          <h4 className="text-2xl font-bold text-slate-900 leading-none mb-2">{stats.totalHoursLogged}</h4>
          <p className="text-xs text-slate-500 font-medium">This month</p>
        </div>
      </div>
    </div>
  );
}
