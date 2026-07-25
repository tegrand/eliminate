import { useState } from "react";
import { Eye, CreditCard, User, Building, Wrench, Star } from "lucide-react";
import { DataTable } from "../../../components/ui/data-table";
import { Pagination } from "../../../components/ui/pagination";
import { Link } from "react-router-dom";
import ApproveDialog from "../../../components/ui/action-dialogs/ApproveDialog";
import RejectDialog from "../../../components/ui/action-dialogs/RejectDialog";
import SuspendDialog from "../../../components/ui/action-dialogs/SuspendDialog";
import ReactivateDialog from "../../../components/ui/action-dialogs/ReactivateDialog";
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

  const handleConfirmAction = (reasonOrNote) => {
    console.log(`Action: ${actionType} on Worker: ${selectedWorker.name}, Reason/Note: ${reasonOrNote}`);
    toast.success(`Worker ${actionType.toLowerCase()}d successfully.`);
    closeDialog();
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (name) => {
    const colors = ["bg-blue-100 text-blue-600", "bg-orange-100 text-orange-600", "bg-purple-100 text-purple-600", "bg-green-100 text-green-600"];
    return colors[name.length % colors.length];
  };

  const getStatusBadge = (status) => {
    if (status === 'ACTIVE' || status === 'APPROVED') {
      return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-green-100 text-green-700"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>ACTIVE</span>;
    }
    if (status === 'ON_LEAVE' || status === 'PENDING') {
      return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-orange-100 text-orange-700"><span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>{status}</span>;
    }
    return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-gray-100 text-gray-700"><span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>Inactive</span>;
  };

  const columns = [
    { key: "checkbox", title: <input type="checkbox" className="rounded border-gray-300" />, render: () => <input type="checkbox" className="rounded border-gray-300" /> },
    { key: "id", title: <div className="flex items-center gap-1.5"><CreditCard className="w-3.5 h-3.5" />EMPLOYEE ID</div>, render: (row) => <span className="font-bold text-gray-900 text-sm">{row.id}</span> },
    { 
      key: "name", 
      title: <div className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" />NAME</div>, 
      render: (row) => (
        <div className="flex items-center gap-3 py-1">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${getAvatarColor(row.name)}`}>
            {getInitials(row.name)}
          </div>
          <p className="text-gray-900 text-sm font-medium">{row.name}</p>
        </div>
      )
    },
    { key: "gender", title: <div className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" />GENDER</div>, render: (row) => <span className="text-sm text-gray-600">-</span> },
    { key: "phone", title: <div className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" />PHONE</div>, render: (row) => <span className="text-sm text-gray-600">{row.phone}</span> },
    { key: "agency", title: <div className="flex items-center gap-1.5"><Building className="w-3.5 h-3.5" />AGENCY</div>, render: (row) => <span className="text-sm text-gray-600">{row.agency}</span> },
    { key: "primarySkill", title: <div className="flex items-center gap-1.5"><Wrench className="w-3.5 h-3.5" />PRIMARY SKILL</div>, render: (row) => <span className="text-sm text-gray-600">{row.primarySkill}</span> },
    { 
      key: "status", 
      title: <div className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5" />STATUS</div>, 
      render: (row) => getStatusBadge(row.status)
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
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
      <DataTable 
        columns={columns} 
        data={workers || []} 
        loading={loading}
        rowKey="id" 
        hover 
      />
      {workers && workers.length > 0 && (
        <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-white">
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
