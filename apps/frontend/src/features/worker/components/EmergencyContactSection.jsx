import { Input } from "../../../components/ui/input";
import { Card, CardContent } from "../../../components/ui/card";
import { PhoneCall } from "lucide-react";

export default function EmergencyContactSection({ register, errors }) {
  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <PhoneCall className="h-5 w-5 text-blue-500" />
          Emergency Contact
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input 
            label="Contact Name" 
            placeholder="Jane Doe" 
            error={errors.emergencyContactName?.message}
            {...register("emergencyContactName")} 
          />
          <Input 
            label="Relationship" 
            placeholder="Spouse" 
            error={errors.emergencyRelationship?.message}
            {...register("emergencyRelationship")} 
          />
          <Input 
            label="Contact Number" 
            placeholder="+1 987 654 3210" 
            error={errors.emergencyContactNumber?.message}
            {...register("emergencyContactNumber")} 
          />
        </div>
      </CardContent>
    </Card>
  );
}
