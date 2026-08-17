import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  User, Phone, Mail, MapPin, Lock, Loader2, Save, Camera,
  CheckCircle2, Globe, Hash, Eye, EyeOff, ShieldCheck, AlertCircle, Settings
} from "lucide-react";
import { useForm } from "react-hook-form";
import { usersApi } from "../../../api/users.api";
import { useAuth } from "../../../hooks/useAuth";
import { clientApi } from "../api/client.api";

// ── Helpers ───────────────────────────────────────────────────────────────────

function Field({ label, icon: Icon, error, className = "", children }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function Spinner() {
  return (
    <div className="flex justify-center py-12">
      <Loader2 className="w-7 h-7 animate-spin text-blue-500" />
    </div>
  );
}

// ── Change Password Tab ────────────────────────────────────────────────────────

function ChangePasswordTab() {
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();

  const { mutate: change, isPending } = useMutation({
    mutationFn: (d) => usersApi.changePassword({ currentPassword: d.currentPassword, newPassword: d.newPassword }),
    onSuccess: () => { toast.success("Password changed!"); reset(); },
    onError: (e) => toast.error(e.response?.data?.message || "Failed to change password"),
  });

  const toggle = (field) => setShow(s => ({ ...s, [field]: !s[field] }));

  return (
    <form onSubmit={handleSubmit(change)} className="space-y-4">
      {[
        { id: "currentPassword", label: "Current Password", placeholder: "Enter current password", field: "current" },
        { id: "newPassword", label: "New Password", placeholder: "Enter new password", field: "new",
          validate: v => v.length >= 8 || "Minimum 8 characters" },
        { id: "confirmPassword", label: "Confirm Password", placeholder: "Re-enter new password", field: "confirm",
          validate: v => v === watch("newPassword") || "Passwords do not match" },
      ].map(({ id, label, placeholder, field, validate }) => (
        <Field key={id} label={label} error={errors[id]?.message}>
          <div className="relative">
            <input
              {...register(id, { required: `${label} is required`, validate })}
              type={show[field] ? "text" : "password"}
              placeholder={placeholder}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all pr-10"
            />
            <button type="button" onClick={() => toggle(field)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {show[field] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </Field>
      ))}
      <div className="flex justify-end pt-2">
        <button type="submit" disabled={isPending}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors">
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
          {isPending ? "Changing…" : "Change Password"}
        </button>
      </div>
    </form>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ClientProfilePage() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const { data: clientData, isLoading, refetch } = useQuery({
    queryKey: ["clientProfile"],
    queryFn: async () => {
      const res = await clientApi.getMe();
      return res.data ?? res;
    },
  });

  const { register, handleSubmit, formState: { errors, isDirty } } = useForm({
    values: {
      contactPerson:  clientData?.contactPerson  || "",
      phone:          clientData?.phone          || "",
      alternatePhone: clientData?.alternatePhone || "",
      email:          clientData?.email          || clientData?.user?.email || "",
      addressLine1:   clientData?.addressLine1   || "",
      addressLine2:   clientData?.addressLine2   || "",
      city:           clientData?.city           || "",
      state:          clientData?.state          || "",
      country:        clientData?.country        || "India",
      postalCode:     clientData?.postalCode     || "",
    },
  });

  const { mutate: save, isPending: saving } = useMutation({
    mutationFn: (data) => clientApi.updateMe(data),
    onSuccess: () => { toast.success("Profile updated successfully!"); refetch(); },
    onError: (e) => toast.error(e.response?.data?.message || "Failed to update profile"),
  });

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await usersApi.uploadAvatar(formData);
      const profile = res.data?.data;
      if (profile?.avatar) {
        updateUser({ avatar: profile.avatar });
        refetch();
        toast.success("Profile picture updated successfully");
      }
    } catch {
      toast.error("Failed to upload profile picture");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Derived values
  const name = clientData?.contactPerson || user?.name || "Client";
  const email = clientData?.email || clientData?.user?.email || user?.email || "";
  const avatar = clientData?.user?.avatar || user?.avatar;
  const initials = name.split(" ").map(n => n?.[0] || "").join("").substring(0, 2).toUpperCase() || "C";
  const status = clientData?.profileStatus || "ACTIVE";

  const getAvatarUrl = (src) => {
    if (!src) return null;
    if (src.startsWith('http') || src.startsWith('data:')) return src;
    return `http://localhost:5000${src.startsWith('/') ? '' : '/'}${src}`;
  };

  // Completion calculation
  const requiredFields = [
    clientData?.contactPerson,
    clientData?.phone,
    clientData?.email || clientData?.user?.email,
    clientData?.city,
    clientData?.state,
  ];
  const filled = requiredFields.filter(Boolean).length;
  const completion = Math.round((filled / requiredFields.length) * 100);
  const isComplete = completion === 100;

  const location = [clientData?.city, clientData?.state].filter(Boolean).join(", ") || "Location not set";
  const memberSince = clientData?.createdAt
    ? new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(new Date(clientData.createdAt))
    : "Unknown";

  const tabs = [
    { id: "profile",   label: "Profile",   icon: User },
    { id: "contact",   label: "Contact",   icon: Phone },
    { id: "location",  label: "Location",  icon: MapPin },
    { id: "password",  label: "Password",  icon: Lock },
  ];

  return (
    <div className="w-full min-h-screen bg-gray-50 pb-12">
      <div className="max-w-2xl mx-auto px-4 pt-5 space-y-4">

        {/* ── Profile Overview Card ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          {/* Top row: avatar + info */}
          <div className="flex items-start gap-4">
            {/* Avatar with upload */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden border border-gray-200 shadow-inner flex items-center justify-center text-gray-500 text-3xl font-bold">
                {avatar ? (
                  <img src={getAvatarUrl(avatar)} alt={name} className="w-full h-full object-cover" />
                ) : (
                  initials
                )}
              </div>
              <label className="absolute bottom-1 right-1 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 cursor-pointer transition-colors">
                {isUploadingAvatar
                  ? <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
                  : <Camera className="w-3 h-3 text-gray-500" />}
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={isUploadingAvatar} />
              </label>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 pt-1">
              <h2 className="text-lg font-bold text-gray-900 leading-tight truncate">{name}</h2>
              <p className="text-sm text-gray-500 mt-0.5 truncate">{email}</p>
              <div className="mt-2">
                {status === 'ACTIVE' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified
                  </span>
                )}
                {status === 'PENDING' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-amber-50 text-amber-600 border border-amber-200">
                    Pending
                  </span>
                )}
                {status !== 'ACTIVE' && status !== 'PENDING' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600 border border-gray-200">
                    {status}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Divider row */}
          <div className="border-t border-gray-100 mt-4 pt-4 grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Location</p>
                <p className="text-sm font-semibold text-gray-800">{location}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400 shrink-0" />
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Member since</p>
                <p className="text-sm font-semibold text-gray-800">{memberSince}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Profile Completion Card ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-bold text-gray-900">Profile Completion</span>
            <span className={`text-sm font-bold ${isComplete ? 'text-emerald-500' : 'text-blue-600'}`}>{completion}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden mb-3">
            <div
              className={`h-2.5 rounded-full transition-all duration-1000 ${isComplete ? 'bg-emerald-500' : 'bg-blue-500'}`}
              style={{ width: `${completion}%` }}
            />
          </div>
          {isComplete ? (
            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-2 rounded-xl text-sm font-bold border border-emerald-100">
              <CheckCircle2 className="w-4 h-4" /> All Set!
            </div>
          ) : (
            <p className="text-xs text-gray-500">Fill in your contact and location details to complete your profile.</p>
          )}
        </div>

        {/* ── Tabs + Form Card ── */}
        <form onSubmit={handleSubmit(save)}>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Tab bar */}
            <div className="flex border-b border-gray-100 overflow-x-auto scrollbar-hide bg-gray-50/80">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-4 py-3 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 outline-none flex-1 justify-center ${
                      isActive
                        ? 'border-emerald-500 text-emerald-600 bg-white'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab content */}
            <div className="p-4 sm:p-5">

              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div className="animate-fade-in space-y-4">
                  <div className="pb-3 border-b border-gray-100">
                    <h3 className="text-base font-bold text-gray-900">Profile Details</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Update your personal or company information.</p>
                  </div>
                  <Field label="Contact Person" error={errors.contactPerson?.message}>
                    <input
                      {...register("contactPerson", { required: "Contact person is required" })}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                      placeholder="e.g. John Doe"
                    />
                  </Field>
                  <div className="flex justify-end pt-2">
                    <button type="submit" disabled={saving || !isDirty}
                      className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50">
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      {saving ? "Saving…" : "Save Changes"}
                    </button>
                  </div>
                </div>
              )}

              {/* Contact Tab */}
              {activeTab === "contact" && (
                <div className="animate-fade-in space-y-4">
                  <div className="pb-3 border-b border-gray-100">
                    <h3 className="text-base font-bold text-gray-900">Contact Details</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Manage how clients can reach you.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Primary Phone" error={errors.phone?.message}>
                      <input {...register("phone", { required: "Primary phone is required" })}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                        placeholder="+91 9876543210" />
                    </Field>
                    <Field label="Alternate Phone">
                      <input {...register("alternatePhone")}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                        placeholder="Optional" />
                    </Field>
                    <Field label="Email Address" error={errors.email?.message} className="sm:col-span-2">
                      <input {...register("email", { required: "Email is required" })} type="email"
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                        placeholder="you@example.com" />
                    </Field>
                  </div>
                  <div className="flex justify-end pt-2">
                    <button type="submit" disabled={saving || !isDirty}
                      className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50">
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      {saving ? "Saving…" : "Save Changes"}
                    </button>
                  </div>
                </div>
              )}

              {/* Location Tab */}
              {activeTab === "location" && (
                <div className="animate-fade-in space-y-4">
                  <div className="pb-3 border-b border-gray-100">
                    <h3 className="text-base font-bold text-gray-900">Location</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Set your address and region.</p>
                  </div>
                  <Field label="Address Line 1">
                    <input {...register("addressLine1")}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                      placeholder="Building, Street, Area" />
                  </Field>
                  <Field label="Address Line 2">
                    <input {...register("addressLine2")}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                      placeholder="Landmark, Locality (Optional)" />
                  </Field>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="City / District">
                      <input {...register("city")}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                        placeholder="e.g. Kochi" />
                    </Field>
                    <Field label="State">
                      <input {...register("state")}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                        placeholder="e.g. Kerala" />
                    </Field>
                    <Field label="PIN Code">
                      <input {...register("postalCode")}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                        placeholder="e.g. 682001" />
                    </Field>
                    <Field label="Country">
                      <input {...register("country")}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                        placeholder="e.g. India" />
                    </Field>
                  </div>
                  <div className="flex justify-end pt-2">
                    <button type="submit" disabled={saving || !isDirty}
                      className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50">
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      {saving ? "Saving…" : "Save Changes"}
                    </button>
                  </div>
                </div>
              )}

              {/* Password Tab */}
              {activeTab === "password" && (
                <div className="animate-fade-in">
                  <div className="pb-3 border-b border-gray-100 mb-4">
                    <h3 className="text-base font-bold text-gray-900">Change Password</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Update your account password securely.</p>
                  </div>
                  <ChangePasswordTab />
                </div>
              )}

            </div>
          </div>
        </form>

      </div>
    </div>
  );
}
