import { Users, Building, Building2, Ban, CheckCircle } from "lucide-react";
import StatCard from "./StatCard";

export default function DashboardStats() {
  const stats = [
    { title: "Pending Workers", value: "0", icon: Users, bgColor: "bg-blue-50", iconColor: "text-blue-500" },
    { title: "Pending Agencies", value: "0", icon: Building2, bgColor: "bg-purple-50", iconColor: "text-purple-500" },
    { title: "Approved Workers", value: "0", icon: CheckCircle, bgColor: "bg-green-50", iconColor: "text-green-500" },
    { title: "Approved Agencies", value: "0", icon: Building, bgColor: "bg-orange-50", iconColor: "text-orange-500" },
    { title: "Total Clients", value: "0", icon: Users, bgColor: "bg-blue-50", iconColor: "text-blue-500" },
    { title: "Suspended Accounts", value: "0", icon: Ban, bgColor: "bg-red-50", iconColor: "text-red-500" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
