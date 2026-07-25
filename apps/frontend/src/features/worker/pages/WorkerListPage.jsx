import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import clsx from "clsx";
import WorkerToolbar from "../components/WorkerToolbar";
import WorkerFilters from "../components/WorkerFilters";
import WorkerTable from "../components/WorkerTable";
import { useWorkers } from "../hooks/useWorkers";

export default function WorkerListPage() {
  const [page] = useState(1);
  const [searchParams] = useSearchParams();
  const currentStatus = searchParams.get("status") || "ALL";

  const { data, isLoading } = useWorkers({ page, status: currentStatus !== "ALL" ? currentStatus : undefined });

  const tabs = [
    { name: "All Workers", value: "ALL", path: "/workers" },
    { name: "Pending", value: "PENDING", path: "/workers?status=PENDING" },
    { name: "Approved", value: "APPROVED", path: "/workers?status=APPROVED" },
    { name: "Rejected", value: "REJECTED", path: "/workers?status=REJECTED" },
    { name: "Suspended", value: "SUSPENDED", path: "/workers?status=SUSPENDED" }
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6 animate-fade-in">
      <WorkerToolbar totalWorkers={data?.data?.total} />
      
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <Link
              key={tab.name}
              to={tab.path}
              className={clsx(
                currentStatus === tab.value
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                "whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors"
              )}
            >
              {tab.name}
            </Link>
          ))}
        </nav>
      </div>

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
