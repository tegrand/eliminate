import { Card, CardContent } from "../../../components/ui/card";
import { Users, UserCheck, Clock, ShieldAlert } from "lucide-react";

export default function WorkerStats({ workers }) {
  const total = workers?.length || 0;
  // If the mock data uses ACTIVE or APPROVED, we handle both.
  const active = workers?.filter(w => w.status === 'ACTIVE' || w.status === 'APPROVED')?.length || 0;
  const pending = workers?.filter(w => w.status === 'PENDING')?.length || 0;
  const suspended = workers?.filter(w => w.status === 'SUSPENDED' || w.status === 'Inactive')?.length || 0;

  const stats = [
    { label: "TOTAL WORKERS", value: total, subtitle: "All registered workers", icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "ACTIVE", value: active, subtitle: "Currently working", icon: UserCheck, color: "text-green-600", bg: "bg-green-50" },
    { label: "PENDING", value: pending, subtitle: "Awaiting approval", icon: Clock, color: "text-orange-500", bg: "bg-orange-50" },
    { label: "SUSPENDED", value: suspended, subtitle: "Temporarily suspended", icon: ShieldAlert, color: "text-red-600", bg: "bg-red-50" }
  ];

  return (
    <div className="flex overflow-x-auto gap-3 mb-3 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-4 flex items-center gap-4 min-w-[200px] sm:min-w-[220px] flex-1 shrink-0">
            <div className={`flex flex-shrink-0 items-center justify-center w-12 h-12 rounded-2xl ${stat.bg}`}>
              <Icon className={`w-5 h-5 ${stat.color}`} strokeWidth={2} />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">{stat.label}</span>
              <span className="text-xl font-bold text-slate-800 leading-none mb-0.5">{stat.value}</span>
              <span className="text-[10px] text-gray-400 font-medium">{stat.subtitle}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
