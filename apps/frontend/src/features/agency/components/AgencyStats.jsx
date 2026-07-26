import { Building, Building2, CheckCircle2, Clock, ShieldAlert } from "lucide-react";

export default function AgencyStats({ agencies }) {
  const total = agencies?.length || 0;
  const active = agencies?.filter(a => a.status === 'ACTIVE' || a.status === 'APPROVED')?.length || 0;
  const suspended = agencies?.filter(a => a.status === 'SUSPENDED' || a.status === 'Inactive')?.length || 0;

  const stats = [
    { label: "TOTAL AGENCIES", value: total, subtitle: "All registered agencies", icon: Building, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "ACTIVE", value: active, subtitle: "Currently active", icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
    { label: "SUSPENDED", value: suspended, subtitle: "Temporarily suspended", icon: ShieldAlert, color: "text-red-600", bg: "bg-red-50" }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-4 flex items-center gap-4">
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
