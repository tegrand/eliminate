import { useState } from "react";
import InvoiceToolbar from "../components/InvoiceToolbar";
import InvoiceTable from "../components/InvoiceTable";

const MOCK_INVOICES = [
  { id: "INV-1001", invoiceNumber: "INV-2026-001", client: "TechCorp Inc", assignments: 3, subtotal: "$45,000.00", taxes: "$4,500.00", grandTotal: "$49,500.00", status: "PAID", date: "2026-07-01" },
  { id: "INV-1002", invoiceNumber: "INV-2026-002", client: "Global Logistics", assignments: 1, subtotal: "$12,000.00", taxes: "$1,200.00", grandTotal: "$13,200.00", status: "UNPAID", date: "2026-07-15" },
  { id: "INV-1003", invoiceNumber: "INV-2026-003", client: "FinServe LLC", assignments: 2, subtotal: "$28,000.00", taxes: "$2,800.00", grandTotal: "$30,800.00", status: "DRAFT", date: "2026-07-20" },
];

export default function InvoiceListPage() {
  const [invoices] = useState(MOCK_INVOICES);

  return (
    <div className="w-full h-[calc(100vh-4rem)] px-4 pb-4 pt-8 flex flex-col animate-fade-in bg-[#f8f9fa] overflow-hidden">
      <InvoiceToolbar totalInvoices={invoices.length} />
      
      <div className="flex-1 overflow-hidden mt-3">
        <InvoiceTable 
          invoices={invoices} 
          loading={false}
          page={1}
          totalPages={1}
        />
      </div>
    </div>
  );
}
