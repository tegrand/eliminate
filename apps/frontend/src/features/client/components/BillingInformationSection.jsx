import { Input } from "../../../components/ui/input";
import { Select } from "../../../components/ui/select";
import { Card, CardContent } from "../../../components/ui/card";
import { CreditCard } from "lucide-react";

export default function BillingInformationSection({ register, errors }) {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-blue-500" />
          Billing Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Select 
            label="Billing Cycle" 
            error={errors.billingCycle?.message}
            {...register("billingCycle")}
          >
            <option value="">Select Cycle</option>
            <option value="WEEKLY">Weekly</option>
            <option value="BI_WEEKLY">Bi-Weekly</option>
            <option value="MONTHLY">Monthly</option>
          </Select>
          
          <Select 
            label="Payment Terms" 
            error={errors.paymentTerms?.message}
            {...register("paymentTerms")}
          >
            <option value="">Select Terms</option>
            <option value="NET_15">Net 15</option>
            <option value="NET_30">Net 30</option>
            <option value="NET_60">Net 60</option>
          </Select>
          
          <div className="lg:col-span-3">
            <Input 
              label="Billing Address (If different)" 
              placeholder="456 Finance Blvd" 
              error={errors.billingAddress?.message}
              {...register("billingAddress")} 
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
