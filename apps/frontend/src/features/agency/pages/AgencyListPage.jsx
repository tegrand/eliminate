import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import clsx from "clsx";
import AgencyToolbar from "../components/AgencyToolbar";
import AgencyFilters from "../components/AgencyFilters";
import AgencyTable from "../components/AgencyTable";
import AgencyStats from "../components/AgencyStats";
import { useAgencies } from "../hooks/useAgencies";

export default function AgencyListPage() {
  const [page, setPage] = useState(1);
  const [searchParams] = useSearchParams();
  const currentStatus = searchParams.get("status") || "ALL";

  const { data, isLoading } = useAgencies({ page, status: currentStatus !== "ALL" ? currentStatus : undefined });

  const districtFilter = searchParams.get("district") || "";
  const rawAgencies = data?.data?.items || [];
  
  const normalizedAgencies = rawAgencies.map(a => ({
    ...a,
    status: a.profileStatus || "PENDING",
    location: a.city ? (a.state ? `${a.city}, ${a.state}` : a.city) : (a.state || "—"),
  }));

  let displayedAgencies = normalizedAgencies;

  if (districtFilter) {
    displayedAgencies = displayedAgencies.filter(a => a.city === districtFilter);
  }
  // The API already filters by status if currentStatus !== "ALL", but we can keep client side filtering as fallback
  if (currentStatus !== "ALL") {
    displayedAgencies = displayedAgencies.filter(a => a.status === currentStatus);
  }

  const tabs = [
    { name: "All Agencies", value: "ALL", path: "/agencies" },
    { name: "Pending", value: "PENDING", path: "/agencies?status=PENDING" },
    { name: "Approved", value: "APPROVED", path: "/agencies?status=APPROVED" },
    { name: "Rejected", value: "REJECTED", path: "/agencies?status=REJECTED" },
    { name: "Suspended", value: "SUSPENDED", path: "/agencies?status=SUSPENDED" }
  ];

  const availableStatuses = [...new Set(rawAgencies.map(a => a.profileStatus || "PENDING"))];
  const availableDistricts = [...new Set(rawAgencies.map(a => a.city).filter(Boolean))];

  return (
    <div className="w-full h-[calc(100vh-4rem)] px-4 pb-4 pt-4 flex flex-col animate-fade-in bg-[#f8f9fa] overflow-hidden">
      <AgencyToolbar 
        totalAgencies={displayedAgencies.length} 
        availableStatuses={availableStatuses}
        availableDistricts={availableDistricts}
      />
      
      <AgencyStats agencies={normalizedAgencies} />

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
          <div className="mt-3 flex-1 overflow-hidden flex flex-col">
            <AgencyTable 
              agencies={displayedAgencies} 
              loading={isLoading} 
              page={data?.data?.page || 1}
              totalPages={data?.data?.totalPages || 1}
              onPageChange={setPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
