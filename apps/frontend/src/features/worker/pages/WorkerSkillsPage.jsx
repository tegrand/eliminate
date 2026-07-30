import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Wrench, Plus, Trash2, Loader2, Edit2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { workerApi } from "../api/worker.api";
import { skillsApi } from "../../../api/skills.api";
import { Modal } from "../../../components/ui/modal/Modal";
import Button from "../../../components/ui/button/Button";

const PROFICIENCIES = [
  { value: "BEGINNER", label: "Beginner" },
  { value: "INTERMEDIATE", label: "Intermediate" },
  { value: "ADVANCED", label: "Advanced" },
  { value: "EXPERT", label: "Expert" }
];

export default function WorkerSkillsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [editingSkill, setEditingSkill] = useState(null);
  const [selectedSkillId, setSelectedSkillId] = useState("");
  const [proficiency, setProficiency] = useState("BEGINNER");
  const [experience, setExperience] = useState("");

  // 1. Get the current worker profile to know the workerId
  const { data: workerProfile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["workerProfile"],
    queryFn: async () => {
      const res = await workerApi.getMyWorkerProfile();
      return res.data ?? res;
    }
  });

  const workerId = workerProfile?.id;

  // 2. Fetch worker's current skills
  const { data: workerSkills = [], isLoading: isSkillsLoading } = useQuery({
    queryKey: ["workerSkills", workerId],
    queryFn: async () => {
      const res = await workerApi.getWorkerSkills(workerId);
      return res.data ?? res;
    },
    enabled: !!workerId
  });

  // 3. Fetch all global skills for the dropdown
  const { data: globalSkillsData, isLoading: isGlobalSkillsLoading } = useQuery({
    queryKey: ["globalSkills"],
    queryFn: async () => {
      const res = await skillsApi.getSkills({ limit: 100 });
      return res.data ?? res;
    }
  });

  const globalSkills = globalSkillsData?.items || [];

  // Mutations
  const addMutation = useMutation({
    mutationFn: (data) => workerApi.assignSkill(workerId, data),
    onSuccess: () => {
      toast.success("Skill added successfully");
      queryClient.invalidateQueries(["workerSkills", workerId]);
      closeModal();
    },
    onError: (e) => toast.error(e.response?.data?.message || "Failed to add skill")
  });

  const updateMutation = useMutation({
    mutationFn: (data) => workerApi.updateWorkerSkill(workerId, data.skillId, data.payload),
    onSuccess: () => {
      toast.success("Skill updated successfully");
      queryClient.invalidateQueries(["workerSkills", workerId]);
      closeModal();
    },
    onError: (e) => toast.error(e.response?.data?.message || "Failed to update skill")
  });

  const deleteMutation = useMutation({
    mutationFn: (skillId) => workerApi.deleteWorkerSkill(workerId, skillId),
    onSuccess: () => {
      toast.success("Skill removed");
      queryClient.invalidateQueries(["workerSkills", workerId]);
    },
    onError: (e) => toast.error("Failed to remove skill")
  });

  const isLoading = isProfileLoading || isSkillsLoading || isGlobalSkillsLoading;

  const openModal = (skill = null) => {
    if (skill) {
      setEditingSkill(skill);
      setSelectedSkillId(skill.skillId);
      setProficiency(skill.proficiencyLevel);
      setExperience(skill.experienceYears || "");
    } else {
      setEditingSkill(null);
      setSelectedSkillId("");
      setProficiency("BEGINNER");
      setExperience("");
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSkill(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedSkillId) {
      toast.error("Please select a skill");
      return;
    }

    const payload = {
      skillId: selectedSkillId,
      proficiencyLevel: proficiency,
      experienceYears: experience ? parseInt(experience) : null,
      isPrimary: false
    };

    if (editingSkill) {
      updateMutation.mutate({ skillId: selectedSkillId, payload });
    } else {
      addMutation.mutate(payload);
    }
  };

  const handleDelete = (skillId) => {
    if (window.confirm("Are you sure you want to remove this skill?")) {
      deleteMutation.mutate(skillId);
    }
  };

  const availableSkills = globalSkills.filter(
    (gs) => !workerSkills.find((ws) => ws.skillId === gs.id) || editingSkill?.skillId === gs.id
  );

  return (
    <div className="w-full max-w-5xl mx-auto py-8 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Skills</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your professional skills and proficiencies</p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => openModal()}>
          Add Skill
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      ) : workerSkills.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Wrench className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">No skills added yet</h3>
          <p className="text-slate-500 max-w-md mx-auto mb-6">
            Add your professional skills like Mason, Carpenter, Electrician, etc. to get better job matches.
          </p>
          <Button onClick={() => openModal()}>Add Your First Skill</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workerSkills.map((ws) => (
            <div key={ws.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col hover:border-indigo-200 hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{ws.skill?.name}</h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {ws.experienceYears ? `${ws.experienceYears} Years Experience` : "No experience specified"}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {ws.proficiencyLevel}
                </span>
                
                <div className="flex items-center gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openModal(ws)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(ws.skillId)}
                    disabled={deleteMutation.isPending}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingSkill ? "Edit Skill" : "Add New Skill"}
        className="sm:max-w-[425px]"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Select Skill <span className="text-red-500">*</span></label>
            <select
              value={selectedSkillId}
              onChange={(e) => setSelectedSkillId(e.target.value)}
              disabled={!!editingSkill} // cannot change skill type if editing, must delete and re-add
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100 disabled:text-slate-500"
              required
            >
              <option value="" disabled>-- Select a skill --</option>
              {editingSkill && (
                <option value={editingSkill.skillId}>{editingSkill.skill?.name}</option>
              )}
              {!editingSkill && availableSkills.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            {!editingSkill && availableSkills.length === 0 && (
              <p className="text-xs text-amber-600 mt-1">You have added all available skills.</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Proficiency Level <span className="text-red-500">*</span></label>
            <select
              value={proficiency}
              onChange={(e) => setProficiency(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
              required
            >
              {PROFICIENCIES.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Experience (Years)</label>
            <input
              type="number"
              min="0"
              max="50"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="e.g. 5"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t pt-4">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={addMutation.isPending || updateMutation.isPending || !selectedSkillId}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-70 flex items-center gap-2"
            >
              {(addMutation.isPending || updateMutation.isPending) && <Loader2 className="w-4 h-4 animate-spin" />}
              {editingSkill ? "Save Changes" : "Add Skill"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
