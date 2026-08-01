import { useQuery } from "@tanstack/react-query";
import { companyApi } from "../api/company.api";
import { dashboardApi } from "../../dashboard/api/dashboard.api";
import { FolderKanban, MapPin, Users, Users2, Building2, Briefcase, Loader2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../routes/routePaths";
import { useAuth } from "../../../hooks/useAuth";
import DashboardCard from "../../dashboard/components/DashboardCard";
import DashboardChartsRow from "../../dashboard/components/charts/DashboardChartsRow";

export default function CompanyDashboard() {
  const { user } = useAuth();
  
  const { data: projectsRes, isLoading: loadingProjects } = useQuery({
    queryKey: ["company", "projects"],
    queryFn: () => companyApi.getProjects(),
  });
  
  const { data: sitesRes, isLoading: loadingSites } = useQuery({
    queryKey: ["company", "sites"],
    queryFn: () => companyApi.getSites(),
  });
  
  const { data: deptsRes, isLoading: loadingDepts } = useQuery({
    queryKey: ["company", "departments"],
    queryFn: () => companyApi.getDepartments(),
  });
  
  const { data: teamsRes, isLoading: loadingTeams } = useQuery({
    queryKey: ["company", "teams"],
    queryFn: () => companyApi.getTeams(),
  });

  const { data: dashboardRes, isLoading: loadingDashboard } = useQuery({
    queryKey: ["clientDashboard"],
    queryFn: () => dashboardApi.getDashboardData(),
  });

  const isLoading = loadingProjects || loadingSites || loadingDepts || loadingTeams || loadingDashboard;
  const chartData = dashboardRes?.data?.chartData;

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in">


      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard
            title="Projects"
            count={projectsRes?.data?.data?.length || 0}
            icon={FolderKanban}
            colorClass="from-blue-500 to-indigo-600"
            link={ROUTES.COMPANY_PROJECTS}
            description="Active construction or development projects"
          />
          <DashboardCard
            title="Site Locations"
            count={sitesRes?.data?.data?.length || 0}
            icon={MapPin}
            colorClass="from-emerald-500 to-teal-600"
            link={ROUTES.COMPANY_SITES}
            description="Geographical work site locations"
          />
          <DashboardCard
            title="Departments"
            count={deptsRes?.data?.data?.length || 0}
            icon={Users}
            colorClass="from-amber-500 to-orange-600"
            link={ROUTES.COMPANY_DEPARTMENTS}
            description="Internal company divisions"
          />
          <DashboardCard
            title="Teams"
            count={teamsRes?.data?.data?.length || 0}
            icon={Users2}
            colorClass="from-violet-500 to-purple-600"
            link={ROUTES.COMPANY_TEAMS}
            description="Worker squads for bulk assignment"
          />
        </div>
      )}



      <div className="mt-8">
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
    </div>
  );
}
