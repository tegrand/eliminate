import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  Phone, Mail, MapPin, Loader2, Save, Camera,
  ChevronRight, Pencil, X, CheckCircle2, Search,
  Briefcase, Building2, Settings
} from "lucide-react";
import { useForm } from "react-hook-form";
import { usersApi } from "../../../../api/users.api";
import { useAuth } from "../../../../hooks/useAuth";
import { clientApi } from "../../../client/api/client.api";

export default function ClientProfileStatus() {
  const { user, updateUser } = useAuth();
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
    onSuccess: (_, variables) => {
      toast.success("Profile updated successfully!");
      if (variables?.email) {
        updateUser({ email: variables.email });
      }
      refetch();
      setIsEditModalOpen(false);
    },
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
      <div className="max-w-lg mx-auto space-y-6">

        {/* ── Profile Overview Cover Card (Matching Reference Design) ── */}
        <div className="bg-white rounded-[28px] border border-gray-100 shadow-sm p-4 sm:p-5 relative mt-1 sm:mt-2">
          
          {/* Subtle Ambient Decorative Circle on Top-Right */}
          <div className="w-36 h-36 rounded-full bg-purple-100/50 absolute right-0 top-0 blur-xl pointer-events-none" />

          {/* Top Section: Avatar Left + Details Right */}
          <div className="flex flex-row items-center gap-4 sm:gap-5 relative z-10">
            
            {/* Avatar inside card */}
            <div className="relative shrink-0 mt-0 group">
              {/* Circular Sky Blue Border SVG Ring */}
              <div className="relative w-22 h-22 sm:w-26 sm:h-26 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="44" fill="none" stroke="#0284c7" strokeWidth="5.5" />
                </svg>

                {/* Inner Round Avatar Photo */}
                <div className="w-[82%] h-[82%] rounded-full bg-sky-300 p-0.5 shadow-xs relative overflow-hidden flex items-center justify-center">
                  {avatar ? (
                    <img src={getAvatarUrl(avatar)} alt={name} className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <span className="text-xl sm:text-2xl font-bold text-slate-700">{initials}</span>
                  )}
                  
                  {/* Camera Hover Overlay */}
                  <label className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    {isUploadingAvatar ? (
                      <Loader2 className="w-5 h-5 text-white animate-spin" />
                    ) : (
                      <Camera className="w-5 h-5 text-white" />
                    )}
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={isUploadingAvatar} />
                  </label>
                </div>
              </div>

              {/* Verified Check Badge on Bottom Right of Avatar */}
              <div className="absolute bottom-0 right-0 w-6 h-6 sm:w-6.5 sm:h-6.5 bg-sky-500 rounded-full flex items-center justify-center shadow-md border-2 border-white z-10 text-white">
                <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
            </div>

            {/* Right Side Info */}
            <div className="flex-1 min-w-0 text-left">
              {/* Verified Badge */}
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-sky-50 text-sky-700 border border-sky-100 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> VERIFIED
              </span>

              {/* Welcome Name */}
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight truncate">
                Welcome {name.split(" ")[0]}!
              </h2>

              {/* Email Line */}
              {email && (
                <div className="flex items-center gap-1.5 mt-0.5 text-slate-500">
                  <Mail className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span className="text-xs font-medium truncate">{email}</span>
                </div>
              )}
            </div>

          </div>

          {/* Bottom Action Row */}
          <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between gap-3 relative z-10">
            {/* Edit Profile Button */}
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>

            {/* Account Status / Location Pill */}
            <div className="bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <span className="text-slate-500">Account:</span>
              <span className="text-sky-600 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                Active
              </span>
            </div>
          </div>

        </div>

        {/* ── Quick Actions Grid (4 Boxes) ── */}
        <div className="pt-1">
          <div className="relative inline-block pb-1">
            <h3 className="text-base font-bold text-slate-800 tracking-wide">Quick Actions</h3>
            <span className="absolute bottom-0 left-0 w-8 h-[3px] bg-sky-600 rounded-full" />
          </div>

          <div className="grid grid-cols-2 gap-3.5 mt-3.5">
            
            {/* Box 1: Find Workers */}
            <Link
              to="/client/search"
              className="bg-white rounded-2xl p-4 border border-slate-100/80 shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-sky-200 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-sky-600 transition-colors">Find Workers</h4>
                <p className="text-[11px] font-medium text-slate-400 mt-0.5">Search & hire labor</p>
              </div>
            </Link>

            {/* Box 2: Settings */}
            <Link
              to="/settings"
              className="bg-white rounded-2xl p-4 border border-slate-100/80 shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-sky-200 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">Settings</h4>
                <p className="text-[11px] font-medium text-slate-400 mt-0.5">Language & app info</p>
              </div>
            </Link>

            {/* Box 3: Agencies */}
            <Link
              to="/client/agencies"
              className="bg-white rounded-2xl p-4 border border-slate-100/80 shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-sky-200 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-purple-600 transition-colors">Agencies</h4>
                <p className="text-[11px] font-medium text-slate-400 mt-0.5">Partner agencies</p>
              </div>
            </Link>

            {/* Box 4: Contact Info / Edit Profile */}
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="bg-white rounded-2xl p-4 border border-slate-100/80 shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-sky-200 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors">Contact Details</h4>
                <p className="text-[11px] font-medium text-slate-400 mt-0.5">{phone || "Update contact"}</p>
              </div>
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

    </div>
  );
}
