import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import clsx from "clsx";
import WorkerToolbar from "../components/WorkerToolbar";
import WorkerFilters from "../components/WorkerFilters";
import WorkerTable from "../components/WorkerTable";
import WorkerStats from "../components/WorkerStats";
import { useWorkers } from "../hooks/useWorkers";

export default function WorkerListPage() {
  const [page] = useState(1);
  const [searchParams] = useSearchParams();
  const currentStatus = searchParams.get("status") || "ALL";

  const { data, isLoading } = useWorkers({ page, status: currentStatus !== "ALL" ? currentStatus : undefined });

  const agencyFilter = searchParams.get("agency") || "";
  const skillFilter = searchParams.get("skill") || "";

  let displayedWorkers = data?.data?.workers || [];
  
  if (agencyFilter) {
    displayedWorkers = displayedWorkers.filter(w => w.agency === agencyFilter);
  }
  if (skillFilter) {
    displayedWorkers = displayedWorkers.filter(w => w.primarySkill === skillFilter);
  }
  if (currentStatus !== "ALL") {
    displayedWorkers = displayedWorkers.filter(w => w.status === currentStatus);
  }

  const tabs = [
    { name: "All Workers", value: "ALL", path: "/workers" },
    { name: "Pending", value: "PENDING", path: "/workers?status=PENDING" },
    { name: "Approved", value: "APPROVED", path: "/workers?status=APPROVED" },
    { name: "Rejected", value: "REJECTED", path: "/workers?status=REJECTED" },
    { name: "Suspended", value: "SUSPENDED", path: "/workers?status=SUSPENDED" }
  ];

  return (
    <div className="w-full pb-8 pt-0 animate-fade-in bg-gray-50/30 min-h-screen">
      <WorkerToolbar totalWorkers={displayedWorkers.length} />
      
      <WorkerStats workers={data?.data?.workers || []} />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-2">
        <div className="border-b border-gray-100 px-6 pt-2">
          <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
            {tabs.map((tab) => (
              <Link
                key={tab.name}
                to={tab.path}
                className={clsx(
                  currentStatus === tab.value
                    ? "border-blue-600 text-blue-600 font-bold"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 font-semibold",
                  "whitespace-nowrap border-b-2 py-4 px-1 text-sm transition-colors"
                )}
              >
                {tab.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="px-6 pb-6">
          <WorkerFilters />
          
          <div className="mt-2">
            <WorkerTable 
              workers={displayedWorkers} 
              loading={isLoading} 
              page={data?.data?.page || 1}
              totalPages={data?.data?.totalPages || 1}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
