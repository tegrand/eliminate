import { useState } from "react";
import { Eye, CreditCard, Building, User, Phone, MapPin, Star, Ban, PlayCircle, Settings, MoreVertical } from "lucide-react";
import { DataTable } from "../../../components/ui/data-table";
import { Pagination } from "../../../components/ui/pagination";
import { Link } from "react-router-dom";
import ClientStatusBadge from "./ClientStatusBadge";
import SuspendDialog from "../../../components/ui/action-dialogs/SuspendDialog";
import ReactivateDialog from "../../../components/ui/action-dialogs/ReactivateDialog";
import { useQueryClient } from "@tanstack/react-query";
import { clientApi } from "../api/client.api";
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

  const queryClient = useQueryClient();

  const handleConfirmAction = async (reasonOrNote) => {
    try {
      let status = actionType;
      if (actionType === 'REACTIVATE') status = 'ACTIVE';
      await clientApi.updateClientStatus(selectedClient.id, status);
      toast.success(`Client ${actionType.toLowerCase()}d successfully.`);
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update status");
    } finally {
      closeDialog();
    }
  };



  const columns = [
    { key: "checkbox", title: <input type="checkbox" className="rounded border-gray-300" />, render: () => <input type="checkbox" className="rounded border-gray-300" /> },
    { key: "companyName", title: <div className="flex items-center gap-1.5"><Building className="w-3.5 h-3.5" />COMPANY / CLIENT NAME</div>, render: (row) => <span className="text-gray-900 text-sm font-bold">{row.companyName || row.name || "—"}</span> },
    { key: "contactPerson", title: <div className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" />CONTACT PERSON</div>, render: (row) => <span className="text-sm text-gray-600">{row.contactPerson}</span> },
    { key: "phone", title: <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />PHONE</div>, render: (row) => <span className="text-sm text-gray-600">{row.phone}</span> },
    { key: "location", title: <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />LOCATION</div>, render: (row) => <span className="text-sm text-gray-600">{row.location}</span> },
    { 
      key: "status", 
      title: <div className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5" />STATUS</div>, 
      render: (row) => <ClientStatusBadge status={row.status} />
    },
    {
      key: "actions",
      title: <div className="flex items-center gap-1.5"><Settings className="w-3.5 h-3.5" />ACTIONS</div>,
      render: (row) => (
        <div className="flex items-center gap-3 text-sm font-semibold relative">
          <Link to={`/clients/${row.id}`} className="text-blue-600 hover:text-blue-800 transition-colors whitespace-nowrap">
            View Details
          </Link>
          <div className="relative group">
            <button className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded focus:outline-none">
              <MoreVertical className="w-4 h-4" />
            </button>
            <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 flex flex-col">
              {row.status === 'ACTIVE' && (
                <button onClick={() => handleAction(row, 'SUSPEND')} className="text-left px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 w-full transition-colors">Suspend</button>
              )}
              {row.status === 'SUSPENDED' && (
                <button onClick={() => handleAction(row, 'REACTIVATE')} className="text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 w-full transition-colors">Reactivate</button>
              )}
            </div>
          </div>
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
