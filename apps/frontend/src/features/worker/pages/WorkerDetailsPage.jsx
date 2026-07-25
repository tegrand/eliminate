import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, XCircle, Ban, PlayCircle } from "lucide-react";
import { useState } from "react";
import { useWorker } from "../hooks/useWorker";
import { Skeleton } from "../../../components/ui/skeleton";
import { Button } from "../../../components/ui/button";
import toast from "react-hot-toast";

import WorkerProfileCard from "../components/WorkerProfileCard";
import WorkerInformationCard from "../components/WorkerInformationCard";
import WorkerSkillCard from "../components/WorkerSkillCard";
import WorkerEmergencyContactCard from "../components/WorkerEmergencyContactCard";
import WorkerTimelineCard from "../components/WorkerTimelineCard";

import ApproveDialog from "../../../components/ui/action-dialogs/ApproveDialog";
import RejectDialog from "../../../components/ui/action-dialogs/RejectDialog";
import SuspendDialog from "../../../components/ui/action-dialogs/SuspendDialog";
import ReactivateDialog from "../../../components/ui/action-dialogs/ReactivateDialog";

export default function WorkerDetailsPage() {
  const { workerId } = useParams();
  const navigate = useNavigate();
  const { data: worker, isLoading, isError } = useWorker(workerId);

  const [actionType, setActionType] = useState(null);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-6 w-96" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <Skeleton className="h-96 w-full" />
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !worker) {
    return (
      <div className="max-w-5xl mx-auto py-16 px-4 text-center">
        <h2 className="text-xl font-bold text-red-600">Failed to load worker</h2>
        <p className="text-gray-500 mt-2">The worker data could not be found or loaded.</p>
        <Button className="mt-6" onClick={() => navigate("/workers")}>Back to Workers</Button>
      </div>
    );
  }

  const handleAction = (type) => setActionType(type);
  const closeDialog = () => setActionType(null);
  const handleConfirmAction = (reason) => {
    toast.success(`Worker ${actionType.toLowerCase()}d successfully.`);
    closeDialog();
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <Link 
            to="/workers" 
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Workers
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Worker Details</h1>
        </div>
        
        <div className="flex items-center gap-3">
          {worker.status === 'PENDING' && (
            <>
              <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleAction('REJECT')}>
                <XCircle className="mr-2 h-4 w-4" /> Reject
              </Button>
              <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleAction('APPROVE')}>
                <CheckCircle className="mr-2 h-4 w-4" /> Approve
              </Button>
            </>
          )}
          {worker.status === 'APPROVED' && (
            <Button variant="outline" className="text-orange-600 border-orange-200 hover:bg-orange-50" onClick={() => handleAction('SUSPEND')}>
              <Ban className="mr-2 h-4 w-4" /> Suspend
            </Button>
          )}
          {worker.status === 'SUSPENDED' && (
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => handleAction('REACTIVATE')}>
              <PlayCircle className="mr-2 h-4 w-4" /> Reactivate
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <WorkerProfileCard worker={worker} />
          <WorkerSkillCard worker={worker} />
        </div>
        
        <div className="lg:col-span-2 space-y-6">
          <WorkerInformationCard worker={worker} />
          <WorkerEmergencyContactCard worker={worker} />
          <WorkerTimelineCard />
        </div>
      </div>

      {actionType === 'APPROVE' && <ApproveDialog isOpen={true} onClose={closeDialog} onConfirm={handleConfirmAction} entityName={worker.name} />}
      {actionType === 'REJECT' && <RejectDialog isOpen={true} onClose={closeDialog} onConfirm={handleConfirmAction} entityName={worker.name} />}
      {actionType === 'SUSPEND' && <SuspendDialog isOpen={true} onClose={closeDialog} onConfirm={handleConfirmAction} entityName={worker.name} />}
      {actionType === 'REACTIVATE' && <ReactivateDialog isOpen={true} onClose={closeDialog} onConfirm={handleConfirmAction} entityName={worker.name} />}
    </div>
  );
}
