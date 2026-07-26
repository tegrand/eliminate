import { useState } from "react";
import InvoiceToolbar from "../components/InvoiceToolbar";
import InvoiceTable from "../components/InvoiceTable";

const MOCK_INVOICES = [];

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
