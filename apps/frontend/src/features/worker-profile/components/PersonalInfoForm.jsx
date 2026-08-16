import { useState, useRef, useEffect } from "react";
import { Save, UserCircle2, Camera, Loader2 } from "lucide-react";

export default function PersonalInfoForm({ data, onSave, saving, hideHeader }) {
  const [formData, setFormData] = useState({
    firstName: data?.firstName || "",
    lastName: data?.lastName || "",
    dateOfBirth: data?.dateOfBirth ? new Date(data.dateOfBirth).toISOString().split('T')[0] : "",
    gender: data?.gender || "",
    addressLine1: data?.addressLine1 || "",
    notes: data?.notes || "",
  });

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 18);
  const maxDateString = maxDate.toISOString().split('T')[0];

  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formDataFile = new FormData();
      formDataFile.append("file", file);

      const { usersApi } = await import("../../../api/users.api.js");
      const res = await usersApi.uploadAvatar(formDataFile);
      const documentUrl = res.data?.data?.avatar || res.data?.avatar;

      if (!documentUrl) throw new Error("Upload failed");

      // Save to worker profile too
      onSave({ ...formData, profilePhoto: documentUrl });
      toast.success("Profile photo uploaded successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to upload photo");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const inputClass = "w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 placeholder:text-slate-400 text-sm";
  const labelClass = "block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide";

  return (
    <div className="animate-fade-in">
      {!hideHeader && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900">Personal Information</h2>
          <p className="text-sm text-slate-500 mt-1">Update your basic profile details and profile picture.</p>
        </div>
      )}

      {/* Profile Photo */}
      <div className="flex items-center gap-6 mb-8 p-5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
          <div className="w-24 h-24 rounded-2xl bg-white border-2 border-indigo-200 shadow-sm flex items-center justify-center overflow-hidden">
            {isUploading ? (
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            ) : data?.profilePhoto ? (
              <img src={data.profilePhoto.startsWith('http') || data.profilePhoto.startsWith('data:') ? data.profilePhoto : `http://localhost:5000${data.profilePhoto.startsWith('/') ? '' : '/'}${data.profilePhoto}`} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <UserCircle2 className="w-14 h-14 text-slate-300" />
            )}
          </div>
          <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-6 h-6 text-white" />
          </div>
          <input ref={fileInputRef} onChange={handlePhotoUpload} type="file" className="hidden" accept="image/png,image/jpg,image/jpeg" />
          <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center shadow-md">
            <Camera className="w-3.5 h-3.5 text-white" />
          </div>
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-base">Profile Photo</h3>
          <p className="text-xs text-slate-500 mt-1 mb-3 max-w-xs">
            Upload a clear, professional photo. PNG, JPG, or JPEG up to 5MB.
          </p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-4 py-2 bg-white border border-indigo-200 text-sm font-semibold text-indigo-600 rounded-xl hover:bg-indigo-50 transition-colors shadow-sm disabled:opacity-50"
          >
            {isUploading ? "Uploading..." : "Change Photo"}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={inputClass}
              placeholder="Enter first name"
            />
          </div>
          <div>
            <label className={labelClass}>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={inputClass}
              placeholder="Enter last name"
            />
          </div>
        </div>

        {/* DOB & Gender */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              max={maxDateString}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </div>

        {/* Address */}
        <div>
          <label className={labelClass}>Address</label>
          <input
            type="text"
            name="addressLine1"
            value={formData.addressLine1}
            onChange={handleChange}
            className={inputClass}
            placeholder="Enter your address"
          />
        </div>

        {/* Bio */}
        <div>
          <label className={labelClass}>Bio / About Me</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            className={`${inputClass} resize-none`}
            placeholder="Tell employers about yourself — your experience, strengths, and what kind of work you're looking for..."
          />
          <p className="text-[11px] text-slate-400 mt-1.5">{formData.notes.length}/2000 characters</p>
        </div>

        <div className="pt-5 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-70"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
