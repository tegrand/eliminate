import { Input } from "../../../components/ui/input";
import { Search } from "lucide-react";

export default function AssignmentToolbar({ totalAssignments }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Assignments</h2>
        <p className="text-sm text-gray-500 mt-1">
          {totalAssignments !== undefined ? `Total ${totalAssignments} assignments found` : "Loading assignments..."}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Input
          placeholder="Search assignments..."
          aria-label="Search assignments"
          leftIcon={<Search className="h-4 w-4 text-gray-400" />}
          className="w-full sm:w-64 h-10 bg-white border-gray-200 text-sm focus:ring-indigo-500 focus:border-indigo-500 rounded-xl"
        />
      </div>
    </div>
  );
}
