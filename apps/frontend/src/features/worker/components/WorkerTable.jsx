import { useState } from "react";
import { Eye, CreditCard, Briefcase, User, Building, Wrench, Star, Phone, Settings, MoreVertical } from "lucide-react";
import { DataTable } from "../../../components/ui/data-table";
import { Pagination } from "../../../components/ui/pagination";
import { Link } from "react-router-dom";
import WorkerStatusBadge from "./WorkerStatusBadge";
import ApproveDialog from "../../../components/ui/action-dialogs/ApproveDialog";
import RejectDialog from "../../../components/ui/action-dialogs/RejectDialog";
import SuspendDialog from "../../../components/ui/action-dialogs/SuspendDialog";
import ReactivateDialog from "../../../components/ui/action-dialogs/ReactivateDialog";
import { useQueryClient } from "@tanstack/react-query";
import { workerApi } from "../api/worker.api";
import toast from "react-hot-toast";

export default function WorkerTable({ workers, loading, page, totalPages }) {
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [actionType, setActionType] = useState(null);

  const handleAction = (worker, type) => {
    setSelectedWorker(worker);
    setActionType(type);
  };

  const closeDialog = () => {
    setSelectedWorker(null);
    setActionType(null);
  };

  const queryClient = useQueryClient();

  const handleConfirmAction = async (reasonOrNote) => {
    try {
      let status = actionType;
      if (actionType === 'REACTIVATE') status = 'APPROVED';
      await workerApi.updateWorkerStatus(selectedWorker.id, status);
      toast.success(`Worker ${actionType.toLowerCase()}d successfully.`);
      queryClient.invalidateQueries({ queryKey: ["workers"] });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update status");
    } finally {
      closeDialog();
    }
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (name) => {
    const colors = ["bg-blue-100 text-blue-600", "bg-orange-100 text-orange-600", "bg-purple-100 text-purple-600", "bg-green-100 text-green-600"];
    return colors[name.length % colors.length];
  };

  const columns = [
    { key: "checkbox", title: <input type="checkbox" className="rounded border-gray-300" />, render: () => <input type="checkbox" className="rounded border-gray-300" /> },
    { key: "id", title: <div className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" />EMPLOYEE ID</div>, render: (row) => <span className="font-bold text-gray-900 text-sm">{row.id}</span> },
    { key: "name", title: <div className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" />NAME</div>, render: (row) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
          {row.name.split(' ').map(n => n[0]).join('')}
        </div>
        <span className="text-sm font-semibold text-gray-900">{row.name}</span>
      </div>
    )},
    { key: "gender", title: <div className="flex items-center gap-1.5">GENDER</div>, render: (row) => <span className="text-sm text-gray-600">-</span> },
    { key: "phone", title: <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />PHONE</div>, render: (row) => <span className="text-sm text-gray-600">{row.phone}</span> },
    { key: "agency", title: <div className="flex items-center gap-1.5"><Building className="w-3.5 h-3.5" />AGENCY</div>, render: (row) => <span className="text-sm text-gray-600">{row.agency}</span> },
    { key: "primarySkill", title: <div className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5" />PRIMARY SKILL</div>, render: (row) => <span className="text-sm text-gray-600">{row.primarySkill}</span> },
    { 
      key: "status", 
      title: "STATUS", 
      render: (row) => <WorkerStatusBadge status={row.status} /> 
    },
    {
      key: "actions",
      title: <div className="flex items-center gap-1.5"><Settings className="w-3.5 h-3.5" />ACTIONS</div>,
      render: (row) => (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-semibold">
          <Link to={`/workers/${row.id}`} className="text-blue-600 hover:text-blue-800 transition-colors">
            View Details
          </Link>
          {row.status === 'PENDING' && (
            <>
              <button onClick={() => handleAction(row, 'APPROVE')} className="text-green-600 hover:text-green-800 transition-colors">Approve</button>
              <button onClick={() => handleAction(row, 'REJECT')} className="text-red-600 hover:text-red-800 transition-colors">Reject</button>
            </>
          )}
          {row.status === 'APPROVED' && (
            <button onClick={() => handleAction(row, 'SUSPEND')} className="text-orange-600 hover:text-orange-800 transition-colors">Suspend</button>
          )}
          {row.status === 'SUSPENDED' && (
            <button onClick={() => handleAction(row, 'REACTIVATE')} className="text-blue-600 hover:text-blue-800 transition-colors">Reactivate</button>
          )}
        </div>
      )
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm flex flex-col h-full">
      <div className="flex-1 overflow-auto">
        <DataTable 
          columns={columns} 
          data={workers || []} 
          loading={loading}
          rowKey="id" 
          hover 
        />
      </div>
      {workers && workers.length > 0 && (
        <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-white flex-shrink-0">
          <span className="text-sm text-gray-500 font-medium">Showing 1 to {workers.length} of {workers.length} workers</span>
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
