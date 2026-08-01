import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import clsx from "clsx";
import ClientToolbar from "../components/ClientToolbar";
import ClientFilters from "../components/ClientFilters";
import ClientTable from "../components/ClientTable";
import ClientStats from "../components/ClientStats";
import { useClients } from "../hooks/useClients";

export default function ClientListPage() {
  const [page] = useState(1);
  const [searchParams] = useSearchParams();
  const currentStatus = searchParams.get("status") || "ALL";

  const { data, isLoading } = useClients({ page, status: currentStatus !== "ALL" ? currentStatus : undefined });

  const districtFilter = searchParams.get("district") || "";

  const rawClients = data?.data?.items || data?.data?.clients || [];
  const pagination = data?.data?.pagination || {};

  const normalizedClients = rawClients.map(c => ({
    ...c,
    status: c.profileStatus || "ACTIVE",
  }));

  let displayedClients = normalizedClients;

  if (districtFilter) {
    displayedClients = displayedClients.filter(c => c.district === districtFilter);
  }
  if (currentStatus !== "ALL") {
    displayedClients = displayedClients.filter(c => c.status === currentStatus);
  }

  const tabs = [
    { name: "All Clients", value: "ALL", path: "/clients" },
    { name: "Active", value: "ACTIVE", path: "/clients?status=ACTIVE" },
    { name: "Suspended", value: "SUSPENDED", path: "/clients?status=SUSPENDED" }
  ];

  const availableStatuses = [...new Set(rawClients.map(c => c.profileStatus || "ACTIVE"))];
  const availableDistricts = [...new Set(rawClients.map(c => c.district).filter(Boolean))];

  return (
    <div className="w-full h-[calc(100vh-4rem)] px-4 pb-4 pt-4 flex flex-col animate-fade-in bg-[#f8f9fa] overflow-hidden">
      <ClientToolbar 
        totalClients={pagination.total || 0} 
        availableStatuses={availableStatuses} 
        availableDistricts={availableDistricts} 
      />
      
      <ClientStats clients={rawClients} />

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
            <ClientTable 
              clients={displayedClients} 
              loading={isLoading} 
              page={pagination.page || 1}
              totalPages={pagination.totalPages || 1}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
