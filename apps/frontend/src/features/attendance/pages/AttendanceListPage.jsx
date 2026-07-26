import { useState } from "react";
import AttendanceToolbar from "../components/AttendanceToolbar";
import AttendanceStats from "../components/AttendanceStats";
import AttendanceFilters from "../components/AttendanceFilters";
import AttendanceTable from "../components/AttendanceTable";
import { useAttendance } from "../hooks/useAttendance";

export default function AttendanceListPage() {
  const [page] = useState(1);
  const { data, isLoading } = useAttendance({ page });

  return (
    <div className="w-full h-[calc(100vh-4rem)] px-4 pb-4 pt-0 flex flex-col animate-fade-in bg-[#f8f9fa] overflow-hidden">
      <AttendanceToolbar totalRecords={data?.data?.total} />
      <AttendanceStats />
      
      <div className="flex-1 overflow-hidden min-h-0 bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col">
        <AttendanceFilters />
        <AttendanceTable 
          records={data?.data?.attendance} 
          loading={isLoading} 
          page={data?.data?.page || 1}
          totalPages={data?.data?.totalPages || 1}
        />
      </div>
    </div>
  );
}
