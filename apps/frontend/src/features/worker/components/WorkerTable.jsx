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
import { useAuth } from "../../../hooks/useAuth";
import { useTranslation } from "react-i18next";

export default function WorkerTable({ workers, loading, page, totalPages, onPageChange }) {
  const { user } = useAuth();
  const { t } = useTranslation();
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
      if (actionType === 'APPROVE' || actionType === 'REACTIVATE') status = 'APPROVED';
      else if (actionType === 'REJECT') status = 'REJECTED';
      else if (actionType === 'SUSPEND') status = 'SUSPENDED';
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
    { key: "employeeId", title: <div className="flex items-center gap-1.5 whitespace-nowrap"><Briefcase className="w-3.5 h-3.5" />{t('table.employeeId') || 'EMPLOYEE ID'}</div>, render: (row) => <span className="font-bold text-gray-900 text-sm whitespace-nowrap">{row.employeeId}</span> },
    { key: "name", title: <div className="flex items-center gap-1.5 whitespace-nowrap"><User className="w-3.5 h-3.5" />{t('table.name') || 'NAME'}</div>, render: (row) => (
      <div className="flex items-center gap-3 whitespace-nowrap">
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs shrink-0">
          {row.name.split(' ').map(n => n[0]).join('')}
        </div>
        <span className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">{row.name}</span>
      </div>
    )},
  ];

  if (user?.profileType !== "AGENCY") {
    columns.push({ key: "gender", title: <div className="flex items-center gap-1.5 whitespace-nowrap">{t('table.gender') || 'GENDER'}</div>, render: (row) => <span className="text-sm text-gray-600 capitalize whitespace-nowrap">{row.gender && row.gender !== "—" ? row.gender : "-"}</span> });
    if (user?.profileType !== "SUPER_ADMIN") {
      columns.push({ key: "agency", title: <div className="flex items-center gap-1.5 whitespace-nowrap"><Building className="w-3.5 h-3.5" />{t('table.agency') || 'AGENCY'}</div>, render: (row) => <span className="text-sm text-gray-600 whitespace-nowrap">{row.agency}</span> });
    }
  } else {
    // Agency specific columns
    columns.push({
      key: "availability",
      title: <div className="flex items-center gap-1.5 whitespace-nowrap">{t('table.availability') || 'AVAILABILITY'}</div>,
      render: (row) => {
        const getAvailabilityBadge = (status) => {
          switch(status) {
            case 'Available': return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">Available</span>;
            case 'Busy': return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200 whitespace-nowrap">Busy</span>;
            case 'On Leave': return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200 whitespace-nowrap">On Leave</span>;
            case 'Offline': return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200 whitespace-nowrap">Offline</span>;
            default: return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200 whitespace-nowrap">{status}</span>;
          }
        };
        return getAvailabilityBadge(row.availability);
      }
    });

    columns.push({
      key: "performance",
      title: <div className="flex items-center gap-1.5 whitespace-nowrap">{t('table.performance') || 'PERFORMANCE'}</div>,
      render: (row) => (
        <div className="flex flex-col gap-1 w-44 whitespace-nowrap">
          <div className="flex items-center justify-between text-[11px] text-gray-600">
            <span>Attd: <span className="font-semibold text-gray-900">{row.performance?.attendance}%</span></span>
            <span className="flex items-center gap-0.5"><Star className="w-3 h-3 text-yellow-500 fill-yellow-500"/> {row.performance?.rating}</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-gray-600">
            <span>Jobs: <span className="font-semibold text-gray-900">{row.performance?.completedJobs}</span></span>
            <span>Cmp: <span className="font-semibold text-red-600">{row.performance?.complaints}</span></span>
          </div>
          <div className="text-[10px] text-gray-500 mt-0.5">Exp: {row.performance?.experience} Yrs</div>
        </div>
      )
    });
  }

  columns.push({ key: "phone", title: <div className="flex items-center gap-1.5 whitespace-nowrap"><Phone className="w-3.5 h-3.5" />{t('table.phone') || 'PHONE'}</div>, render: (row) => <span className="text-sm text-gray-600 whitespace-nowrap">{row.phone}</span> });
  columns.push({ key: "primarySkill", title: <div className="flex items-center gap-1.5 whitespace-nowrap"><Star className="w-3.5 h-3.5" />{t('table.primarySkill') || 'PRIMARY SKILL'}</div>, render: (row) => <span className="text-sm text-gray-600 whitespace-nowrap">{row.primarySkill}</span> });
  columns.push({ 
    key: "status", 
    title: <div className="whitespace-nowrap">{t('table.status') || "STATUS"}</div>, 
    render: (row) => <div className="whitespace-nowrap"><WorkerStatusBadge status={row.status} /></div> 
  });
  columns.push({
      key: "actions",
      title: <div className="flex items-center gap-1.5 whitespace-nowrap"><Settings className="w-3.5 h-3.5" />{t('table.actions') || 'ACTIONS'}</div>,
      render: (row) => (
        <div className="flex items-center gap-3 text-sm font-semibold relative whitespace-nowrap">
          <Link to={`/workers/${row.id}`} className="text-blue-600 hover:text-blue-800 transition-colors whitespace-nowrap">
            View Details
          </Link>
          <div className="relative group">
            <button className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded focus:outline-none">
              <MoreVertical className="w-4 h-4" />
            </button>
            <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 flex flex-col">
              {user?.profileType === "AGENCY" ? (
                <>
                  <button onClick={() => { setActionType('SUSPEND'); toast.success("Agency suspended worker"); }} className="text-left px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 w-full transition-colors">Suspend Worker</button>
                  <button onClick={() => toast.success("Worker removed from agency")} className="text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full transition-colors">Remove Worker</button>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
      )
    }
  );

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm flex flex-col h-full">
      <div className="flex-1 overflow-x-auto overflow-y-auto min-h-[300px]">
        <div className="min-w-[800px]">
          <DataTable 
            columns={columns} 
            data={workers || []} 
            loading={loading}
            rowKey="id" 
            hover 
          />
        </div>
      </div>
      {workers && workers.length > 0 && (
        <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white flex-shrink-0">
          <span className="text-sm text-gray-500 font-medium">Showing 1 to {workers.length} of {workers.length} workers</span>
          <Pagination 
            currentPage={page}
            totalPages={totalPages}
            onPageChange={onPageChange || ((p) => console.log("Page changed to:", p))}
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
