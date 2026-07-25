import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import ClientStatusBadge from "../components/ClientStatusBadge";

export default function ClientDetailsPage() {
  const { id } = useParams();

  // Mock data for display
  const client = {
    id: id,
    companyName: "TechCorp Logistics",
    contactPerson: "John Smith",
    phone: "+1 987 654 321",
    location: "South District",
    requirementsCount: 3,
    activeWorkers: 12,
    status: "ACTIVE",
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <Link 
            to="/clients" 
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Clients
          </Link>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-gray-900">{client.companyName}</h1>
            <ClientStatusBadge status={client.status} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Contact Person</p>
                  <p className="text-gray-900">{client.contactPerson}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="text-gray-900">{client.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p className="text-gray-900">{client.location}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Active Workers</p>
                  <p className="text-gray-900">{client.activeWorkers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="mt-1 bg-green-100 p-2 rounded-full">
                  <Clock className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Account Active</p>
                  <p className="text-xs text-gray-500">Oct 20, 2023 - 09:00 AM</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
