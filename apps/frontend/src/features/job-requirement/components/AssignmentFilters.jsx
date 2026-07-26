import { Input } from "../../../components/ui/input";
import { Select } from "../../../components/ui/select";
import { Card, CardContent } from "../../../components/ui/card";
import { Search, Filter } from "lucide-react";

export default function AssignmentFilters() {
  return (
    <Card className="mb-6 border-gray-200">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row items-end gap-4">
          <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input 
                label="Search Worker" 
                placeholder="Name or ID..." 
                className="pl-9"
              />
            </div>
            <Select label="Skill Category">
              <option value="">All Skills</option>
              <option value="electrical">Electrical</option>
              <option value="plumbing">Plumbing</option>
              <option value="construction">Construction</option>
            </Select>
            <Select label="Agency">
              <option value="">All Agencies</option>
              <option value="agency1">Alpha Staffing</option>
              <option value="agency2">Global Temp</option>
            </Select>
            <Select label="Availability">
              <option value="">Any Status</option>
              <option value="available">Available Now</option>
              <option value="soon">Available in 7 Days</option>
            </Select>
          </div>
          <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm font-medium transition-colors w-full sm:w-auto flex items-center justify-center gap-2 border border-gray-300 shadow-sm h-[38px]">
              <Filter className="h-4 w-4" />
              More Filters
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
