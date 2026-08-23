import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../../api/dashboard.api";
import ClientProfileStatus from "./ClientProfileStatus";
import { Loader2, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ClientDashboard() {
  const { t } = useTranslation();
  
  // We can still fetch the data if needed for topStats etc, but the profile
  // structure mostly relies on useAuth in the ClientProfileStatus component.
  const { isLoading, error } = useQuery({
    queryKey: ["clientDashboard"],
    queryFn: async () => {
      const res = await dashboardApi.getDashboardData();
      return res.data?.data || res.data;
    }
  });

  if (isLoading) {
    return (
      <div className="w-full pt-4 pb-8 space-y-6 animate-pulse">
        <div className="h-48 bg-gray-200 rounded-2xl w-full" />
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

  return (
    <div className="w-full space-y-6 animate-fade-in pb-8">
      {/* Exact replica of the Worker Dashboard Structure for Client */}
      <ClientProfileStatus />
    </div>
  );
}
