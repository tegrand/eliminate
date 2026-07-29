import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Users, UserRound, Clock3, CalendarCheck, CalendarDays, Activity, UserPlus, Loader2, Building2, CheckCircle } from "lucide-react";
import api from "../../../api/axios";
import AssignWorkerModal from "../components/AssignWorkerModal";

export default function AssignmentDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const { data: assignment, isLoading, error } = useQuery({
    queryKey: ["assignment", id],
    queryFn: async () => {
      const res = await api.get(`/assignments/${id}`);
      return res.data?.data || res.data;
    }
  });

  if (isLoading) {
    return <div className="flex justify-center items-center h-[calc(100vh-4rem)]"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;
  }

  if (error || !assignment) {
    return <div className="flex justify-center items-center h-[calc(100vh-4rem)] text-red-600 font-medium">Failed to load assignment details.</div>;
  }

  const assignedWorkers = assignment.assignedWorkers || [];

  // Calculate Progress
  let progress = 0;
  if (assignment.startDate && assignment.endDate) {
    const start = new Date(assignment.startDate).getTime();
    const end = new Date(assignment.endDate).getTime();
    const now = new Date().getTime();
    
    if (now >= end) {
      progress = 100;
    } else if (now <= start) {
      progress = 0;
    } else {
      progress = Math.round(((now - start) / (end - start)) * 100);
    }
  } else if (assignment.status === 'COMPLETED') {
    progress = 100;
  } else if (assignment.status === 'ACTIVE') {
    progress = 50; // default indeterminate progress
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in space-y-6 h-[calc(100vh-4rem)] overflow-y-auto scrollbar-hide">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/assignments"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors mb-4 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Assignments
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">{assignment.title}</h1>
            <div className={`px-3 py-1 rounded-full text-xs font-bold border ${
              assignment.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
              assignment.status === 'COMPLETED' ? 'bg-blue-50 text-blue-700 border-blue-200' :
              'bg-gray-50 text-gray-600 border-gray-200'
            }`}>
              {assignment.status}
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500 font-mono">
            {assignment.assignmentCode}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsAssignModalOpen(true)}
            className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-sm px-4 py-2.5 rounded-xl shadow-sm transition-colors flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" /> Assign Worker
          </button>
          <button 
            onClick={() => navigate("/attendance/bulk")} 
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-sm shadow-indigo-200 transition-colors flex items-center gap-2"
          >
            <Clock3 className="w-4 h-4" /> Mark Attendance
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Assignment Tracking & Progress (Spans 2 columns on lg) */}
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-2 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Assignment Tracking</h2>
              <p className="text-sm text-gray-500">Current progress and timeline.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1.5 mb-1"><CalendarDays className="w-3.5 h-3.5" /> Start Date</span>
              <span className="text-sm font-bold text-gray-900">{assignment.startDate ? new Date(assignment.startDate).toLocaleDateString() : 'N/A'}</span>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1.5 mb-1"><CalendarCheck className="w-3.5 h-3.5" /> End Date</span>
              <span className="text-sm font-bold text-gray-900">{assignment.endDate ? new Date(assignment.endDate).toLocaleDateString() : 'N/A'}</span>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1.5 mb-1"><Users className="w-3.5 h-3.5" /> Workers</span>
              <span className="text-sm font-bold text-gray-900">{assignedWorkers.length} Assigned</span>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1.5 mb-1"><Activity className="w-3.5 h-3.5" /> Status</span>
              <span className={`text-sm font-bold ${assignment.status === 'ACTIVE' ? 'text-emerald-600' : 'text-gray-900'}`}>{assignment.status}</span>
            </div>
          </div>

          <div className="mt-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">Overall Progress</span>
              <span className="text-sm font-bold text-indigo-600">{progress}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5">
              <div 
                className="bg-indigo-600 h-2.5 rounded-full transition-all duration-1000" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </section>

        {/* Overview & Attendance (Spans 1 column on lg) */}
        <div className="space-y-6">
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Overview</h2>
            <div className="space-y-4">
              {assignment.client && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm font-semibold text-gray-500 flex items-center gap-2"><Building2 className="w-4 h-4" /> Client</span>
                  <span className="text-sm font-bold text-gray-900">{assignment.client.companyName || assignment.client.user?.firstName}</span>
                </div>
              )}
              {assignment.agency && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm font-semibold text-gray-500 flex items-center gap-2"><Users className="w-4 h-4" /> Agency</span>
                  <span className="text-sm font-bold text-gray-900">{assignment.agency.agencyName || assignment.agency.user?.firstName}</span>
                </div>
              )}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm font-semibold text-gray-500">Agreed Rate</span>
                <span className="text-sm font-bold text-emerald-600">{assignment.agreedRate ? `₹${assignment.agreedRate}` : 'TBD'}</span>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-100 bg-indigo-50 p-6 shadow-sm border-indigo-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Clock3 className="w-24 h-24 text-indigo-600" />
            </div>
            <h2 className="text-lg font-bold text-indigo-900 mb-2 relative z-10">Attendance</h2>
            <p className="text-sm text-indigo-700/80 mb-4 relative z-10">Track daily attendance for workers assigned to this project.</p>
            <button 
              onClick={() => navigate("/attendance/bulk")}
              className="w-full bg-white text-indigo-600 hover:bg-indigo-600 hover:text-white border border-indigo-200 transition-colors font-bold text-sm px-4 py-2.5 rounded-xl shadow-sm relative z-10 flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" /> View Attendance
            </button>
          </section>
        </div>

        {/* Assigned Workers (Full width below) */}
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Assigned Workers</h2>
                <p className="text-sm text-gray-500">Workers attached to this assignment.</p>
              </div>
            </div>
            <span className="bg-emerald-100 text-emerald-700 font-bold px-2.5 py-1 rounded-lg text-sm">{assignedWorkers.length}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignedWorkers.length === 0 ? (
              <div className="col-span-full text-center p-8 bg-gray-50 rounded-xl border border-gray-100 border-dashed text-gray-500 text-sm">
                No workers assigned yet. Click 'Assign Worker' to add someone to this assignment.
              </div>
            ) : (
              assignedWorkers.map((aw) => {
                const w = aw.worker;
                const name = `${w?.user?.firstName || w?.firstName} ${w?.user?.lastName || w?.lastName || ''}`.trim();
                return (
                  <div key={aw.id} className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 p-4 hover:border-emerald-100 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <UserRound className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-gray-900 truncate">{name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded ${aw.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{aw.status}</span>
                          <span className="text-xs text-gray-500 truncate">{w?.workerCode || w?.id.substring(0,8)}</span>
                        </div>
                      </div>
                    </div>
                    <Link to={`/workers/${w.id}`} className="text-sm font-semibold text-emerald-600 hover:text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      View
                    </Link>
                  </div>
                );
              })
            )}
          </div>
        </section>

      </div>
      
      <AssignWorkerModal 
        isOpen={isAssignModalOpen} 
        onClose={() => setIsAssignModalOpen(false)} 
        assignmentId={id} 
      />
    </div>
  );
}
