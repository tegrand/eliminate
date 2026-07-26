import { Input } from "../../../components/ui/input";
import { Select } from "../../../components/ui/select";
import { Card, CardContent } from "../../../components/ui/card";
import { Briefcase } from "lucide-react";

export default function GeneralInformationSection({ register, errors }) {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-blue-500" />
          General Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Input 
              label="Job Title" 
              placeholder="e.g. Senior Electrician" 
              error={errors.jobTitle?.message}
              {...register("jobTitle")} 
            />
          </div>
          <Select 
            label="Priority" 
            error={errors.priority?.message}
            {...register("priority")}
          >
            <option value="">Select Priority</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </Select>
          <Select 
            label="Status" 
            error={errors.status?.message}
            {...register("status")}
          >
            <option value="">Select Status</option>
            <option value="OPEN">Open</option>
            <option value="PENDING">Pending</option>
            <option value="FULFILLED">Fulfilled</option>
            <option value="CANCELLED">Cancelled</option>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
