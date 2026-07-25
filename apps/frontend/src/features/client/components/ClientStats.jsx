import { Building, CheckCircle2, ShieldAlert } from "lucide-react";

export default function ClientStats({ clients }) {
  const total = clients?.length || 0;
  const active = clients?.filter(c => c.status === 'ACTIVE')?.length || 0;
  const suspended = clients?.filter(c => c.status === 'SUSPENDED' || c.status === 'INACTIVE')?.length || 0;

  const stats = [
    { label: "TOTAL CLIENTS", value: total, icon: Building, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "ACTIVE", value: active, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
    { label: "SUSPENDED", value: suspended, icon: ShieldAlert, color: "text-red-600", bg: "bg-red-50" }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
            <div className={`flex items-center justify-center w-12 h-12 rounded-full ${stat.bg}`}>
              <Icon className={`w-5 h-5 ${stat.color}`} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1">{stat.label}</span>
              <span className="text-2xl font-bold text-slate-800 leading-none">{stat.value}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
