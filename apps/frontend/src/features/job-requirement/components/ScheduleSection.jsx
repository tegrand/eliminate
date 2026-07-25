import { Input } from "../../../components/ui/input";
import { Card, CardContent } from "../../../components/ui/card";
import { CalendarDays } from "lucide-react";

export default function ScheduleSection({ register, errors }) {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-blue-500" />
          Schedule Details
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Input 
            type="date"
            label="Start Date" 
            error={errors.startDate?.message}
            {...register("startDate")} 
          />
          <Input 
            type="date"
            label="End Date (Optional)" 
            error={errors.endDate?.message}
            {...register("endDate")} 
          />
          <Input 
            label="Working Hours (Optional)" 
            placeholder="e.g. 9:00 AM - 5:00 PM" 
            error={errors.workingHours?.message}
            {...register("workingHours")} 
          />
        </div>
      </CardContent>
    </Card>
  );
}
