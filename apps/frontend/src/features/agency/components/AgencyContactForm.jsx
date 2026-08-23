import { useState } from "react";
import { Save, Loader2, Mail, Phone, Globe, X } from "lucide-react";

export default function AgencyContactForm({ data, onSave, saving, hideHeader, agencyType, isOpen, onClose }) {
  const [formData, setFormData] = useState({
    email: data?.contact?.email || "",
    phone: data?.contact?.phone || "",
    website: data?.contact?.website || "",
  });

  if (isOpen === false) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...data,
      contact: {
        ...data.contact,
        email: formData.email,
        phone: formData.phone,
        website: formData.website,
      }
    });
    if (onClose) onClose();
  };

  const inputClass = "w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all text-slate-800 placeholder:text-slate-400 text-sm font-medium outline-none";
  const labelClass = "block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide";

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-3">
        <div className="space-y-1">
          <label className={labelClass}>Email Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={inputClass}
              placeholder="contact@agency.com"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className={labelClass}>Phone Number</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={inputClass}
              placeholder="+91 98765 43210"
            />
          </div>
        </div>

        {agencyType === "corporate" && (
          <div className="space-y-1">
            <label className={labelClass}>Website</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Globe className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className={inputClass}
                placeholder="www.agencywebsite.com"
              />
            </div>
          </div>
        )}
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
            <h2 className="text-base font-bold text-slate-900">Edit Contact Details</h2>
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
          <h2 className="text-lg font-bold text-slate-900">Contact Details</h2>
          <p className="text-xs text-slate-500 mt-0.5">How clients and workers reach you.</p>
        </div>
      )}
      {formContent}
    </div>
  );
}
