import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, LayoutGrid, Calendar, Users, MapPin, Loader2, Briefcase, MoreVertical, Edit2, Trash2, XCircle, CheckCircle, RotateCcw } from "lucide-react";
import toast from "react-hot-toast";
import { jobRequirementApi } from "../../job-requirement/api/jobRequirement.api";
import ClientJobCreationModal from "../components/ClientJobCreationModal";
import ClientCategoryManagerModal from "../components/ClientCategoryManagerModal";

// A small component to render each job card beautifully
function JobCard({ job, onDelete, onUpdateStatus, onEdit }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "OPEN": return "bg-green-100 text-green-700";
      case "DRAFT": return "bg-gray-100 text-gray-700";
      case "PARTIALLY_FILLED": return "bg-blue-100 text-blue-700";
      case "FILLED": return "bg-purple-100 text-purple-700";
      case "COMPLETED": return "bg-emerald-100 text-emerald-700";
      case "CANCELLED": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all group flex flex-col h-full relative">
      <div className="flex items-start justify-between mb-3">
        <div className="pr-8">
          <span className="text-xs font-bold text-gray-400 mb-1 block uppercase tracking-wider">{job.requirementCode}</span>
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">{job.title}</h3>
        </div>
        
        {/* Actions Menu */}
        <div className="absolute top-4 right-4" ref={menuRef}>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
          
          {isMenuOpen && (
            <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-10 animate-fade-in-up">
              <button 
                onClick={() => { setIsMenuOpen(false); onEdit(job); }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4 text-blue-500" /> Edit Details
              </button>
              
              {job.status === "OPEN" && (
                <>
                  <button 
                    onClick={() => { setIsMenuOpen(false); onUpdateStatus(job.id, "COMPLETED"); }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-500" /> Mark Completed
                  </button>
                  <button 
                    onClick={() => { setIsMenuOpen(false); onUpdateStatus(job.id, "CANCELLED"); }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <XCircle className="w-4 h-4 text-orange-500" /> Cancel Job
                  </button>
                </>
              )}
              
              {(job.status === "CANCELLED" || job.status === "COMPLETED") && (
                <button 
                  onClick={() => { setIsMenuOpen(false); onUpdateStatus(job.id, "OPEN"); }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4 text-blue-500" /> Reopen Job
                </button>
              )}
              
              <div className="h-px bg-gray-100 my-1"></div>
              <button 
                onClick={() => { setIsMenuOpen(false); onDelete(job.id); }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mb-3">
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(job.status)}`}>
          {job.status.replace("_", " ")}
        </span>
      </div>

      <div className="flex flex-col gap-2 mt-auto">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4 text-orange-400" />
          <span>{job.startDate ? new Date(job.startDate).toLocaleDateString() : "Not Specified"}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span className="line-clamp-1">{job.location?.name || "Any Location"}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="w-4 h-4 text-blue-400" />
          <span>{job.requiredWorkers} Worker{job.requiredWorkers > 1 ? "s" : ""} Required</span>
        </div>
      </div>
    </div>
  );
}

export default function ClientJobsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const queryClient = useQueryClient();

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

  const handleEdit = (job) => {
    toast.error("Edit form feature coming soon! You can use status update instead.");
  };

  const jobs = Array.isArray(data) ? data : data?.data || [];

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
          <button 
            type="button"
            onClick={() => setIsCategoryModalOpen(true)}
            className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2 text-sm"
          >
            <LayoutGrid className="w-4 h-4" /> Manage Categories
          </button>
          
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-sm shadow-blue-200 transition-colors flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" /> Post a New Job
          </button>
        </div>
      </div>

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
            onClick={() => setIsCreateModalOpen(true)}
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
        onClose={() => setIsCreateModalOpen(false)} 
      />

      {/* Category Manager Modal */}
      <ClientCategoryManagerModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
      />
      
    </div>
  );
}
