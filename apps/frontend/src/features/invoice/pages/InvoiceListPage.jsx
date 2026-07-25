import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Download, Search } from "lucide-react";
import { DataTable } from "../../../components/ui/data-table";
import { Input } from "../../../components/ui/input";
import InvoiceStatusBadge from "../components/InvoiceStatusBadge";

const MOCK_INVOICES = [
  { id: "INV-1001", invoiceNumber: "INV-2026-001", client: "TechCorp Inc", assignments: 3, subtotal: "$45,000.00", taxes: "$4,500.00", grandTotal: "$49,500.00", status: "PAID", date: "2026-07-01" },
  { id: "INV-1002", invoiceNumber: "INV-2026-002", client: "Global Logistics", assignments: 1, subtotal: "$12,000.00", taxes: "$1,200.00", grandTotal: "$13,200.00", status: "UNPAID", date: "2026-07-15" },
  { id: "INV-1003", invoiceNumber: "INV-2026-003", client: "FinServe LLC", assignments: 2, subtotal: "$28,000.00", taxes: "$2,800.00", grandTotal: "$30,800.00", status: "DRAFT", date: "2026-07-20" },
];

export default function InvoiceListPage() {
  const [invoices] = useState(MOCK_INVOICES);

  const columns = [
    { key: "invoiceNumber", title: "Invoice #", render: (row) => <span className="font-medium text-gray-900">{row.invoiceNumber}</span> },
    { key: "client", title: "Client", render: (row) => row.client },
    { key: "assignments", title: "Assignments", render: (row) => row.assignments },
    { key: "subtotal", title: "Subtotal", render: (row) => row.subtotal },
    { key: "taxes", title: "Taxes", render: (row) => row.taxes },
    { key: "grandTotal", title: "Grand Total", render: (row) => <span className="font-semibold text-gray-900">{row.grandTotal}</span> },
    { key: "status", title: "Status", render: (row) => <InvoiceStatusBadge status={row.status} /> },
    {
      key: "actions",
      title: "Actions",
      render: () => (
        <div className="flex items-center gap-2">
          <Link to="/invoices/INV-1001" className="p-1 text-gray-400 hover:text-blue-600 focus:outline-none" aria-label="View">
            <Eye className="h-4 w-4" />
          </Link>
          <button className="p-1 text-gray-400 hover:text-indigo-600 focus:outline-none" aria-label="Download PDF">
            <Download className="h-4 w-4" />
          </button>
        </div>
      )
    },
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Client Invoices</h2>
          <p className="text-sm text-gray-500 mt-1">Manage and track billing invoices sent to clients.</p>
        </div>
        <div className="w-full sm:w-64 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <Input 
            placeholder="Search invoices..." 
            aria-label="Search invoices"
            className="pl-9"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <DataTable columns={columns} data={invoices} rowKey="id" hover />
      </div>
    </div>
  );
}
