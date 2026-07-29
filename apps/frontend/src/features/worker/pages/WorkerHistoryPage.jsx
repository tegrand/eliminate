import { useQuery } from "@tanstack/react-query";
import { History, Building2, Calendar, Clock, IndianRupee, Loader2, MapPin } from "lucide-react";
import { workerApi } from "../api/worker.api";
import { format } from "date-fns";

export default function WorkerHistoryPage() {
  const { data: historyData, isLoading, error } = useQuery({
    queryKey: ["workerHistory", { status: "COMPLETED" }],
    queryFn: async () => {
      const res = await workerApi.getMyAssignments({ status: "COMPLETED" });
      return res.data ?? res;
    }
  });

  const completedJobs = Array.isArray(historyData) ? historyData : [];

  return (
    <div className="w-full max-w-5xl mx-auto py-8 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Work History</h1>
        <p className="text-sm text-slate-500 mt-1">Review your completed jobs and assignments.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-600 border-b border-red-100">
            Failed to load work history.
          </div>
        ) : completedJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[400px] text-center p-6">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <History className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No history yet</h3>
            <p className="text-slate-500">Completed assignments will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {completedJobs.map(job => (
              <div key={job.id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
                    <div className="text-xs text-slate-500 mt-1">ID: {job.assignmentCode}</div>
                  </div>
                  {job.agreedRate && (
                    <span className="text-sm font-bold text-emerald-600 flex items-center bg-emerald-50 px-2.5 py-1 rounded-full">
                      <IndianRupee className="w-4 h-4 mr-1" /> {job.agreedRate}/day
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                  {/* Company / Client */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Client / Company</span>
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <Building2 className="w-4 h-4 text-slate-400" />
                      <span className="font-medium truncate">{job.client?.companyName || `${job.client?.user?.firstName} ${job.client?.user?.lastName}`}</span>
                    </div>
                  </div>

                  {/* Agency (if any) */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Agency</span>
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <Building2 className="w-4 h-4 text-blue-400" />
                      <span className="font-medium truncate">{job.agency?.user?.firstName ? `${job.agency?.user?.firstName} ${job.agency?.user?.lastName}` : "Independent"}</span>
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Duration</span>
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className="font-medium truncate">
                        {job.startDate ? format(new Date(job.startDate), 'MMM dd, yyyy') : 'N/A'} - {job.endDate ? format(new Date(job.endDate), 'MMM dd, yyyy') : 'N/A'}
                      </span>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Location</span>
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span className="font-medium truncate">{job.siteLocation?.name || "Multiple / On-site"}</span>
                    </div>
                  </div>
                </div>

                {job.description && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-sm text-slate-600 line-clamp-2">{job.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
