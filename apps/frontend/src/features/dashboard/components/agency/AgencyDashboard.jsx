import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../../api/dashboard.api";
import AgencyOverviewCards from "./AgencyOverviewCards";
import AgencyAttendance from "./AgencyAttendance";
import AgencyNotifications from "./AgencyNotifications";
import { Loader2, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function AgencyDashboard() {
  const { t } = useTranslation();
  
  // Note: we use agencyDashboard data fetch
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ["agencyDashboard"],
    queryFn: async () => {
      // Falling back to existing dashboardData for now.
      // If agency-specific endpoint exists, replace this.
      const res = await dashboardApi.getDashboardData();
      return res.data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 w-full">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 text-red-600 bg-red-50 p-4 rounded-xl border border-red-100">
        <AlertCircle className="w-5 h-5" />
        <p className="text-sm font-medium">{t('agencyDashboard.failedToLoadData') || "Failed to load dashboard data. Please try again."}</p>
      </div>
    );
  }

  const { topStats, recentActivities, notifications, attendance } = dashboardData || {};

  return (
    <div className="space-y-6">
      {/* Top Row: Overview Cards */}
      <AgencyOverviewCards stats={topStats} />

      {/* Bottom Row: Attendance & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AgencyAttendance attendance={attendance} />
        <AgencyNotifications notifications={notifications} />
      </div>
    </div>
  );
}
