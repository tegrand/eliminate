import { Eye, Edit, UserCog } from "lucide-react";
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
      title: "Actions",
      render: () => (
        <div className="flex items-center gap-2">
          <button className="p-1 text-gray-400 hover:text-blue-600 focus:outline-none" aria-label="View">
            <Eye className="h-4 w-4" />
          </button>
          <button className="p-1 text-gray-400 hover:text-green-600 focus:outline-none" aria-label="Edit">
            <Edit className="h-4 w-4" />
          </button>
          <button className="p-1 text-gray-400 hover:text-indigo-600 focus:outline-none" aria-label="Manage Workers" title="Manage Workers">
            <UserCog className="h-4 w-4" />
          </button>
        </div>
      )
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <DataTable 
        columns={columns} 
        data={assignments || []} 
        loading={loading}
        rowKey="id" 
        hover 
      />
      {assignments && assignments.length > 0 && (
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
