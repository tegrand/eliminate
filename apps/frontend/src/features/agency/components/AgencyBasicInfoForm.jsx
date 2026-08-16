import { useState } from "react";
import { Save, Loader2, Camera } from "lucide-react";

export default function AgencyBasicInfoForm({ data, onSave, saving, hideHeader, agencyType, setAgencyType }) {
  const [formData, setFormData] = useState({
    agencyName: data?.agencyName || "",
    description: data?.description || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...data,
      agencyName: formData.agencyName,
      description: formData.description,
    });
  };

  const inputClass = "w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 placeholder:text-slate-400 text-sm";
  const labelClass = "block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide";
  const sectionClass = "space-y-6";

  return (
    <div className="animate-fade-in">
      {!hideHeader && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900">{agencyType === "corporate" ? "Basic Information" : "Personal Information"}</h2>
          <p className="text-sm text-slate-500 mt-1">{agencyType === "corporate" ? "Update your agency's name and description." : "Update your personal details."}</p>
        </div>
      )}

      {setAgencyType && (
        <div className="space-y-3 mb-8">
          <h3 className="text-sm font-semibold text-slate-900">Are you registering as a Corporate Agency or an Individual Recruiter?</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setAgencyType("corporate")}
              className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all ${agencyType === "corporate" ? "border-indigo-500 bg-indigo-50 text-indigo-800" : "border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/50 text-slate-600"}`}
            >
              <span className="font-bold text-sm">Corporate Agency</span>
              <span className="text-[11px] mt-1 opacity-70">Company / Organization</span>
            </button>
            <button
              type="button"
              onClick={() => setAgencyType("individual")}
              className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all ${agencyType === "individual" ? "border-indigo-500 bg-indigo-50 text-indigo-800" : "border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/50 text-slate-600"}`}
            >
              <span className="font-bold text-sm">Individual Recruiter</span>
              <span className="text-[11px] mt-1 opacity-70">Independent Person</span>
            </button>
          </div>
        </div>
      )}

      {/* Profile Photo */}
      <div className="flex items-center gap-6 mb-8 p-5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
        <div className="relative group cursor-pointer" onClick={() => {}}>
          <div className="w-24 h-24 rounded-2xl bg-white border-2 border-indigo-200 shadow-sm flex items-center justify-center overflow-hidden">
            {data?.logo ? (
              <img src={data.logo} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <Camera className="w-10 h-10 text-slate-300" />
            )}
          </div>
          <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-6 h-6 text-white" />
          </div>
          <input type="file" className="hidden" accept="image/png,image/jpg,image/jpeg" />
          <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center shadow-md">
            <Camera className="w-3.5 h-3.5 text-white" />
          </div>
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-base">{agencyType === "corporate" ? "Agency Logo" : "Profile Photo"}</h3>
          <p className="text-xs text-slate-500 mt-1 mb-3 max-w-xs">
            Upload a clear, professional photo. PNG, JPG, or JPEG up to 5MB.
          </p>
          <button
            type="button"
            className="px-4 py-2 bg-white border border-indigo-200 text-sm font-semibold text-indigo-600 rounded-xl hover:bg-indigo-50 transition-colors shadow-sm"
          >
            Change Photo
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div className={sectionClass}>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
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
          </div>

          <div className="space-y-2">
            <label className={labelClass}>{agencyType === "corporate" ? "About Agency" : "About You"}</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={`${inputClass} resize-none`}
              placeholder={agencyType === "corporate" ? "Provide a brief description of your agency, services, and experience..." : "Provide a brief description of your experience..."}
            />
          </div>

        </div>

        <div className="pt-6 border-t border-slate-100 flex justify-end">
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
