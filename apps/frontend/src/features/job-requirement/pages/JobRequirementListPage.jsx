import { useState } from "react";
import JobRequirementToolbar from "../components/JobRequirementToolbar";
import JobRequirementFilters from "../components/JobRequirementFilters";
import JobRequirementTable from "../components/JobRequirementTable";
import { useJobRequirements } from "../hooks/useJobRequirements";

export default function JobRequirementListPage() {
  const [page] = useState(1);
  const { data, isLoading } = useJobRequirements({ page });

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6 animate-fade-in">
      <JobRequirementToolbar totalRequirements={data?.data?.total} />
      <JobRequirementFilters />
      <JobRequirementTable 
        requirements={data?.data?.requirements} 
        loading={isLoading} 
        page={data?.data?.page || 1}
        totalPages={data?.data?.totalPages || 1}
      />
    </div>
  );
}
