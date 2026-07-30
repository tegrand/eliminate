import { useState, useEffect } from "react";
import { toast } from "sonner";
import { dashboardApi } from "../../api/dashboard.api";
import WorkerTopStatsWidget from "./WorkerTopStatsWidget";
import DashboardChartsRow from "../charts/DashboardChartsRow";
import api from "../../../../api/axios";

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

  const handleStatusChange = async (newStatus) => {
    try {
      await api.patch('/workers/my-profile', { employmentStatus: newStatus });
      setData(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          status: newStatus
        }
      }));
      toast.success("Status updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
      throw error;
    }
  };

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
        lineTitle="Earnings Overview"
        lineSubtitle="Monthly income overview"
        lineData={[
          { name: 'Jan', value: 0 },
          { name: 'Feb', value: 0 },
          { name: 'Mar', value: 0 },
          { name: 'Apr', value: 0 },
          { name: 'May', value: 0 },
          { name: 'Jun', value: 0 },
          { name: 'Jul', value: 0 },
          { name: 'Aug', value: 0.15 },
          { name: 'Sep', value: 0 },
          { name: 'Oct', value: 0 },
          { name: 'Nov', value: 0 },
          { name: 'Dec', value: 0 },
        ]}
        donutTitle="Task Completion"
        donutSubtitle="Status breakdown"
        donutTotal={data.topStats?.totalCompletedWork || 1}
        donutData={[
          { name: 'Completed', value: data.topStats?.totalCompletedWork || 1 },
          { name: 'Active', value: data.activeJob ? 1 : 0 },
        ]}
      />
    </div>
  );
}
