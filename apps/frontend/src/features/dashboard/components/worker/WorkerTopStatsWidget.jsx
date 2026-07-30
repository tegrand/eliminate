import { useTranslation } from "react-i18next";
import DashboardCard from "../DashboardCard";

export default function WorkerTopStatsWidget({ stats }) {
  const { t } = useTranslation();
  if (!stats) return null;

  const cards = [
    {
      title: t('workerDashboard.completedWork') || "Completed Work",
      value: stats.totalCompletedWork || "0",
      description: t('workerDashboard.tasksCompleted') || "Tasks completed",
      gradient: "from-indigo-500 to-indigo-600",
    },
    {
      title: t('workerDashboard.totalRevenue') || "Total Revenue",
      value: stats.totalRevenue || "$0",
      description: t('workerDashboard.thisMonth') || "This month",
      gradient: "from-emerald-500 to-emerald-600",
    },
    {
      title: t('workerDashboard.pendingAmount') || "Pending Amount",
      value: stats.pendingAmount || "$0",
      description: "Due by end of month",
      gradient: "from-orange-500 to-orange-600",
    },
    {
      title: t('workerDashboard.attendance') || "Attendance",
      value: (stats.attendanceSummary?.present || "0") + " Days",
      description: `Absent: ${stats.attendanceSummary?.absent || 0} | Leave: ${stats.attendanceSummary?.onLeave || 0}`,
      gradient: "from-blue-500 to-blue-600",
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {cards.map((card, idx) => (
        <DashboardCard 
          key={idx} 
          title={card.title}
          count={card.value}
          colorClass={card.gradient}
          description={card.description}
        />
      ))}
    </div>
  );
}
