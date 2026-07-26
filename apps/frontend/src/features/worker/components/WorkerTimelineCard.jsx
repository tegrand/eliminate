import { Card, CardContent } from "../../../components/ui/card";
import AuditLogTimeline from "../../../components/ui/audit-log/AuditLogTimeline";

export default function WorkerTimelineCard() {
  const events = [
    { id: 1, title: "Worker Status Changed to APPROVED", action: "APPROVED", timestamp: "2026-10-24T10:30:00Z", performedBy: "Super Admin", reason: "All documents verified." },
    { id: 2, title: "Worker Registered (Pending)", action: "REGISTERED", timestamp: "2026-10-23T08:00:00Z", performedBy: "System", reason: "Self registration completed." },
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-100 pb-2">
          Approval Timeline & Audit Log
        </h3>
        <AuditLogTimeline logs={events} />
      </CardContent>
    </Card>
  );
}
