import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { invoiceApi } from "../../../api/invoice.api";
import InvoiceToolbar from "../components/InvoiceToolbar";
import InvoiceTable from "../components/InvoiceTable";

export default function InvoiceListPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["invoices", page],
    queryFn: () => invoiceApi.getInvoices({ page, limit: 10 }),
  });

  const invoices = data?.data?.invoices || [];
  const pagination = data?.data?.pagination || { total: 0, page: 1, totalPages: 1 };

  return (
    <div className="w-full h-[calc(100vh-4rem)] px-4 pb-4 pt-8 flex flex-col animate-fade-in bg-[#f8f9fa] overflow-hidden">
      <InvoiceToolbar totalInvoices={pagination.total} />
      
      <div className="flex-1 overflow-hidden mt-3">
        <InvoiceTable 
          invoices={invoices} 
          loading={isLoading}
          page={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
