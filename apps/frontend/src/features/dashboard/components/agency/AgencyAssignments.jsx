import { Briefcase, Activity, CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import StatCard from "../StatCard";

export default function AgencyAssignments({ stats }) {
  const { t } = useTranslation();

  const cards = [
    {
      title: t('agencyDashboard.activeClientRequirements') || "Active Client Requirements",
      value: stats?.activeClientRequirements || "0",
      icon: Briefcase,
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-500",
    },
    {
      title: t('agencyDashboard.ongoingAssignments') || "Ongoing Assignments",
      value: stats?.ongoingAssignments || "0",
      icon: Activity,
      bgColor: "bg-cyan-50",
      iconColor: "text-cyan-500",
    },
    {
      title: t('agencyDashboard.completedAssignments') || "Completed Assignments",
      value: stats?.completedAssignments || "0",
      icon: CheckCircle2,
      bgColor: "bg-teal-50",
      iconColor: "text-teal-500",
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
      {cards.map((card, idx) => (
        <StatCard key={idx} {...card} />
      ))}
    </div>
  );
}
