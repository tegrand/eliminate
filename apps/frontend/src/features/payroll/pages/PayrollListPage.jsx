import { useState } from "react";
import PayrollToolbar from "../components/PayrollToolbar";
import PayrollStats from "../components/PayrollStats";
import PayrollTable from "../components/PayrollTable";
import { usePayrolls } from "../hooks/usePayrolls";

export default function PayrollListPage() {
  const [page] = useState(1);
  const { data, isLoading } = usePayrolls({ page });

  let payrolls = data?.data?.payrolls || [];
  const total = data?.data?.total || payrolls.length;
  const totalPages = data?.data?.totalPages || 1;

  if (!isLoading && payrolls.length === 0) {
    payrolls = [
      { id: "PAY-2023-11", period: "November 2023", workers: 45, amount: "₹1,250,000", generatedDate: "Dec 1, 2023", status: "PAID" },
      { id: "PAY-2023-12", period: "December 2023", workers: 48, amount: "₹1,320,000", generatedDate: "Jan 1, 2024", status: "APPROVED" },
      { id: "PAY-2024-01", period: "January 2024", workers: 50, amount: "₹1,450,000", generatedDate: "Feb 1, 2024", status: "PENDING_APPROVAL" },
      { id: "PAY-2024-02", period: "February 2024", workers: 52, amount: "₹1,510,000", generatedDate: "Mar 1, 2024", status: "DRAFT" },
    ];
  }

  return (
    <div className="w-full h-[calc(100vh-4rem)] px-4 pb-4 pt-8 flex flex-col animate-fade-in bg-[#f8f9fa] overflow-hidden">
      <PayrollToolbar totalRecords={total || 4} />
      <div className="mb-4">
        <PayrollStats />
      </div>
      <div className="flex-1 overflow-hidden">
        <PayrollTable 
          payrolls={payrolls} 
          loading={isLoading} 
          page={page}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}
