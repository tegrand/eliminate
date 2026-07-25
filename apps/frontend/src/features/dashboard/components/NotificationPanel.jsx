import { Bell } from "lucide-react";
import { Card, CardContent } from "../../../components/ui/card";

export default function NotificationPanel() {
  const notifications = [
    { id: 1, message: "System maintenance scheduled for tonight.", type: "warning" },
    { id: 2, message: "New compliance policy update available.", type: "info" },
  ];

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          <Bell className="h-5 w-5 text-gray-400" />
        </div>
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div key={notif.id} className="flex items-start p-3 bg-gray-50 rounded-lg">
              <div className="h-2 w-2 mt-1.5 rounded-full bg-blue-500 mr-3 flex-shrink-0"></div>
              <p className="text-sm text-gray-700">{notif.message}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
