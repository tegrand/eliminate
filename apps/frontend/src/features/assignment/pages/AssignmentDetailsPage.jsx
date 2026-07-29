import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Users, UserRound, Clock3, RefreshCcw, UserPlus, Loader2, Building2 } from "lucide-react";
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
  const primaryWorker = assignedWorkers[0]?.worker;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in space-y-6 h-[calc(100vh-4rem)] overflow-y-auto">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Info Card */}
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Assignment Overview</h2>
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
              <span className="text-sm font-semibold text-gray-500 flex items-center gap-2"><Clock3 className="w-4 h-4" /> Start Date</span>
              <span className="text-sm font-bold text-gray-900">{assignment.startDate ? new Date(assignment.startDate).toLocaleDateString() : 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-sm font-semibold text-gray-500">Agreed Rate</span>
              <span className="text-sm font-bold text-emerald-600">{assignment.agreedRate ? `₹${assignment.agreedRate}` : 'TBD'}</span>
            </div>
          </div>
        </section>

        {/* Assigned Workers */}
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Assigned Workers</h2>
                <p className="text-sm text-gray-500">Workers attached to this assignment.</p>
              </div>
            </div>
            <span className="bg-indigo-100 text-indigo-700 font-bold px-2.5 py-1 rounded-lg text-sm">{assignedWorkers.length}</span>
          </div>

          <div className="space-y-3">
            {assignedWorkers.length === 0 ? (
              <div className="text-center p-6 bg-gray-50 rounded-xl border border-gray-100 border-dashed text-gray-500 text-sm">
                No workers assigned yet. Click 'Assign Worker' to add someone.
              </div>
            ) : (
              assignedWorkers.map((aw) => {
                const w = aw.worker;
                const name = `${w?.user?.firstName || w?.firstName} ${w?.user?.lastName || w?.lastName || ''}`.trim();
                return (
                  <div key={aw.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-gray-100 p-4 hover:border-indigo-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <UserRound className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded ${aw.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{aw.status}</span>
                          <span className="text-xs text-gray-500">{w?.workerCode || w?.id.substring(0,8)}</span>
                        </div>
                      </div>
                    </div>
                    <Link to={`/workers/${w.id}`} className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-lg">
                      View Profile
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
