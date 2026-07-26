import { Card, CardContent } from "../../../components/ui/card";
import { PhoneCall } from "lucide-react";

export default function WorkerEmergencyContactCard({ worker }) {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-100 pb-2 flex items-center gap-2">
          <PhoneCall className="h-5 w-5 text-red-500" />
          Emergency Contact
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-500 mb-1">Contact Name</span>
            <span className="text-sm text-gray-900">{worker.emergencyContactName || "-"}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-500 mb-1">Relationship</span>
            <span className="text-sm text-gray-900">{worker.emergencyRelationship || "-"}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-500 mb-1">Contact Number</span>
            <span className="text-sm text-gray-900">{worker.emergencyContactNumber || "-"}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
