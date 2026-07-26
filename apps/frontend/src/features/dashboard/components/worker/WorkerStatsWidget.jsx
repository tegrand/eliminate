import { CheckCircle2, Clock, Calendar } from "lucide-react";

export default function WorkerStatsWidget({ attendance, payments }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Attendance Stat */}
      <div className="bg-white rounded-2xl border border-emerald-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden relative">
        {/* Decorative Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent pointer-events-none" />
        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-emerald-100/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-0 w-full h-24 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-emerald-100/40 via-emerald-50/10 to-transparent pointer-events-none" />
        
        <div className="relative p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-emerald-500 flex items-center justify-center bg-white shrink-0 shadow-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="flex-1 pt-1">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-gray-500 tracking-wider uppercase">Attendance Status</span>
              <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold tracking-widest uppercase rounded-full border border-emerald-100">
                Today
              </span>
            </div>
            <h4 className="text-xl font-bold text-emerald-600 mb-1.5">{attendance.status}</h4>
            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
              <Clock className="w-3.5 h-3.5" />
              In: {attendance.timeIn}
            </div>
          </div>
        </div>
      </div>

      {/* Payments Stat */}
      <div className="bg-white rounded-2xl border border-orange-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden relative">
        {/* Decorative Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-transparent pointer-events-none" />
        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-orange-100/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-0 w-full h-24 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-orange-100/40 via-orange-50/10 to-transparent pointer-events-none" />
        
        <div className="relative p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-orange-400 flex items-center justify-center bg-white shrink-0 shadow-sm">
            <span className="text-lg font-bold text-orange-500">₹</span>
          </div>
          <div className="flex-1 pt-1">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-gray-500 tracking-wider uppercase">Pending Payments</span>
            </div>
            <h4 className="text-xl font-bold text-orange-500 mb-1.5">{payments.amount}</h4>
            <div className="flex items-center gap-1.5 text-xs font-medium text-orange-600">
              <Calendar className="w-3.5 h-3.5" />
              Due by {payments.dueDate}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
