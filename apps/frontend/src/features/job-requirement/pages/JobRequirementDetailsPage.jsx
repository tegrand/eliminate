import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { 
  ArrowLeft, FileText, Users, Calendar, MapPin, IndianRupee, Clock,
  CheckCircle2, XCircle, AlertCircle, Trash2, Edit, Loader2 
} from "lucide-react";
import { jobRequirementApi } from "../api/jobRequirement.api";
import { Badge } from "../../../components/ui/badge";
import JobRequirementStatusBadge from "../components/JobRequirementStatusBadge";

export default function JobRequirementDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("details");

  const { data: jobRes, isLoading, refetch } = useQuery({
    queryKey: ["jobRequirement", id],
    queryFn: () => jobRequirementApi.getJobRequirementById(id),
  });

  const job = jobRes?.data?.jobRequirement;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <AlertCircle className="w-12 h-12 mb-2 text-gray-400" />
        <p>Job Requirement not found</p>
        <button 
          onClick={() => navigate("/job-requirements")}
          className="mt-4 text-blue-600 hover:underline"
        >
          Go back to list
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <button 
          onClick={() => navigate("/job-requirements")}
          className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Requirements
        </button>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
              <JobRequirementStatusBadge status={job.status} />
            </div>
            <p className="text-sm text-gray-500 mt-1">ID: {job.requirementCode}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
              <Edit className="w-4 h-4 inline-block mr-1.5" /> Edit
            </button>
            <button 
              onClick={() => navigate(`/job-requirements/${id}/assign`)}
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              Manage Applications
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: "details", label: "Details", icon: FileText },
            { id: "workers", label: "Assigned Workers", icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${active 
                    ? "border-blue-600 text-blue-600" 
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {tab.id === "workers" && (
                  <span className={`ml-1.5 py-0.5 px-2 rounded-full text-xs ${active ? "bg-blue-100" : "bg-gray-100"}`}>
                    {job.assignedCount} / {job.requiredWorkers}
                  </span>
                )}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {activeTab === "details" && <DetailsTab job={job} />}
        {activeTab === "workers" && <WorkersTab job={job} refetch={refetch} />}
      </div>
    </div>
  );
}

