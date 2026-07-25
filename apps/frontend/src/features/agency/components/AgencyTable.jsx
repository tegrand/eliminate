import { useState } from "react";
import { Eye, CreditCard, Building, User, Phone, MapPin, Users, Star, CheckCircle, XCircle, Ban, PlayCircle } from "lucide-react";
import { DataTable } from "../../../components/ui/data-table";
import { Pagination } from "../../../components/ui/pagination";
import { Link } from "react-router-dom";
import ApproveDialog from "../../../components/ui/action-dialogs/ApproveDialog";
import RejectDialog from "../../../components/ui/action-dialogs/RejectDialog";
import SuspendDialog from "../../../components/ui/action-dialogs/SuspendDialog";
import ReactivateDialog from "../../../components/ui/action-dialogs/ReactivateDialog";
import toast from "react-hot-toast";

export default function AgencyTable({ agencies, loading, page, totalPages }) {
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [actionType, setActionType] = useState(null);

  const handleAction = (agency, type) => {
    setSelectedAgency(agency);
    setActionType(type);
  };

  const closeDialog = () => {
    setSelectedAgency(null);
    setActionType(null);
  };

  const handleConfirmAction = (reasonOrNote) => {
    console.log(`Action: ${actionType} on Agency: ${selectedAgency.agencyName}, Reason/Note: ${reasonOrNote}`);
    toast.success(`Agency ${actionType.toLowerCase()}d successfully.`);
    closeDialog();
  };

  const getStatusBadge = (status) => {
    if (status === 'ACTIVE' || status === 'APPROVED') {
      return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-green-100 text-green-700"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>ACTIVE</span>;
    }
    if (status === 'ONBOARDING' || status === 'PENDING') {
      return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-orange-100 text-orange-700"><span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>{status}</span>;
    }
    return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-gray-100 text-gray-700"><span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>Inactive</span>;
  };

  const columns = [
    { key: "checkbox", title: <input type="checkbox" className="rounded border-gray-300" />, render: () => <input type="checkbox" className="rounded border-gray-300" /> },
    { key: "id", title: <div className="flex items-center gap-1.5"><CreditCard className="w-3.5 h-3.5" />AGENCY CODE</div>, render: (row) => <span className="font-bold text-gray-900 text-sm">{row.id}</span> },
    { key: "agencyName", title: <div className="flex items-center gap-1.5"><Building className="w-3.5 h-3.5" />AGENCY NAME</div>, render: (row) => <span className="text-gray-900 text-sm font-medium">{row.agencyName}</span> },
    { key: "contactPerson", title: <div className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" />CONTACT PERSON</div>, render: (row) => <span className="text-sm text-gray-600">{row.contactPerson}</span> },
    { key: "phone", title: <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />PHONE</div>, render: (row) => <span className="text-sm text-gray-600">{row.phone}</span> },
    { key: "district", title: <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />DISTRICT</div>, render: (row) => <span className="text-sm text-gray-600">{row.district}</span> },
    { key: "totalWorkers", title: <div className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" />TOTAL WORKERS</div>, render: (row) => <span className="text-sm text-gray-600">{row.totalWorkers}</span> },
    { 
      key: "status", 
      title: <div className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5" />STATUS</div>, 
      render: (row) => getStatusBadge(row.status)
    },
    {
      key: "actions",
      title: "ACTIONS",
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
          <Link to={`/agencies/${row.id}`} className="p-1 text-gray-400 hover:text-blue-600 focus:outline-none" aria-label="View Details" title="View Details">
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
        data={agencies || []} 
        loading={loading}
        rowKey="id" 
        hover 
      />
      {agencies && agencies.length > 0 && (
        <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-white">
          <span className="text-sm text-gray-500 font-medium">Showing 1 to {agencies.length} of {agencies.length} agencies</span>
          <Pagination 
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => console.log("Page changed to:", p)}
          />
        </div>
      )}

      {selectedAgency && actionType === 'APPROVE' && (
        <ApproveDialog isOpen={true} onClose={closeDialog} onConfirm={() => handleConfirmAction()} entityName={selectedAgency.agencyName} />
      )}
      {selectedAgency && actionType === 'REJECT' && (
        <RejectDialog isOpen={true} onClose={closeDialog} onConfirm={handleConfirmAction} entityName={selectedAgency.agencyName} />
      )}
      {selectedAgency && actionType === 'SUSPEND' && (
        <SuspendDialog isOpen={true} onClose={closeDialog} onConfirm={handleConfirmAction} entityName={selectedAgency.agencyName} />
      )}
      {selectedAgency && actionType === 'REACTIVATE' && (
        <ReactivateDialog isOpen={true} onClose={closeDialog} onConfirm={handleConfirmAction} entityName={selectedAgency.agencyName} />
      )}
    </div>
  );
}
