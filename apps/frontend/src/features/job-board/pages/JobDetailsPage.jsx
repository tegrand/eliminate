import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Briefcase, Calendar, Building2, MapPin, DollarSign, Clock, ArrowLeft } from "lucide-react";
import { jobRequirementApi } from "../../job-requirement/api/jobRequirement.api";
import { ROUTES } from "../../../routes/routePaths";
import { toast } from "react-hot-toast";

export default function JobDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      const response = await jobRequirementApi.getJobRequirement(id);
      setJob(response);
    } catch (error) {
      console.error("Failed to fetch job details:", error);
      toast.error("Failed to load job details.");
      navigate(ROUTES.JOB_BOARD);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    setApplying(true);
    try {
      await jobRequirementApi.applyForJob(id, "Applied from Job Board");
      toast.success("Successfully applied for this job!");
      navigate(ROUTES.JOB_BOARD);
    } catch (error) {
      console.error("Application failed:", error);
      toast.error(error?.response?.data?.message || "Failed to apply. You may have already applied.");
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-gray-500">Loading job details...</div>;
  }

  if (!job) return null;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <button 
        onClick={() => navigate(ROUTES.JOB_BOARD)}
        className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Job Board
      </button>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 shadow-sm">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
          <div>
            <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 mb-4 border border-amber-200">
              {job.priority || "Standard Priority"}
            </span>
            <h1 className="text-3xl font-bold text-gray-900">{job.title || job.jobTitle}</h1>
            <div className="flex items-center text-base text-gray-500 mt-2">
              <Building2 className="h-5 w-5 mr-2 text-gray-400"/>
              {job.client?.companyName || job.client || "Direct Client"}
            </div>
          </div>
          <button 
            onClick={handleApply}
            disabled={applying}
            className="w-full md:w-auto bg-gray-900 text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {applying ? "Applying..." : "Apply Now"}
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10 pt-10 border-t border-gray-100">
          <div>
            <p className="text-sm font-medium text-gray-500 flex items-center mb-1"><Briefcase className="h-4 w-4 mr-1.5"/> Openings</p>
            <p className="text-lg font-semibold text-gray-900">{job.requiredWorkers}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 flex items-center mb-1"><DollarSign className="h-4 w-4 mr-1.5"/> Pay Rate</p>
            <p className="text-lg font-semibold text-gray-900">{job.salaryAmount ? `$${job.salaryAmount}` : "Negotiable"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 flex items-center mb-1"><Calendar className="h-4 w-4 mr-1.5"/> Starts</p>
            <p className="text-lg font-semibold text-gray-900">{job.startDate ? new Date(job.startDate).toLocaleDateString() : "Flexible"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 flex items-center mb-1"><MapPin className="h-4 w-4 mr-1.5"/> Location</p>
            <p className="text-lg font-semibold text-gray-900">{job.location?.name || "Multiple Locations"}</p>
          </div>
        </div>

        <div className="mt-10 pt-10 border-t border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Job Description</h3>
          <div className="prose max-w-none text-gray-600 space-y-4">
            <p>{job.description || "No detailed description provided."}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
