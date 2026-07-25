import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle, XCircle, Ban, PlayCircle } from "lucide-react";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import toast from "react-hot-toast";
import AgencyStatusBadge from "../components/AgencyStatusBadge";

import ApproveDialog from "../../../components/ui/action-dialogs/ApproveDialog";
import RejectDialog from "../../../components/ui/action-dialogs/RejectDialog";
import SuspendDialog from "../../../components/ui/action-dialogs/SuspendDialog";
import ReactivateDialog from "../../../components/ui/action-dialogs/ReactivateDialog";
import AuditLogTimeline from "../../../components/ui/audit-log/AuditLogTimeline";

export default function AgencyDetailsPage() {
  const { id } = useParams();
  const [actionType, setActionType] = useState(null);

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

  const logs = [
    { id: 1, title: "Agency Registered (Pending)", action: "REGISTERED", timestamp: "2026-10-24T10:00:00Z", performedBy: "Jane Doe" }
  ];

  const handleAction = (type) => setActionType(type);
  const closeDialog = () => setActionType(null);
  const handleConfirmAction = (reason) => {
    toast.success(`Agency ${actionType.toLowerCase()}d successfully.`);
    closeDialog();
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
        
        <div className="flex items-center gap-3">
          {agency.status === 'PENDING' && (
            <>
              <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleAction('REJECT')}>
                <XCircle className="mr-2 h-4 w-4" /> Reject
              </Button>
              <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleAction('APPROVE')}>
                <CheckCircle className="mr-2 h-4 w-4" /> Approve
              </Button>
            </>
          )}
          {agency.status === 'APPROVED' && (
            <Button variant="outline" className="text-orange-600 border-orange-200 hover:bg-orange-50" onClick={() => handleAction('SUSPEND')}>
              <Ban className="mr-2 h-4 w-4" /> Suspend
            </Button>
          )}
          {agency.status === 'SUSPENDED' && (
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
              <CardTitle>Approval Timeline & Audit Log</CardTitle>
            </CardHeader>
            <CardContent>
              <AuditLogTimeline logs={logs} />
            </CardContent>
          </Card>
        </div>
      </div>

      {actionType === 'APPROVE' && <ApproveDialog isOpen={true} onClose={closeDialog} onConfirm={handleConfirmAction} entityName={agency.agencyName} />}
      {actionType === 'REJECT' && <RejectDialog isOpen={true} onClose={closeDialog} onConfirm={handleConfirmAction} entityName={agency.agencyName} />}
      {actionType === 'SUSPEND' && <SuspendDialog isOpen={true} onClose={closeDialog} onConfirm={handleConfirmAction} entityName={agency.agencyName} />}
      {actionType === 'REACTIVATE' && <ReactivateDialog isOpen={true} onClose={closeDialog} onConfirm={handleConfirmAction} entityName={agency.agencyName} />}
    </div>
  );
}
