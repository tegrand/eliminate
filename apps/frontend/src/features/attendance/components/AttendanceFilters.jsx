import { Select } from "../../../components/ui/select";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Filter } from "lucide-react";

export default function AttendanceFilters() {
  return (
    <div className="px-4 py-3 bg-white border-b border-gray-100 flex flex-col md:flex-row items-end gap-4">
      <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        <Input 
          type="date"
          label="Date"
          defaultValue={new Date().toISOString().split('T')[0]}
        />
        <Select label="Status">
          <option value="">All Statuses</option>
          <option value="VERIFIED">Verified</option>
          <option value="LATE">Late</option>
          <option value="ABSENT">Absent</option>
          <option value="PENDING">Pending Verification</option>
        </Select>
        <Select label="Client">
          <option value="">All Clients</option>
          <option value="techcorp">TechCorp Inc</option>
          <option value="globallogistics">Global Logistics</option>
        </Select>
        <Select label="Agency">
          <option value="">All Agencies</option>
          <option value="alpha">Alpha Staffing</option>
          <option value="beta">Beta Temp</option>
        </Select>
        <Select label="Assignment">
          <option value="">All Assignments</option>
          <option value="ASM-1001">ASM-1001</option>
          <option value="ASM-1002">ASM-1002</option>
        </Select>
      </div>
      <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
        <Button variant="outline" className="w-full sm:w-auto h-9 border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg">
          Reset
        </Button>
        <Button className="w-full sm:w-auto h-9 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">
          Apply
        </Button>
      </div>
    </div>
  );
}
