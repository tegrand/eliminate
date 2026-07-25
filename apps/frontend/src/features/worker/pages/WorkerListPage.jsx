import { useState } from "react";
import WorkerToolbar from "../components/WorkerToolbar";
import WorkerFilters from "../components/WorkerFilters";
import WorkerTable from "../components/WorkerTable";
import { useWorkers } from "../hooks/useWorkers";

export default function WorkerListPage() {
  const [page] = useState(1);
  const { data, isLoading } = useWorkers({ page });

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6 animate-fade-in">
      <WorkerToolbar totalWorkers={data?.data?.total} />
      <WorkerFilters />
      <WorkerTable 
        workers={data?.data?.workers} 
        loading={isLoading} 
        page={data?.data?.page || 1}
        totalPages={data?.data?.totalPages || 1}
      />
    </div>
  );
}
