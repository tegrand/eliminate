import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../../api/dashboard.api";
import AgencyOverviewCards from "./AgencyOverviewCards";
import DashboardChartsRow from "../charts/DashboardChartsRow";
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
      return res.data?.data || res.data;
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

  const { topStats, chartData } = dashboardData || {};

  return (
    <div className="space-y-6">
      {/* Top Row: Overview Cards */}
      <AgencyOverviewCards stats={topStats} />

      {/* Analytics Charts (Worker Allocation Donut Chart) */}
      <DashboardChartsRow
        donutTitle="Worker Allocation"
        donutSubtitle="Status breakdown"
        donutTotal={chartData?.donutTotal || 0}
        donutData={chartData?.donutData || []}
      />
    </div>
  );
}
