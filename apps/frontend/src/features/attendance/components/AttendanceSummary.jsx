import { Card, CardContent } from "../../../components/ui/card";
import { User, Calendar, Briefcase, Clock } from "lucide-react";
import AttendanceStatusBadge from "./AttendanceStatusBadge";

export default function AttendanceSummary({ record }) {
  if (!record) return null;

  return (
    <Card className="mb-6">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <h3 className="font-semibold text-gray-900">Attendance Record Details</h3>
        <AttendanceStatusBadge status={record.status} />
      </div>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <div className="mt-1 bg-blue-50 p-2 rounded-lg text-blue-600">
              <User className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Worker</p>
              <p className="font-semibold text-gray-900">{record.worker}</p>
              <p className="text-xs text-gray-500">{record.workerId}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="mt-1 bg-purple-50 p-2 rounded-lg text-purple-600">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Assignment</p>
              <p className="font-semibold text-gray-900">{record.assignment}</p>
              <p className="text-xs text-gray-500">{record.client}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-1 bg-green-50 p-2 rounded-lg text-green-600">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Date</p>
              <p className="font-semibold text-gray-900">{record.date}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-1 bg-amber-50 p-2 rounded-lg text-amber-600">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Shift Type</p>
              <p className="font-semibold text-gray-900">{record.shiftType}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
