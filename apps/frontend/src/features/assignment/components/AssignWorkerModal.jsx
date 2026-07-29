import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Search, UserCheck, Loader2 } from "lucide-react";
import api from "../../../api/axios";
import toast from "react-hot-toast";
import { useAuth } from "../../../hooks/useAuth";

export default function AssignWorkerModal({ isOpen, onClose, assignmentId }) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [search, setSearch] = useState("");

  const { data: workers = [], isLoading } = useQuery({
    queryKey: ["agencyWorkersForAssignment", user?.agencyProfile?.id || user?.id],
    queryFn: async () => {
      // Fetch all workers. The backend should ideally filter by agencyId if the user is an AGENCY.
      const res = await api.get("/workers");
      const allWorkers = res.data?.items || res.data?.workers || res.data || [];
      return allWorkers; // we can do client side filter if needed, but assuming backend handles it
    },
    enabled: isOpen
  });

  const assignWorkerMutation = useMutation({
    mutationFn: (workerId) => api.post(`/assignments/${assignmentId}/workers`, { workerId }),
    onSuccess: () => {
      toast.success("Worker assigned successfully!");
      queryClient.invalidateQueries(["assignment", assignmentId]);
      onClose();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to assign worker");
    }
  });

  const filteredWorkers = workers.filter(w => {
    const name = `${w.user?.firstName || w.firstName} ${w.user?.lastName || w.lastName}`.toLowerCase();
    return name.includes(search.toLowerCase());
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[85vh] flex flex-col overflow-hidden animate-slide-up">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Assign Worker</h2>
            <p className="text-xs text-gray-500">Select a worker from your pool.</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text"
              placeholder="Search workers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {isLoading ? (
            <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-indigo-600" /></div>
          ) : filteredWorkers.length === 0 ? (
            <div className="text-center py-10 text-sm text-gray-500">No workers found.</div>
          ) : (
            filteredWorkers.map(worker => {
              const name = `${worker.user?.firstName || worker.firstName} ${worker.user?.lastName || worker.lastName || ""}`.trim() || "Unknown";
              return (
                <div key={worker.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/50 transition-colors">
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">{name}</h4>
                    <p className="text-xs text-gray-500">{worker.primarySkill?.name || worker.primarySkill || "General"}</p>
                  </div>
                  <button
                    onClick={() => assignWorkerMutation.mutate(worker.id)}
                    disabled={assignWorkerMutation.isPending}
                    className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                  >
                    <UserCheck className="w-3.5 h-3.5" /> Assign
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
