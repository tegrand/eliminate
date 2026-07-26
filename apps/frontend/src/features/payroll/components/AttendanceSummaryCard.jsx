import { Card, CardContent } from "../../../components/ui/card";
import { Clock } from "lucide-react";

export default function AttendanceSummaryCard({ stats }) {
  return (
    <Card className="mb-6">
      <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <Clock className="h-4 w-4 text-blue-500" /> Aggregated Attendance
        </h3>
      </div>
      <CardContent className="p-5">
        <ul className="space-y-4">
          <li className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Total Regular Hours</span>
            <span className="text-sm font-bold text-gray-900">{stats.regularHours} hrs</span>
          </li>
          <li className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Total Shifts Logged</span>
            <span className="text-sm font-bold text-gray-900">{stats.totalShifts}</span>
          </li>
          <li className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Avg Hours/Worker</span>
            <span className="text-sm font-bold text-gray-900">{stats.avgHours} hrs</span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}
