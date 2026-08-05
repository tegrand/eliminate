import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, LayoutGrid, Calendar, Users, MapPin, Loader2, Briefcase, MoreVertical, Edit2, Trash2, XCircle, CheckCircle, RotateCcw } from "lucide-react";
import toast from "react-hot-toast";
import { jobRequirementApi } from "../../job-requirement/api/jobRequirement.api";
import ClientJobCreationModal from "../components/ClientJobCreationModal";
import ClientCategoryManagerModal from "../components/ClientCategoryManagerModal";
import { useAuth } from "../../../hooks/useAuth";


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

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let isJobStarted = false;
  if (job.startDate) {
    const sDate = new Date(job.startDate);
    sDate.setHours(0, 0, 0, 0);
    isJobStarted = sDate <= today;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col h-full overflow-hidden">
      {/* Top Header Section */}
      <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{job.requirementCode}</span>
          <h3 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
            {job.title}
          </h3>
        </div>
        <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold border whitespace-nowrap ${getStatusColor(job.status)}`}>
          {job.status.replace("_", " ")}
        </span>
      </div>

      {/* Details Section */}
      <div className="px-4 py-3 flex-1 flex flex-col gap-3">
        <div className="flex items-center gap-3 text-xs text-gray-600">
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
        <div className="flex items-center gap-2 mt-auto">
          <div className="flex-1 bg-gray-50 rounded-lg p-2 text-center border border-gray-100 transition-colors hover:bg-gray-100 flex flex-col items-center justify-center">
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Required</span>
            <span className="text-sm font-black text-gray-800">{job.requiredWorkers}</span>
          </div>
          <div className="flex-1 bg-green-50/50 rounded-lg p-2 text-center border border-green-100 transition-colors hover:bg-green-50 flex flex-col items-center justify-center">
            <span className="text-[9px] font-bold text-green-600 uppercase tracking-wider mb-0.5">Assigned</span>
            <span className="text-sm font-black text-green-700">{job.assignedCount || 0}</span>
          </div>
          <div className="flex-1 bg-orange-50/50 rounded-lg p-2 text-center border border-orange-100 transition-colors hover:bg-orange-50 flex flex-col items-center justify-center">
            <span className="text-[9px] font-bold text-orange-600 uppercase tracking-wider mb-0.5">Vacant</span>
            <span className="text-sm font-black text-orange-700">{vacancies}</span>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-4 py-2.5 bg-gray-50/50 border-t border-gray-100 flex items-center justify-end gap-1">
        <button 
          onClick={() => !isJobStarted && onEdit(job)}
          disabled={isJobStarted}
          className={`px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold ${
            isJobStarted ? "text-gray-400 cursor-not-allowed opacity-50" : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
          }`}
          title={isJobStarted ? "Cannot edit a confirmed job that has already started" : ""}
        >
          <Edit2 className="w-3.5 h-3.5" /> Edit
        </button>
        
        {(job.status === "OPEN" || job.status === "DRAFT" || job.status === "PARTIALLY_FILLED" || job.status === "FILLED") && (
          <button 
            onClick={() => onUpdateStatus(job, "CANCELLED")}
            className="px-2.5 py-1.5 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <XCircle className="w-3.5 h-3.5" /> Cancel
          </button>
        )}
        
        {(job.status === "CANCELLED" || job.status === "COMPLETED") && (
          <button 
            onClick={() => onUpdateStatus(job, "OPEN")}
            className="px-2.5 py-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reopen
          </button>
        )}
        
        <button 
          onClick={() => !isJobStarted && onDelete(job)}
          disabled={isJobStarted}
          className={`px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold ${
            isJobStarted ? "text-gray-400 cursor-not-allowed opacity-50" : "text-gray-500 hover:text-red-600 hover:bg-red-50"
          }`}
          title={isJobStarted ? "Cannot delete a confirmed job that has already started" : ""}
        >
          <Trash2 className="w-3.5 h-3.5" /> Delete
        </button>
      </div>
    </div>
  );
}

export default function ClientJobsPage() {
  const { user } = useAuth();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedSite, setSelectedSite] = useState("");
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: null, job: null, newStatus: null });

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

  const handleDelete = (job) => {
    setConfirmModal({
      isOpen: true,
      type: "delete",
      job,
      newStatus: null
    });
  };

  const handleUpdateStatus = (job, status) => {
    setConfirmModal({
      isOpen: true,
      type: "status",
      job,
      newStatus: status
    });
  };

  const confirmAction = () => {
    if (confirmModal.type === "delete") {
      deleteMutation.mutate(confirmModal.job.id);
    } else if (confirmModal.type === "status") {
      updateStatusMutation.mutate({ id: confirmModal.job.id, status: confirmModal.newStatus });
    }
    setConfirmModal({ isOpen: false, type: null, job: null, newStatus: null });
  };

  const [selectedJob, setSelectedJob] = useState(null);

  const handleEdit = (job) => {
    setSelectedJob(job);
    setIsCreateModalOpen(true);
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
            onClick={() => {
              setSelectedJob(null);
              setIsCreateModalOpen(true);
            }}
            className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-sm shadow-blue-200 transition-colors flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" /> Create Job
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
            onClick={() => {
              setSelectedJob(null);
              setIsCreateModalOpen(true);
            }}
            className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-sm shadow-blue-200 transition-colors flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" /> Create Job
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-10">
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

      {/* Custom Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm flex flex-col overflow-hidden animate-slide-up">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {confirmModal.type === "delete" ? "Delete Job Requirement" : "Update Job Status"}
              </h3>
              <p className="text-sm text-gray-600">
                {confirmModal.type === "delete" 
                  ? "Are you sure you want to delete this job requirement? This action cannot be undone." 
                  : `Are you sure you want to update the status to ${confirmModal.newStatus.replace("_", " ")}?`}
              </p>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex items-center justify-end gap-3 border-t border-gray-100">
              <button 
                onClick={() => setConfirmModal({ isOpen: false, type: null, job: null, newStatus: null })}
                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-200 hover:text-gray-900 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmAction}
                className={`px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors shadow-sm ${
                  confirmModal.type === "delete" 
                    ? "bg-red-600 hover:bg-red-700 shadow-red-200" 
                    : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
