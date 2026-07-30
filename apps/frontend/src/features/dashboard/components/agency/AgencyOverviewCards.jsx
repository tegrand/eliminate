import { Users, UserCheck, Clock, UserPlus } from "lucide-react";
import { useTranslation } from "react-i18next";
import StatCard from "../../StatCard"; // I will assume this exists based on ClientDashboard

export default function AgencyOverviewCards({ stats }) {
  const { t } = useTranslation();

  const cards = [
    {
      title: t('agencyDashboard.activeWorkers') || "Active Workers",
      value: stats?.activeWorkers || "0",
      icon: Users,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-500",
    },
    {
      title: t('agencyDashboard.availableWorkers') || "Available Workers",
      value: stats?.availableWorkers || "0",
      icon: UserCheck,
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-500",
    },
    {
      title: t('agencyDashboard.busyWorkers') || "Busy Workers",
      value: stats?.busyWorkers || "0",
      icon: Clock,
      bgColor: "bg-amber-50",
      iconColor: "text-amber-500",
    },
    {
      title: t('agencyDashboard.pendingRequests') || "Pending Worker Requests",
      value: stats?.pendingRequests || "0",
      icon: UserPlus,
      bgColor: "bg-purple-50",
      iconColor: "text-purple-500",
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
      {cards.map((card, idx) => (
        <StatCard key={idx} {...card} />
      ))}
    </div>
  );
}
