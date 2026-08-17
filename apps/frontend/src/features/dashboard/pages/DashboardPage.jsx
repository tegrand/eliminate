import { useAuth } from "../../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Calendar, ChevronDown, BadgeCheck, Clock, Loader2 } from "lucide-react";
import { dashboardApi } from "../api/dashboard.api";

import DashboardStats from "../components/DashboardStats";
import RecentActivity from "../components/RecentActivity";
import EarningsOverview from "../components/EarningsOverview";
import TaskCompletion from "../components/TaskCompletion";
import WorkerProfileStatus from "../components/worker/WorkerProfileStatus";
import ClientDashboard from "../components/client/ClientDashboard";

import AgencyDashboard from "../components/agency/AgencyDashboard";
import AdPopupOverlay from "../components/AdPopupOverlay";

export default function DashboardPage() {
  const { user } = useAuth();

  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ["dashboard", user?.profileType],
    queryFn: async () => {
      const res = await dashboardApi.getDashboardData();
      return res.data ?? res;
    },
    enabled: user?.profileType === "SUPER_ADMIN"
  });

  const renderAdminDashboard = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <p className="text-gray-500 mt-2 text-sm">Loading dashboard data...</p>
        </div>
      );
    }
    if (error) {
      return (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
          Failed to load dashboard data.
        </div>
      );
    }

    const apiResponse = Array.isArray(dashboardData) ? dashboardData[0] : dashboardData;
    const data = apiResponse?.data || apiResponse;

    return (
      <>
        <DashboardStats data={data?.topStats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
          <EarningsOverview data={data?.chartData} />
          <TaskCompletion data={data?.chartData} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <RecentActivity data={data?.recentUsers} />
        </div>
      </>
    );
  };

  const isClientOrWorkerOrAgency = ["WORKER", "CLIENT", "AGENCY"].includes(user?.profileType);

  return (
    <div className="w-full pt-2 pb-6 space-y-4 animate-fade-in relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
        {user?.profileType !== "WORKER" && user?.profileType !== "CLIENT" ? (
          <div>
            <h1 className="text-xl sm:text-2xl font-medium text-gray-900 flex flex-wrap items-center gap-2">
              <span>Welcome back, {user?.profileType === "SUPER_ADMIN" ? "Super Admin" : user?.email?.split('@')[0] || "User"}! 👋</span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Here's what's happening in your system today.
            </p>
          </div>
        ) : (
          <div />
        )}
      </div>

      {user?.profileType === "WORKER" ? (
        <WorkerProfileStatus />
      ) : user?.profileType === "CLIENT" ? (
        <ClientDashboard />
      ) : user?.profileType === "AGENCY" ? (
        <AgencyDashboard />
      ) : (
        renderAdminDashboard()
      )}
      
      {/* Show Ad Overlay for Clients, Workers, and Agencies */}
      {isClientOrWorkerOrAgency && <AdPopupOverlay />}
    </div>
  );
}
