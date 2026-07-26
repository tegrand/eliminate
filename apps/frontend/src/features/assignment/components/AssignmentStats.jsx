import { CheckCircle2, Clock, PlayCircle, Users } from "lucide-react";

export default function AssignmentStats() {
  const stats = [
    { label: "TOTAL ASSIGNMENTS", value: "324", subtitle: "All assignments", icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "ACTIVE", value: "185", subtitle: "Currently active", icon: PlayCircle, color: "text-green-600", bg: "bg-green-50" },
    { label: "PENDING", value: "42", subtitle: "Awaiting approval", icon: Clock, color: "text-orange-500", bg: "bg-orange-50" },
    { label: "COMPLETED", value: "97", subtitle: "Finished assignments", icon: CheckCircle2, color: "text-gray-600", bg: "bg-gray-50" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
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
