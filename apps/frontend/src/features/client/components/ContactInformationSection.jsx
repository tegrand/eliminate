import { Input } from "../../../components/ui/input";
import { Card, CardContent } from "../../../components/ui/card";
import { MapPin } from "lucide-react";

export default function ContactInformationSection({ register, errors }) {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-500" />
          Primary Contact & Location
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Input 
            label="Contact Person Name" 
            placeholder="Jane Doe" 
            error={errors.contactPerson?.message}
            {...register("contactPerson")} 
          />
          <Input 
            label="Phone Number" 
            placeholder="+1 234 567 8900" 
            error={errors.phone?.message}
            {...register("phone")} 
          />
          <Input 
            label="Email Address" 
            type="email" 
            placeholder="jane@example.com" 
            error={errors.email?.message}
            {...register("email")} 
          />
          <div className="lg:col-span-3">
            <Input 
              label="Address" 
              placeholder="123 Main St" 
              error={errors.address?.message}
              {...register("address")} 
            />
          </div>
          <Input 
            label="City" 
            placeholder="City" 
            error={errors.city?.message}
            {...register("city")} 
          />
          <Input 
            label="District" 
            placeholder="District" 
            error={errors.district?.message}
            {...register("district")} 
          />
          <Input 
            label="State" 
            placeholder="State" 
            error={errors.state?.message}
            {...register("state")} 
          />
          <Input 
            label="PIN Code" 
            placeholder="123456" 
            error={errors.pinCode?.message}
            {...register("pinCode")} 
          />
        </div>
      </CardContent>
    </Card>
  );
}
