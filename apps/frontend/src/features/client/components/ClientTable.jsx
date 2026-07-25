import { Eye, Edit, Trash2 } from "lucide-react";
import { DataTable } from "../../../components/ui/data-table";
import { Pagination } from "../../../components/ui/pagination";
import ClientStatusBadge from "./ClientStatusBadge";

export default function ClientTable({ clients, loading, page, totalPages }) {
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
      render: () => (
        <div className="flex items-center gap-2">
          <button className="p-1 text-gray-400 hover:text-blue-600 focus:outline-none" aria-label="View">
            <Eye className="h-4 w-4" />
          </button>
          <button className="p-1 text-gray-400 hover:text-green-600 focus:outline-none" aria-label="Edit">
            <Edit className="h-4 w-4" />
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
    </div>
  );
}
