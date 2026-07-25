import { useState } from "react";
import PayrollToolbar from "../components/PayrollToolbar";
import PayrollStats from "../components/PayrollStats";
import PayrollTable from "../components/PayrollTable";
import { usePayrolls } from "../hooks/usePayrolls";

export default function PayrollListPage() {
  const [page] = useState(1);
  const { data, isLoading } = usePayrolls({ page });

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6 animate-fade-in">
      <PayrollToolbar totalRecords={data?.data?.total} />
      <PayrollStats />
      <PayrollTable 
        payrolls={data?.data?.payrolls} 
        loading={isLoading} 
        page={data?.data?.page || 1}
        totalPages={data?.data?.totalPages || 1}
      />
    </div>
  );
}
