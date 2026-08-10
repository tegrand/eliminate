import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../../api/dashboard.api";
import ClientOverviewCards from "./ClientOverviewCards";
import DashboardChartsRow from "../charts/DashboardChartsRow";
import { Loader2, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ClientDashboard() {
  const { t } = useTranslation();
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ["clientDashboard"],
    queryFn: async () => {
      const res = await dashboardApi.getDashboardData();
      return res.data?.data || res.data;
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

  const { topStats, chartData } = dashboardData || {};

  return (
    <div className="space-y-6">
      {/* Overview Stat Cards */}
      <ClientOverviewCards stats={topStats} />

      {/* Analytics Charts */}
      <DashboardChartsRow
        lineTitle="Monthly Expenditure"
        lineSubtitle="Monthly spending overview on assignments"
        lineData={chartData?.lineData || []}
        donutTitle="Project Status"
        donutSubtitle="Status breakdown"
        donutTotal={chartData?.donutTotal || 0}
        donutData={chartData?.donutData || []}
      />

    </div>
  );
}
