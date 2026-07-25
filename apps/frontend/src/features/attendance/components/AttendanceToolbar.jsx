import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Search, Download, Upload } from "lucide-react";

export default function AttendanceToolbar({ totalRecords }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Attendance Log</h2>
        <p className="text-sm text-gray-500 mt-1">
          {totalRecords !== undefined ? `Showing ${totalRecords} records today` : "Loading attendance..."}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="w-full sm:w-64 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <Input 
            placeholder="Search worker or assignment..." 
            aria-label="Search attendance"
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="w-full sm:w-auto">
            <Upload className="mr-2 h-4 w-4" /> Import
          </Button>
          <Button variant="outline" className="w-full sm:w-auto">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>
    </div>
  );
}
