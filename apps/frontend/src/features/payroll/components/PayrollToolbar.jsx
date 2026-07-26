import { Input } from "../../../components/ui/input";
import { Search, Plus } from "lucide-react";
import { Button } from "../../../components/ui/button";

export default function PayrollToolbar({ totalRecords }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Payroll Runs</h2>
        <p className="text-sm text-gray-500 mt-1">
          {totalRecords !== undefined ? `Total ${totalRecords} payrolls found` : "Loading payrolls..."}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="w-full sm:w-64 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <Input 
            placeholder="Search payroll ID..." 
            aria-label="Search payrolls"
            className="pl-9"
          />
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Generate Payroll
        </Button>
      </div>
    </div>
  );
}
