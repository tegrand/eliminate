import { useAuth } from "../../../hooks/useAuth";
import { Calendar, ChevronDown, BadgeCheck, Clock } from "lucide-react";

import DashboardStats from "../components/DashboardStats";
import RecentActivity from "../components/RecentActivity";
import NotificationPanel from "../components/NotificationPanel";
import EarningsOverview from "../components/EarningsOverview";
import TaskCompletion from "../components/TaskCompletion";
import WorkerDashboard from "../components/worker/WorkerDashboard";
import WorkerAttendanceDropdown from "../components/worker/WorkerAttendanceDropdown";
import ClientDashboard from "../components/client/ClientDashboard";

import AgencyDashboard from "../components/agency/AgencyDashboard";

export default function DashboardPage() {
  const { user } = useAuth();

  const renderAdminDashboard = () => (
    <>
      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
        <EarningsOverview />
        <TaskCompletion />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <RecentActivity />
        <NotificationPanel />
      </div>
    </>
  );

  return (
    <div className="w-full pt-2 pb-6 space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-medium text-gray-900 flex flex-wrap items-center gap-2">
            <span>Welcome back, {user?.profileType === "SUPER_ADMIN" ? "Super Admin" : user?.email?.split('@')[0] || "User"}! 👋</span>
            {user?.profileType === "WORKER" && (
              user?.workerProfile?.profileStatus === "APPROVED" ? (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-medium">
                  <BadgeCheck className="w-4 h-4" />
                  Verified
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-xs font-medium">
                  <Clock className="w-4 h-4" />
                  {user?.workerProfile?.profileStatus === "PENDING" ? "Verification Pending" : "Unverified"}
                </div>
              )
            )}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {user?.profileType === "WORKER" 
              ? "Here is your personal workspace overview." 
              : "Here's what's happening in your system today."}
          </p>
        </div>
        {user?.profileType === "WORKER" ? (
          <WorkerAttendanceDropdown />
        ) : (
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span>May 21, 2025</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
        )}
      </div>

      {user?.profileType === "WORKER" ? (
        <WorkerDashboard />
      ) : user?.profileType === "CLIENT" ? (
        <ClientDashboard />
      ) : user?.profileType === "AGENCY" ? (
        <AgencyDashboard />
      ) : (
        renderAdminDashboard()
      )}
    </div>
  );
}
