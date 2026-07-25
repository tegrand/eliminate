import { Eye } from "lucide-react";
import { DataTable } from "../../../components/ui/data-table";
import PaymentStatusBadge from "./PaymentStatusBadge";

export default function PaymentTable({ payments }) {
  const columns = [
    { key: "paymentId", title: "Payment ID", render: (row) => <span className="font-medium text-gray-900">{row.paymentId}</span> },
    { key: "invoiceNumber", title: "Invoice #", render: (row) => <span className="text-blue-600 hover:underline cursor-pointer">{row.invoiceNumber}</span> },
    { key: "client", title: "Client", render: (row) => row.client },
    { key: "amount", title: "Amount Received", render: (row) => <span className="font-semibold text-green-700">{row.amount}</span> },
    { key: "method", title: "Payment Method", render: (row) => row.method },
    { key: "date", title: "Payment Date", render: (row) => row.date },
    { key: "status", title: "Status", render: (row) => <PaymentStatusBadge status={row.status} /> },
    {
      key: "actions",
      title: "Actions",
      render: () => (
        <div className="flex items-center gap-2">
          <button className="p-1 text-gray-400 hover:text-blue-600 focus:outline-none" aria-label="View Receipt">
            <Eye className="h-4 w-4" />
          </button>
        </div>
      )
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <DataTable columns={columns} data={payments || []} rowKey="id" hover />
    </div>
  );
}
