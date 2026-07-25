import { Users, Building2, Briefcase, Clock, Ban, CheckCircle } from "lucide-react";
import StatCard from "./StatCard";

export default function DashboardStats() {
  const stats = [
    { title: "Pending Workers", value: "24", icon: Clock, trend: "+5", trendUp: true, color: "text-yellow-600" },
    { title: "Pending Agencies", value: "12", icon: Clock, trend: "+2", trendUp: true, color: "text-yellow-600" },
    { title: "Approved Workers", value: "2,543", icon: CheckCircle, trend: "+12.5%", trendUp: true, color: "text-green-600" },
    { title: "Approved Agencies", value: "45", icon: CheckCircle, trend: "+1", trendUp: true, color: "text-green-600" },
    { title: "Total Clients", value: "128", icon: Briefcase, trend: "+4.2%", trendUp: true, color: "text-blue-600" },
    { title: "Suspended Accounts", value: "7", icon: Ban, trend: "-1", trendUp: false, color: "text-red-600" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