function DetailsTab({ job }) {
  return (
    <div className="space-y-8">
      {/* Overview Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500 flex items-center gap-1.5"><Users className="w-4 h-4" /> Required</p>
          <p className="text-lg font-semibold text-gray-900">{job.requiredWorkers}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500 flex items-center gap-1.5"><Users className="w-4 h-4 text-blue-500" /> Assigned</p>
          <p className="text-lg font-semibold text-gray-900">{job.assignedCount || 0}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500 flex items-center gap-1.5"><Users className="w-4 h-4 text-green-500" /> Vacancy</p>
          <p className="text-lg font-semibold text-gray-900">{Math.max(0, (job.requiredWorkers || 0) - (job.assignedCount || 0))}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500 flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Duration</p>
          <p className="text-lg font-semibold text-gray-900">{job.duration || "Not specified"}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500 flex items-center gap-1.5"><Clock className="w-4 h-4" /> Shift</p>
          <p className="text-lg font-semibold text-gray-900 capitalize">{job.shift?.toLowerCase() || "Not specified"}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500 flex items-center gap-1.5"><IndianRupee className="w-4 h-4" /> Salary</p>
          <p className="text-lg font-semibold text-gray-900">
            {job.salaryAmount ? `₹${job.salaryAmount} / ${job.salaryType?.toLowerCase() || 'month'}` : "Not specified"}
          </p>
        </div>
      </div>

      {/* Description */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Description & Notes</h3>
        <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
          {job.description || job.notes || "No description provided."}
        </p>
      </div>

      {/* Details Grid */}
      <div className="grid md:grid-cols-2 gap-8 pt-6 border-t border-gray-100">
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Job Info</h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between pb-2 border-b border-gray-50">
                <dt className="text-gray-500">Category</dt>
                <dd className="font-medium text-gray-900">{job.category?.name || "None"}</dd>
              </div>
              <div className="flex justify-between pb-2 border-b border-gray-50">
                <dt className="text-gray-500">Gender Preference</dt>
                <dd className="font-medium text-gray-900">{job.genderPreference || "Any"}</dd>
              </div>
              <div className="flex justify-between pb-2 border-b border-gray-50">
                <dt className="text-gray-500">Experience Required</dt>
                <dd className="font-medium text-gray-900">{job.experienceRequired || "Any"}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Location & Schedule</h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between pb-2 border-b border-gray-50">
                <dt className="text-gray-500">Location</dt>
                <dd className="font-medium text-gray-900">{job.location?.name || "Not specified"}</dd>
              </div>
              <div className="flex justify-between pb-2 border-b border-gray-50">
                <dt className="text-gray-500">Start Date</dt>
                <dd className="font-medium text-gray-900">
                  {job.startDate ? new Date(job.startDate).toLocaleDateString() : "Not specified"}
                </dd>
              </div>
              <div className="flex justify-between pb-2 border-b border-gray-50">
                <dt className="text-gray-500">Timings</dt>
                <dd className="font-medium text-gray-900">
                  {job.startTime || "TBD"} - {job.endTime || "TBD"}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

function WorkersTab({ job, refetch }) {
  // Filter only applications that are accepted or have a pending replacement/removal request
  const assignedApplications = job.applications?.filter(app => 
    ["ACCEPTED", "REPLACEMENT_REQUESTED", "REMOVAL_REQUESTED"].includes(app.status)
  ) || [];

  const handleRequestReplacement = async (appId) => {
    const reason = window.prompt("Reason for replacement:");
    if (!reason) return;
    
    try {
      await jobRequirementApi.requestWorkerReplacement(job.id, appId, reason);
      toast.success("Replacement request submitted");
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to request replacement");
    }
  };

  const handleRequestRemoval = async (appId) => {
    const reason = window.prompt("Reason for removal:");
    if (!reason) return;
    
    try {
      await jobRequirementApi.requestWorkerRemoval(job.id, appId, reason);
      toast.success("Removal request submitted");
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to request removal");
    }
  };

  if (assignedApplications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-500">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
          <Users className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-lg font-medium text-gray-900">No Workers Assigned Yet</p>
        <p className="text-sm mt-1">Workers will appear here once they are assigned to this job.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold rounded-t-xl">
          <tr>
            <th className="px-4 py-3 rounded-tl-xl">Worker Name</th>
            <th className="px-4 py-3">Code</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Phone</th>
            <th className="px-4 py-3 text-right rounded-tr-xl">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {assignedApplications.map((app) => (
            <tr key={app.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 font-medium text-gray-900">
                {app.worker?.firstName} {app.worker?.lastName}
              </td>
              <td className="px-4 py-3 text-gray-500">{app.worker?.workerCode}</td>
              <td className="px-4 py-3">
                {app.status === "ACCEPTED" && <Badge variant="success">Active</Badge>}
                {app.status === "REPLACEMENT_REQUESTED" && <Badge variant="warning">Replacement Req</Badge>}
                {app.status === "REMOVAL_REQUESTED" && <Badge variant="error">Removal Req</Badge>}
              </td>
              <td className="px-4 py-3 text-gray-500">{app.worker?.phone || "N/A"}</td>
              <td className="px-4 py-3 text-right space-x-2">
                {app.status === "ACCEPTED" && (
                  <>
                    <button 
                      onClick={() => handleRequestReplacement(app.id)}
                      className="text-xs font-medium text-orange-600 hover:text-orange-700 bg-orange-50 px-2 py-1 rounded-md"
                    >
                      Request Replacement
                    </button>
                    <button 
                      onClick={() => handleRequestRemoval(app.id)}
                      className="text-xs font-medium text-red-600 hover:text-red-700 bg-red-50 px-2 py-1 rounded-md"
                    >
                      Remove Worker
                    </button>
                  </>
                )}
                {app.status !== "ACCEPTED" && (
                  <span className="text-xs text-gray-400 italic">Request Pending</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
