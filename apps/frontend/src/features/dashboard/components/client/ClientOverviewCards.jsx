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
import { useTranslation } from "react-i18next";
import StatCard from "../StatCard";

const cards = (stats, t) => [
  {
    label: t('clientDashboard.activeJobs'),
    value: stats?.activeJobs ?? "—",
    sub: t('clientDashboard.activeJobsSub'),
    icon: TrendingUp,
    gradient: "from-blue-500 to-blue-600",
    lightBg: "bg-blue-50",
    lightIcon: "text-blue-600",
    ring: "ring-blue-100",
  },
  {
    label: t('clientDashboard.pendingRequests'),
    value: stats?.pendingRequests ?? "—",
    sub: t('clientDashboard.pendingRequestsSub'),
    icon: FolderOpen,
    gradient: "from-orange-500 to-orange-600",
    lightBg: "bg-orange-50",
    lightIcon: "text-orange-600",
    ring: "ring-orange-100",
  },
  {
    label: t('clientDashboard.completedJobs'),
    value: stats?.completedJobs ?? "—",
    sub: t('clientDashboard.completedJobsSub'),
    icon: CheckCircle2,
    gradient: "from-teal-500 to-teal-600",
    lightBg: "bg-teal-50",
    lightIcon: "text-teal-600",
    ring: "ring-teal-100",
  },
  {
    label: t('clientDashboard.assignedWorkers'),
    value: stats?.assignedWorkers ?? "—",
    sub: t('clientDashboard.assignedWorkersSub'),
    icon: Users,
    gradient: "from-emerald-500 to-emerald-600",
    lightBg: "bg-emerald-50",
    lightIcon: "text-emerald-600",
    ring: "ring-emerald-100",
  },
];

export default function ClientOverviewCards({ stats }) {
  const { t } = useTranslation();
  const items = cards(stats, t);

  return (
    <div>
      <h2 className="text-[13px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
        <span className="inline-block w-4 h-px bg-gray-300" />
        {t('clientDashboard.overview')}
        <span className="inline-block flex-1 h-px bg-gray-100" />
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((card) => (
          <StatCard
            key={card.label}
            title={card.label}
            value={card.value}
            icon={card.icon}
            bgColor={card.lightBg}
            iconColor={card.lightIcon}
            description={card.sub}
          />
        ))}
      </div>
    </div>
  );
}
