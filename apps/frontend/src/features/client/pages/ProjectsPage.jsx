import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { companyApi } from "../api/company.api";
import { FolderKanban, Plus, MoreVertical, Trash2, Edit, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Modal } from "../../../components/ui/modal/Modal";

export default function ProjectsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "", status: "ACTIVE" });

  const { data: response, isLoading } = useQuery({
    queryKey: ["company", "projects"],
    queryFn: () => companyApi.getProjects(),
  });
  const projects = response?.data?.data || [];

  const createMutation = useMutation({
    mutationFn: (data) => companyApi.createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["company", "projects"]);
      toast.success("Project created successfully");
      setIsModalOpen(false);
    },
    onError: (e) => toast.error(e.response?.data?.message || "Failed to create project"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => companyApi.updateProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["company", "projects"]);
      toast.success("Project updated successfully");
      setIsModalOpen(false);
    },
    onError: (e) => toast.error(e.response?.data?.message || "Failed to update project"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => companyApi.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["company", "projects"]);
      toast.success("Project deleted successfully");
    },
    onError: (e) => toast.error(e.response?.data?.message || "Failed to delete project"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingProject) {
      updateMutation.mutate({ id: editingProject.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const openModal = (project = null) => {
    if (project) {
      setEditingProject(project);
      setFormData({ name: project.name, description: project.description || "", status: project.status });
    } else {
      setEditingProject(null);
      setFormData({ name: "", description: "", status: "ACTIVE" });
    }
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FolderKanban className="w-6 h-6 text-indigo-600" />
            Project Management
          </h1>
          <p className="text-slate-500 mt-1">Manage your company projects and track active sites.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> New Project
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FolderKanban className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">No projects found</h3>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">Create your first project to start tracking sites and workforce assignments.</p>
          <button onClick={() => openModal()} className="bg-indigo-50 text-indigo-600 px-6 py-2.5 rounded-xl font-medium hover:bg-indigo-100 transition-colors">
            Create Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow group relative">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-slate-900 text-lg pr-8">{project.name}</h3>
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                  project.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700" :
                  project.status === "ON_HOLD" ? "bg-amber-100 text-amber-700" :
                  "bg-slate-100 text-slate-700"
                }`}>
                  {project.status}
                </span>
              </div>
              <p className="text-sm text-slate-500 mb-5 line-clamp-2 min-h-[40px]">
                {project.description || "No description provided."}
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-4 pt-4 border-t border-slate-100">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Sites</p>
                  <p className="font-semibold text-slate-900">{project.sites?.length || 0}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Active Workers</p>
                  <p className="font-semibold text-slate-900">{project.assignments?.length || 0}</p>
                </div>
              </div>

              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 bg-white/90 backdrop-blur-sm p-1 rounded-lg border border-slate-100 shadow-sm">
                <button onClick={() => openModal(project)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md"><Edit className="w-4 h-4" /></button>
                <button 
                  onClick={() => { if(confirm("Delete this project?")) deleteMutation.mutate(project.id); }} 
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
        title={editingProject ? "Edit Project" : "Create New Project"}
        className="sm:max-w-[425px]"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Project Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g. Skyline Towers"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                rows={3}
                placeholder="Brief description..."
              />
            </div>
            {editingProject && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="ON_HOLD">On Hold</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            )}
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
                {editingProject ? "Save Changes" : "Create Project"}
              </button>
            </div>
          </form>
      </Modal>
    </div>
  );
}
