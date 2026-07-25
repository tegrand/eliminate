import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import clsx from "clsx";
import ClientToolbar from "../components/ClientToolbar";
import ClientFilters from "../components/ClientFilters";
import ClientTable from "../components/ClientTable";
import { useClients } from "../hooks/useClients";

export default function ClientListPage() {
  const [page] = useState(1);
  const [searchParams] = useSearchParams();
  const currentStatus = searchParams.get("status") || "ALL";

  const { data, isLoading } = useClients({ page, status: currentStatus !== "ALL" ? currentStatus : undefined });

  const tabs = [
    { name: "All Clients", value: "ALL", path: "/clients" },
    { name: "Active", value: "ACTIVE", path: "/clients?status=ACTIVE" },
    { name: "Suspended", value: "SUSPENDED", path: "/clients?status=SUSPENDED" }
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6 animate-fade-in">
      <ClientToolbar totalClients={data?.data?.total} />
      
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

      <ClientFilters />
      <ClientTable 
        clients={data?.data?.clients} 
        loading={isLoading} 
        page={data?.data?.page || 1}
        totalPages={data?.data?.totalPages || 1}
      />
    </div>
  );
}
