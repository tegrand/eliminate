import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { companyApi } from "../api/company.api";
import { MapPin, Plus, Trash2, Edit, Loader2, Building2 } from "lucide-react";
import { toast } from "sonner";
import { Modal } from "../../../components/ui/modal/Modal";

export default function SiteLocationsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSite, setEditingSite] = useState(null);
  const [formData, setFormData] = useState({ name: "", address: "", city: "", state: "", projectId: "" });

  const { data: sitesRes, isLoading: loadingSites } = useQuery({
    queryKey: ["company", "sites"],
    queryFn: () => companyApi.getSites(),
  });
  const sites = sitesRes?.data?.data || [];

  const { data: projectsRes } = useQuery({
    queryKey: ["company", "projects"],
    queryFn: () => companyApi.getProjects(),
  });
  const projects = projectsRes?.data?.data || [];

  const createMutation = useMutation({
    mutationFn: (data) => companyApi.createSite(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["company", "sites"]);
      toast.success("Site created successfully");
      setIsModalOpen(false);
    },
    onError: (e) => toast.error(e.response?.data?.message || "Failed to create site"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => companyApi.updateSite(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["company", "sites"]);
      toast.success("Site updated successfully");
      setIsModalOpen(false);
    },
    onError: (e) => toast.error(e.response?.data?.message || "Failed to update site"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => companyApi.deleteSite(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["company", "sites"]);
      toast.success("Site deleted successfully");
    },
    onError: (e) => toast.error(e.response?.data?.message || "Failed to delete site"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      projectId: formData.projectId || undefined // Send undefined if empty so it doesn't fail UUID validation
    };
    if (editingSite) {
      updateMutation.mutate({ id: editingSite.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const openModal = (site = null) => {
    if (site) {
      setEditingSite(site);
      setFormData({ 
        name: site.name, 
        address: site.address || "", 
        city: site.city || "", 
        state: site.state || "", 
        projectId: site.projectId || "" 
      });
    } else {
      setEditingSite(null);
      setFormData({ name: "", address: "", city: "", state: "", projectId: "" });
    }
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-indigo-600" />
            Site Locations
          </h1>
          <p className="text-slate-500 mt-1">Manage multiple work sites and locations for your projects.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> New Site
        </button>
      </div>

      {loadingSites ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      ) : sites.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">No site locations found</h3>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">Add your work sites to easily assign workers to specific locations.</p>
          <button onClick={() => openModal()} className="bg-indigo-50 text-indigo-600 px-6 py-2.5 rounded-xl font-medium hover:bg-indigo-100 transition-colors">
            Add Site Location
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sites.map((site) => (
            <div key={site.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow group relative">
              <h3 className="font-bold text-slate-900 text-lg mb-1 pr-8">{site.name}</h3>
              
              {site.project && (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md inline-flex mb-3">
                  <Building2 className="w-3.5 h-3.5" />
                  {site.project.name}
                </div>
              )}

              <div className="text-sm text-slate-500 mb-4 mt-2">
                <p className="flex items-start gap-1.5 mb-1"><MapPin className="w-4 h-4 mt-0.5 shrink-0" /> {site.address || "No specific address"}</p>
                {(site.city || site.state) && <p className="ml-5.5 text-xs">{[site.city, site.state].filter(Boolean).join(", ")}</p>}
              </div>

              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 bg-white/90 backdrop-blur-sm p-1 rounded-lg border border-slate-100 shadow-sm">
                <button onClick={() => openModal(site)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md"><Edit className="w-4 h-4" /></button>
                <button 
                  onClick={() => { if(confirm("Delete this site?")) deleteMutation.mutate(site.id); }} 
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
        title={editingSite ? "Edit Site Location" : "Add New Site Location"}
        className="sm:max-w-[500px]"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Site Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g. North Wing Construction"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Link to Project (Optional)</label>
              <select
                value={formData.projectId}
                onChange={e => setFormData({...formData, projectId: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">-- No Project --</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
              <textarea
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                rows={2}
                placeholder="Street address..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={e => setFormData({...formData, city: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">State</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={e => setFormData({...formData, state: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
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
                {editingSite ? "Save Changes" : "Create Site"}
              </button>
            </div>
          </form>
      </Modal>
    </div>
  );
}
