import { PlusCircle, Users, Briefcase, Building } from "lucide-react";
import { Card, CardContent } from "../../../components/ui/card";

export default function QuickActions() {
  const actions = [
    { label: "Add Worker", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Add Client", icon: Briefcase, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Create Requirement", icon: PlusCircle, color: "text-green-600", bg: "bg-green-50" },
    { label: "Register Agency", icon: Building, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {actions.map((action) => (
            <button
              key={action.label}
              className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <div className={`p-3 rounded-full ${action.bg} mb-3`}>
                <action.icon className={`h-6 w-6 ${action.color}`} />
              </div>
              <span className="text-sm font-medium text-gray-700">{action.label}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
