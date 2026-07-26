import { Card, CardContent } from "../../../components/ui/card";
import { CheckCircle2, FileText, Send, UserCheck } from "lucide-react";

export default function ApprovalTimeline({ events = [] }) {
  const timelineEvents = events.length > 0 ? events : [
    { id: "1", type: "APPROVED", title: "Payroll Approved", user: "Admin (Sarah J.)", date: "2026-07-16", time: "14:30", notes: "All discrepancies resolved.", icon: UserCheck, color: "text-green-500", bg: "bg-green-100" },
    { id: "2", type: "REVIEW", title: "Pending Review", user: "Manager (Tom K.)", date: "2026-07-16", time: "10:00", notes: "Sent to admin for final sign-off.", icon: Send, color: "text-blue-500", bg: "bg-blue-100" },
    { id: "3", type: "GENERATED", title: "Payroll Generated", user: "System", date: "2026-07-16", time: "01:00", notes: "Automated generation based on attendance.", icon: FileText, color: "text-gray-500", bg: "bg-gray-100" },
  ];

  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Approval Timeline</h3>
        <div className="relative border-l border-gray-200 ml-3 space-y-8">
          {timelineEvents.map((event, index) => {
            const Icon = event.icon || CheckCircle2;
            return (
              <div key={event.id} className="relative pl-6 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <span className={`absolute -left-3 top-0 flex h-6 w-6 items-center justify-center rounded-full ring-8 ring-white ${event.bg}`}>
                  <Icon className={`h-3.5 w-3.5 ${event.color}`} />
                </span>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">{event.title}</h4>
                    <p className="mt-1 text-sm text-gray-600">{event.notes}</p>
                    <div className="mt-2 text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md inline-block">
                      {event.user}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 whitespace-nowrap sm:text-right mt-1 sm:mt-0 flex gap-2 sm:flex-col sm:gap-0">
                    <span>{event.date}</span>
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
