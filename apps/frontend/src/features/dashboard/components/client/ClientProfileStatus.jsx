import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import {
  Phone, Mail, MapPin, Lock, Loader2, Save, Camera,
  ShieldCheck, Eye, EyeOff, ChevronRight, Pencil, X
} from "lucide-react";
import { useForm } from "react-hook-form";
import { usersApi } from "../../../../api/users.api";
import { useAuth } from "../../../../hooks/useAuth";
import { clientApi } from "../../../client/api/client.api";

// ── Change Password Modal Form ──────────────────────────────────────────────────
function ChangePasswordForm({ onClose }) {
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();

  const { mutate: change, isPending } = useMutation({
    mutationFn: (d) => usersApi.changePassword({ currentPassword: d.currentPassword, newPassword: d.newPassword }),
    onSuccess: () => { 
      toast.success("Password changed!"); 
      reset(); 
      onClose(); 
    },
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
        <div key={id} className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider text-left">
            {label}
          </label>
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
          {errors[id] && <p className="text-xs text-red-500 mt-0.5 text-left">{errors[id]?.message}</p>}
        </div>
      ))}
      <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-200 text-gray-500 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button type="submit" disabled={isPending}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors">
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
          {isPending ? "Changing…" : "Change Password"}
        </button>
      </div>
    </form>
  );
}

