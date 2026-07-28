import { Settings } from "lucide-react";
import { DataTable } from "../../../components/ui/data-table";
import { Pagination } from "../../../components/ui/pagination";
import { Link } from "react-router-dom";
import PaymentStatusBadge from "./PaymentStatusBadge";

export default function PaymentTable({ payments, loading, page, totalPages }) {
  const columns = [
    { key: "checkbox", title: <input type="checkbox" className="rounded border-gray-300" />, render: () => <input type="checkbox" className="rounded border-gray-300" /> },
    { key: "paymentId", title: "PAYMENT ID", render: (row) => <span className="font-bold text-gray-900 text-sm">{row.paymentId}</span> },
    { key: "invoiceNumber", title: "INVOICE #", render: (row) => <span className="text-blue-600 hover:underline cursor-pointer font-medium">{row.invoiceNumber}</span> },
    { key: "client", title: "CLIENT", render: (row) => <span className="text-gray-900 text-sm">{row.client}</span> },
    { key: "amount", title: "AMOUNT", render: (row) => <span className="font-bold text-green-700 text-sm">{row.amount}</span> },
    { key: "method", title: "METHOD", render: (row) => <span className="text-sm text-gray-600">{row.method}</span> },
    { key: "date", title: "DATE", render: (row) => <span className="text-sm text-gray-600">{row.date}</span> },
    { key: "status", title: "STATUS", render: (row) => <PaymentStatusBadge status={row.status} /> },
    {
      key: "actions",
      title: <div className="flex items-center gap-1.5"><Settings className="w-3.5 h-3.5" />ACTIONS</div>,
      render: (row) => (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-semibold">
          <Link to={`/payments/${row.id}`} className="text-blue-600 hover:text-blue-800 transition-colors">
            Payment Receipts
          </Link>
        </div>
      )
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm flex flex-col h-full">
      <div className="flex-1 overflow-auto">
        <DataTable 
          columns={columns} 
          data={payments || []} 
          loading={loading}
          rowKey="id" 
          hover 
        />
      </div>
      {payments && payments.length > 0 && (
        <div className="p-3 border-t border-gray-100 flex justify-between items-center bg-white flex-shrink-0">
          <span className="text-[13px] text-gray-500 font-medium">Showing 1 to {payments.length} of {payments.length} payments</span>
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
