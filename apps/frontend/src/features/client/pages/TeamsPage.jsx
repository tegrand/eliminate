import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { companyApi } from "../api/company.api";
import { Users2, Plus, Trash2, Edit, Loader2, UserMinus } from "lucide-react";
import { toast } from "sonner";
import { Modal } from "../../../components/ui/modal/Modal";

export default function TeamsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [formData, setFormData] = useState({ name: "" });

  const { data: response, isLoading } = useQuery({
    queryKey: ["company", "teams"],
    queryFn: () => companyApi.getTeams(),
  });
  const teams = response?.data?.data || [];

  const createMutation = useMutation({
    mutationFn: (data) => companyApi.createTeam(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["company", "teams"]);
      toast.success("Team created successfully");
      setIsModalOpen(false);
    },
    onError: (e) => toast.error(e.response?.data?.message || "Failed to create team"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => companyApi.updateTeam(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["company", "teams"]);
      toast.success("Team updated successfully");
      setIsModalOpen(false);
    },
    onError: (e) => toast.error(e.response?.data?.message || "Failed to update team"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => companyApi.deleteTeam(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["company", "teams"]);
      toast.success("Team deleted successfully");
    },
    onError: (e) => toast.error(e.response?.data?.message || "Failed to delete team"),
  });

  const removeMemberMutation = useMutation({
    mutationFn: ({ teamId, workerId }) => companyApi.removeTeamMember(teamId, workerId),
    onSuccess: () => {
      queryClient.invalidateQueries(["company", "teams"]);
      toast.success("Worker removed from team");
    },
    onError: (e) => toast.error(e.response?.data?.message || "Failed to remove member"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingTeam) {
      updateMutation.mutate({ id: editingTeam.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const openModal = (team = null) => {
    if (team) {
      setEditingTeam(team);
      setFormData({ name: team.name });
    } else {
      setEditingTeam(null);
      setFormData({ name: "" });
    }
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users2 className="w-6 h-6 text-indigo-600" />
            Team Management
          </h1>
          <p className="text-slate-500 mt-1">Create teams and manage worker groups for bulk assignments.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> New Team
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      ) : teams.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">No teams found</h3>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">Create teams to quickly assign multiple workers to a project or site.</p>
          <button onClick={() => openModal()} className="bg-indigo-50 text-indigo-600 px-6 py-2.5 rounded-xl font-medium hover:bg-indigo-100 transition-colors">
            Create Team
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {teams.map((team) => (
            <div key={team.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow group relative">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-slate-900 text-lg pr-8">{team.name}</h3>
                <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md text-xs font-bold">
                  {team.members?.length || 0} Members
                </span>
              </div>
              
              <div className="space-y-2 mt-4 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                {team.members?.map((member) => (
                  <div key={member.id} className="flex justify-between items-center p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 group/member">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">
                        {member.worker.firstName[0]}{member.worker.lastName?.[0] || ""}
                      </div>
                      <div className="truncate">
                        <p className="text-sm font-semibold text-slate-900">{member.worker.firstName} {member.worker.lastName}</p>
                        <p className="text-[10px] text-slate-500">{member.worker.phone || "No phone"}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => { if(confirm("Remove worker from team?")) removeMemberMutation.mutate({ teamId: team.id, workerId: member.workerId }) }}
                      className="text-slate-400 hover:text-red-500 opacity-0 group-hover/member:opacity-100 transition-opacity p-1"
                      title="Remove from team"
                    >
                      <UserMinus className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                
                {(!team.members || team.members.length === 0) && (
                  <p className="text-sm text-slate-500 italic text-center py-4 bg-slate-50 rounded-lg">No workers in this team yet.</p>
                )}
              </div>

              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 bg-white/90 backdrop-blur-sm p-1 rounded-lg border border-slate-100 shadow-sm">
                <button onClick={() => openModal(team)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md"><Edit className="w-4 h-4" /></button>
                <button 
                  onClick={() => { if(confirm("Delete this team?")) deleteMutation.mutate(team.id); }} 
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-md"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingTeam ? "Edit Team" : "Create New Team"}
        className="sm:max-w-[400px]"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Team Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g. Alpha Squad, Plumbers Unit 1"
              />
            </div>
            
            <div className="mt-6 flex justify-end gap-3 border-t pt-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-70 flex items-center gap-2"
              >
                {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingTeam ? "Save Changes" : "Create"}
              </button>
            </div>
          </form>
      </Modal>
    </div>
  );
}