// ── Main Page Component ─────────────────────────────────────────────────────────
export default function ClientProfileStatus() {
  const { user, updateUser } = useAuth();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tab = searchParams.get("tab");

  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

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
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      refetch();
      setIsEditModalOpen(false);
    },
    onError: (e) => toast.error(e.response?.data?.message || "Failed to update profile"),
  });

  // Automatically open password modal if tab=password query is present
  useEffect(() => {
    if (tab === "password") {
      setIsPasswordModalOpen(true);
    } else {
      setIsPasswordModalOpen(false);
    }
  }, [tab]);

  const handleClosePasswordModal = () => {
    setIsPasswordModalOpen(false);
    // Remove query parameter smoothly
    window.history.replaceState(null, "", window.location.pathname);
  };

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
      <div className="flex items-center justify-center h-[60vh] w-full">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Derived values
  const name = clientData?.contactPerson || user?.name || "Client";
  const email = clientData?.email || clientData?.user?.email || user?.email || "";
  const avatar = clientData?.user?.avatar || user?.avatar;
  const initials = name.split(" ").map(n => n?.[0] || "").join("").substring(0, 2).toUpperCase() || "C";
  const phone = clientData?.phone || "";
  
  const getAvatarUrl = (src) => {
    if (!src) return null;
    if (src.startsWith('http') || src.startsWith('data:')) return src;
    return `http://localhost:5000${src.startsWith('/') ? '' : '/'}${src}`;
  };

  const clientLocation = [clientData?.city, clientData?.state].filter(Boolean).join(", ") || "Location not set";

  return (
    <div className="w-full pb-16">
      <div className="max-w-md mx-auto space-y-6">

        {/* ── Profile Overview Cover Card (Blue Gradient) ── */}
        <div className="bg-gradient-to-b from-[#9fc3f9] to-[#ebf3fe] rounded-[32px] p-5 flex flex-col items-center border border-blue-100/40 shadow-[0_4px_20px_rgba(0,0,0,0.02)] relative">
          
          {/* Avatar with thick white border & Camera upload */}
          <div className="relative shrink-0 mb-2.5">
            <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.08)] flex items-center justify-center bg-blue-100 text-blue-600 text-2xl font-extrabold">
              {avatar ? (
                <img src={getAvatarUrl(avatar)} alt={name} className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <label className="absolute bottom-0 right-0 w-7 h-7 bg-white border border-slate-100 rounded-full flex items-center justify-center shadow-md hover:bg-slate-50 cursor-pointer transition-colors z-10">
              {isUploadingAvatar ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
              ) : (
                <Camera className="w-3.5 h-3.5 text-blue-600" />
              )}
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={isUploadingAvatar} />
            </label>
          </div>

          {/* Name & Subtitle */}
          <h2 className="text-lg font-bold text-slate-800 tracking-wide text-center lowercase">{name}</h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">Client Profile</p>

          {/* Edit Profile Pill Button */}
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="mt-4 flex items-center gap-1.5 px-5 py-2 bg-white border border-slate-100 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.04)] hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all text-xs font-bold text-blue-600 cursor-pointer"
          >
            <Pencil className="w-3.5 h-3.5 text-blue-600" />
            Edit Profile
          </button>
        </div>

        {/* ── Contact Information Section Accent Header ── */}
        <div className="pt-2">
          <div className="relative inline-block pb-1.5">
            <h3 className="text-base font-bold text-slate-800 tracking-wide">Contact Information</h3>
            <span className="absolute bottom-0 left-0 w-10 h-[3px] bg-blue-600 rounded-full" />
          </div>

          {/* ── Contact Detail Cards ── */}
          <div className="space-y-3.5 mt-5">
            
            {/* Card 1: Contact Number */}
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100/50 shadow-[0_4px_12px_rgba(0,0,0,0.01)] hover:shadow-md hover:border-slate-200/80 hover:translate-y-[-1px] transition-all duration-200 group text-left cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-50/80 flex items-center justify-center text-blue-600 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contact Number</p>
                  <p className="text-sm font-bold text-slate-700 mt-0.5">{phone || "Not set"}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all duration-200" />
            </button>

            {/* Card 2: Email Address */}
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100/50 shadow-[0_4px_12px_rgba(0,0,0,0.01)] hover:shadow-md hover:border-slate-200/80 hover:translate-y-[-1px] transition-all duration-200 group text-left cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-pink-50/80 flex items-center justify-center text-pink-500 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</p>
                  <p className="text-sm font-bold text-slate-700 mt-0.5">{email || "Not set"}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all duration-200" />
            </button>

            {/* Card 3: Location */}
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100/50 shadow-[0_4px_12px_rgba(0,0,0,0.01)] hover:shadow-md hover:border-slate-200/80 hover:translate-y-[-1px] transition-all duration-200 group text-left cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-50/80 flex items-center justify-center text-purple-500 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Location</p>
                  <p className="text-sm font-bold text-slate-700 mt-0.5">{clientLocation}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all duration-200" />
            </button>

            {/* Card 4: Account Security */}
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100/50 shadow-[0_4px_12px_rgba(0,0,0,0.01)] hover:shadow-md hover:border-slate-200/80 hover:translate-y-[-1px] transition-all duration-200 group text-left cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-50/80 flex items-center justify-center text-emerald-600 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-slate-700">Account Security</p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100/60">
                      Secure
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 font-medium">Manage your password and security settings</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all duration-200" />
            </button>
          </div>
        </div>

      </div>

      {/* ── Edit Profile Modal ── */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs transition-all duration-300">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden transform transition-all max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="text-left">
                <h3 className="text-lg font-bold text-slate-800">Edit Profile</h3>
                <p className="text-xs text-slate-400 mt-0.5">Update your contact and location details</p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <form id="edit-profile-form" onSubmit={handleSubmit(save)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2 text-left">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Contact Person
                    </label>
                    <input
                      {...register("contactPerson", { required: "Contact person is required" })}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                      placeholder="e.g. John Doe"
                    />
                    {errors.contactPerson && <p className="text-xs text-red-500 mt-1">{errors.contactPerson.message}</p>}
                  </div>

                  <div className="text-left">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Primary Phone
                    </label>
                    <input
                      {...register("phone", { required: "Primary phone is required" })}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                      placeholder="+91 9876543210"
                    />
                    {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
                  </div>

                  <div className="text-left">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Alternate Phone
                    </label>
                    <input
                      {...register("alternatePhone")}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                      placeholder="Optional"
                    />
                  </div>

                  <div className="sm:col-span-2 text-left">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Email Address
                    </label>
                    <input
                      {...register("email", { required: "Email is required" })}
                      type="email"
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                      placeholder="you@example.com"
                    />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                  </div>

                  <div className="text-left">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      City / District
                    </label>
                    <input
                      {...register("city")}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                      placeholder="e.g. Kochi"
                    />
                  </div>

                  <div className="text-left">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      State
                    </label>
                    <input
                      {...register("state")}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                      placeholder="e.g. Kerala"
                    />
                  </div>

                  <div className="text-left">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      PIN Code
                    </label>
                    <input
                      {...register("postalCode")}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                      placeholder="e.g. 682001"
                    />
                  </div>

                  <div className="text-left">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Country
                    </label>
                    <input
                      {...register("country")}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                      placeholder="e.g. India"
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 flex gap-3 justify-end bg-slate-50 shrink-0">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-5 py-2.5 border border-slate-200 text-slate-500 text-sm font-semibold rounded-xl hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="edit-profile-form"
                disabled={saving || !isDirty}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-md shadow-blue-500/10 cursor-pointer"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Password / Security Modal ── */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs transition-all duration-300">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden transform transition-all text-left">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div className="text-left">
                <h3 className="text-lg font-bold text-slate-800">Change Password</h3>
                <p className="text-xs text-slate-400 mt-0.5">Update your account password securely</p>
              </div>
              <button
                onClick={handleClosePasswordModal}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <ChangePasswordForm onClose={handleClosePasswordModal} />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
