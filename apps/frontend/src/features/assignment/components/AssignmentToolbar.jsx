import { Input } from "../../../components/ui/input";
import { Search } from "lucide-react";

export default function AssignmentToolbar({ totalAssignments }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Assignments</h2>
        <p className="text-sm text-gray-500 mt-1">
          {totalAssignments !== undefined ? `Total ${totalAssignments} assignments found` : "Loading assignments..."}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="w-full sm:w-64 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <Input 
            placeholder="Search assignments..." 
            aria-label="Search assignments"
            className="pl-9"
          />
        </div>
      </div>
    </div>
  );
}
