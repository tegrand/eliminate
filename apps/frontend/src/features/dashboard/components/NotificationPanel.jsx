import { Bell } from "lucide-react";

export default function NotificationPanel() {
  const notifications = [
    {
      id: 1,
      title: "System maintenance scheduled",
      desc: "Tonight from 12:00 AM to 2:00 AM",
      time: "10 mins ago"
    },
    {
      id: 2,
      title: "New compliance policy update",
      desc: "Please review the updated guidelines",
      time: "2 hours ago"
    },
    {
      id: 3,
      title: "Database backup completed",
      desc: "May 21, 2025 at 02:00 AM",
      time: "5 hours ago"
    }
  ];

  return (
    <div className="rounded-2xl bg-white h-full border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
      <div className="p-5">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-bold text-gray-900">Notifications</h3>
          <a href="#" className="text-xs font-semibold text-blue-600 hover:text-blue-700">View all</a>
        </div>
        
        <div className="space-y-6">
          {notifications.map((notif) => (
            <div key={notif.id} className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
              <div className="flex-1 flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-[13px] font-semibold text-gray-900 leading-tight">{notif.title}</h4>
                  <p className="text-[12px] text-gray-500 mt-0.5">{notif.desc}</p>
                </div>
                <span className="text-[11px] text-gray-500 whitespace-nowrap pt-0.5">{notif.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
