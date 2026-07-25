import { Input } from "../../../components/ui/input";
import { Card, CardContent } from "../../../components/ui/card";
import { FileText } from "lucide-react";

export default function NotesSection({ register, errors }) {
  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-500" />
          Additional Notes
        </h3>
        
        <div className="w-full">
          <Input 
            label="Internal Notes" 
            placeholder="Any specific client requirements..." 
            error={errors.notes?.message}
            {...register("notes")} 
          />
        </div>
      </CardContent>
    </Card>
  );
}
