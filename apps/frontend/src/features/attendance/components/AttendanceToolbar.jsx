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
        <div className="w-full sm:w-64 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <Input 
            placeholder="Search worker or assignment..." 
            aria-label="Search attendance"
            className="pl-9 h-10 bg-white border-gray-200 text-sm focus:ring-indigo-500 focus:border-indigo-500 rounded-xl"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="w-full sm:w-auto h-10 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl">
            <Upload className="mr-2 h-4 w-4 text-gray-500" /> Import
          </Button>
          <Button variant="outline" className="w-full sm:w-auto h-10 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl">
            <Download className="mr-2 h-4 w-4 text-gray-500" /> Export
          </Button>
        </div>
      </div>
    </div>
  );
}
