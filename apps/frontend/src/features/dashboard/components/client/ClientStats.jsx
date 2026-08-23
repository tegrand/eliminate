import { Briefcase, Users, Calendar, DollarSign } from "lucide-react";
import { useTranslation } from "react-i18next";
import StatCard from "../StatCard";

export default function ClientStats({ stats }) {
  const { t } = useTranslation();
  
  const statItems = [
    { title: t("clientDashboard.activeRequirements") || "Active Requirements", value: stats?.activeRequirements || "0", icon: Briefcase, bgColor: "bg-blue-50", iconColor: "text-blue-500" },
    { title: t("clientDashboard.assignedWorkers") || "Assigned Workers", value: stats?.assignedWorkers || "0", icon: Users, bgColor: "bg-green-50", iconColor: "text-green-500" },
    { title: t("clientDashboard.upcomingJobs") || "Upcoming Jobs", value: stats?.upcomingJobs || "0", icon: Calendar, bgColor: "bg-purple-50", iconColor: "text-purple-500" },
    { title: t("clientDashboard.pendingPayments") || "Pending Payments", value: stats?.pendingPayments || "₹0", icon: DollarSign, bgColor: "bg-orange-50", iconColor: "text-orange-500" }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
      {statItems.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
