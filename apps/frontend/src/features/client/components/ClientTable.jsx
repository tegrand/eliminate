import { useState } from "react";
import { Eye, Ban, PlayCircle } from "lucide-react";
import { DataTable } from "../../../components/ui/data-table";
import { Pagination } from "../../../components/ui/pagination";
import ClientStatusBadge from "./ClientStatusBadge";
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

  const columns = [
    { key: "id", title: "Client Code", render: (row) => <span className="font-medium text-gray-900">{row.id}</span> },
    { key: "companyName", title: "Company Name", render: (row) => row.companyName },
    { key: "contactPerson", title: "Contact Person", render: (row) => row.contactPerson },
    { key: "phone", title: "Phone", render: (row) => row.phone },
    { key: "location", title: "Location", render: (row) => row.location },
    { 
      key: "status", 
      title: "Status", 
      render: (row) => <ClientStatusBadge status={row.status} /> 
    },
    {
      key: "actions",
      title: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          {row.status === 'ACTIVE' && (
            <button onClick={() => handleAction(row, 'SUSPEND')} className="p-1 text-gray-400 hover:text-orange-600 focus:outline-none" aria-label="Suspend" title="Suspend">
              <Ban className="h-4 w-4" />
            </button>
          )}
          {row.status === 'SUSPENDED' && (
            <button onClick={() => handleAction(row, 'REACTIVATE')} className="p-1 text-gray-400 hover:text-green-600 focus:outline-none" aria-label="Reactivate" title="Reactivate">
              <PlayCircle className="h-4 w-4" />
            </button>
          )}
          <Link to={`/clients/${row.id}`} className="p-1 text-gray-400 hover:text-blue-600 focus:outline-none" aria-label="View Details" title="View Details">
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
        data={clients || []} 
        loading={loading}
        rowKey="id" 
        hover 
      />
      {clients && clients.length > 0 && (
        <div className="p-4 border-t border-gray-100 flex justify-end bg-gray-50/50">
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
