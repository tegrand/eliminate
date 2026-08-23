import { useState } from "react";
import { Package, Plus, Pencil, Trash2, Save, Loader2, X, Check, Calendar, Sparkles } from "lucide-react";
import { advertisementsApi } from "../../../api/advertisements.api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const EMPTY_PACKAGE = { name: "", description: "", price: "", durationDays: "" };

function AdPackageModal({ pkg, onClose, onSave }) {
  const [form, setForm] = useState(pkg ? { ...pkg, durationDays: pkg.durationDays || "" } : { ...EMPTY_PACKAGE });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Package name is required"); return; }
    
    setSaving(true);
    try {
      await onSave({ 
        ...form, 
        price: form.price ? parseFloat(form.price) : 0,
        durationDays: form.durationDays ? parseInt(form.durationDays) : null
      });
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save package");
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
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl sm:max-w-2xl overflow-hidden border border-slate-100 max-h-[90vh] flex flex-col animate-scale-up">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                {pkg ? "Edit Package" : "Create New Ad Package"}
              </h3>
              <p className="text-xs text-slate-500">Configure standard advertisement pricing tier and features.</p>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 space-y-1">
              <label className={labelClass}>Package Name <span className="text-rose-500">*</span></label>
              <input 
                name="name" 
                value={form.name} 
                onChange={handleChange} 
                placeholder="e.g. Standard Business Listing" 
                required
                className={inputClass} 
              />
            </div>

            <div className="space-y-1">
              <label className={labelClass}>Price (₹)</label>
              <input 
                name="price" 
                type="number" 
                step="0.01" 
                min="0" 
                value={form.price} 
                onChange={handleChange} 
                placeholder="0.00"
                className={inputClass} 
              />
            </div>

            <div className="space-y-1">
              <label className={labelClass}>Duration (Days)</label>
              <input 
                name="durationDays" 
                type="number" 
                min="1" 
                value={form.durationDays} 
                onChange={handleChange} 
                placeholder="e.g. 30"
                className={inputClass} 
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className={labelClass}>Description & Features</label>
              <textarea 
                name="description" 
                value={form.description} 
                onChange={handleChange} 
                placeholder="Describe what's included in this package (e.g. High Priority Listing, 24/7 Support)..." 
                rows={3}
                className={`${inputClass} resize-none`} 
              />
            </div>
          </div>

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
              <span>{saving ? "Saving..." : "Save Package"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdPackagesPage() {
  const queryClient = useQueryClient();
  const [modalPkg, setModalPkg] = useState(null); 
  const [deleteId, setDeleteId] = useState(null);

  const { data: packages = [], isLoading } = useQuery({
    queryKey: ["adPackages"],
    queryFn: async () => {
      const res = await advertisementsApi.getPackages();
      return res.data || [];
    }
  });

  const createMutation = useMutation({
    mutationFn: (data) => advertisementsApi.createPackage(data),
    onSuccess: () => { toast.success("Package created successfully"); queryClient.invalidateQueries(["adPackages"]); },
    onError: (e) => toast.error(e?.response?.data?.message || "Failed to create package"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => advertisementsApi.updatePackage(id, data),
    onSuccess: () => { toast.success("Package updated successfully"); queryClient.invalidateQueries(["adPackages"]); },
    onError: (e) => toast.error(e?.response?.data?.message || "Failed to update package"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => advertisementsApi.deletePackage(id),
    onSuccess: () => { toast.success("Package deleted successfully"); queryClient.invalidateQueries(["adPackages"]); setDeleteId(null); },
    onError: (e) => toast.error(e?.response?.data?.message || "Failed to delete package"),
  });

  const handleSave = async (form) => {
    if (modalPkg && modalPkg.id) {
      await updateMutation.mutateAsync({ id: modalPkg.id, data: form });
    } else {
      await createMutation.mutateAsync(form);
    }
  };

  return (
    <div className="w-full min-h-screen bg-transparent py-6 px-4 sm:px-6 lg:px-8 space-y-6 font-sans">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-[24px] border border-slate-100 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Ad Packages & Pricing</h1>
            <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 font-extrabold text-xs rounded-full border border-indigo-100">
              {packages.length} {packages.length === 1 ? 'Package' : 'Packages'}
            </span>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1">
            Manage standard pricing tiers, duration terms, and features for advertisements.
          </p>
        </div>
        <button 
          onClick={() => setModalPkg({})} 
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Package</span>
        </button>
      </div>

      {/* Main Grid Container */}
      <div className="max-w-6xl mx-auto">
        {isLoading ? (
          <div className="flex justify-center py-20 bg-white rounded-[24px] border border-slate-100 shadow-xs">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        ) : packages.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-[24px] border border-slate-100 shadow-xs">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Package className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No ad packages configured</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">Create your first package to allow clients to publish ads.</p>
            <button 
              onClick={() => setModalPkg({})} 
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Package</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {packages.map((pkg) => {
              const features = pkg.description ? pkg.description.split('\n').filter(f => f.trim()) : [];

              return (
                <div 
                  key={pkg.id} 
                  className="bg-white border border-slate-200 hover:border-indigo-300 rounded-[28px] p-5 sm:p-6 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
                  
                  <div>
                    {/* Top Action Bar */}
                    <div className="flex items-start justify-between mb-4 relative z-10">
                      <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100/60">
                        <Sparkles className="w-5.5 h-5.5" />
                      </div>
                      <div className="flex items-center gap-1 bg-slate-50 border border-slate-100 rounded-xl p-1">
                        <button 
                          onClick={() => setModalPkg(pkg)} 
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                          title="Edit Package"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setDeleteId(pkg.id)} 
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                          title="Delete Package"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Package Title & Price */}
                    <h4 className="text-lg font-bold text-slate-900 mb-2 relative z-10 leading-tight">{pkg.name}</h4>
                    
                    <div className="flex items-baseline gap-1.5 mb-4 relative z-10 pb-4 border-b border-slate-100">
                      <span className="text-2xl sm:text-3xl font-black text-indigo-600 tracking-tight">₹{pkg.price || 0}</span>
                      {pkg.durationDays && (
                        <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" /> {pkg.durationDays} Days
                        </span>
                      )}
                    </div>

                    {/* Features & Description */}
                    <div className="space-y-2 mb-6 relative z-10">
                      {features.length > 0 ? (
                        features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs font-semibold text-slate-600 leading-relaxed">
                            <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-500 italic">No description provided for this package.</p>
                      )}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-400 relative z-10">
                    <span>Added {new Date(pkg.createdAt).toLocaleDateString()}</span>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded-md border border-emerald-100 uppercase tracking-wider text-[10px]">
                      Active
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit / Create Modal */}
      {modalPkg && (
        <AdPackageModal 
          pkg={modalPkg.id ? modalPkg : null} 
          onClose={() => setModalPkg(null)} 
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
            <h3 className="text-base font-bold text-slate-900 mb-1">Delete Package?</h3>
            <p className="text-xs text-slate-500 mb-5">This action cannot be undone. Any active listings under this package will be preserved.</p>
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
