import { useState, useEffect } from "react";
import { toast } from "sonner";
import { dashboardApi } from "../../api/dashboard.api";
import WorkerProfileWidget from "./WorkerProfileWidget";
import WorkerJobsWidget from "./WorkerJobsWidget";
import WorkerStatsWidget from "./WorkerStatsWidget";
import WorkerActivityWidget from "./WorkerActivityWidget";
import WorkerTopStatsWidget from "./WorkerTopStatsWidget";
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

      <WorkerStatsWidget 
        attendance={data.todayAttendance} 
        payments={data.pendingPayments} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 space-y-4">
          <WorkerProfileWidget 
            profile={data.profile} 
            onStatusChange={handleStatusChange} 
          />
        </div>
        
        <div className="lg:col-span-2">
          <WorkerJobsWidget 
            activeJob={data.activeJob} 
            upcomingJobs={data.upcomingJobs} 
          />
        </div>
      </div>

      <WorkerActivityWidget 
        notifications={data.notifications} 
        recentActivities={data.recentActivities} 
      />
    </div>
  );
}
