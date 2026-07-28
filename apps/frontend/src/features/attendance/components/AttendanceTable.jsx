import { Settings } from "lucide-react";
import { DataTable } from "../../../components/ui/data-table";
import { Pagination } from "../../../components/ui/pagination";
import { Link } from "react-router-dom";
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
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-semibold">
          <Link to="/attendance" className="text-indigo-600 hover:text-indigo-800 transition-colors">
            View Attendance
          </Link>
          {row.status === "PENDING" && (
            <Link to={`/attendance/verify/${row.id}`} className="text-emerald-600 hover:text-emerald-800 transition-colors">
              Approve Attendance
            </Link>
          )}
          <Link to={`/attendance/missing/${row.id}`} className="text-rose-600 hover:text-rose-800 transition-colors">
            Report Missing Attendance
          </Link>
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
