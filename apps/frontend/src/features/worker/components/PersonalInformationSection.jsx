import { Input } from "../../../components/ui/input";
import { Select } from "../../../components/ui/select";
import { Card, CardContent } from "../../../components/ui/card";
import { UserCircle } from "lucide-react";

export default function PersonalInformationSection({ register, errors }) {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <UserCircle className="h-5 w-5 text-blue-500" />
          Personal Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Input 
            label="Employee ID" 
            placeholder="e.g. W-1001" 
            error={errors.employeeId?.message}
            {...register("employeeId")} 
          />
          <Input 
            label="First Name" 
            placeholder="John" 
            error={errors.firstName?.message}
            {...register("firstName")} 
          />
          <Input 
            label="Last Name" 
            placeholder="Doe" 
            error={errors.lastName?.message}
            {...register("lastName")} 
          />
          <Select 
            label="Gender" 
            error={errors.gender?.message}
            options={[
              { value: "MALE", label: "Male" },
              { value: "FEMALE", label: "Female" },
              { value: "OTHER", label: "Other" }
            ]}
            {...register("gender")}
          />
          <Input 
            label="Date of Birth" 
            type="date" 
            error={errors.dateOfBirth?.message}
            {...register("dateOfBirth")} 
          />
          <Input 
            label="Address" 
            placeholder="123 Main St, City, Country" 
            error={errors.addressLine1?.message}
            {...register("addressLine1")} 
          />
          
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-700 mb-2">Profile Photo</span>
            <div className="flex items-center justify-center w-full h-10 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-gray-400 text-sm">
              Upload Photo (Placeholder)
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
