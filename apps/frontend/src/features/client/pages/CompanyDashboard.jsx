import { useQuery } from "@tanstack/react-query";
import { companyApi } from "../api/company.api";
import { FolderKanban, MapPin, Users, Users2, Building2, Briefcase, Loader2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../routes/routePaths";
import { useAuth } from "../../../hooks/useAuth";

const DashboardCard = ({ title, count, icon: Icon, colorClass, link, description }) => {
  // Extract a light bg color from colorClass (e.g. from-blue-500 -> bg-blue-50)
  // For simplicity and matching the exact screenshot, we can just use the provided opacity approach.
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-md transition-all group relative overflow-hidden flex flex-col justify-end min-h-[140px]">
      <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${colorClass} opacity-10 rounded-bl-[100%] transition-transform group-hover:scale-110`} />
      
      <div className="absolute top-4 right-4 z-10">
        {link ? (
          <Link to={link} className="text-slate-400 hover:text-indigo-600 transition-colors block">
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        ) : (
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
        )}
      </div>

      <div className="relative z-10 mt-6">
        <h3 className="text-3xl font-bold text-slate-900 mb-1">{count}</h3>
        <p className="text-sm font-medium text-slate-700">{title}</p>
        {description && <p className="text-[11px] text-slate-500 mt-1">{description}</p>}
      </div>
    </div>
  );
};

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
