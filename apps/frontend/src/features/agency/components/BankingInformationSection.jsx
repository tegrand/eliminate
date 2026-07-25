import { Input } from "../../../components/ui/input";
import { Card, CardContent } from "../../../components/ui/card";
import { Landmark } from "lucide-react";

export default function BankingInformationSection({ register, errors }) {
  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Landmark className="h-5 w-5 text-blue-500" />
          Banking Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input 
            label="Bank Name" 
            placeholder="e.g. Chase Bank" 
            error={errors.bankName?.message}
            {...register("bankName")} 
          />
          <Input 
            label="Account Number" 
            placeholder="XXXX-XXXX-XXXX" 
            error={errors.accountNumber?.message}
            {...register("accountNumber")} 
          />
          <Input 
            label="IFSC / Routing Code" 
            placeholder="e.g. ABCD0123456" 
            error={errors.ifscCode?.message}
            {...register("ifscCode")} 
          />
        </div>
      </CardContent>
    </Card>
  );
}
