import { Input } from "../../../components/ui/input";
import { Card, CardContent } from "../../../components/ui/card";
import { MapPin } from "lucide-react";

export default function AddressSection({ register, errors }) {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-500" />
          Location Details
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
