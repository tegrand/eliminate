import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, LayoutGrid, Calendar, Users, MapPin, Loader2, Briefcase, MoreVertical, Edit2, Trash2, XCircle, CheckCircle, RotateCcw } from "lucide-react";
import toast from "react-hot-toast";
import { jobRequirementApi } from "../../job-requirement/api/jobRequirement.api";
import ClientJobCreationModal from "../components/ClientJobCreationModal";
import ClientCategoryManagerModal from "../components/ClientCategoryManagerModal";
import { useAuth } from "../../../hooks/useAuth";
import { companyApi } from "../../client/api/company.api";

// A small component to render each job card beautifully
// A small component to render each job card beautifully
function JobCard({ job, onDelete, onUpdateStatus, onEdit }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "OPEN": return "bg-green-50 text-green-700 border-green-200";
      case "DRAFT": return "bg-gray-50 text-gray-700 border-gray-200";
      case "PARTIALLY_FILLED": return "bg-blue-50 text-blue-700 border-blue-200";
      case "FILLED": return "bg-purple-50 text-purple-700 border-purple-200";
      case "COMPLETED": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "CANCELLED": return "bg-red-50 text-red-700 border-red-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const vacancies = Math.max(0, (job.requiredWorkers || 0) - (job.assignedCount || 0));

  return (
    <div className="bg-white rounded-2xl border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full overflow-hidden">
      {/* Top Header Section */}
      <div className="p-5 pb-4 border-b border-gray-50">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{job.requirementCode}</span>
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getStatusColor(job.status)}`}>
            {job.status.replace("_", " ")}
          </span>
        </div>
        <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
          {job.title}
        </h3>
      </div>

      {/* Details Section */}
      <div className="p-5 flex-1 flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            <span>{job.startDate ? new Date(job.startDate).toLocaleDateString() : "Not Specified"}</span>
          </div>
          <span className="text-gray-300">|</span>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-gray-400" />
            <span className="line-clamp-1">{job.location?.name || "Any Location"}</span>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-2 mt-auto pt-2">
          <div className="flex-1 bg-gray-50 rounded-xl p-2.5 text-center border border-gray-100 transition-colors hover:bg-gray-100">
            <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Required</span>
            <span className="block text-sm font-black text-gray-800">{job.requiredWorkers}</span>
          </div>
          <div className="flex-1 bg-green-50/50 rounded-xl p-2.5 text-center border border-green-100 transition-colors hover:bg-green-50">
            <span className="block text-[10px] font-bold text-green-600 uppercase tracking-wider mb-0.5">Assigned</span>
            <span className="block text-sm font-black text-green-700">{job.assignedCount || 0}</span>
          </div>
          <div className="flex-1 bg-orange-50/50 rounded-xl p-2.5 text-center border border-orange-100 transition-colors hover:bg-orange-50">
            <span className="block text-[10px] font-bold text-orange-600 uppercase tracking-wider mb-0.5">Vacant</span>
            <span className="block text-sm font-black text-orange-700">{vacancies}</span>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-5 py-3.5 bg-gray-50/50 border-t border-gray-100 flex items-center justify-end gap-1">
        <button 
          onClick={() => onEdit(job)}
          className="px-3 py-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold"
        >
          <Edit2 className="w-3.5 h-3.5" /> Edit
        </button>
        
        {(job.status === "OPEN" || job.status === "DRAFT") ? (
          <button 
            onClick={() => onUpdateStatus(job.id, "CANCELLED")}
            className="px-3 py-1.5 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <XCircle className="w-3.5 h-3.5" /> Cancel
          </button>
        ) : (
          <button 
            onClick={() => onUpdateStatus(job.id, "OPEN")}
            className="px-3 py-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reopen
          </button>
        )}
        
        <button 
          onClick={() => onDelete(job.id)}
          className="px-3 py-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold"
        >
          <Trash2 className="w-3.5 h-3.5" /> Delete
        </button>
      </div>
    </div>
  );
}

export default function ClientJobsPage() {
  const { user } = useAuth();
  const isCompany = user?.clientProfile?.clientType === "COMPANY";

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedSite, setSelectedSite] = useState("");

  const queryClient = useQueryClient();

  const { data: deptsRes } = useQuery({
    queryKey: ["company", "departments"],
    queryFn: () => companyApi.getDepartments(),
    enabled: isCompany,
  });
  
  const { data: sitesRes } = useQuery({
    queryKey: ["company", "sites"],
    queryFn: () => companyApi.getSites(),
    enabled: isCompany,
  });

  const departments = deptsRes?.data?.data || [];
  const sites = sitesRes?.data?.data || [];

  const { data, isLoading, error } = useQuery({
    queryKey: ["clientJobs"],
    queryFn: async () => {
      const res = await jobRequirementApi.getJobRequirements({ limit: 50 });
      return res.data?.items || res.data || [];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => jobRequirementApi.deleteJobRequirement(id),
    onSuccess: () => {
      toast.success("Job deleted successfully");
      queryClient.invalidateQueries(["clientJobs"]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete job");
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => {
      if (status === "CANCELLED") return jobRequirementApi.cancelJobRequirement(id, "Cancelled by user");
      if (status === "COMPLETED") return jobRequirementApi.closeJobRequirement(id);
      if (status === "OPEN") return jobRequirementApi.reopenJobRequirement(id);
      return jobRequirementApi.updateJobRequirement(id, { status });
    },
    onSuccess: () => {
      toast.success("Job status updated");
      queryClient.invalidateQueries(["clientJobs"]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  });

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this job requirement?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleUpdateStatus = (id, status) => {
    updateStatusMutation.mutate({ id, status });
  };

  const [selectedJob, setSelectedJob] = useState(null);

  const handleEdit = (job) => {
    setSelectedJob(job);
    setIsCreateModalOpen(true);
  };

  let jobs = Array.isArray(data) ? data : data?.data || [];
  
  // Apply local filtering if company selected dept/site
  if (selectedDept) {
    jobs = jobs.filter(j => j.departmentId === selectedDept);
  }
  if (selectedSite) {
    jobs = jobs.filter(j => j.siteId === selectedSite);
  }

  return (
    <div className="w-full flex flex-col animate-fade-in h-[calc(100vh-4rem)] overflow-y-auto scrollbar-hide px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Briefcase className="w-7 h-7 text-blue-600" />
            My Job Postings
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage and track your requested workforce requirements.</p>
        </div>

        <div className="flex items-center gap-3">
          {isCompany && (
            <button 
              type="button"
              onClick={() => toast.success("Bulk Hire coming soon")}
              className="px-4 py-2.5 bg-indigo-100 text-indigo-700 font-semibold rounded-xl hover:bg-indigo-200 transition-colors shadow-sm flex items-center gap-2 text-sm"
            >
              <Users className="w-4 h-4" /> Bulk Hire
            </button>
          )}
          <button 
            type="button"
            onClick={() => setIsCategoryModalOpen(true)}
            className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2 text-sm"
          >
            <LayoutGrid className="w-4 h-4" /> Manage Categories
          </button>
          
          <button 
            onClick={() => {
              setSelectedJob(null);
              setIsCreateModalOpen(true);
            }}
            className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-sm shadow-blue-200 transition-colors flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" /> Post a New Job
          </button>
        </div>
      </div>

      {/* Filters for Company */}
      {isCompany && (
        <div className="mb-6 flex gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex-1 max-w-xs">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Department</label>
            <select
              value={selectedDept}
              onChange={e => setSelectedDept(e.target.value)}
              className="w-full text-sm border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Departments</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div className="flex-1 max-w-xs">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Site Location</label>
            <select
              value={selectedSite}
              onChange={e => setSelectedSite(e.target.value)}
              className="w-full text-sm border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Sites</option>
              {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        </div>
      )}

      {/* Content Area */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 border-dashed">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
          <p className="text-sm font-medium text-gray-500 mt-4">Loading your jobs...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 text-center text-sm font-medium">
          Failed to load jobs. Please try again.
        </div>
      ) : jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-gray-200 shadow-sm text-center px-4">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <Briefcase className="w-8 h-8 text-blue-300" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No jobs posted yet</h3>
          <p className="text-sm text-gray-500 mt-1 max-w-sm mb-6">Create your first job requirement to start finding workers.</p>
          <button 
            onClick={() => {
              setSelectedJob(null);
              setIsCreateModalOpen(true);
            }}
            className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-sm shadow-blue-200 transition-colors flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" /> Post a New Job
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
          {jobs.map((job) => (
            <JobCard 
              key={job.id} 
              job={job} 
              onDelete={handleDelete}
              onUpdateStatus={handleUpdateStatus}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}

      {/* Creation Modal */}
      <ClientJobCreationModal 
        isOpen={isCreateModalOpen} 
        onClose={() => {
          setIsCreateModalOpen(false);
          setSelectedJob(null);
        }} 
        mode={selectedJob ? "edit" : "create"}
        jobData={selectedJob}
      />

      {/* Category Manager Modal */}
      <ClientCategoryManagerModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
      />
      
    </div>
  );
}
