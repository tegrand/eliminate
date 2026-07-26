import { Link } from "react-router-dom";
import { Settings } from "lucide-react";
import { DataTable } from "../../../components/ui/data-table";
import { Pagination } from "../../../components/ui/pagination";
import InvoiceStatusBadge from "./InvoiceStatusBadge";

export default function InvoiceTable({ invoices, loading, page, totalPages }) {
  const columns = [
    { key: "checkbox", title: <input type="checkbox" className="rounded border-gray-300" />, render: () => <input type="checkbox" className="rounded border-gray-300" /> },
    { key: "invoiceNumber", title: "INVOICE #", render: (row) => <span className="font-bold text-gray-900 text-sm">{row.invoiceNumber}</span> },
    { key: "client", title: "CLIENT", render: (row) => <span className="text-gray-900 text-sm font-medium">{row.client}</span> },
    { key: "assignments", title: "ASSIGNMENTS", render: (row) => <span className="text-sm text-gray-600">{row.assignments}</span> },
    { key: "subtotal", title: "SUBTOTAL", render: (row) => <span className="text-sm text-gray-600">{row.subtotal}</span> },
    { key: "taxes", title: "TAXES", render: (row) => <span className="text-sm text-gray-600">{row.taxes}</span> },
    { key: "grandTotal", title: "GRAND TOTAL", render: (row) => <span className="font-bold text-gray-900 text-sm">{row.grandTotal}</span> },
    { key: "status", title: "STATUS", render: (row) => <InvoiceStatusBadge status={row.status} /> },
    {
      key: "actions",
      title: <div className="flex items-center gap-1.5"><Settings className="w-3.5 h-3.5" />ACTIONS</div>,
      render: (row) => (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-semibold">
          <Link to={`/invoices/${row.id}`} className="text-blue-600 hover:text-blue-800 transition-colors">
            View Details
          </Link>
          <button className="text-indigo-600 hover:text-indigo-800 transition-colors">
            Download
          </button>
        </div>
      )
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm flex flex-col h-full">
      <div className="flex-1 overflow-auto">
        <DataTable 
          columns={columns} 
          data={invoices || []} 
          loading={loading}
          rowKey="id" 
          hover 
        />
      </div>
      {invoices && invoices.length > 0 && (
        <div className="p-3 border-t border-gray-100 flex justify-between items-center bg-white flex-shrink-0">
          <span className="text-[13px] text-gray-500 font-medium">Showing 1 to {invoices.length} of {invoices.length} invoices</span>
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
