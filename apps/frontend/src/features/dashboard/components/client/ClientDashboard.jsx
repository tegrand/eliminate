import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../../api/dashboard.api";
import ClientOverviewCards from "./ClientOverviewCards";
import ClientQuickActions from "./ClientQuickActions";
import ClientRecentActivity from "./ClientRecentActivity";
import ClientNotifications from "./ClientNotifications";
import DashboardChartsRow from "../charts/DashboardChartsRow";
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

      {/* Analytics Charts */}
      <DashboardChartsRow
        lineTitle="Monthly Expenditure"
        lineSubtitle="Monthly spending overview on assignments"
        lineData={[
          { name: 'Jan', value: 0 },
          { name: 'Feb', value: 0 },
          { name: 'Mar', value: 0 },
          { name: 'Apr', value: 0 },
          { name: 'May', value: 0 },
          { name: 'Jun', value: 0 },
          { name: 'Jul', value: 0 },
          { name: 'Aug', value: 0.3 },
          { name: 'Sep', value: 0 },
          { name: 'Oct', value: 0 },
          { name: 'Nov', value: 0 },
          { name: 'Dec', value: 0 },
        ]}
        donutTitle="Project Status"
        donutSubtitle="Status breakdown"
        donutTotal={topStats?.activeRequirements || 1}
        donutData={[
          { name: 'Completed', value: topStats?.completedJobs || 0 },
          { name: 'Active', value: topStats?.activeRequirements || 1 },
        ]}
      />

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
