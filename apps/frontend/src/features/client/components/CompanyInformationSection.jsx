import { Input } from "../../../components/ui/input";
import { Select } from "../../../components/ui/select";
import { Card, CardContent } from "../../../components/ui/card";
import { Building2 } from "lucide-react";

export default function CompanyInformationSection({ register, errors }) {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Building2 className="h-5 w-5 text-blue-500" />
          Company Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Input 
            label="Company Name" 
            placeholder="e.g. Acme Corp" 
            error={errors.companyName?.message}
            {...register("companyName")} 
          />
          <Input 
            label="Industry" 
            placeholder="e.g. Logistics" 
            error={errors.industry?.message}
            {...register("industry")} 
          />
          <Select 
            label="Status" 
            error={errors.status?.message}
            {...register("status")}
          >
            <option value="">Select Status</option>
            <option value="ACTIVE">Active</option>
            <option value="ONBOARDING">Onboarding</option>
            <option value="INACTIVE">Inactive</option>
          </Select>
          <Input 
            label="Registration Number" 
            placeholder="e.g. REG123456" 
            error={errors.registrationNumber?.message}
            {...register("registrationNumber")} 
          />
          <Input 
            label="Tax ID / GSTIN" 
            placeholder="e.g. TAX987654" 
            error={errors.taxId?.message}
            {...register("taxId")} 
          />
        </div>
      </CardContent>
    </Card>
  );
}
