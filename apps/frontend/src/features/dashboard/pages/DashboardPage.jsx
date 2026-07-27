import { useAuth } from "../../../hooks/useAuth";
import { Calendar, ChevronDown } from "lucide-react";

import DashboardStats from "../components/DashboardStats";
import UpcomingRequirements from "../components/UpcomingRequirements";
import SystemOverview from "../components/SystemOverview";
import RecentActivity from "../components/RecentActivity";
import NotificationPanel from "../components/NotificationPanel";
import WorkerDashboard from "../components/worker/WorkerDashboard";
import ClientDashboard from "../components/client/ClientDashboard";

export default function DashboardPage() {
  const { user } = useAuth();

  const renderAdminDashboard = () => (
    <>
      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingRequirements />
        <SystemOverview />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        <NotificationPanel />
      </div>
    </>
  );

  return (
    <div className="w-full pt-4 pb-8 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Welcome back, {user?.profileType === "SUPER_ADMIN" ? "Super Admin" : user?.email?.split('@')[0] || "User"}! 👋
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {user?.profileType === "WORKER" 
              ? "Here is your personal workspace overview." 
              : "Here's what's happening in your system today."}
          </p>
        </div>
        <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span>May 21, 2025</span>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {user?.profileType === "WORKER" ? (
        <WorkerDashboard />
      ) : user?.profileType === "CLIENT" ? (
        <ClientDashboard />
      ) : (
        renderAdminDashboard()
      )}
    </div>
  );
}
