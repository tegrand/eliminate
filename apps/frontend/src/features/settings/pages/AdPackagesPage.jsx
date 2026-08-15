import { useState } from "react";
import { Package, Plus, Pencil, Trash2, Save, Loader2, X } from "lucide-react";
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
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md transition-all">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100/50 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">{pkg ? "Edit Package" : "Create Package"}</h3>
              <p className="text-xs font-medium text-slate-500">Configure your advertisement package details.</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Package Name <span className="text-rose-500">*</span></label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Premium Plan" required
              className="w-full px-4 py-2.5 text-sm font-medium border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Price (₹)</label>
              <input name="price" type="number" step="0.01" min="0" value={form.price} onChange={handleChange} placeholder="0.00"
                className="w-full px-4 py-2.5 text-sm font-medium border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Duration (Days)</label>
              <input name="durationDays" type="number" min="1" value={form.durationDays} onChange={handleChange} placeholder="e.g. 7"
                className="w-full px-4 py-2.5 text-sm font-medium border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="What's included in this package?" rows={3}
              className="w-full px-4 py-3 text-sm font-medium border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none" />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 rounded-xl transition-all shadow-md">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? "Saving..." : "Save Package"}
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
    onSuccess: () => { toast.success("Package created"); queryClient.invalidateQueries(["adPackages"]); },
    onError: (e) => toast.error(e?.response?.data?.message || "Failed to create"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => advertisementsApi.updatePackage(id, data),
    onSuccess: () => { toast.success("Package updated"); queryClient.invalidateQueries(["adPackages"]); },
    onError: (e) => toast.error(e?.response?.data?.message || "Failed to update"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => advertisementsApi.deletePackage(id),
    onSuccess: () => { toast.success("Package deleted"); queryClient.invalidateQueries(["adPackages"]); setDeleteId(null); },
    onError: (e) => toast.error(e?.response?.data?.message || "Failed to delete"),
  });

  const handleSave = async (form) => {
    if (modalPkg && modalPkg.id) {
      await updateMutation.mutateAsync({ id: modalPkg.id, data: form });
    } else {
      await createMutation.mutateAsync(form);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-in fade-in">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Ad Packages</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Manage standard pricing and feature bundles for your advertisements.</p>
        </div>
        <button onClick={() => setModalPkg({})} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all shadow-md">
          <Plus className="w-4 h-4" /> New Package
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden p-6">
        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>
        ) : packages.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900">No packages yet</h3>
            <p className="text-slate-500 mt-1">Create your first advertisement package.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div key={pkg.id} className="border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all bg-slate-50 hover:bg-white flex flex-col group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                    <Package className="w-6 h-6" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setModalPkg(pkg)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => setDeleteId(pkg.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-1 relative z-10">{pkg.name}</h4>
                <div className="flex items-end gap-2 mb-4 relative z-10">
                  <div className="text-2xl font-black text-indigo-600">₹{pkg.price || 0}</div>
                  {pkg.durationDays && <div className="text-sm font-semibold text-slate-500 mb-1">/ {pkg.durationDays} Days</div>}
                </div>
                <p className="text-sm font-medium text-slate-500 line-clamp-3 mb-4 flex-1 relative z-10">{pkg.description || "No description provided."}</p>
                <div className="text-xs font-semibold text-slate-400 mt-auto relative z-10">Created {new Date(pkg.createdAt).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modalPkg && <AdPackageModal pkg={modalPkg.id ? modalPkg : null} onClose={() => setModalPkg(null)} onSave={handleSave} />}
      
      {deleteId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md transition-all">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center">
            <Trash2 className="w-12 h-12 text-rose-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Delete Package?</h3>
            <p className="text-slate-500 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-600">Cancel</button>
              <button onClick={() => deleteMutation.mutate(deleteId)} disabled={deleteMutation.isPending} className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold">
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
