import { Card, CardContent } from "../../../components/ui/card";
import { FileText, Clock, CheckCircle2, DollarSign } from "lucide-react";

export default function PayrollStats() {
  const stats = [
    { title: "Draft Payrolls", value: "3", icon: FileText, color: "text-gray-600", bg: "bg-gray-100" },
    { title: "Pending Approval", value: "5", icon: Clock, color: "text-amber-600", bg: "bg-amber-100" },
    { title: "Approved", value: "12", icon: CheckCircle2, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Paid", value: "84", icon: DollarSign, color: "text-green-600", bg: "bg-green-100" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, i) => (
        <Card key={i}>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <h4 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h4>
            </div>
            <div className={`h-12 w-12 rounded-full flex items-center justify-center ${stat.bg}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
