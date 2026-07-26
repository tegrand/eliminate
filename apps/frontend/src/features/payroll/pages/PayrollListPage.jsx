import { useState } from "react";
import PayrollToolbar from "../components/PayrollToolbar";
import PayrollStats from "../components/PayrollStats";
import PayrollTable from "../components/PayrollTable";
import { usePayrolls } from "../hooks/usePayrolls";

export default function PayrollListPage() {
  const [page] = useState(1);
  const { data, isLoading } = usePayrolls({ page });

  return (
    <div className="w-full h-[calc(100vh-4rem)] px-4 pb-4 pt-8 flex flex-col animate-fade-in bg-[#f8f9fa] overflow-hidden">
      <PayrollToolbar totalRecords={data?.data?.total} />
      <div className="mb-4">
        <PayrollStats />
      </div>
      <div className="flex-1 overflow-hidden">
        <PayrollTable 
          payrolls={data?.data?.payrolls} 
          loading={isLoading} 
          page={data?.data?.page || 1}
          totalPages={data?.data?.totalPages || 1}
        />
      </div>
    </div>
  );
}
