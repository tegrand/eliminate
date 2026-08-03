import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Briefcase, Calendar, MapPin, Building2, CheckCircle, XCircle, Clock, Users } from "lucide-react";
import { workerApi } from "../api/worker.api";
import { format, isAfter, isBefore, isSameDay } from "date-fns";

export default function WorkerAssignmentsPage() {
  const [activeTab, setActiveTab] = useState("CURRENT");

  const { data: assignmentsData, isLoading, error } = useQuery({
    queryKey: ["workerAssignments"],
    queryFn: async () => {
      const res = await workerApi.getMyAssignments();
      return res.data ?? res;
    }
  });

  const assignments = Array.isArray(assignmentsData) ? assignmentsData : [];

  // Categorize assignments
  const categorized = useMemo(() => {
    const today = new Date();
    
    return assignments.reduce((acc, assignment) => {
      const startDate = new Date(assignment.startDate);
      const isUpcomingDate = isAfter(startDate, today) && !isSameDay(startDate, today);

      if (assignment.status === "COMPLETED") {
        acc.COMPLETED.push(assignment);
      } else if (assignment.status === "CANCELLED") {
        acc.CANCELLED.push(assignment);
      } else if (assignment.status === "ACTIVE") {
        if (isUpcomingDate) {
          acc.UPCOMING.push(assignment);
        } else {
          acc.CURRENT.push(assignment);
        }
      }
      return acc;
    }, { CURRENT: [], UPCOMING: [], COMPLETED: [], CANCELLED: [] });
  }, [assignments]);

  const tabs = [
    { id: "CURRENT", label: "Current", count: categorized.CURRENT.length },
    { id: "UPCOMING", label: "Upcoming", count: categorized.UPCOMING.length },
    { id: "COMPLETED", label: "Completed", count: categorized.COMPLETED.length },
    { id: "CANCELLED", label: "Cancelled", count: categorized.CANCELLED.length }
  ];

  const currentAssignments = categorized[activeTab] || [];

  return (
    <div className="w-full max-w-7xl mx-auto py-6 px-4 sm:px-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Assignments</h1>
        <p className="text-sm text-slate-500 mt-1">Track and manage your work assignments.</p>
      </div>

      <div className="flex border-b border-gray-200 overflow-x-auto hide-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-3 px-6 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === tab.id 
                ? "border-indigo-600 text-indigo-600" 
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.id ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-600"
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="space-y-4 pt-2">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
            Failed to load assignments.
          </div>
        ) : currentAssignments.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">No {activeTab.toLowerCase()} assignments</h3>
            <p className="text-slate-500">You don't have any assignments in this category right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 xl:gap-5">
            {currentAssignments.map(assignment => (
              <div key={assignment.id} className="bg-white rounded-xl border border-gray-200 hover:border-indigo-300 shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col h-full overflow-hidden">
                {/* Header */}
                <div className="px-3 py-2.5 border-b border-gray-50 flex items-center justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                      {assignment.hiringRequest?.jobRequirement?.requirementCode || "ASSIGNMENT"}
                    </span>
                    <h3 className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {assignment.title}
                    </h3>
                  </div>
                  
                  {assignment.status === "ACTIVE" && activeTab === "CURRENT" && (
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-bold px-2 py-0.5 rounded-md flex items-center uppercase tracking-wider whitespace-nowrap">
                      ONGOING
                    </span>
                  )}
                  {assignment.status === "COMPLETED" && (
                    <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[9px] font-bold px-2 py-0.5 rounded-md flex items-center uppercase tracking-wider whitespace-nowrap">
                      DONE
                    </span>
                  )}
                  {assignment.status === "CANCELLED" && (
                    <span className="bg-red-50 text-red-700 border border-red-200 text-[9px] font-bold px-2 py-0.5 rounded-md flex items-center uppercase tracking-wider whitespace-nowrap">
                      CANCELLED
                    </span>
                  )}
                </div>

                {/* Body */}
                <div className="px-3 py-2.5 flex-1 flex flex-col gap-2">
                  <div className="flex flex-col gap-1.5 text-xs text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="truncate font-medium">{assignment.client?.companyName || "Private Client"}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span>
                          {assignment.startDate ? format(new Date(assignment.startDate), 'MMM dd, yyyy') : 'TBD'} 
                          {assignment.endDate ? ` - ${format(new Date(assignment.endDate), 'MMM dd, yyyy')}` : ''}
                        </span>
                      </div>
                      {assignment.siteLocation?.name && (
                        <>
                          <span className="text-gray-300">|</span>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span className="line-clamp-1">{assignment.siteLocation.name}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 bg-gray-50 rounded-lg p-2 text-center border border-gray-100 transition-colors hover:bg-gray-100 flex flex-col items-center justify-center">
                      <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Required</span>
                      <span className="text-sm font-black text-gray-800">{assignment.hiringRequest?.jobRequirement?.requiredWorkers || 0}</span>
                    </div>
                    <div className="flex-1 bg-green-50/50 rounded-lg p-2 text-center border border-green-100 transition-colors hover:bg-green-50 flex flex-col items-center justify-center">
                      <span className="text-[9px] font-bold text-green-600 uppercase tracking-wider mb-0.5">Assigned</span>
                      <span className="text-sm font-black text-green-700">{assignment.hiringRequest?.jobRequirement?.assignedCount || 0}</span>
                    </div>
                    <div className="flex-1 bg-orange-50/50 rounded-lg p-2 text-center border border-orange-100 transition-colors hover:bg-orange-50 flex flex-col items-center justify-center">
                      <span className="text-[9px] font-bold text-orange-600 uppercase tracking-wider mb-0.5">Vacant</span>
                      <span className="text-sm font-black text-orange-700">{Math.max(0, (assignment.hiringRequest?.jobRequirement?.requiredWorkers || 0) - (assignment.hiringRequest?.jobRequirement?.assignedCount || 0))}</span>
                    </div>
                  </div>

                  {/* Assigned Workers List */}
                  {assignment.assignedWorkers?.length > 0 && (
                    <div className="mt-1 p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-600 flex flex-col gap-1.5">
                      <span className="font-bold text-[9px] uppercase tracking-wider text-slate-400">Assigned Team</span>
                      <div className="flex flex-wrap gap-1">
                        {assignment.assignedWorkers.map((aw, i) => (
                          <span key={i} className="bg-white px-2 py-0.5 rounded-full border border-slate-200 text-slate-700 font-medium">
                            {aw.worker?.user?.firstName} {aw.worker?.user?.lastName}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                {assignment.agreedRate && (
                  <div className="px-3 py-2 bg-emerald-50/30 border-t border-emerald-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Agreed Rate</span>
                    <span className="text-sm font-black text-emerald-700">₹{assignment.agreedRate}/day</span>
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
