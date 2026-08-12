import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Users, Loader2, Check, UserPlus, X, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { assignmentApi } from "../../../api/assignment.api";

export default function AssignWorkersPanel({ assignmentId, requiredWorkers }) {
  const queryClient = useQueryClient();

  const { data: workers, isLoading } = useQuery({
    queryKey: ["agencyWorkersForAssignment", assignmentId],
    queryFn: async () => {
      const res = await assignmentApi.getAgencyWorkers(assignmentId);
      return res.data?.data || res.data || [];
    },
    enabled: !!assignmentId
  });

  const assignMutation = useMutation({
    mutationFn: (workerId) => assignmentApi.assignWorker(assignmentId, workerId),
    onSuccess: () => {
      toast.success("Worker assigned successfully");
      queryClient.invalidateQueries(["agencyWorkersForAssignment", assignmentId]);
      queryClient.invalidateQueries(["hiringRequest"]); // To update any assignment stats
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to assign worker");
    }
  });

  const removeMutation = useMutation({
    mutationFn: (workerId) => assignmentApi.removeWorker(assignmentId, workerId),
    onSuccess: () => {
      toast.success("Worker removed successfully");
      queryClient.invalidateQueries(["agencyWorkersForAssignment", assignmentId]);
      queryClient.invalidateQueries(["hiringRequest"]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to remove worker");
    }
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex justify-center py-10">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  const assignedCount = workers?.filter(w => w.isAlreadyAssigned)?.length || 0;
  const isFull = assignedCount >= requiredWorkers;

  return (
    <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
          <Users className="w-4 h-4 text-indigo-500" /> Assign Workers
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 uppercase">Assigned:</span>
          <span className={`px-2 py-0.5 rounded text-xs font-bold ${isFull ? 'bg-green-100 text-green-700' : 'bg-indigo-100 text-indigo-700'}`}>
            {assignedCount} / {requiredWorkers}
          </span>
        </div>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
        {workers?.length === 0 ? (
          <p className="text-sm text-gray-500 italic text-center py-4">No active workers found in your agency.</p>
        ) : (
          workers?.map(worker => (
            <div 
              key={worker.workerId} 
              className={`flex items-center justify-between p-3 rounded-lg border ${
                worker.isAlreadyAssigned 
                  ? 'border-indigo-200 bg-indigo-50' 
                  : worker.hasDateConflict 
                    ? 'border-red-100 bg-red-50 opacity-75' 
                    : 'border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-white'
              } transition-colors`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden border border-white shadow-sm">
                  {worker.avatar ? (
                    <img src={worker.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <UserPlus className="w-5 h-5 text-gray-400 m-2.5" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{worker.firstName} {worker.lastName}</p>
                  <p className="text-xs text-gray-500 font-mono">{worker.workerCode} • {worker.jobType}</p>
                  {worker.hasDateConflict && !worker.isAlreadyAssigned && (
                    <p className="text-[10px] font-semibold text-red-600 flex items-center gap-1 mt-0.5">
                      <AlertCircle className="w-3 h-3" /> Already assigned on these dates
                    </p>
                  )}
                </div>
              </div>

              <div>
                {worker.isAlreadyAssigned ? (
                  <button
                    onClick={() => removeMutation.mutate(worker.workerId)}
                    disabled={removeMutation.isPending}
                    className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-bold"
                  >
                    <X className="w-4 h-4" /> Remove
                  </button>
                ) : (
                  <button
                    onClick={() => assignMutation.mutate(worker.workerId)}
                    disabled={worker.hasDateConflict || assignMutation.isPending || (isFull && assignedCount >= requiredWorkers)}
                    className="px-3 py-1.5 bg-indigo-600 text-white font-semibold text-xs rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" /> Assign
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
