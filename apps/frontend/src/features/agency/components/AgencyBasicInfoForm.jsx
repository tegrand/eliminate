import { useState, useRef } from "react";
import { Save, Loader2, Camera, X, Building, User } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../../hooks/useAuth";

export default function AgencyBasicInfoForm({ data, onSave, saving, hideHeader, agencyType, setAgencyType, isOpen, onClose }) {
  const { updateUser } = useAuth();
  const [formData, setFormData] = useState({
    agencyName: data?.agencyName || "",
    description: data?.description || "",
  });
  
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  if (isOpen === false) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("documentType", "PHOTO");
      formData.append("file", file);

      const { agencyApi } = await import('../api/agency.api.js');
      const res = await agencyApi.uploadDocument(formData);
      const documentUrl = res?.data?.documentUrl || res?.documentUrl || res?.data?.data?.documentUrl;

      if (!documentUrl) {
        throw new Error("Upload failed: no URL returned");
      }

      onSave({ ...data, logo: documentUrl });
      
      try {
        const { usersApi } = await import('../../../api/users.api.js');
        await usersApi.updateProfile({ avatar: documentUrl });
        updateUser({ avatar: documentUrl });
      } catch (userErr) {
        console.warn('Failed to update user avatar globally:', userErr);
      }

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
    onSave({
      ...data,
      agencyName: formData.agencyName,
      description: formData.description,
    });
    if (onClose) onClose();
  };

  const inputClass = "w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all text-slate-800 placeholder:text-slate-400 text-sm font-medium outline-none";
  const labelClass = "block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide";

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-5">
      {setAgencyType && (
        <div className="space-y-2">
          <label className={labelClass}>Agency Account Type</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setAgencyType("corporate")}
              className={`flex items-center gap-2 p-3 border-2 rounded-xl transition-all cursor-pointer ${agencyType === "corporate" ? "border-violet-500 bg-violet-50 text-violet-900 font-bold" : "border-slate-200 hover:bg-slate-50 text-slate-600 font-medium"}`}
            >
              <Building className="w-4 h-4 text-violet-600" />
              <div className="text-left">
                <div className="text-xs">Corporate Agency</div>
                <div className="text-[10px] text-slate-500 font-normal">Company / Firm</div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setAgencyType("individual")}
              className={`flex items-center gap-2 p-3 border-2 rounded-xl transition-all cursor-pointer ${agencyType === "individual" ? "border-violet-500 bg-violet-50 text-violet-900 font-bold" : "border-slate-200 hover:bg-slate-50 text-slate-600 font-medium"}`}
            >
              <User className="w-4 h-4 text-violet-600" />
              <div className="text-left">
                <div className="text-xs">Individual Recruiter</div>
                <div className="text-[10px] text-slate-500 font-normal">Independent Person</div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Profile Photo Upload */}
      <div className="flex items-center gap-4 p-4 bg-violet-50/60 rounded-2xl border border-violet-100">
        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
          <div className="w-20 h-20 rounded-2xl bg-white border-2 border-violet-200 shadow-xs flex items-center justify-center overflow-hidden relative">
            {data?.logo ? (
              <img src={data.logo.startsWith('http') ? data.logo : `http://localhost:5000${data.logo.startsWith('/') ? '' : '/'}${data.logo}`} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <Camera className="w-8 h-8 text-slate-300" />
            )}
            {isUploading && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-violet-600" />
              </div>
            )}
          </div>
          <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-5 h-5 text-white" />
          </div>
          <input ref={fileInputRef} type="file" className="hidden" accept="image/png,image/jpg,image/jpeg" onChange={handlePhotoUpload} />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-violet-600 rounded-full flex items-center justify-center shadow-md">
            <Camera className="w-3.5 h-3.5 text-white" />
          </div>
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-sm">{agencyType === "corporate" ? "Agency Logo" : "Profile Photo"}</h3>
          <p className="text-xs text-slate-500 mt-0.5 mb-2">
            Upload logo or photo. PNG, JPG up to 5MB.
          </p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-3 py-1.5 bg-white border border-violet-200 text-xs font-bold text-violet-600 rounded-xl hover:bg-violet-50 transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
          >
            {isUploading ? "Uploading..." : "Change Photo"}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="space-y-1">
          <label className={labelClass}>{agencyType === "corporate" ? "Agency Name" : "Full Name"}</label>
          <input
            type="text"
            name="agencyName"
            value={formData.agencyName}
            onChange={handleChange}
            className={inputClass}
            placeholder={agencyType === "corporate" ? "e.g. Tegrand Manpower Solutions" : "e.g. Rahul Kumar"}
          />
        </div>

        <div className="space-y-1">
          <label className={labelClass}>{agencyType === "corporate" ? "About Agency" : "About You"}</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className={`${inputClass} resize-none`}
            placeholder={agencyType === "corporate" ? "Provide a brief description of your agency..." : "Provide a brief description of your experience..."}
          />
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex justify-end gap-3 shrink-0">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-violet-500 hover:bg-violet-600 active:bg-violet-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all disabled:opacity-70 cursor-pointer"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );

  if (isOpen) {
    return (
      <div 
        className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-md animate-fade-in"
        style={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
      >
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg overflow-hidden animate-slide-up-sm border border-slate-100 max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/50 shrink-0">
            <h2 className="text-base font-bold text-slate-900">Edit Basic Details</h2>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-5 overflow-y-auto flex-1">
            {formContent}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {!hideHeader && (
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900">Basic Information</h2>
          <p className="text-xs text-slate-500 mt-0.5">Update your agency details.</p>
        </div>
      )}
      {formContent}
    </div>
  );
}
