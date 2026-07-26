import { CheckCircle2, Clock, IndianRupee, Calendar } from "lucide-react";

export default function WorkerStatsWidget({ attendance, payments }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {/* Attendance Stat */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-2xl border border-emerald-100 relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all" />
        
        <div className="flex justify-between items-start mb-4">
          <div className="bg-white p-2.5 rounded-xl shadow-sm border border-emerald-100 text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <span className="px-2.5 py-1 bg-white/60 rounded-full text-[10px] font-bold text-emerald-700 uppercase tracking-wide border border-emerald-200/50 backdrop-blur-sm">
            Today
          </span>
        </div>
        
        <div>
          <p className="text-sm font-medium text-emerald-800/70 mb-1">Attendance Status</p>
          <h4 className="text-2xl font-bold text-emerald-900 mb-3">{attendance.status}</h4>
          
          <div className="flex items-center gap-4 text-xs font-medium text-emerald-700">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 opacity-70" />
              In: {attendance.timeIn}
            </div>
            {attendance.timeOut && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 opacity-70" />
                Out: {attendance.timeOut}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payments Stat */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-100 relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all" />
        
        <div className="flex justify-between items-start mb-4">
          <div className="bg-white p-2.5 rounded-xl shadow-sm border border-amber-100 text-amber-600">
            <IndianRupee className="w-5 h-5" />
          </div>
        </div>
        
        <div>
          <p className="text-sm font-medium text-amber-800/70 mb-1">Pending Payments</p>
          <h4 className="text-2xl font-bold text-amber-900 mb-3">{payments.amount}</h4>
          
          <div className="flex items-center gap-1.5 text-xs font-medium text-amber-700">
            <Calendar className="w-3.5 h-3.5 opacity-70" />
            Due by {payments.dueDate}
          </div>
        </div>
      </div>
    </div>
  );
}
