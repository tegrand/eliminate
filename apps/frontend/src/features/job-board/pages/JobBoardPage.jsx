import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, Calendar, Building2 } from "lucide-react";
import { jobRequirementApi } from "../../job-requirement/api/jobRequirement.api";
import { ROUTES } from "../../../routes/routePaths";

export default function JobBoardPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      // By default, a worker should only see OPEN jobs.
      const response = await jobRequirementApi.getJobRequirements({ status: "OPEN" });
      setJobs(response || []);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Job Board</h1>
        <p className="mt-2 text-sm text-gray-500">Find and apply for open shifts.</p>
      </div>

      <div className="grid gap-6">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading jobs...</div>
        ) : jobs.length > 0 ? (
          jobs.map(job => (
            <div key={job.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{job.title || job.jobTitle}</h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Building2 className="h-4 w-4 mr-1"/>
                    {job.client?.companyName || job.client || "Direct Client"}
                  </div>
                </div>
                <Link to={ROUTES.JOB_BOARD_DETAILS.replace(":id", job.id)} className="bg-amber-500 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-amber-600 transition-colors shrink-0 text-center">
                  View Details
                </Link>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-100 flex flex-wrap gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <Briefcase className="h-4 w-4 text-amber-500"/>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Openings</p>
                    <p className="font-medium text-gray-900">{job.requiredWorkers}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <Calendar className="h-4 w-4 text-amber-500"/>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Start Date</p>
                    <p className="font-medium text-gray-900">{job.startDate ? new Date(job.startDate).toLocaleDateString() : "Flexible"}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No open jobs found</h3>
            <p className="mt-1 text-gray-500">Check back later for new opportunities.</p>
          </div>
        )}
      </div>
    </div>
  );
}
