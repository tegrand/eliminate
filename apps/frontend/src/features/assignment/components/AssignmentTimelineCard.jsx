import { Card, CardContent } from "../../../components/ui/card";
import { CheckCircle2, AlertCircle, Clock, PlayCircle, StopCircle, UserPlus, Info } from "lucide-react";

const getEventConfig = (type) => {
  switch (type) {
    case "ASSIGNED":
      return { icon: UserPlus, color: "text-blue-500", bg: "bg-blue-100" };
    case "STARTED":
      return { icon: PlayCircle, color: "text-green-500", bg: "bg-green-100" };
    case "PAUSED":
      return { icon: Clock, color: "text-amber-500", bg: "bg-amber-100" };
    case "COMPLETED":
      return { icon: CheckCircle2, color: "text-gray-600", bg: "bg-gray-200" };
    case "CANCELLED":
      return { icon: StopCircle, color: "text-red-500", bg: "bg-red-100" };
    case "ISSUE":
      return { icon: AlertCircle, color: "text-orange-500", bg: "bg-orange-100" };
    default:
      return { icon: Info, color: "text-gray-500", bg: "bg-gray-100" };
  }
};

export default function AssignmentTimelineCard({ events = [] }) {
  // Dummy data if empty
  const timelineEvents = events.length > 0 ? events : [
    { id: "1", type: "COMPLETED", title: "Assignment Completed", user: "Manager A", date: "2026-10-15", time: "17:30", notes: "Final sign-off received from client." },
    { id: "2", type: "PAUSED", title: "Assignment Paused", user: "Manager A", date: "2026-09-10", time: "14:00", notes: "Awaiting material delivery at site." },
    { id: "3", type: "STARTED", title: "Assignment Started", user: "Dispatcher B", date: "2026-08-01", time: "09:00", notes: "Worker deployed to site successfully." },
    { id: "4", type: "ASSIGNED", title: "Worker Assigned", user: "Dispatcher B", date: "2026-07-25", time: "11:15", notes: "John Smith assigned to TechCorp requirement." },
  ];

  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Assignment Timeline</h3>
        
        <div className="relative border-l border-gray-200 ml-3 space-y-8">
          {timelineEvents.map((event, index) => {
            const config = getEventConfig(event.type);
            const Icon = config.icon;
            
            return (
              <div key={event.id} className="relative pl-6 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <span className={`absolute -left-3 top-0 flex h-6 w-6 items-center justify-center rounded-full ring-8 ring-white ${config.bg}`}>
                  <Icon className={`h-3.5 w-3.5 ${config.color}`} />
                </span>
                
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">{event.title}</h4>
                    <p className="mt-1 text-sm text-gray-600">{event.notes}</p>
                    <div className="mt-2 flex items-center gap-2 text-xs font-medium text-gray-500">
                      <span className="bg-gray-100 px-2 py-1 rounded-md">{event.user}</span>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-400 whitespace-nowrap sm:text-right mt-1 sm:mt-0 flex flex-row sm:flex-col gap-2 sm:gap-0">
                    <span>{event.date}</span>
                    <span className="hidden sm:inline">&nbsp;</span>
                    <span>{event.time}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
