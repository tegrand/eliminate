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
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6 animate-fade-in">
      <AttendanceToolbar totalRecords={data?.data?.total} />
      <AttendanceStats />
      <AttendanceFilters />
      <AttendanceTable 
        records={data?.data?.attendance} 
        loading={isLoading} 
        page={data?.data?.page || 1}
        totalPages={data?.data?.totalPages || 1}
      />
    </div>
  );
}
