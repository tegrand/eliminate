import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../../api/dashboard.api";
import ClientOverviewCards from "./ClientOverviewCards";
import ClientQuickActions from "./ClientQuickActions";
import ClientRecentActivity from "./ClientRecentActivity";
import ClientNotifications from "./ClientNotifications";
import { Loader2, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ClientDashboard() {
  const { t } = useTranslation();
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ["clientDashboard"],
    queryFn: async () => {
      const res = await dashboardApi.getDashboardData();
      return res.data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 w-full">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 text-red-600 bg-red-50 p-4 rounded-xl border border-red-100">
        <AlertCircle className="w-5 h-5" />
        <p className="text-sm font-medium">{t('clientDashboard.failedToLoadData')}</p>
      </div>
    );
  }

  const { topStats, recentActivities, notifications, favouriteWorkers, favouriteAgencies } = dashboardData || {};

  return (
    <div className="space-y-6">
      {/* Overview Stat Cards */}
      <ClientOverviewCards stats={topStats} />

      {/* Quick Actions */}
      <ClientQuickActions />

      {/* Bottom Row: Recent Activity + Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ClientRecentActivity activities={recentActivities} />
        <ClientNotifications notifications={notifications} />
      </div>
    </div>
  );
}
