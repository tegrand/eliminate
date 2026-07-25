import { useState } from "react";
import { Eye, CreditCard, Building, User, Phone, MapPin, Star, Ban, PlayCircle, Settings, MoreVertical } from "lucide-react";
import { DataTable } from "../../../components/ui/data-table";
import { Pagination } from "../../../components/ui/pagination";
import { Link } from "react-router-dom";
import SuspendDialog from "../../../components/ui/action-dialogs/SuspendDialog";
import ReactivateDialog from "../../../components/ui/action-dialogs/ReactivateDialog";
import toast from "react-hot-toast";

export default function ClientTable({ clients, loading, page, totalPages }) {
  const [selectedClient, setSelectedClient] = useState(null);
  const [actionType, setActionType] = useState(null);

  const handleAction = (client, type) => {
    setSelectedClient(client);
    setActionType(type);
  };

  const closeDialog = () => {
    setSelectedClient(null);
    setActionType(null);
  };

  const handleConfirmAction = (reasonOrNote) => {
    console.log(`Action: ${actionType} on Client: ${selectedClient.companyName}, Reason/Note: ${reasonOrNote}`);
    toast.success(`Client ${actionType.toLowerCase()}d successfully.`);
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
    { key: "id", title: <div className="flex items-center gap-1.5"><CreditCard className="w-3.5 h-3.5" />CLIENT CODE</div>, render: (row) => <span className="font-bold text-gray-900 text-sm">{row.id}</span> },
    { key: "companyName", title: <div className="flex items-center gap-1.5"><Building className="w-3.5 h-3.5" />COMPANY NAME</div>, render: (row) => <span className="text-gray-900 text-sm font-medium">{row.companyName}</span> },
    { key: "contactPerson", title: <div className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" />CONTACT PERSON</div>, render: (row) => <span className="text-sm text-gray-600">{row.contactPerson}</span> },
    { key: "phone", title: <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />PHONE</div>, render: (row) => <span className="text-sm text-gray-600">{row.phone}</span> },
    { key: "location", title: <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />LOCATION</div>, render: (row) => <span className="text-sm text-gray-600">{row.location}</span> },
    { 
      key: "status", 
      title: <div className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5" />STATUS</div>, 
      render: (row) => getStatusBadge(row.status)
    },
    {
      key: "actions",
      title: <div className="flex items-center gap-1.5"><Settings className="w-3.5 h-3.5" />ACTIONS</div>,
      render: (row) => (
        <div className="flex items-center gap-2">
          {row.status === 'ACTIVE' && (
            <button onClick={() => handleAction(row, 'SUSPEND')} className="p-1.5 border border-gray-200 rounded-lg text-gray-400 hover:text-orange-600 hover:border-orange-200 focus:outline-none transition-colors" aria-label="Suspend" title="Suspend">
              <Ban className="h-4 w-4" />
            </button>
          )}
          {row.status === 'SUSPENDED' && (
            <button onClick={() => handleAction(row, 'REACTIVATE')} className="p-1.5 border border-gray-200 rounded-lg text-gray-400 hover:text-green-600 hover:border-green-200 focus:outline-none transition-colors" aria-label="Reactivate" title="Reactivate">
              <PlayCircle className="h-4 w-4" />
            </button>
          )}
          <Link to={`/clients/${row.id}`} className="p-1.5 border border-gray-200 rounded-lg text-gray-400 hover:text-indigo-600 hover:border-indigo-200 focus:outline-none transition-colors" aria-label="View Details" title="View Details">
            <Eye className="h-4 w-4" />
          </Link>
          <button className="p-1.5 border border-gray-200 rounded-lg text-gray-400 hover:text-indigo-600 hover:border-indigo-200 focus:outline-none transition-colors" aria-label="More Actions" title="More Actions">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      )
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm flex flex-col h-full">
      <div className="flex-1 overflow-auto">
        <DataTable 
          columns={columns} 
          data={clients || []} 
          loading={loading}
          rowKey="id" 
          hover 
          compact
        />
      </div>
      {clients && clients.length > 0 && (
        <div className="p-3 border-t border-gray-100 flex justify-between items-center bg-white flex-shrink-0">
          <span className="text-[13px] text-gray-500 font-medium">Showing 1 to {clients.length} of {clients.length} clients</span>
          <Pagination 
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => console.log("Page changed to:", p)}
          />
        </div>
      )}

      {selectedClient && actionType === 'SUSPEND' && (
        <SuspendDialog isOpen={true} onClose={closeDialog} onConfirm={handleConfirmAction} entityName={selectedClient.companyName} />
      )}
      {selectedClient && actionType === 'REACTIVATE' && (
        <ReactivateDialog isOpen={true} onClose={closeDialog} onConfirm={handleConfirmAction} entityName={selectedClient.companyName} />
      )}
    </div>
  );
}
