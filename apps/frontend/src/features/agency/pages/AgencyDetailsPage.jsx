import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import AgencyStatusBadge from "../components/AgencyStatusBadge";

export default function AgencyDetailsPage() {
  const { id } = useParams();

  // Mock data for display
  const agency = {
    id: id,
    agencyName: "Alpha Staffing",
    contactPerson: "Jane Doe",
    phone: "+1 234 567 890",
    district: "North District",
    totalWorkers: 15,
    status: "PENDING",
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <Link 
            to="/agencies" 
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Agencies
          </Link>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-gray-900">{agency.agencyName}</h1>
            <AgencyStatusBadge status={agency.status} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Agency Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Contact Person</p>
                  <p className="text-gray-900">{agency.contactPerson}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="text-gray-900">{agency.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">District</p>
                  <p className="text-gray-900">{agency.district}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Workers</p>
                  <p className="text-gray-900">{agency.totalWorkers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Verification History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="mt-1 bg-blue-100 p-2 rounded-full">
                  <Clock className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Application Submitted</p>
                  <p className="text-xs text-gray-500">Oct 24, 2023 - 10:00 AM</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
