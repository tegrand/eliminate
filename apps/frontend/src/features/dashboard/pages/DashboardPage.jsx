import { useAuth } from "../../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Calendar, ChevronDown, BadgeCheck, Clock, Loader2, Building2, ArrowRight } from "lucide-react";
import { dashboardApi } from "../api/dashboard.api";
import { ROUTES } from "../../../routes/routePaths";

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
  const isClient = user?.profileType === "CLIENT";

  const getDisplayName = () => {
    if (user?.profileType === "SUPER_ADMIN") return "Super Admin";
    if (user?.agencyName) return user.agencyName;
    if (user?.agency?.agencyName) return user.agency.agencyName;
    if (user?.firstName) {
      return `${user.firstName} ${user.lastName || ""}`.trim();
    }
    if (user?.name) return user.name;
    if (user?.contactPerson) return user.contactPerson;
    return user?.email?.split('@')[0] || "User";
  };

  return (
    <div className={`w-full ${isClient ? "pt-0" : "pt-2"} pb-6 space-y-4 animate-fade-in relative`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 sm:mb-6">
        {user?.profileType !== "WORKER" && user?.profileType !== "CLIENT" ? (
          <div className="w-full space-y-3">
            <h1 className="text-xl sm:text-2xl font-medium text-gray-900">
              Welcome back, {getDisplayName()}!
            </h1>

            {/* Full-Width "Complete Your Profile" Card for Agency with Avatar & SVG Progress Ring */}
            {user?.profileType === "AGENCY" && (() => {
              const profile = user?.agencyProfile || {};
              let score = 0;
              if (user?.agencyName || profile?.agencyName || user?.name) score += 20;
              if (user?.avatar || profile?.logo) score += 20;
              if (user?.phone || profile?.contact?.phone) score += 20;
              if (user?.address || profile?.address?.city) score += 20;
              if (profile?.compliance?.gst || profile?.compliance?.licenseNumber || profile?.address?.state || user?.email) score += 20;

              const avatarUrl = user?.avatar || profile?.logo;
              const getImageUrl = (path) => {
                if (!path) return null;
                if (path.startsWith('http') || path.startsWith('data:')) return path;
                const baseUrl = import.meta.env.VITE_API_BASE_URL
                  ? import.meta.env.VITE_API_BASE_URL.replace('/api/v1', '')
                  : 'http://localhost:5000';
                return `${baseUrl}/${path.replace(/\\/g, '/').replace(/^\//, '')}`;
              };
              const fullAvatarUrl = getImageUrl(avatarUrl);
              const initialLetter = (user?.agencyName || user?.name || user?.email || "A").charAt(0).toUpperCase();

              return (
                <div className="w-full bg-white/90 backdrop-blur-md rounded-2xl border border-violet-100/90 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Avatar Container with SVG Progress Ring */}
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="42" fill="none" stroke="#f5f3ff" strokeWidth="8" />
                        <circle
                          cx="50"
                          cy="50"
                          r="42"
                          fill="none"
                          stroke="#c084fc"
                          strokeWidth="8"
                          strokeDasharray="263.89"
                          strokeDashoffset={263.89 - (263.89 * (score / 100))}
                          strokeLinecap="round"
                          className="transition-all duration-1000 ease-out"
                        />
                      </svg>
                      {/* Center Avatar Image */}
                      <div className="absolute inset-2 rounded-full overflow-hidden bg-violet-50 flex items-center justify-center border-2 border-white shadow-inner">
                        {fullAvatarUrl ? (
                          <img src={fullAvatarUrl} alt="Agency Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xl font-bold text-violet-600">{initialLetter}</span>
                        )}
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug truncate">Complete Your Profile</h3>
                        <span className="text-xs font-extrabold text-violet-600 bg-violet-50 border border-violet-200 px-2 py-0.5 rounded-full shrink-0">
                          {score}%
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium truncate">Update agency details, logo & verification documents</p>
                      
                      {/* Progress Bar */}
                      <div className="w-full max-w-md bg-violet-50 rounded-full h-2 overflow-hidden mt-2 border border-violet-100">
                        <div 
                          className="h-full bg-violet-400 rounded-full transition-all duration-1000" 
                          style={{ width: `${score}%` }} 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Complete Now Action Button */}
                  <Link 
                    to={ROUTES.AGENCY_PROFILE} 
                    className="px-4 py-2.5 bg-violet-500 hover:bg-violet-600 active:bg-violet-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer self-stretch sm:self-auto"
                  >
                    <span>Complete Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              );
            })()}
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
