import { useTranslation } from "react-i18next";
import { ROUTES } from "../../../../routes/routePaths";
import DashboardCard from "../DashboardCard";

export default function AgencyOverviewCards({ stats }) {
  const { t } = useTranslation();

  const cards = [
    {
      title: t('agencyDashboard.activeWorkers') || "Active Workers",
      value: stats?.activeWorkers || "0",
      description: "Workers currently on job",
      gradient: "from-violet-400 to-purple-500",
      link: ROUTES.AGENCY_WORKERS,
    },
    {
      title: t('agencyDashboard.availableWorkers') || "Available Workers",
      value: stats?.availableWorkers || "0",
      description: "Workers ready for assignment",
      gradient: "from-purple-400 to-indigo-500",
      link: ROUTES.AGENCY_WORKERS,
    },
    {
      title: t('agencyDashboard.busyWorkers') || "Busy Workers",
      value: stats?.busyWorkers || "0",
      description: "Workers temporarily unavailable",
      gradient: "from-fuchsia-400 to-violet-500",
      link: ROUTES.AGENCY_WORKERS,
    },
    {
      title: t('agencyDashboard.pendingRequests') || "Pending Requests",
      value: stats?.pendingRequests || "0",
      description: "Pending worker assignments",
      gradient: "from-indigo-400 to-purple-500",
      link: ROUTES.AGENCY_ASSIGNMENTS,
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
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
