import { useState, useEffect } from "react";
import { toast } from "sonner";
import { dashboardApi } from "../../api/dashboard.api";
import WorkerTopStatsWidget from "./WorkerTopStatsWidget";
import DashboardChartsRow from "../charts/DashboardChartsRow";

export default function WorkerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await dashboardApi.getDashboardData();
        setData(response.data.data);
      } catch (error) {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="w-full pt-4 pb-8 space-y-6 animate-pulse">
        <div className="h-48 bg-gray-200 rounded-2xl w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-64 bg-gray-200 rounded-2xl lg:col-span-1" />
          <div className="h-64 bg-gray-200 rounded-2xl lg:col-span-2" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="w-full space-y-4 animate-fade-in">
      <WorkerTopStatsWidget stats={data.topStats} />

      <DashboardChartsRow
        lineTitle="Hours Logged"
        lineSubtitle="Monthly work hours overview"
        lineData={data.chartData?.lineData || []}
        donutTitle="Attendance Overview"
        donutSubtitle="Status breakdown"
        donutTotal={data.chartData?.donutTotal || 0}
        donutData={data.chartData?.donutData || []}
      />
    </div>
  );
}
