import { Card, CardContent } from "../../../components/ui/card";
import WorkerStatusBadge from "./WorkerStatusBadge";
import { UserCircle, MapPin, Phone, Mail } from "lucide-react";

export default function WorkerProfileCard({ worker }) {
  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <div className="h-24 w-24 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
            <UserCircle className="h-16 w-16" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">{worker.firstName} {worker.lastName}</h2>
          <p className="text-sm text-gray-500 mb-4">{worker.employeeId}</p>
          <WorkerStatusBadge status={worker.status} />
        </div>
        
        <div className="mt-8 space-y-4">
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="h-4 w-4 mr-3 text-gray-400" />
            {worker.phone}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Mail className="h-4 w-4 mr-3 text-gray-400" />
            {worker.email || "No email provided"}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-3 text-gray-400" />
            {worker.city}, {worker.state}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
