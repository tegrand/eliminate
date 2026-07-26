import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Card, CardContent } from "../../../components/ui/card";
import { FileText } from "lucide-react";

export default function RequirementDetailsSection({ register, errors }) {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-500" />
          Requirement Details
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input 
            type="number"
            min="1"
            label="Number of Required Workers" 
            placeholder="e.g. 5" 
            error={errors.requiredWorkers?.message}
            {...register("requiredWorkers")} 
          />
          <div className="md:col-span-2">
            <Textarea 
              label="Job Description" 
              placeholder="Describe the responsibilities and daily tasks..." 
              rows={4}
              error={errors.jobDescription?.message}
              {...register("jobDescription")} 
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
