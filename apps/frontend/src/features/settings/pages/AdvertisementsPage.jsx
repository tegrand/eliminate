import { useState } from "react";
import { Megaphone, Plus, Pencil, Trash2, ToggleLeft, ToggleRight, X, Link as LinkIcon, Image, Type, AlignLeft, Hash, Save, Loader2, Info, Package, Check } from "lucide-react";
import { advertisementsApi } from "../../../api/advertisements.api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// ── Ad Form Modal ─────────────────────────────────────────────────────────────
const EMPTY_FORM = { title: "", description: "", imageUrl: "", linkUrl: "", buttonText: "Learn More", isActive: true, order: 0, adPackageId: "" };

function AdFormModal({ ad, onClose, onSave }) {
  const [form, setForm] = useState(ad ? { ...ad, adPackageId: ad.adPackageId || "" } : { ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [imageMode, setImageMode] = useState(ad?.imageUrl && !ad.imageUrl.startsWith("http://localhost") ? "url" : "upload");
  const [selectedFile, setSelectedFile] = useState(null);
  
  const queryClient = useQueryClient();
  const { data: packages = [] } = useQuery({
    queryKey: ["adPackages"],
    queryFn: async () => {
      const res = await advertisementsApi.getPackages();
      return res.data || [];
    },
    staleTime: 30000,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    
    setSaving(true);
    let finalForm = { ...form };

    try {
      if (imageMode === "upload" && selectedFile) {
        const uploadRes = await advertisementsApi.uploadImage(selectedFile);
        finalForm.imageUrl = uploadRes.data.imageUrl;
      } else if (imageMode === "upload" && !selectedFile && !form.imageUrl) {
        finalForm.imageUrl = ""; // Clear if no file
      }

      await onSave(finalForm);
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save advertisement");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md transition-all">
      <div className="bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] w-full max-w-3xl overflow-hidden border border-slate-100/50 transform scale-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100/80 bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Megaphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">{ad ? "Edit Advertisement" : "Create New Ad"}</h3>
              <p className="text-xs font-medium text-slate-500">{ad ? "Update the details of your advertisement." : "Fill in the details for the new campaign."}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-white shadow-sm border border-transparent hover:border-slate-200 transition-all bg-slate-100/50">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Type className="w-4 h-4 text-indigo-500" /> Campaign Title <span className="text-rose-500">*</span>
              </label>
              <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Summer Sale 2026" required
                className="w-full px-4 py-2.5 text-sm font-medium border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:font-normal placeholder:text-slate-400 bg-slate-50/50 hover:bg-slate-50" />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 flex items-center justify-between">
                <span className="flex items-center gap-2"><Package className="w-4 h-4 text-indigo-500" /> Ad Package</span>
              </label>
              
              <select name="adPackageId" value={form.adPackageId} onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm font-medium border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all bg-slate-50/50 hover:bg-slate-50 appearance-none">
                <option value="">No Package (Standalone)</option>
                {packages.map(pkg => (
                  <option key={pkg.id} value={pkg.id}>{pkg.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
             <div className="md:col-span-2 space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <AlignLeft className="w-4 h-4 text-indigo-500" /> Description
              </label>
              <textarea name="description" value={form.description} onChange={handleChange} placeholder="Enter a compelling description for this advertisement..." rows={3}
                className="w-full px-4 py-3 text-sm font-medium border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none placeholder:font-normal placeholder:text-slate-400 bg-slate-50/50 hover:bg-slate-50" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Hash className="w-4 h-4 text-indigo-500" /> Priority Order
              </label>
              <input name="order" value={form.order} onChange={handleChange} type="number" min="0" placeholder="0"
                className="w-full px-4 py-2.5 text-sm font-medium border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:font-normal placeholder:text-slate-400 bg-slate-50/50 hover:bg-slate-50" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Image className="w-4 h-4 text-indigo-500" /> Ad Creative
                </label>
                <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200/50">
                  <button type="button" onClick={() => setImageMode("upload")} className={`text-xs font-semibold px-3 py-1 rounded-md transition-all ${imageMode === "upload" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                    Upload
                  </button>
                  <button type="button" onClick={() => setImageMode("url")} className={`text-xs font-semibold px-3 py-1 rounded-md transition-all ${imageMode === "url" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                    Link URL
                  </button>
                </div>
              </div>
              
              {imageMode === "url" ? (
                <input name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="https://..." type="url"
                  className="w-full h-11 px-4 text-sm font-medium border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:font-normal placeholder:text-slate-400 bg-slate-50/50 hover:bg-slate-50" />
              ) : (
                <div className="relative w-full h-11 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center px-4 overflow-hidden bg-slate-50/50 hover:bg-slate-50 hover:border-indigo-400 cursor-pointer transition-all group">
                  <input type="file" accept="image/*" onChange={(e) => setSelectedFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  <span className="text-sm font-medium text-slate-500 truncate group-hover:text-indigo-600 transition-colors flex items-center gap-2">
                    <Image className="w-4 h-4" />
                    {selectedFile ? selectedFile.name : (form.imageUrl ? "Change existing image..." : "Browse or drop image")}
                  </span>
                </div>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-2">
                <LinkIcon className="w-4 h-4 text-indigo-500" /> Target URL
              </label>
              <input name="linkUrl" value={form.linkUrl} onChange={handleChange} placeholder="https://..." type="url"
                className="w-full h-11 px-4 text-sm font-medium border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:font-normal placeholder:text-slate-400 bg-slate-50/50 hover:bg-slate-50" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end pt-2 border-t border-slate-100/80">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">CTA Button Text</label>
              <input name="buttonText" value={form.buttonText} onChange={handleChange} placeholder="Learn More"
                className="w-full px-4 py-2.5 text-sm font-medium border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:font-normal placeholder:text-slate-400 bg-slate-50/50 hover:bg-slate-50" />
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-indigo-600"></div>
              </label>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-700">Campaign Status</span>
                <span className="text-xs font-medium text-slate-400">Toggle visibility for clients</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-100/80">
            <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-all shadow-sm">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-70 rounded-xl transition-all shadow-lg shadow-indigo-500/25">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? "Saving Changes..." : "Save Advertisement"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────
export default function AdvertisementsPage() {
  const queryClient = useQueryClient();
  const [modalAd, setModalAd] = useState(null); // null = closed, "new" = create, object = edit
  const [deleteId, setDeleteId] = useState(null);

  const { data: ads = [], isLoading } = useQuery({
    queryKey: ["adminAds"],
    queryFn: async () => {
      const res = await advertisementsApi.getAll();
      return res.data || [];
    },
    staleTime: 30000,
  });

  const createMutation = useMutation({
    mutationFn: (data) => advertisementsApi.create(data),
    onSuccess: () => { toast.success("Advertisement created successfully"); queryClient.invalidateQueries(["adminAds"]); },
    onError: (e) => toast.error(e?.response?.data?.message || "Failed to create"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => advertisementsApi.update(id, data),
    onSuccess: () => { toast.success("Advertisement updated successfully"); queryClient.invalidateQueries(["adminAds"]); },
    onError: (e) => toast.error(e?.response?.data?.message || "Failed to update"),
  });

  const toggleMutation = useMutation({
    mutationFn: (id) => advertisementsApi.toggle(id),
    onSuccess: () => queryClient.invalidateQueries(["adminAds"]),
    onError: (e) => toast.error(e?.response?.data?.message || "Failed to toggle"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => advertisementsApi.delete(id),
    onSuccess: () => { toast.success("Advertisement deleted permanently"); queryClient.invalidateQueries(["adminAds"]); setDeleteId(null); },
    onError: (e) => toast.error(e?.response?.data?.message || "Failed to delete"),
  });

  const handleSave = async (form) => {
    if (modalAd && typeof modalAd === "object" && modalAd.id) {
      await updateMutation.mutateAsync({ id: modalAd.id, data: form });
    } else {
      await createMutation.mutateAsync(form);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 mb-3">
            <span className="flex h-2 w-2 rounded-full bg-indigo-600"></span>
            <span className="text-xs font-bold text-indigo-700 tracking-wide uppercase">Marketing</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3 tracking-tight">
            Advertisements
          </h1>
          <p className="text-slate-500 text-sm font-medium max-w-xl leading-relaxed">
            Manage premium promotional content, banners, and campaigns displayed across client dashboards.
          </p>
        </div>
        <button
          onClick={() => setModalAd("new")}
          className="group relative flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-slate-900/20 hover:shadow-slate-900/30 overflow-hidden"
        >
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600/0 via-blue-600/20 to-blue-600/0 -translate-x-full group-hover:translate-x-full duration-1000 ease-in-out"></div>
          <Plus className="w-4 h-4 relative z-10" />
          <span className="relative z-10">New Campaign</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
        
        {/* Toolbar/Stats Header (Optional visual touch) */}
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
           <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
             <Info className="w-4 h-4 text-indigo-500" />
             <span>Active Campaigns: <span className="text-slate-900">{ads.filter(a => a.isActive).length}</span> / {ads.length}</span>
           </div>
        </div>

        <div className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-indigo-200 rounded-full animate-spin border-t-indigo-600"></div>
              </div>
              <p className="mt-4 text-sm font-semibold text-slate-500">Loading campaigns...</p>
            </div>
          ) : ads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center px-4">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <Megaphone className="w-10 h-10 text-indigo-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">No active campaigns</h3>
              <p className="text-sm font-medium text-slate-500 mb-6 max-w-sm">You haven't created any advertisements yet. Start by creating a new campaign to engage your clients.</p>
              <button onClick={() => setModalAd("new")} className="px-6 py-2.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-sm font-bold rounded-xl transition-colors">
                Create First Ad
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {ads.map((ad) => (
                <div key={ad.id} className="group flex flex-col sm:flex-row sm:items-center gap-5 p-6 hover:bg-slate-50/80 transition-colors duration-200">
                  {/* Image preview */}
                  <div className="relative w-full sm:w-28 h-28 sm:h-20 rounded-2xl bg-slate-100 border border-slate-200/60 overflow-hidden shrink-0 flex items-center justify-center shadow-sm">
                    {ad.imageUrl ? (
                      <>
                        <img src={ad.imageUrl} alt={ad.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" onError={(e) => { e.target.style.display = 'none'; }} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </>
                    ) : (
                      <Image className="w-8 h-8 text-slate-300" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex flex-wrap items-center gap-3 mb-1.5">
                      <h4 className="text-base font-bold text-slate-900 truncate tracking-tight">{ad.title}</h4>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-wider ${ad.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${ad.isActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-slate-400'}`}></span>
                        {ad.isActive ? "Live" : "Draft"}
                      </span>
                      {ad.adPackage && (
                        <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 border border-purple-100 px-2 py-0.5 rounded-md text-[11px] font-bold">
                          <Package className="w-3 h-3" /> {ad.adPackage.name}
                        </span>
                      )}
                    </div>
                    {ad.description && <p className="text-sm font-medium text-slate-500 truncate line-clamp-1 mb-2">{ad.description}</p>}
                    <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
                       <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md text-slate-600">
                         <Hash className="w-3 h-3" /> Priority: {ad.order}
                       </span>
                       {ad.linkUrl && (
                         <a href={ad.linkUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-indigo-500 hover:text-indigo-600 transition-colors truncate max-w-[200px]">
                           <LinkIcon className="w-3 h-3" /> {new URL(ad.linkUrl).hostname.replace('www.','')}
                         </a>
                       )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 sm:pl-4 sm:border-l border-slate-100 shrink-0 mt-4 sm:mt-0">
                    <button onClick={() => toggleMutation.mutate(ad.id)} title={ad.isActive ? "Deactivate Campaign" : "Activate Campaign"}
                      className={`p-2.5 rounded-xl transition-all shadow-sm ${ad.isActive ? 'bg-white text-indigo-600 border border-indigo-100 hover:bg-indigo-50' : 'bg-slate-100 text-slate-400 border border-transparent hover:text-slate-600 hover:bg-slate-200'}`}>
                      {ad.isActive ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                    </button>
                    <button onClick={() => setModalAd(ad)} title="Edit Campaign"
                      className="p-2.5 rounded-xl bg-white text-slate-400 border border-slate-200 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => setDeleteId(ad.id)} title="Delete Campaign"
                      className="p-2.5 rounded-xl bg-white text-slate-400 border border-slate-200 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-all shadow-sm">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Ad Form Modal */}
      {modalAd !== null && (
        <AdFormModal
          ad={typeof modalAd === "object" ? modalAd : null}
          onClose={() => setModalAd(null)}
          onSave={handleSave}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md transition-all animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] p-8 max-w-sm w-full border border-slate-100 transform scale-100 animate-in zoom-in-95 duration-200 text-center">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto mb-5 shadow-inner">
              <Trash2 className="w-8 h-8 text-rose-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Campaign?</h3>
            <p className="text-sm font-medium text-slate-500 mb-8 leading-relaxed">This action is permanent and cannot be undone. Are you sure you want to remove this advertisement?</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-3 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
                Cancel
              </button>
              <button onClick={() => deleteMutation.mutate(deleteId)} disabled={deleteMutation.isPending}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-70 rounded-xl transition-all shadow-lg shadow-rose-500/25">
                {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {deleteMutation.isPending ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

