import {
  FileText,
  FolderOpen,
  Users,
  Briefcase,
  CheckCircle2,
  IndianRupee,
  CalendarClock,
  TrendingUp,
} from "lucide-react";

const cards = (stats) => [
  {
    label: "Active Requirements",
    value: stats?.activeRequirements ?? "—",
    sub: "Open + Partially Filled",
    icon: TrendingUp,
    gradient: "from-blue-500 to-blue-600",
    lightBg: "bg-blue-50",
    lightIcon: "text-blue-600",
    ring: "ring-blue-100",
  },
  {
    label: "Open Requirements",
    value: stats?.openRequirements ?? "—",
    sub: "Awaiting workers",
    icon: FolderOpen,
    gradient: "from-violet-500 to-violet-600",
    lightBg: "bg-violet-50",
    lightIcon: "text-violet-600",
    ring: "ring-violet-100",
  },
  {
    label: "Assigned Workers",
    value: stats?.assignedWorkers ?? "—",
    sub: "Across all requirements",
    icon: Users,
    gradient: "from-emerald-500 to-emerald-600",
    lightBg: "bg-emerald-50",
    lightIcon: "text-emerald-600",
    ring: "ring-emerald-100",
  },
  {
    label: "Ongoing Jobs",
    value: stats?.ongoingJobs ?? "—",
    sub: "Currently in progress",
    icon: Briefcase,
    gradient: "from-orange-500 to-orange-600",
    lightBg: "bg-orange-50",
    lightIcon: "text-orange-600",
    ring: "ring-orange-100",
  },
  {
    label: "Completed Jobs",
    value: stats?.completedJobs ?? "—",
    sub: "Successfully finished",
    icon: CheckCircle2,
    gradient: "from-teal-500 to-teal-600",
    lightBg: "bg-teal-50",
    lightIcon: "text-teal-600",
    ring: "ring-teal-100",
  },
  {
    label: "Upcoming Jobs",
    value: stats?.upcomingJobs ?? "—",
    sub: "Future start dates",
    icon: CalendarClock,
    gradient: "from-indigo-500 to-indigo-600",
    lightBg: "bg-indigo-50",
    lightIcon: "text-indigo-600",
    ring: "ring-indigo-100",
  },
  {
    label: "Pending Payments",
    value: stats?.pendingPayments ?? "₹0",
    sub: "Due to workers",
    icon: IndianRupee,
    gradient: "from-rose-500 to-rose-600",
    lightBg: "bg-rose-50",
    lightIcon: "text-rose-600",
    ring: "ring-rose-100",
  },
];

export default function ClientOverviewCards({ stats }) {
  const items = cards(stats);

  return (
    <div>
      <h2 className="text-[13px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
        <span className="inline-block w-4 h-px bg-gray-300" />
        Overview
        <span className="inline-block flex-1 h-px bg-gray-100" />
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        {items.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`group relative bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] p-4 flex flex-col gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ring-1 ${card.ring}`}
            >
              {/* Icon */}
              <div className={`w-9 h-9 rounded-xl ${card.lightBg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-4.5 h-4.5 ${card.lightIcon}`} strokeWidth={2} />
              </div>

              {/* Value */}
              <div>
                <p className="text-2xl font-bold text-gray-900 leading-none">{card.value}</p>
                <p className="text-[11px] font-semibold text-gray-500 mt-1 leading-tight">{card.label}</p>
              </div>

              {/* Sub text */}
              <p className="text-[10px] text-gray-400 font-medium leading-tight">{card.sub}</p>

              {/* Gradient bottom accent */}
              <div className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
