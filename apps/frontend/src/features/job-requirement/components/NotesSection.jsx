import { Textarea } from "../../../components/ui/textarea";
import { Card, CardContent } from "../../../components/ui/card";
import { StickyNote } from "lucide-react";

export default function NotesSection({ register, errors }) {
  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <StickyNote className="h-5 w-5 text-blue-500" />
          Internal Notes
        </h3>
        
        <div className="grid grid-cols-1 gap-6">
          <Textarea 
            label="Additional Notes (Optional)" 
            placeholder="Any internal notes or special requests from the client..." 
            rows={3}
            error={errors.notes?.message}
            {...register("notes")} 
          />
        </div>
      </CardContent>
    </Card>
  );
}
