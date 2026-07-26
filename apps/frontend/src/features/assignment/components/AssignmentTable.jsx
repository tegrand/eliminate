import { Eye, Edit, UserCog, Settings, MoreVertical } from "lucide-react";
import { DataTable } from "../../../components/ui/data-table";
import { Pagination } from "../../../components/ui/pagination";
import AssignmentStatusBadge from "./AssignmentStatusBadge";

export default function AssignmentTable({ assignments, loading, page, totalPages }) {
  const columns = [
    { key: "id", title: "Assignment ID", render: (row) => <span className="font-medium text-gray-900">{row.id}</span> },
    { key: "jobRequirement", title: "Job Requirement", render: (row) => row.jobRequirement },
    { key: "client", title: "Client", render: (row) => row.client },
    { key: "assignedWorkers", title: "Assigned Workers", render: (row) => row.assignedWorkers },
    { key: "agency", title: "Agency", render: (row) => row.agency },
    { key: "startDate", title: "Start Date", render: (row) => row.startDate },
    { key: "endDate", title: "End Date", render: (row) => row.endDate },
    { 
      key: "status", 
      title: "Status", 
      render: (row) => <AssignmentStatusBadge status={row.status} /> 
    },
    {
      key: "actions",
      title: <div className="flex items-center gap-1.5"><Settings className="w-3.5 h-3.5" />ACTIONS</div>,
      render: () => (
        <div className="flex items-center gap-2">
          <button className="p-1.5 border border-gray-200 rounded-lg text-gray-400 hover:text-indigo-600 hover:border-indigo-200 focus:outline-none transition-colors" aria-label="View Details" title="View Details">
            <Eye className="h-4 w-4" />
          </button>
          <button className="p-1.5 border border-gray-200 rounded-lg text-gray-400 hover:text-indigo-600 hover:border-indigo-200 focus:outline-none transition-colors" aria-label="More Actions" title="More Actions">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      )
    },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">
      <DataTable 
        columns={columns} 
        data={assignments || []} 
        loading={loading}
        rowKey="id" 
        hover
        compact
      />
      {assignments && assignments.length > 0 && (
        <div className="p-3 border-t border-gray-100 flex justify-end bg-gray-50/50 mt-auto">
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
