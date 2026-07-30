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
import { ROUTES } from "../../../routes/routePaths";
import DashboardCard from "../DashboardCard";

const cards = (stats, t) => [
  {
    label: t('clientDashboard.activeJobs'),
    value: stats?.activeJobs ?? "—",
    sub: t('clientDashboard.activeJobsSub'),
    gradient: "from-blue-500 to-blue-600",
    link: ROUTES.CLIENT_JOBS,
  },
  {
    label: t('clientDashboard.pendingRequests'),
    value: stats?.pendingRequests ?? "—",
    sub: t('clientDashboard.pendingRequestsSub'),
    gradient: "from-orange-500 to-orange-600",
    link: ROUTES.CLIENT_WORKERS,
  },
  {
    label: t('clientDashboard.completedJobs'),
    value: stats?.completedJobs ?? "—",
    sub: t('clientDashboard.completedJobsSub'),
    gradient: "from-teal-500 to-teal-600",
    link: ROUTES.CLIENT_JOBS,
  },
  {
    label: t('clientDashboard.assignedWorkers'),
    value: stats?.assignedWorkers ?? "—",
    sub: t('clientDashboard.assignedWorkersSub'),
    gradient: "from-emerald-500 to-emerald-600",
    link: ROUTES.CLIENT_WORKERS,
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
          <DashboardCard
            key={card.label}
            title={card.label}
            count={card.value}
            colorClass={card.gradient}
            link={card.link}
            description={card.sub}
          />
        ))}
      </div>
    </div>
  );
}
