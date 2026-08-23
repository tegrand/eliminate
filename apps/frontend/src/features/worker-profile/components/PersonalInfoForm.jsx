import { useState, useRef, useEffect } from "react";
import { Save, UserCircle2, Camera, Loader2 } from "lucide-react";

export default function PersonalInfoForm({ data, onSave, saving, hideHeader, isActive, onDirty }) {
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
    if (onDirty) onDirty();
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

  const inputClass = "w-full px-3 py-1.5 sm:py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 placeholder:text-slate-400 text-sm";
  const labelClass = "block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide";

  return (
    <div className="animate-fade-in">
      {!hideHeader && (
        <div className="mb-4">
          <h2 className="text-xl font-bold text-slate-900">Personal Information</h2>
          <p className="text-sm text-slate-500 mt-1">Update your basic profile details and profile picture.</p>
        </div>
      )}

      <form id={isActive ? "profile-form" : undefined} onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
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
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
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
            rows={3}
            className={`${inputClass} resize-none`}
            placeholder="Tell employers about yourself — your experience, strengths, and what kind of work you're looking for..."
          />
          <p className="text-[11px] text-slate-400 mt-1.5">{formData.notes.length}/2000 characters</p>
        </div>

      </form>
    </div>
  );
}
