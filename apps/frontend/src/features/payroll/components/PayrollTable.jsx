import { Eye, FileCheck, FileOutput } from "lucide-react";
import { DataTable } from "../../../components/ui/data-table";
import { Pagination } from "../../../components/ui/pagination";
import PayrollStatusBadge from "./PayrollStatusBadge";

export default function PayrollTable({ payrolls, loading, page, totalPages }) {
  const columns = [
    { key: "id", title: "Payroll ID", render: (row) => <span className="font-medium text-gray-900">{row.id}</span> },
    { key: "period", title: "Payroll Period", render: (row) => row.period },
    { key: "workers", title: "Workers Included", render: (row) => row.workers },
    { key: "amount", title: "Total Amount", render: (row) => <span className="font-semibold text-gray-900">{row.amount}</span> },
    { key: "generatedDate", title: "Generated Date", render: (row) => row.generatedDate },
    { 
      key: "status", 
      title: "Status", 
      render: (row) => <PayrollStatusBadge status={row.status} /> 
    },
    {
      key: "actions",
      title: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button className="p-1 text-gray-400 hover:text-blue-600 focus:outline-none" aria-label="View" title="View Details">
            <Eye className="h-4 w-4" />
          </button>
          {row.status === "PENDING_APPROVAL" && (
            <button className="p-1 text-gray-400 hover:text-green-600 focus:outline-none" aria-label="Approve" title="Approve Payroll">
              <FileCheck className="h-4 w-4" />
            </button>
          )}
          {(row.status === "APPROVED" || row.status === "PAID") && (
            <button className="p-1 text-gray-400 hover:text-indigo-600 focus:outline-none" aria-label="Generate Invoice" title="Generate Invoice">
              <FileOutput className="h-4 w-4" />
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
        data={payrolls || []} 
        loading={loading}
        rowKey="id" 
        hover 
      />
      {payrolls && payrolls.length > 0 && (
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
