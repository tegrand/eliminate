import { Eye, Edit, ShieldCheck } from "lucide-react";
import { DataTable } from "../../../components/ui/data-table";
import { Pagination } from "../../../components/ui/pagination";
import AttendanceStatusBadge from "./AttendanceStatusBadge";

export default function AttendanceTable({ records, loading, page, totalPages }) {
  const columns = [
    { key: "date", title: "Date", render: (row) => row.date },
    { key: "assignment", title: "Assignment", render: (row) => <span className="font-medium text-gray-900">{row.assignment}</span> },
    { key: "worker", title: "Worker", render: (row) => row.worker },
    { key: "client", title: "Client", render: (row) => row.client },
    { key: "agency", title: "Agency", render: (row) => row.agency },
    { key: "checkIn", title: "Check-In", render: (row) => row.checkIn },
    { key: "checkOut", title: "Check-Out", render: (row) => row.checkOut },
    { key: "hoursWorked", title: "Hours", render: (row) => row.hoursWorked },
    { 
      key: "status", 
      title: "Status", 
      render: (row) => <AttendanceStatusBadge status={row.status} /> 
    },
    {
      key: "actions",
      title: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button className="p-1 text-gray-400 hover:text-blue-600 focus:outline-none" aria-label="View">
            <Eye className="h-4 w-4" />
          </button>
          <button className="p-1 text-gray-400 hover:text-green-600 focus:outline-none" aria-label="Edit">
            <Edit className="h-4 w-4" />
          </button>
          {row.status === "PENDING" && (
            <button className="p-1 text-gray-400 hover:text-indigo-600 focus:outline-none" aria-label="Verify" title="Verify Attendance">
              <ShieldCheck className="h-4 w-4" />
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
        data={records || []} 
        loading={loading}
        rowKey="id" 
        hover 
      />
      {records && records.length > 0 && (
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
