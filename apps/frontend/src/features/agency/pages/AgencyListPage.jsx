import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import clsx from "clsx";
import AgencyToolbar from "../components/AgencyToolbar";
import AgencyFilters from "../components/AgencyFilters";
import AgencyTable from "../components/AgencyTable";
import AgencyStats from "../components/AgencyStats";
import { useAgencies } from "../hooks/useAgencies";

export default function AgencyListPage() {
  const [page] = useState(1);
  const [searchParams] = useSearchParams();
  const currentStatus = searchParams.get("status") || "ALL";

  const { data, isLoading } = useAgencies({ page, status: currentStatus !== "ALL" ? currentStatus : undefined });

  const tabs = [
    { name: "All Agencies", value: "ALL", path: "/agencies" },
    { name: "Pending", value: "PENDING", path: "/agencies?status=PENDING" },
    { name: "Approved", value: "APPROVED", path: "/agencies?status=APPROVED" },
    { name: "Rejected", value: "REJECTED", path: "/agencies?status=REJECTED" },
    { name: "Suspended", value: "SUSPENDED", path: "/agencies?status=SUSPENDED" }
  ];

  return (
    <div className="w-full pb-8 pt-0 animate-fade-in bg-gray-50/30 min-h-screen">
      <AgencyToolbar totalAgencies={data?.data?.total} />
      
      <AgencyStats agencies={data?.data?.agencies || []} />

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
          <AgencyFilters />
          
          <div className="mt-2">
            <AgencyTable 
              agencies={data?.data?.agencies} 
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
