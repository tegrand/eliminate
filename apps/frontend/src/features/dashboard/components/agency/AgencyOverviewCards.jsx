import { useTranslation } from "react-i18next";
import { ROUTES } from "../../../routes/routePaths";
import DashboardCard from "../DashboardCard";

export default function AgencyOverviewCards({ stats }) {
  const { t } = useTranslation();

  const cards = [
    {
      title: t('agencyDashboard.activeWorkers') || "Active Workers",
      value: stats?.activeWorkers || "0",
      description: "Workers currently on job",
      gradient: "from-blue-500 to-blue-600",
      link: ROUTES.AGENCY_WORKERS,
    },
    {
      title: t('agencyDashboard.availableWorkers') || "Available Workers",
      value: stats?.availableWorkers || "0",
      description: "Workers ready for assignment",
      gradient: "from-emerald-500 to-emerald-600",
      link: ROUTES.AGENCY_WORKERS,
    },
    {
      title: t('agencyDashboard.busyWorkers') || "Busy Workers",
      value: stats?.busyWorkers || "0",
      description: "Workers temporarily unavailable",
      gradient: "from-amber-500 to-amber-600",
      link: ROUTES.AGENCY_WORKERS,
    },
    {
      title: t('agencyDashboard.pendingRequests') || "Pending Requests",
      value: stats?.pendingRequests || "0",
      description: "Pending worker assignments",
      gradient: "from-purple-500 to-purple-600",
      link: ROUTES.AGENCY_ASSIGNMENTS,
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
      {cards.map((card, idx) => (
        <DashboardCard 
          key={idx} 
          title={card.title}
          count={card.value}
          colorClass={card.gradient}
          link={card.link}
          description={card.description}
        />
      ))}
    </div>
  );
}
