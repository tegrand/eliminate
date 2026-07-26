import { useState } from "react";
import AssignmentToolbar from "../components/AssignmentToolbar";
import AssignmentStats from "../components/AssignmentStats";
import AssignmentTable from "../components/AssignmentTable";
import { useAssignments } from "../hooks/useAssignments";

export default function AssignmentListPage() {
  const [page] = useState(1);
  const { data, isLoading } = useAssignments({ page });

  return (
    <div className="w-full h-[calc(100vh-4rem)] px-4 pb-4 pt-4 flex flex-col animate-fade-in bg-[#f8f9fa] overflow-hidden">
      <AssignmentToolbar totalAssignments={data?.data?.total || 0} />
      <AssignmentStats />

      <div className="flex-1 overflow-hidden min-h-0 bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col">
        <AssignmentTable
          assignments={data?.data?.assignments}
          loading={isLoading}
          page={data?.data?.page || 1}
          totalPages={data?.data?.totalPages || 1}
        />
      </div>
    </div>
  );
}
