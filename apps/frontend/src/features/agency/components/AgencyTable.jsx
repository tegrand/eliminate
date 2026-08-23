import { useState } from "react";
import { Eye, CreditCard, Building, User, Phone, Mail, MapPin, Users, Star, Ban, PlayCircle, Settings, MoreVertical } from "lucide-react";
import { DataTable } from "../../../components/ui/data-table";
import { Pagination } from "../../../components/ui/pagination";
import { Link } from "react-router-dom";
import AgencyStatusBadge from "./AgencyStatusBadge";
import ApproveDialog from "../../../components/ui/action-dialogs/ApproveDialog";
import RejectDialog from "../../../components/ui/action-dialogs/RejectDialog";
import SuspendDialog from "../../../components/ui/action-dialogs/SuspendDialog";
import ReactivateDialog from "../../../components/ui/action-dialogs/ReactivateDialog";
import { useQueryClient } from "@tanstack/react-query";
import { agencyApi } from "../api/agency.api";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export default function AgencyTable({ agencies, loading, page, totalPages, onPageChange }) {
  const { t } = useTranslation();
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

  const queryClient = useQueryClient();

  const handleConfirmAction = async (reasonOrNote) => {
    try {
      let status = actionType;
      if (actionType === 'REACTIVATE') status = 'APPROVED';
      if (actionType === 'APPROVE') status = 'APPROVED';
      if (actionType === 'REJECT') status = 'REJECTED';
      if (actionType === 'SUSPEND') status = 'SUSPENDED';
      
      await agencyApi.updateAgencyStatus(selectedAgency.id, status);
      
      const actionPastTense = actionType === 'REACTIVATE' ? 'reactivated' : 
                              actionType === 'APPROVE' ? 'approved' : 
                              actionType === 'REJECT' ? 'rejected' : 'suspended';
                              
      toast.success(`Agency ${actionPastTense} successfully.`);
      queryClient.invalidateQueries({ queryKey: ["agencies"] });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update status");
    } finally {
      closeDialog();
    }
  };



  const getFullUrl = (url) => {
    if (!url) return null;
    return url.startsWith('http') ? url : `http://localhost:5000${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const columns = [
    { key: "checkbox", title: <input type="checkbox" className="rounded border-gray-300" />, render: () => <input type="checkbox" className="rounded border-gray-300" /> },
    { 
      key: "agencyName", 
      title: <div className="flex items-center gap-1.5 whitespace-nowrap"><Building className="w-3.5 h-3.5" />{t('table.agencyName') || 'AGENCY NAME'}</div>, 
      render: (row) => (
        <div className="flex items-center gap-3 whitespace-nowrap">
          {row.logoUrl ? (
            <img src={getFullUrl(row.logoUrl)} alt="Logo" className="w-8 h-8 rounded bg-gray-100 object-cover border border-gray-200 shrink-0" />
          ) : (
            <div className="w-8 h-8 rounded bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
              <span className="text-indigo-600 font-bold text-xs">{(row.agencyName || row.name || "A").charAt(0).toUpperCase()}</span>
            </div>
          )}
          <span className="text-gray-900 text-sm font-bold truncate max-w-[200px]">{row.agencyName || row.name || "—"}</span>
        </div>
      ) 
    },
    { key: "contactPerson", title: <div className="flex items-center gap-1.5 whitespace-nowrap"><User className="w-3.5 h-3.5" />{t('table.contactPerson') || 'CONTACT PERSON'}</div>, render: (row) => <span className="text-sm text-gray-600 whitespace-nowrap">{row.contactPerson}</span> },
    { key: "phone", title: <div className="flex items-center gap-1.5 whitespace-nowrap"><Phone className="w-3.5 h-3.5" />{t('table.phone') || 'PHONE'}</div>, render: (row) => <span className="text-sm text-gray-600 whitespace-nowrap">{row.phone || "—"}</span> },
    { key: "email", title: <div className="flex items-center gap-1.5 whitespace-nowrap"><Mail className="w-3.5 h-3.5" />{t('table.email') || 'EMAIL'}</div>, render: (row) => <span className="text-sm text-gray-600 whitespace-nowrap">{row.email || "—"}</span> },
    { key: "location", title: <div className="flex items-center gap-1.5 whitespace-nowrap"><MapPin className="w-3.5 h-3.5" />{t('table.location') || 'LOCATION'}</div>, render: (row) => <span className="text-sm text-gray-600 whitespace-nowrap">{row.location}</span> },
    { key: "totalWorkers", title: <div className="flex items-center gap-1.5 whitespace-nowrap"><Users className="w-3.5 h-3.5" />{t('table.workers') || 'WORKERS'}</div>, render: (row) => <span className="text-sm text-gray-600 font-medium whitespace-nowrap">{row.totalWorkers || row._count?.workers || 0}</span> },
    { 
      key: "status", 
      title: <div className="flex items-center gap-1.5 whitespace-nowrap"><Star className="w-3.5 h-3.5" />{t('table.status') || 'STATUS'}</div>, 
      render: (row) => <div className="whitespace-nowrap"><AgencyStatusBadge status={row.status} /></div>
    },
    {
      key: "actions",
      title: <div className="flex items-center gap-1.5 whitespace-nowrap"><Settings className="w-3.5 h-3.5" />{t('table.actions') || 'ACTIONS'}</div>,
      render: (row) => (
        <div className="flex items-center gap-3 text-sm font-semibold relative whitespace-nowrap">
          <Link to={`/agencies/${row.id}`} className="text-blue-600 hover:text-blue-800 transition-colors whitespace-nowrap">
            View Details
          </Link>
          <div className="relative group">
            <button className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded focus:outline-none">
              <MoreVertical className="w-4 h-4" />
            </button>
            <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 flex flex-col">
              {row.status === 'PENDING' && (
                <>
                  <button onClick={() => handleAction(row, 'APPROVE')} className="text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 w-full transition-colors">Approve</button>
                  <button onClick={() => handleAction(row, 'REJECT')} className="text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full transition-colors">Reject</button>
                </>
              )}
              {row.status === 'APPROVED' && (
                <button onClick={() => handleAction(row, 'SUSPEND')} className="text-left px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 w-full transition-colors">Suspend</button>
              )}
              {row.status === 'SUSPENDED' && (
                <button onClick={() => handleAction(row, 'REACTIVATE')} className="text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 w-full transition-colors">Reactivate</button>
              )}
              {row.status === 'REJECTED' && (
                <div className="px-4 py-2 text-sm text-gray-400 italic text-center">No actions</div>
              )}
            </div>
          </div>
        </div>
      )
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm flex flex-col h-full">
      <div className="flex-1 overflow-x-auto overflow-y-auto min-h-[300px]">
        <div className="min-w-[800px]">
          <DataTable 
            columns={columns} 
            data={agencies || []} 
            loading={loading}
            rowKey="id" 
            hover 
            compact
          />
        </div>
      </div>
      {agencies && agencies.length > 0 && (
        <div className="p-3 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white flex-shrink-0">
          <span className="text-[13px] text-gray-500 font-medium">Showing 1 to {agencies.length} of {agencies.length} agencies</span>
          <Pagination 
            currentPage={page}
            totalPages={totalPages}
            onPageChange={onPageChange || ((p) => console.log("Page changed to:", p))}
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
