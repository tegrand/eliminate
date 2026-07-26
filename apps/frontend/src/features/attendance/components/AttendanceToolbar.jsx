import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Search, Download, Upload } from "lucide-react";

export default function AttendanceToolbar({ totalRecords }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Attendance Log</h2>
        <p className="text-sm text-gray-500 mt-1">
          {totalRecords !== undefined ? `Showing ${totalRecords} records today` : "Loading attendance..."}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Input 
          placeholder="Search worker or assignment..." 
          aria-label="Search attendance"
          leftIcon={<Search className="h-4 w-4 text-gray-400" />}
          className="w-full sm:w-64 h-10 bg-white border-gray-200 text-sm focus:ring-indigo-500 focus:border-indigo-500 rounded-xl"
        />
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" leftIcon={<Upload className="h-4 w-4 text-gray-500" />} className="w-full sm:w-auto h-10 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl">
            Import
          </Button>
          <Button variant="outline" leftIcon={<Download className="h-4 w-4 text-gray-500" />} className="w-full sm:w-auto h-10 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl">
            Export
          </Button>
        </div>
      </div>
    </div>
  );
}
