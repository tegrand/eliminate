import { Card, CardContent } from "../../../components/ui/card";
import { CheckCircle2, XCircle, Clock, CalendarIcon } from "lucide-react";

export default function AttendanceSummaryCard({ workers }) {
  const total = workers.length;
  const present = workers.filter(w => w.status === "PRESENT").length;
  const absent = workers.filter(w => w.status === "ABSENT").length;
  const halfDay = workers.filter(w => w.status === "HALF_DAY").length;
  const leave = workers.filter(w => w.status === "LEAVE").length;

  return (
    <Card className="sticky top-6 border-blue-100 shadow-md">
      <div className="px-5 py-4 border-b border-gray-100 bg-blue-50/30 rounded-t-xl">
        <h3 className="font-semibold text-gray-900">Summary</h3>
      </div>
      <CardContent className="p-5">
        <div className="flex items-end gap-2 mb-6">
          <span className="text-4xl font-bold text-gray-900">{total}</span>
          <span className="text-sm font-medium text-gray-500 mb-1">Total Workers</span>
        </div>

        <ul className="space-y-4">
          <li className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <CheckCircle2 className="h-4 w-4 text-green-500" /> Present
            </div>
            <span className="text-sm font-bold text-gray-900">{present}</span>
          </li>
          <li className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <XCircle className="h-4 w-4 text-red-500" /> Absent
            </div>
            <span className="text-sm font-bold text-gray-900">{absent}</span>
          </li>
          <li className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <Clock className="h-4 w-4 text-amber-500" /> Half Day
            </div>
            <span className="text-sm font-bold text-gray-900">{halfDay}</span>
          </li>
          <li className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <CalendarIcon className="h-4 w-4 text-blue-500" /> Leave
            </div>
            <span className="text-sm font-bold text-gray-900">{leave}</span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}
