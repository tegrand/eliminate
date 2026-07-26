import { Button } from "../../../components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

export default function AttendanceHeader({ assignmentId, date, onSave, isSaving }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <Link 
          to="/attendance" 
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Attendance
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Bulk Attendance</h1>
        <p className="mt-2 text-sm text-gray-500">
          Marking attendance for assignment <span className="font-semibold text-gray-700">{assignmentId}</span> on <span className="font-semibold text-gray-700">{date}</span>.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" className="w-full sm:w-auto">
          Discard
        </Button>
        <Button onClick={onSave} loading={isSaving} className="w-full sm:w-auto">
          <Save className="mr-2 h-4 w-4" /> Save All
        </Button>
      </div>
    </div>
  );
}
