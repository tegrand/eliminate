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
    <div className="w-full max-w-5xl mx-auto py-8 space-y-6 animate-fade-in">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentAssignments.map(assignment => (
              <div key={assignment.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-5 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-slate-900">{assignment.title}</h3>
                  {assignment.status === "ACTIVE" && activeTab === "CURRENT" && (
                    <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded flex items-center uppercase tracking-wide">
                      <Clock className="w-3 h-3 mr-1" /> Ongoing
                    </span>
                  )}
                  {assignment.status === "COMPLETED" && (
                    <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded flex items-center uppercase tracking-wide">
                      <CheckCircle className="w-3 h-3 mr-1" /> Done
                    </span>
                  )}
                  {assignment.status === "CANCELLED" && (
                    <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-1 rounded flex items-center uppercase tracking-wide">
                      <XCircle className="w-3 h-3 mr-1" /> Cancelled
                    </span>
                  )}
                </div>

                <div className="space-y-2 mt-2 flex-1">
                  <div className="flex items-center text-sm text-slate-600 gap-2">
                    <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="truncate">{assignment.client?.companyName || "Private Client"}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-600 gap-2">
                    <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>
                      {assignment.startDate ? format(new Date(assignment.startDate), 'MMM dd, yyyy') : 'TBD'} 
                      {assignment.endDate ? ` - ${format(new Date(assignment.endDate), 'MMM dd, yyyy')}` : ''}
                    </span>
                  </div>
                  {assignment.siteLocation?.name && (
                    <div className="flex items-center text-sm text-slate-600 gap-2">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="truncate">{assignment.siteLocation.name}</span>
                    </div>
                  )}
                  <div className="flex flex-col gap-1 mt-2 text-sm text-slate-600 border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-400" />
                      <span>{assignment.hiringRequest?.jobRequirement?.requiredWorkers || 0} Required</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-green-400" />
                      <span>{assignment.hiringRequest?.jobRequirement?.assignedCount || 0} Assigned</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-orange-400" />
                      <span>{Math.max(0, (assignment.hiringRequest?.jobRequirement?.requiredWorkers || 0) - (assignment.hiringRequest?.jobRequirement?.assignedCount || 0))} Vacanc{Math.max(0, (assignment.hiringRequest?.jobRequirement?.requiredWorkers || 0) - (assignment.hiringRequest?.jobRequirement?.assignedCount || 0)) === 1 ? 'y' : 'ies'}</span>
                    </div>
                    {assignment.assignedWorkers?.length > 0 && (
                      <div className="mt-2 text-xs text-slate-500">
                        <span className="font-semibold text-slate-700">Assigned Workers: </span>
                        {assignment.assignedWorkers.map((aw, i) => (
                          <span key={i}>
                            {aw.worker?.user?.firstName} {aw.worker?.user?.lastName}
                            {i < assignment.assignedWorkers.length - 1 ? ", " : ""}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                {assignment.agreedRate && (
                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 uppercase">Agreed Rate</span>
                    <span className="text-sm font-bold text-emerald-600">₹{assignment.agreedRate}/day</span>
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
