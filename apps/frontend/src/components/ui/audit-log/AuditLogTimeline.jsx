import { CheckCircle, XCircle, Ban, PlayCircle, UserPlus, Clock } from "lucide-react";

export default function AuditLogTimeline({ logs = [] }) {
  if (!logs || logs.length === 0) {
    return <p className="text-sm text-gray-500">No audit history available.</p>;
  }

  const getIconForAction = (action) => {
    switch (action) {
      case "APPROVED":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "REJECTED":
        return <XCircle className="h-5 w-5 text-red-600" />;
      case "SUSPENDED":
        return <Ban className="h-5 w-5 text-orange-600" />;
      case "REACTIVATED":
        return <PlayCircle className="h-5 w-5 text-blue-600" />;
      case "REGISTERED":
        return <UserPlus className="h-5 w-5 text-gray-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getBgColorForAction = (action) => {
    switch (action) {
      case "APPROVED": return "bg-green-100";
      case "REJECTED": return "bg-red-100";
      case "SUSPENDED": return "bg-orange-100";
      case "REACTIVATED": return "bg-blue-100";
      default: return "bg-gray-100";
    }
  };

  return (
    <div className="space-y-6">
      {logs.map((log, index) => (
        <div key={log.id || index} className="relative pl-6 border-l-2 border-gray-200 last:border-l-0 last:pb-0 pb-6">
          <span className={`absolute -left-[11px] top-0 h-5 w-5 rounded-full flex items-center justify-center border-2 border-white ${getBgColorForAction(log.action)}`}>
            {/* Inner dot just to look clean, or the icon itself slightly offset */}
          </span>
          <div className="absolute -left-2 -top-1 bg-white p-0.5 rounded-full">
            {getIconForAction(log.action)}
          </div>
          
          <div className="flex flex-col ml-3">
            <span className="text-sm font-medium text-gray-900">{log.title}</span>
            <span className="text-xs text-gray-500 mt-1">Performed by: {log.performedBy} • {new Date(log.timestamp).toLocaleString()}</span>
            {log.reason && (
              <span className="text-sm text-gray-700 mt-2 bg-gray-50 p-2 rounded border border-gray-100">
                <span className="font-semibold text-gray-500 text-xs uppercase tracking-wider block mb-1">Reason / Note:</span>
                {log.reason}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
