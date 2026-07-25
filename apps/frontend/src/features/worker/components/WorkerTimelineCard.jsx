import { Card, CardContent } from "../../../components/ui/card";

export default function WorkerTimelineCard() {
  const events = [
    { id: 1, title: "Worker Profile Updated", date: "Oct 24, 2026 - 10:30 AM", user: "Admin" },
    { id: 2, title: "Worker Status Changed to ACTIVE", date: "Sep 15, 2026 - 09:15 AM", user: "System" },
    { id: 3, title: "Worker Created", date: "Jan 15, 2023 - 08:00 AM", user: "Admin" },
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-100 pb-2">
          Recent Activity
        </h3>
        <div className="space-y-6">
          {events.map((event) => (
            <div key={event.id} className="relative pl-6 border-l-2 border-gray-200 last:border-l-0 last:pb-0">
              <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-blue-100 border-2 border-white"></span>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900">{event.title}</span>
                <span className="text-xs text-gray-500 mt-1">{event.date} • by {event.user}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
