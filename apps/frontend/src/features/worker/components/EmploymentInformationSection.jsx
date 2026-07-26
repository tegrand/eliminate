import { Input } from "../../../components/ui/input";
import { Select } from "../../../components/ui/select";
import { Card, CardContent } from "../../../components/ui/card";
import { Briefcase } from "lucide-react";

export default function EmploymentInformationSection({ register, errors }) {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-blue-500" />
          Employment Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Select 
            label="Agency" 
            error={errors.agency?.message}
            {...register("agency")}
          >
            <option value="">Select Agency</option>
            <option value="Alpha Staffing">Alpha Staffing</option>
            <option value="Beta Temp">Beta Temp</option>
          </Select>
          
          <Input 
            label="Joining Date" 
            type="date" 
            error={errors.joiningDate?.message}
            {...register("joiningDate")} 
          />
          
          <Select 
            label="Status" 
            error={errors.status?.message}
            {...register("status")}
          >
            <option value="">Select Status</option>
            <option value="ACTIVE">Active</option>
            <option value="ON_LEAVE">On Leave</option>
            <option value="INACTIVE">Inactive</option>
          </Select>
          
          <Input 
            label="Salary / Wage" 
            placeholder="e.g. 500 / day" 
            error={errors.salary?.message}
            {...register("salary")} 
          />
        </div>
      </CardContent>
    </Card>
  );
}
