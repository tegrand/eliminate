import { useQuery } from "@tanstack/react-query";
import { companyApi } from "../api/company.api";
import { FolderKanban, MapPin, Users, Users2, Building2, Briefcase, Loader2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../routes/routePaths";
import { useAuth } from "../../../hooks/useAuth";

const DashboardCard = ({ title, count, icon: Icon, colorClass, link, description }) => (
  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${colorClass} opacity-10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`} />
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div className={`p-3 rounded-xl ${colorClass}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <Link to={link} className="text-slate-400 hover:text-indigo-600 transition-colors p-2">
        <ArrowRight className="w-5 h-5" />
      </Link>
    </div>
    <div className="relative z-10">
      <h3 className="text-3xl font-bold text-slate-900 mb-1">{count}</h3>
      <p className="font-semibold text-slate-700">{title}</p>
      <p className="text-xs text-slate-500 mt-2">{description}</p>
    </div>
  </div>
);

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
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-indigo-100 rounded-lg text-indigo-700">
            <Building2 className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Company Dashboard</h1>
        </div>
        <p className="text-slate-500">Welcome back, {user?.clientProfile?.companyName || "Company Admin"}. Manage your enterprise operations.</p>
      </div>

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

      <div className="mt-12 bg-indigo-50 border border-indigo-100 rounded-2xl p-6 lg:p-8 flex flex-col lg:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-bold text-indigo-900 flex items-center gap-2 mb-2">
            <Briefcase className="w-5 h-5" /> Enterprise Hiring
          </h2>
          <p className="text-indigo-700">Use the bulk hiring tools to request large numbers of workers across your departments and projects.</p>
        </div>
        <Link 
          to={ROUTES.CLIENT_JOBS} 
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shrink-0 whitespace-nowrap shadow-sm hover:shadow-md"
        >
          Manage Job Requirements
        </Link>
      </div>
    </div>
  );
}
