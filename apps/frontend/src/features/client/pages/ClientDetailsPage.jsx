import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, Ban, PlayCircle } from "lucide-react";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import toast from "react-hot-toast";
import ClientStatusBadge from "../components/ClientStatusBadge";

import SuspendDialog from "../../../components/ui/action-dialogs/SuspendDialog";
import ReactivateDialog from "../../../components/ui/action-dialogs/ReactivateDialog";
import AuditLogTimeline from "../../../components/ui/audit-log/AuditLogTimeline";

export default function ClientDetailsPage() {
  const { id } = useParams();
  const [actionType, setActionType] = useState(null);

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

  const logs = [
    { id: 1, title: "Client Registered (Active)", action: "REGISTERED", timestamp: "2026-10-20T09:00:00Z", performedBy: "John Smith" }
  ];

  const handleAction = (type) => setActionType(type);
  const closeDialog = () => setActionType(null);
  const handleConfirmAction = (reason) => {
    toast.success(`Client ${actionType.toLowerCase()}d successfully.`);
    closeDialog();
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
        
        <div className="flex items-center gap-3">
          {client.status === 'ACTIVE' && (
            <Button variant="outline" className="text-orange-600 border-orange-200 hover:bg-orange-50" onClick={() => handleAction('SUSPEND')}>
              <Ban className="mr-2 h-4 w-4" /> Suspend
            </Button>
          )}
          {client.status === 'SUSPENDED' && (
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => handleAction('REACTIVATE')}>
              <PlayCircle className="mr-2 h-4 w-4" /> Reactivate
            </Button>
          )}
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
              <AuditLogTimeline logs={logs} />
            </CardContent>
          </Card>
        </div>
      </div>

      {actionType === 'SUSPEND' && <SuspendDialog isOpen={true} onClose={closeDialog} onConfirm={handleConfirmAction} entityName={client.companyName} />}
      {actionType === 'REACTIVATE' && <ReactivateDialog isOpen={true} onClose={closeDialog} onConfirm={handleConfirmAction} entityName={client.companyName} />}
    </div>
  );
}
