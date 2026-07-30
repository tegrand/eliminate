import { Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { DataTable } from "../../../components/ui/data-table";
import { Pagination } from "../../../components/ui/pagination";
import PayrollStatusBadge from "./PayrollStatusBadge";

export default function PayrollTable({ payrolls, loading, page, totalPages }) {
  const columns = [
    { key: "checkbox", title: <input type="checkbox" className="rounded border-gray-300" />, render: () => <input type="checkbox" className="rounded border-gray-300" /> },
    { key: "id", title: "PAYROLL ID", render: (row) => <span className="font-bold text-gray-900 text-sm">{row.id}</span> },
    { key: "period", title: "PERIOD", render: (row) => <span className="text-sm text-gray-600">{row.period}</span> },
    { key: "workers", title: "WORKERS", render: (row) => <span className="text-sm text-gray-600">{row.workers}</span> },
    { key: "amount", title: "TOTAL AMOUNT", render: (row) => <span className="font-bold text-gray-900 text-sm">{row.amount}</span> },
    { key: "generatedDate", title: "GENERATED DATE", render: (row) => <span className="text-sm text-gray-600">{row.generatedDate}</span> },
    { 
      key: "status", 
      title: "STATUS", 
      render: (row) => <PayrollStatusBadge status={row.status} /> 
    },
    {
      key: "actions",
      title: <div className="flex items-center gap-1.5"><Settings className="w-3.5 h-3.5" />ACTIONS</div>,
      render: (row) => (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-semibold">
          <Link to={`/payrolls/${row.id}`} className="text-blue-600 hover:text-blue-800 transition-colors">
            View
          </Link>
          {row.status === "PENDING_APPROVAL" && (
            <button className="text-green-600 hover:text-green-800 transition-colors">
              Approve
            </button>
          )}
          {(row.status === "APPROVED" || row.status === "PAID") && (
            <button className="text-indigo-600 hover:text-indigo-800 transition-colors">
              Invoice
            </button>
          )}
        </div>
      )
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm flex flex-col h-full">
      <div className="flex-1 overflow-auto">
        <DataTable 
          columns={columns} 
          data={payrolls || []} 
          loading={loading}
          rowKey="id" 
          hover 
        />
      </div>
      {payrolls && payrolls.length > 0 && (
        <div className="p-3 border-t border-gray-100 flex justify-between items-center bg-white flex-shrink-0">
          <span className="text-[13px] text-gray-500 font-medium">Showing 1 to {payrolls.length} of {payrolls.length} payrolls</span>
          <Pagination 
            currentPage={page || 1}
            totalPages={totalPages || 1}
            onPageChange={(p) => console.log("Page changed to:", p)}
          />
        </div>
      )}
    </div>
  );
}
