import { Eye, Edit, Trash2, Users } from "lucide-react";
import { DataTable } from "../../../components/ui/data-table";
import { Pagination } from "../../../components/ui/pagination";
import JobRequirementStatusBadge from "./JobRequirementStatusBadge";
import { Badge } from "../../../components/ui/badge";

export default function JobRequirementTable({ requirements, loading, page, totalPages }) {
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
      render: () => (
        <div className="flex items-center gap-2">
          <button className="p-1 text-gray-400 hover:text-blue-600 focus:outline-none" aria-label="View">
            <Eye className="h-4 w-4" />
          </button>
          <button className="p-1 text-gray-400 hover:text-green-600 focus:outline-none" aria-label="Edit">
            <Edit className="h-4 w-4" />
          </button>
          <button className="p-1 text-gray-400 hover:text-indigo-600 focus:outline-none" aria-label="Assign Workers" title="Assign Workers">
            <Users className="h-4 w-4" />
          </button>
          <button className="p-1 text-gray-400 hover:text-red-600 focus:outline-none" aria-label="Delete">
            <Trash2 className="h-4 w-4" />
          </button>
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
