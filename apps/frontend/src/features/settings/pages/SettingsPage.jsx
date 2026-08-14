import { useState, useEffect } from "react";
import { Settings, Save, Loader2, DollarSign, Megaphone, Plus, Pencil, Trash2, ToggleLeft, ToggleRight, X, Link as LinkIcon, Image, Type, AlignLeft, Hash } from "lucide-react";
import api from "../../../api/axios";
import { advertisementsApi } from "../../../api/advertisements.api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// ── Ad Form Modal ─────────────────────────────────────────────────────────────
const EMPTY_FORM = { title: "", description: "", imageUrl: "", linkUrl: "", buttonText: "Learn More", isActive: true, order: 0 };

function AdFormModal({ ad, onClose, onSave }) {
  const [form, setForm] = useState(ad ? { ...ad } : { ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save advertisement");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
              <Megaphone className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="text-base font-semibold text-gray-900">{ad ? "Edit Advertisement" : "New Advertisement"}</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
              <Type className="w-3 h-3" /> Title <span className="text-red-500">*</span>
            </label>
            <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. New Construction Company" required
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
              <AlignLeft className="w-3 h-3" /> Description
            </label>
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Brief description of the company or service..." rows={3}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
                <Image className="w-3 h-3" /> Image URL
              </label>
              <input name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="https://..." type="url"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
                <LinkIcon className="w-3 h-3" /> Link URL
              </label>
              <input name="linkUrl" value={form.linkUrl} onChange={handleChange} placeholder="https://..." type="url"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Button Text</label>
              <input name="buttonText" value={form.buttonText} onChange={handleChange} placeholder="Learn More"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
                <Hash className="w-3 h-3" /> Display Order
              </label>
              <input name="order" value={form.order} onChange={handleChange} type="number" min="0" placeholder="0"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input type="checkbox" name="isActive" id="isActive" checked={form.isActive} onChange={handleChange} className="w-4 h-4 rounded text-blue-600" />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700 cursor-pointer">Active (visible to clients)</label>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-colors">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Advertisements Section ─────────────────────────────────────────────────────
function AdvertisementsSection() {
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
    onSuccess: () => { toast.success("Advertisement created!"); queryClient.invalidateQueries(["adminAds"]); },
    onError: (e) => toast.error(e?.response?.data?.message || "Failed to create"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => advertisementsApi.update(id, data),
    onSuccess: () => { toast.success("Advertisement updated!"); queryClient.invalidateQueries(["adminAds"]); },
    onError: (e) => toast.error(e?.response?.data?.message || "Failed to update"),
  });

  const toggleMutation = useMutation({
    mutationFn: (id) => advertisementsApi.toggle(id),
    onSuccess: () => queryClient.invalidateQueries(["adminAds"]),
    onError: (e) => toast.error(e?.response?.data?.message || "Failed to toggle"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => advertisementsApi.delete(id),
    onSuccess: () => { toast.success("Advertisement deleted"); queryClient.invalidateQueries(["adminAds"]); setDeleteId(null); },
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col col-span-1 lg:col-span-2">
      {/* Header */}
      <div className="p-5 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-blue-600" />
            Advertisements
          </h2>
          <p className="text-sm text-gray-500 mt-1">Manage business/company ads displayed to clients on their dashboard.</p>
        </div>
        <button
          onClick={() => setModalAd("new")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New Ad
        </button>
      </div>

      {/* List */}
      <div className="p-5">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-7 h-7 animate-spin text-blue-500" />
          </div>
        ) : ads.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12 text-gray-400">
            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center">
              <Megaphone className="w-7 h-7 text-gray-300" />
            </div>
            <p className="text-sm font-medium">No advertisements yet</p>
            <button onClick={() => setModalAd("new")} className="text-xs font-semibold text-blue-600 hover:underline">Create your first ad</button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {ads.map((ad) => (
              <div key={ad.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                {/* Image preview */}
                <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
                  {ad.imageUrl ? (
                    <img src={ad.imageUrl} alt={ad.title} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                  ) : (
                    <Image className="w-5 h-5 text-gray-300" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900 truncate">{ad.title}</p>
                    <span className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${ad.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${ad.isActive ? 'bg-emerald-500' : 'bg-gray-400'}`}></span>
                      {ad.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  {ad.description && <p className="text-xs text-gray-500 mt-0.5 truncate">{ad.description}</p>}
                  {ad.linkUrl && <p className="text-[10px] text-blue-500 mt-0.5 truncate">{ad.linkUrl}</p>}
                </div>

                {/* Order badge */}
                <span className="text-[11px] font-semibold text-gray-400 shrink-0">#{ad.order}</span>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button onClick={() => toggleMutation.mutate(ad.id)} title={ad.isActive ? "Deactivate" : "Activate"}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                    {ad.isActive ? <ToggleRight className="w-5 h-5 text-indigo-600" /> : <ToggleLeft className="w-5 h-5" />}
                  </button>
                  <button onClick={() => setModalAd(ad)} title="Edit"
                    className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => setDeleteId(ad.id)} title="Delete"
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
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

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">Delete Advertisement</h3>
            <p className="text-sm text-gray-500 mb-5">Are you sure you want to delete this ad? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                Cancel
              </button>
              <button onClick={() => deleteMutation.mutate(deleteId)} disabled={deleteMutation.isPending}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-lg transition-colors">
                {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Settings Page ────────────────────────────────────────────────────────
export default function SettingsPage() {
  const [fee, setFee] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get("/settings");
        if (response.data && response.data.data) {
          setFee(response.data.data.platform_fee_percentage || "");
        }
      } catch (error) {
        setMessage({ type: "error", text: "Failed to load settings." });
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage({ type: "", text: "" });
    try {
      await api.put("/settings", { platform_fee_percentage: fee });
      setMessage({ type: "success", text: "Settings saved successfully!" });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to save settings." });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="w-full py-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Settings className="w-6 h-6 text-blue-600" />
          System Settings
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          Manage platform configurations and global parameters.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Payment Settings Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        <div className="p-5 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Payment Settings
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Configure platform fees and commission rates.
          </p>
        </div>

        <div className="p-5">
          <div className="max-w-md">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Platform Fee Percentage (%)
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="100"
                value={fee}
                onChange={(e) => setFee(e.target.value)}
                placeholder="e.g. 10"
                className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">%</span>
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              This percentage will be automatically added to the worker's expected daily wage when displayed to clients.
            </p>
          </div>

          {message.text && (
            <div className={`mt-4 p-3 rounded-md text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {message.text}
            </div>
          )}
        </div>

        <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Settings
          </button>
        </div>
      </div>

      {/* Change Password Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        <div className="p-5 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Settings className="w-5 h-5 text-gray-600" />
            Change Password
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Update your account password securely.
          </p>
        </div>

        <div className="p-5">
          <div className="max-w-md space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            onClick={() => {
               const current = document.getElementById('currentPassword').value;
               const newPass = document.getElementById('newPassword').value;
               const confirm = document.getElementById('confirmPassword').value;
               
               if (newPass !== confirm) {
                 alert("New passwords do not match.");
                 return;
               }
               
               // Implement change password API call
               import('../../../features/auth/api/auth.api.js').then(module => {
                 module.authApi.changePassword({ oldPassword: current, newPassword: newPass })
                   .then(() => alert("Password changed successfully!"))
                   .catch(err => alert(err?.response?.data?.message || "Failed to change password"));
               });
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Change Password
          </button>
        </div>
      </div>

      {/* Advertisements Section — full width */}
      <AdvertisementsSection />

      </div>
    </div>
  );
}
