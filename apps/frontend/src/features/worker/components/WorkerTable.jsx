import { useState } from "react";
import { Eye, CheckCircle, XCircle, Ban, PlayCircle } from "lucide-react";
import { DataTable } from "../../../components/ui/data-table";
import { Pagination } from "../../../components/ui/pagination";
import WorkerStatusBadge from "./WorkerStatusBadge";
import { Link } from "react-router-dom";
import ApproveDialog from "../../../components/ui/action-dialogs/ApproveDialog";
import RejectDialog from "../../../components/ui/action-dialogs/RejectDialog";
import SuspendDialog from "../../../components/ui/action-dialogs/SuspendDialog";
import ReactivateDialog from "../../../components/ui/action-dialogs/ReactivateDialog";
import toast from "react-hot-toast";

export default function WorkerTable({ workers, loading, page, totalPages }) {
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [actionType, setActionType] = useState(null); // 'APPROVE', 'REJECT', 'SUSPEND', 'REACTIVATE'

  const handleAction = (worker, type) => {
    setSelectedWorker(worker);
    setActionType(type);
  };

  const closeDialog = () => {
    setSelectedWorker(null);
    setActionType(null);
  };

  const handleConfirmAction = (reasonOrNote) => {
    // Mock API call
    console.log(`Action: ${actionType} on Worker: ${selectedWorker.name}, Reason/Note: ${reasonOrNote}`);
    toast.success(`Worker ${actionType.toLowerCase()}d successfully.`);
    closeDialog();
  };

  const columns = [
    { key: "id", title: "Employee ID", render: (row) => <span className="font-medium text-gray-900">{row.id}</span> },
    { key: "name", title: "Name", render: (row) => row.name },
    { key: "phone", title: "Phone", render: (row) => row.phone },
    { key: "agency", title: "Agency", render: (row) => row.agency },
    { key: "primarySkill", title: "Primary Skill", render: (row) => row.primarySkill },
    { 
      key: "status", 
      title: "Status", 
      render: (row) => <WorkerStatusBadge status={row.status} /> 
    },
    {
      key: "actions",
      title: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          {row.status === 'PENDING' && (
            <>
              <button onClick={() => handleAction(row, 'APPROVE')} className="p-1 text-gray-400 hover:text-green-600 focus:outline-none" aria-label="Approve" title="Approve">
                <CheckCircle className="h-4 w-4" />
              </button>
              <button onClick={() => handleAction(row, 'REJECT')} className="p-1 text-gray-400 hover:text-red-600 focus:outline-none" aria-label="Reject" title="Reject">
                <XCircle className="h-4 w-4" />
              </button>
            </>
          )}
          {row.status === 'APPROVED' && (
            <button onClick={() => handleAction(row, 'SUSPEND')} className="p-1 text-gray-400 hover:text-orange-600 focus:outline-none" aria-label="Suspend" title="Suspend">
              <Ban className="h-4 w-4" />
            </button>
          )}
          {row.status === 'SUSPENDED' && (
            <button onClick={() => handleAction(row, 'REACTIVATE')} className="p-1 text-gray-400 hover:text-green-600 focus:outline-none" aria-label="Reactivate" title="Reactivate">
              <PlayCircle className="h-4 w-4" />
            </button>
          )}
          <Link to={`/workers/${row.id}`} className="p-1 text-gray-400 hover:text-blue-600 focus:outline-none" aria-label="View Details" title="View Details">
            <Eye className="h-4 w-4" />
          </Link>
        </div>
      )
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <DataTable 
        columns={columns} 
        data={workers || []} 
        loading={loading}
        rowKey="id" 
        hover 
      />
      {workers && workers.length > 0 && (
        <div className="p-4 border-t border-gray-100 flex justify-end bg-gray-50/50">
          <Pagination 
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => console.log("Page changed to:", p)}
          />
        </div>
      )}

      {selectedWorker && actionType === 'APPROVE' && (
        <ApproveDialog isOpen={true} onClose={closeDialog} onConfirm={() => handleConfirmAction()} entityName={selectedWorker.name} />
      )}
      {selectedWorker && actionType === 'REJECT' && (
        <RejectDialog isOpen={true} onClose={closeDialog} onConfirm={handleConfirmAction} entityName={selectedWorker.name} />
      )}
      {selectedWorker && actionType === 'SUSPEND' && (
        <SuspendDialog isOpen={true} onClose={closeDialog} onConfirm={handleConfirmAction} entityName={selectedWorker.name} />
      )}
      {selectedWorker && actionType === 'REACTIVATE' && (
        <ReactivateDialog isOpen={true} onClose={closeDialog} onConfirm={handleConfirmAction} entityName={selectedWorker.name} />
      )}
    </div>
  );
}
