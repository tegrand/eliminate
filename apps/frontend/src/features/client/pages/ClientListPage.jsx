import { useState } from "react";
import ClientToolbar from "../components/ClientToolbar";
import ClientFilters from "../components/ClientFilters";
import ClientTable from "../components/ClientTable";
import { useClients } from "../hooks/useClients";

export default function ClientListPage() {
  const [page] = useState(1);
  const { data, isLoading } = useClients({ page });

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6 animate-fade-in">
      <ClientToolbar totalClients={data?.data?.total} />
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
