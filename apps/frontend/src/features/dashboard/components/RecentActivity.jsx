import { Card, CardContent } from "../../../components/ui/card";

export default function RecentActivity() {
  const activities = [
    { id: 1, title: "Worker Registration", time: "10 mins ago", description: "John Doe submitted an application (Pending)." },
    { id: 2, title: "Agency Approved", time: "2 hours ago", description: "Alpha Staffing was approved by Super Admin." },
    { id: 3, title: "Client Registration", time: "5 hours ago", description: "TechCorp Logistics registered and is Active." },
    { id: 4, title: "Worker Rejected", time: "1 day ago", description: "Jane Smith application rejected." },
  ];

  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
        <div className="space-y-6">
          {activities.map((activity) => (
            <div key={activity.id} className="relative pl-6 border-l-2 border-gray-200 last:border-l-0 last:pb-0">
              <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-blue-100 border-2 border-white"></span>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900">{activity.title}</span>
                <span className="text-sm text-gray-500 mt-1">{activity.description}</span>
                <span className="text-xs text-gray-400 mt-2">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
