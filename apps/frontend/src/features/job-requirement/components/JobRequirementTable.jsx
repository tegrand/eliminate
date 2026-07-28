import { Eye, Edit, Trash2, Users } from "lucide-react";
import { DataTable } from "../../../components/ui/data-table";
import { Pagination } from "../../../components/ui/pagination";
import JobRequirementStatusBadge from "./JobRequirementStatusBadge";
import { Badge } from "../../../components/ui/badge";

export default function JobRequirementTable({ requirements, loading, page, totalPages, onEdit, onDuplicate, onCancel, onClose, onReopen, onArchive }) {
  const columns = [
    { key: "id", title: "Requirement ID", render: (row) => <span className="font-medium text-gray-900">{row.id}</span> },
    { key: "client", title: "Client", render: (row) => row.client },
    { key: "jobTitle", title: "Job Title", render: (row) => row.jobTitle },
    { 
      key: "fulfillment", 
      title: "Fulfillment", 
      render: (row) => (
        <div className="flex items-center gap-1">
          <span className="font-medium">{row.assignedWorkers}</span>
          <span className="text-gray-400">/</span>
          <span>{row.requiredWorkers}</span>
        </div>
      ) 
    },
    { key: "startDate", title: "Start Date", render: (row) => row.startDate },
    { key: "endDate", title: "End Date", render: (row) => row.endDate },
    { 
      key: "priority", 
      title: "Priority", 
      render: (row) => {
        let color = "default";
        if (row.priority === "CRITICAL" || row.priority === "HIGH") color = "error";
        if (row.priority === "MEDIUM") color = "warning";
        return <Badge variant={color}>{row.priority}</Badge>;
      } 
    },
    { 
      key: "status", 
      title: "Status", 
      render: (row) => <JobRequirementStatusBadge status={row.status} /> 
    },
    {
      key: "actions",
      title: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onEdit && onEdit(row)}
            className="p-1 text-gray-400 hover:text-green-600 focus:outline-none" 
            aria-label="Edit"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
          
          <button 
            onClick={() => onDuplicate && onDuplicate(row)}
            className="p-1 text-gray-400 hover:text-blue-600 focus:outline-none" 
            aria-label="Duplicate" 
            title="Duplicate"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
          </button>

          {(row.status === "OPEN" || row.status === "DRAFT" || row.status === "PARTIALLY_FILLED") && (
            <button 
              onClick={() => onClose && onClose(row)}
              className="p-1 text-gray-400 hover:text-yellow-600 focus:outline-none" 
              aria-label="Close" 
              title="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </button>
          )}

          {(row.status === "OPEN" || row.status === "DRAFT" || row.status === "PARTIALLY_FILLED" || row.status === "FILLED") && (
            <button 
              onClick={() => onCancel && onCancel(row)}
              className="p-1 text-gray-400 hover:text-red-600 focus:outline-none" 
              aria-label="Cancel" 
              title="Cancel"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x-circle"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
            </button>
          )}

          {(row.status === "CANCELLED" || row.status === "COMPLETED") && (
            <button 
              onClick={() => onReopen && onReopen(row)}
              className="p-1 text-gray-400 hover:text-green-600 focus:outline-none" 
              aria-label="Reopen" 
              title="Reopen"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-refresh-cw"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            </button>
          )}

          {(row.status === "DRAFT" || row.status === "OPEN") && (
            <button 
              onClick={() => onArchive && onArchive(row)}
              className="p-1 text-gray-400 hover:text-red-600 focus:outline-none" 
              aria-label="Archive / Delete" 
              title="Archive / Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      )
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <DataTable 
        columns={columns} 
        data={requirements || []} 
        loading={loading}
        rowKey="id" 
        hover 
      />
      {requirements && requirements.length > 0 && (
        <div className="p-4 border-t border-gray-100 flex justify-end bg-gray-50/50">
          <Pagination 
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => console.log("Page changed to:", p)}
          />
        </div>
      )}
    </div>
  );
}
