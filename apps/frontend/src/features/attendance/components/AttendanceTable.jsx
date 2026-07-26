import { Eye, Edit, ShieldCheck, Settings, MoreVertical } from "lucide-react";
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
      title: <div className="flex items-center gap-1.5"><Settings className="w-3.5 h-3.5" />ACTIONS</div>,
      render: (row) => (
        <div className="flex items-center gap-2">
          <button className="p-1.5 border border-gray-200 rounded-lg text-gray-400 hover:text-indigo-600 hover:border-indigo-200 focus:outline-none transition-colors" aria-label="View Details" title="View Details">
            <Eye className="h-4 w-4" />
          </button>
          {row.status === "PENDING" && (
            <button className="p-1.5 border border-gray-200 rounded-lg text-gray-400 hover:text-indigo-600 hover:border-indigo-200 focus:outline-none transition-colors" aria-label="Verify" title="Verify Attendance">
              <ShieldCheck className="h-4 w-4" />
            </button>
          )}
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
        data={records || []} 
        loading={loading}
        rowKey="id" 
        hover
        compact
      />
      {records && records.length > 0 && (
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
