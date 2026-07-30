import { useQuery } from "@tanstack/react-query";
import { companyApi } from "../api/company.api";
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

  const isLoading = loadingProjects || loadingSites || loadingDepts || loadingTeams;

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
        donutTotal={projectsRes?.data?.data?.length || 2}
        donutData={[
          { name: 'Completed', value: 1 },
          { name: 'Active', value: 1 },
        ]}
      />

      <div className="mt-8 bg-indigo-50 border border-indigo-100 rounded-xl p-5 lg:p-6 flex flex-col lg:flex-row items-center justify-between gap-5">
        <div>
          <h2 className="text-lg font-bold text-indigo-900 flex items-center gap-2 mb-1.5">
            <Briefcase className="w-4 h-4" /> Enterprise Hiring
          </h2>
          <p className="text-sm text-indigo-700">Use the bulk hiring tools to request large numbers of workers across your departments and projects.</p>
        </div>
        <Link 
          to={ROUTES.CLIENT_JOBS} 
          className="bg-indigo-600 text-white px-5 py-2.5 text-sm rounded-lg font-bold hover:bg-indigo-700 transition-colors shrink-0 whitespace-nowrap shadow-sm hover:shadow-md"
        >
          Manage Job Requirements
        </Link>
      </div>
    </div>
  );
}
