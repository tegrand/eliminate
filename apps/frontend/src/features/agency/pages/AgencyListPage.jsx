import { useState } from "react";
import AgencyToolbar from "../components/AgencyToolbar";
import AgencyFilters from "../components/AgencyFilters";
import AgencyTable from "../components/AgencyTable";
import { useAgencies } from "../hooks/useAgencies";

export default function AgencyListPage() {
  const [page] = useState(1);
  const { data, isLoading } = useAgencies({ page });

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6 animate-fade-in">
      <AgencyToolbar totalAgencies={data?.data?.total} />
      <AgencyFilters />
      <AgencyTable 
        agencies={data?.data?.agencies} 
        loading={isLoading} 
        page={data?.data?.page || 1}
        totalPages={data?.data?.totalPages || 1}
      />
    </div>
  );
}
