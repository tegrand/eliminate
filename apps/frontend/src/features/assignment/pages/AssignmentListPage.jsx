import { useState } from "react";
import AssignmentToolbar from "../components/AssignmentToolbar";
import AssignmentStats from "../components/AssignmentStats";
import AssignmentTable from "../components/AssignmentTable";
import { useAssignments } from "../hooks/useAssignments";

export default function AssignmentListPage() {
  const [page] = useState(1);
  const { data, isLoading } = useAssignments({ page });

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6 animate-fade-in">
      <AssignmentToolbar totalAssignments={data?.data?.total} />
      <AssignmentStats />
      <AssignmentTable 
        assignments={data?.data?.assignments} 
        loading={isLoading} 
        page={data?.data?.page || 1}
        totalPages={data?.data?.totalPages || 1}
      />
    </div>
  );
}
