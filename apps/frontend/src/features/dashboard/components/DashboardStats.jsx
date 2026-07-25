import { Users, Briefcase, Building2, ClipboardList } from "lucide-react";
import StatCard from "./StatCard";

export default function DashboardStats() {
  const stats = [
    { title: "Total Workers", value: "2,543", icon: Users, trend: "+12.5%", trendUp: true },
    { title: "Total Clients", value: "128", icon: Briefcase, trend: "+4.2%", trendUp: true },
    { title: "Total Agencies", value: "45", icon: Building2, trend: "-1.5%", trendUp: false },
    { title: "Open Job Requirements", value: "32", icon: ClipboardList, trend: "+8.1%", trendUp: true },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
