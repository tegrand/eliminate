import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, MapPin, Briefcase, IndianRupee, Loader2, Star, CheckCircle2, X, Clock, Heart, Building2 } from "lucide-react";
import { toast } from "sonner";
import { workerApi } from "../api/worker.api";
import Button from "../../../components/ui/button/Button";

export default function WorkerMarketplacePage() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    skillId: "",
    locationId: "",
    minWage: "",
    duration: ""
  });

  const { data: profile } = useQuery({
    queryKey: ["workerProfile"],
    queryFn: async () => {
      const res = await workerApi.getMyWorkerProfile();
      return res.data ?? res;
    }
  });

  const { data: jobsResponse, isLoading, error } = useQuery({
    queryKey: ["marketplaceJobs", filters],
    queryFn: async () => {
      const res = await workerApi.getMarketplaceJobs(filters);
      return res.data ?? res;
    },
    enabled: profile?.profileStatus === "APPROVED"
  });

  const jobs = Array.isArray(jobsResponse) ? jobsResponse : [];

  const handleFilterChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Mutations
  const applyMutation = useMutation({
    mutationFn: (id) => workerApi.applyForMarketplaceJob(id),
    onSuccess: () => {
      toast.success("Applied successfully!");
      queryClient.invalidateQueries(["marketplaceJobs"]);
    },
    onError: (e) => toast.error(e.response?.data?.message || "Failed to apply")
  });

  const saveMutation = useMutation({
    mutationFn: (id) => workerApi.saveMarketplaceJob(id),
    onSuccess: () => {
      toast.success("Job saved successfully!");
      queryClient.invalidateQueries(["marketplaceJobs"]);
    },
    onError: (e) => toast.error("Failed to save job")
  });

  const ignoreMutation = useMutation({
    mutationFn: (id) => workerApi.ignoreMarketplaceJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["marketplaceJobs"]);
    }
  });

  if (profile?.profileStatus !== "APPROVED") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6 bg-white rounded-2xl border border-slate-200 mt-8 max-w-2xl mx-auto">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8 text-amber-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Verification Required</h2>
        <p className="text-slate-500">
          The Open Requirement Marketplace is only available to verified workers. 
          Please complete your profile and wait for admin approval.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto py-8 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Job Marketplace</h1>
        <p className="text-sm text-slate-500 mt-1">Find and apply for open requirements directly.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Sidebar */}
        <div className="w-full lg:w-64 shrink-0 space-y-6 bg-white p-5 rounded-2xl border border-slate-200 h-fit">
          <div className="flex items-center gap-2 font-bold text-slate-900 pb-4 border-b border-slate-100">
            <Search className="w-5 h-5 text-indigo-500" />
            Filters
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Minimum Daily Wage</label>
              <input
                type="number"
                name="minWage"
                value={filters.minWage}
                onChange={handleFilterChange}
                placeholder="e.g. 1000"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Duration</label>
              <select
                name="duration"
                value={filters.duration}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All</option>
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
          </div>
        </div>

        {/* Jobs List */}
        <div className="flex-1 space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
          ) : error ? (
            <div className="p-4 text-red-600 bg-red-50 rounded-xl border border-red-100">
              Failed to load jobs. Please try again.
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">No Jobs Found</h3>
              <p className="text-slate-500">Try adjusting your filters to see more results.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs.map(job => (
                <div key={job.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col group relative overflow-hidden">
                  
                  {/* Dismiss Button */}
                  <button 
                    onClick={() => ignoreMutation.mutate(job.id)}
                    className="absolute top-3 right-3 p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    title="Not interested"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 pr-8">{job.title}</h3>
                    
                    <div className="flex items-center gap-2 mt-2 text-sm text-slate-600">
                      <Building2 className="w-4 h-4 text-slate-400" />
                      <span>{job.client?.companyName || "Private Client"}</span>
                      {job.client?.rating > 0 && (
                        <div className="flex items-center text-amber-500 text-xs font-medium ml-2 bg-amber-50 px-1.5 py-0.5 rounded">
                          <Star className="w-3 h-3 fill-current mr-1" />
                          {job.client.rating.toFixed(1)}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span className="truncate">{job.location?.name || "Multiple Locations"}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <IndianRupee className="w-4 h-4 text-slate-400" />
                        <span className="font-semibold text-emerald-600">
                          {job.salaryAmount ? `₹${job.salaryAmount}/day` : "Negotiable"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span>{job.duration || "Standard"}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Briefcase className="w-4 h-4 text-slate-400" />
                        <span>{job.requiredWorkers} workers req.</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-100">
                    <Button 
                      variant="outline"
                      className="flex-1 hover:bg-rose-50 text-slate-600 hover:text-rose-600 hover:border-rose-200"
                      onClick={() => saveMutation.mutate(job.id)}
                      isLoading={saveMutation.isPending && saveMutation.variables === job.id}
                      disabled={applyMutation.isPending || saveMutation.isPending || ignoreMutation.isPending}
                    >
                      <Heart className="w-4 h-4 mr-1.5" />
                      Interested
                    </Button>
                    <Button 
                      className="flex-1"
                      onClick={() => applyMutation.mutate(job.id)}
                      isLoading={applyMutation.isPending && applyMutation.variables === job.id}
                      disabled={applyMutation.isPending || saveMutation.isPending || ignoreMutation.isPending}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1.5" />
                      Apply Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
