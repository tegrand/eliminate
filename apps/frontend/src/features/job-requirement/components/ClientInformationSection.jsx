import { Select } from "../../../components/ui/select";
import { Card, CardContent } from "../../../components/ui/card";
import { Building2 } from "lucide-react";

export default function ClientInformationSection({ register, errors }) {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Building2 className="h-5 w-5 text-blue-500" />
          Client Details
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select 
            label="Client" 
            error={errors.clientId?.message}
            {...register("clientId")}
          >
            <option value="">Select Client</option>
            <option value="C-001">TechCorp Inc</option>
            <option value="C-002">Global Logistics</option>
          </Select>
          
          <Select 
            label="Contact Person (Optional)" 
            error={errors.contactPersonId?.message}
            {...register("contactPersonId")}
          >
            <option value="">Select Contact</option>
            <option value="CP-001">Jane Doe</option>
            <option value="CP-002">John Smith</option>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
