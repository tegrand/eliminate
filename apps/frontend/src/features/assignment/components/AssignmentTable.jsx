import { Settings } from "lucide-react";
import { DataTable } from "../../../components/ui/data-table";
import { Pagination } from "../../../components/ui/pagination";
import { Link } from "react-router-dom";
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
      render: (row) => (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-semibold">
          <Link to={`/assignments/${row.id}`} className="text-indigo-600 hover:text-indigo-800 transition-colors">
            View Assigned Workers
          </Link>
          <Link to={`/assignments/${row.id}`} className="text-blue-600 hover:text-blue-800 transition-colors">
            Worker Details
          </Link>
          <Link to="/attendance" className="text-emerald-600 hover:text-emerald-800 transition-colors">
            Attendance Status
          </Link>
          <Link to={`/assignments/${row.id}`} className="text-rose-600 hover:text-rose-800 transition-colors">
            Replace Worker Request
          </Link>
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
