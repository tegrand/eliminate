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
    <div className="w-full h-[calc(100vh-4rem)] px-4 pb-4 pt-1 flex flex-col animate-fade-in bg-[#f8f9fa] overflow-hidden">
      <WorkerToolbar totalWorkers={displayedWorkers.length} />
      
      <WorkerStats workers={data?.data?.workers || []} />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col flex-1 overflow-hidden">
        <div className="border-b border-gray-100 px-6 pt-1 flex-shrink-0">
          <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
            {tabs.map((tab) => (
              <Link
                key={tab.name}
                to={tab.path}
                className={clsx(
                  currentStatus === tab.value
                    ? "border-indigo-600 text-indigo-700 font-bold"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 font-semibold",
                  "whitespace-nowrap border-b-2 py-3 px-1 text-[13px] transition-colors"
                )}
              >
                {tab.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="px-6 pb-4 flex flex-col flex-1 overflow-hidden">
          <WorkerFilters />
          
          <div className="mt-3 flex-1 overflow-hidden flex flex-col">
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
