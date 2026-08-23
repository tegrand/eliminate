import { useState } from "react";
import { Megaphone, Plus, Pencil, Trash2, ToggleLeft, ToggleRight, X, Link as LinkIcon, Image, Type, AlignLeft, Hash, Save, Loader2, Info, Package, Check, Eye } from "lucide-react";
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
    if (!form.title.trim()) { toast.error("Campaign title is required"); return; }
    
    setSaving(true);
    let finalForm = { ...form };

    try {
      if (imageMode === "upload" && selectedFile) {
        const uploadRes = await advertisementsApi.uploadImage(selectedFile);
        finalForm.imageUrl = uploadRes.data.imageUrl;
      } else if (imageMode === "upload" && !selectedFile && !form.imageUrl) {
        finalForm.imageUrl = "";
      }

      await onSave(finalForm);
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save advertisement");
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-900 text-sm font-semibold placeholder:text-slate-400";
  const labelClass = "block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1";

  return (
    <div 
      className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-md animate-fade-in"
      style={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl sm:max-w-4xl overflow-hidden border border-slate-100 max-h-[90vh] flex flex-col animate-scale-up">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                {ad ? "Edit Advertisement" : "Create New Ad Campaign"}
              </h3>
              <p className="text-xs text-slate-500">Configure promotional creative, destination links, and visibility.</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Title */}
            <div className="sm:col-span-2 space-y-1">
              <label className={labelClass}>Campaign Title <span className="text-rose-500">*</span></label>
              <input 
                name="title" 
                value={form.title} 
                onChange={handleChange} 
                placeholder="e.g. Summer Special Promotional Banner" 
                required
                className={inputClass} 
              />
            </div>
            
            {/* Package */}
            <div className="sm:col-span-1 space-y-1">
              <label className={labelClass}>Ad Package</label>
              <select 
                name="adPackageId" 
                value={form.adPackageId} 
                onChange={handleChange}
                className={`${inputClass} appearance-none bg-no-repeat bg-right pr-8`}
              >
                <option value="">Standalone (No Package)</option>
                {packages.map(pkg => (
                  <option key={pkg.id} value={pkg.id}>{pkg.name}</option>
                ))}
              </select>
            </div>

            {/* Target URL */}
            <div className="sm:col-span-2 space-y-1">
              <label className={labelClass}>Target Destination URL</label>
              <input 
                name="linkUrl" 
                value={form.linkUrl} 
                onChange={handleChange} 
                placeholder="https://example.com/landing-page" 
                type="url"
                className={inputClass} 
              />
            </div>

            {/* CTA Button Text */}
            <div className="sm:col-span-1 space-y-1">
              <label className={labelClass}>CTA Button Text</label>
              <input 
                name="buttonText" 
                value={form.buttonText} 
                onChange={handleChange} 
                placeholder="Learn More"
                className={inputClass} 
              />
            </div>

            {/* Ad Creative */}
            <div className="sm:col-span-2 space-y-1">
              <div className="flex items-center justify-between mb-1">
                <label className={labelClass}>Ad Creative Image</label>
                <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                  <button 
                    type="button" 
                    onClick={() => setImageMode("upload")} 
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md transition-all cursor-pointer ${imageMode === "upload" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-500"}`}
                  >
                    Upload File
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setImageMode("url")} 
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md transition-all cursor-pointer ${imageMode === "url" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-500"}`}
                  >
                    Link URL
                  </button>
                </div>
              </div>
              
              {imageMode === "url" ? (
                <input 
                  name="imageUrl" 
                  value={form.imageUrl} 
                  onChange={handleChange} 
                  placeholder="https://..." 
                  type="url"
                  className={inputClass} 
                />
              ) : (
                <div className="relative w-full h-10 border border-dashed border-slate-300 rounded-xl flex items-center justify-center px-4 overflow-hidden bg-slate-50 hover:bg-slate-100/60 hover:border-indigo-400 cursor-pointer transition-all group">
                  <input type="file" accept="image/*" onChange={(e) => setSelectedFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  <span className="text-xs font-semibold text-slate-500 truncate group-hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                    <Image className="w-3.5 h-3.5" />
                    {selectedFile ? selectedFile.name : (form.imageUrl ? "Change existing image..." : "Browse or drop image file")}
                  </span>
                </div>
              )}
            </div>

            {/* Priority Order */}
            <div className="sm:col-span-1 space-y-1">
              <label className={labelClass}>Priority Order</label>
              <input 
                name="order" 
                value={form.order} 
                onChange={handleChange} 
                type="number" 
                min="0" 
                placeholder="0"
                className={inputClass} 
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2 space-y-1">
              <label className={labelClass}>Description / Copy</label>
              <textarea 
                name="description" 
                value={form.description} 
                onChange={handleChange} 
                placeholder="Brief summary displayed on promotional banner..." 
                rows={2}
                className={`${inputClass} resize-none`} 
              />
            </div>

            {/* Active Switch Toggle */}
            <div className="sm:col-span-1 flex flex-col justify-center">
              <label className={labelClass}>Campaign Status</label>
              <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="sr-only peer" />
                  <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-800">{form.isActive ? "Live / Active" : "Draft / Paused"}</span>
                  <span className="text-[10px] text-slate-500">Visible to users</span>
                </div>
              </div>
            </div>

          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 shrink-0">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-5 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-70 rounded-xl transition-all shadow-xs cursor-pointer"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{saving ? "Saving..." : "Save Advertisement"}</span>
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
  const [modalAd, setModalAd] = useState(null);
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
    onError: (e) => toast.error(e?.response?.data?.message || "Failed to create advertisement"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => advertisementsApi.update(id, data),
    onSuccess: () => { toast.success("Advertisement updated successfully"); queryClient.invalidateQueries(["adminAds"]); },
    onError: (e) => toast.error(e?.response?.data?.message || "Failed to update advertisement"),
  });

  const toggleMutation = useMutation({
    mutationFn: (id) => advertisementsApi.toggle(id),
    onSuccess: () => queryClient.invalidateQueries(["adminAds"]),
    onError: (e) => toast.error(e?.response?.data?.message || "Failed to toggle status"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => advertisementsApi.delete(id),
    onSuccess: () => { toast.success("Advertisement deleted permanently"); queryClient.invalidateQueries(["adminAds"]); setDeleteId(null); },
    onError: (e) => toast.error(e?.response?.data?.message || "Failed to delete advertisement"),
  });

  const handleSave = async (form) => {
    if (modalAd && typeof modalAd === "object" && modalAd.id) {
      await updateMutation.mutateAsync({ id: modalAd.id, data: form });
    } else {
      await createMutation.mutateAsync(form);
    }
  };

  const activeCount = ads.filter(a => a.isActive).length;
  const draftCount = ads.length - activeCount;

  return (
    <div className="w-full min-h-screen bg-transparent py-6 px-4 sm:px-6 lg:px-8 space-y-6 font-sans">
      
      {/* Header Section */}
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-[24px] border border-slate-100 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Advertisements & Campaigns</h1>
            <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 font-extrabold text-xs rounded-full border border-indigo-100">
              {ads.length} {ads.length === 1 ? 'Campaign' : 'Campaigns'}
            </span>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1">
            Manage promotional banners, campaign placements, and ad performance across user dashboards.
          </p>
        </div>
        <button
          onClick={() => setModalAd("new")}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Campaign</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto space-y-4">
        
        {/* Toolbar Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-100 shadow-xs text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              {activeCount} Live
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg border border-slate-200 font-bold">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              {draftCount} Paused / Draft
            </span>
          </div>
        </div>

        {/* Campaign List Cards */}
        {isLoading ? (
          <div className="flex justify-center py-20 bg-white rounded-[24px] border border-slate-100 shadow-xs">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        ) : ads.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-[24px] border border-slate-100 shadow-xs">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Megaphone className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No ad campaigns configured</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">Create your first campaign to promote services and special offers.</p>
            <button 
              onClick={() => setModalAd("new")} 
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Campaign</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {ads.map((ad) => (
              <div 
                key={ad.id} 
                className="bg-white border border-slate-200 hover:border-indigo-300 rounded-[24px] p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  {/* Thumbnail Image */}
                  <div className="relative w-20 h-16 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                    {ad.imageUrl ? (
                      <img src={ad.imageUrl} alt={ad.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onError={(e) => { e.target.style.display = 'none'; }} />
                    ) : (
                      <Image className="w-6 h-6 text-slate-300" />
                    )}
                  </div>

                  {/* Text Details */}
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 truncate">{ad.title}</h4>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${ad.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${ad.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        {ad.isActive ? "Live" : "Draft"}
                      </span>
                      {ad.adPackage && (
                        <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 border border-purple-100 px-2 py-0.5 rounded-md text-[10px] font-bold">
                          <Package className="w-3 h-3" /> {ad.adPackage.name}
                        </span>
                      )}
                    </div>

                    {ad.description && (
                      <p className="text-xs font-medium text-slate-500 truncate max-w-xl">{ad.description}</p>
                    )}

                    <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-400 flex-wrap pt-0.5">
                      <span className="flex items-center gap-1 text-slate-600 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                        <Hash className="w-3 h-3 text-slate-400" /> Priority: {ad.order}
                      </span>
                      {ad.linkUrl && (
                        <a 
                          href={ad.linkUrl} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="flex items-center gap-1 text-indigo-600 hover:underline truncate max-w-[200px]"
                        >
                          <LinkIcon className="w-3 h-3" /> {new URL(ad.linkUrl).hostname.replace('www.','')}
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center border-t sm:border-t-0 sm:border-l border-slate-100 pt-3 sm:pt-0 sm:pl-4">
                  <button 
                    onClick={() => toggleMutation.mutate(ad.id)} 
                    title={ad.isActive ? "Deactivate Campaign" : "Activate Campaign"}
                    className={`p-2 rounded-xl transition-all cursor-pointer ${ad.isActive ? 'bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100' : 'bg-slate-100 text-slate-400 border border-transparent hover:text-slate-600'}`}
                  >
                    {ad.isActive ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                  </button>
                  <button 
                    onClick={() => setModalAd(ad)} 
                    title="Edit Campaign"
                    className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 transition-all cursor-pointer"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setDeleteId(ad.id)} 
                    title="Delete Campaign"
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
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
        <div 
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md animate-fade-in"
          style={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
        >
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center border border-slate-100 shadow-2xl animate-scale-up">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Delete Campaign?</h3>
            <p className="text-xs text-slate-500 mb-5">This action is permanent and will remove the advertisement campaign completely.</p>
            <div className="flex gap-2">
              <button 
                onClick={() => setDeleteId(null)} 
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-600 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={() => deleteMutation.mutate(deleteId)} 
                disabled={deleteMutation.isPending} 
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-70"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

