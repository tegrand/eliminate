import { useState } from "react";
import { Save, Loader2, Mail, Phone, Globe } from "lucide-react";

export default function AgencyContactForm({ data, onSave, saving, hideHeader, agencyType }) {
  const [formData, setFormData] = useState({
    email: data?.contact?.email || "",
    phone: data?.contact?.phone || "",
    website: data?.contact?.website || "",
  });

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
  };

  const inputClass = "w-full pl-10 pr-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 placeholder:text-slate-400 text-sm";
  const labelClass = "block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide";
  const sectionClass = "space-y-6";

  return (
    <div className="animate-fade-in">
      {!hideHeader && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900">Contact Details</h2>
          <p className="text-sm text-slate-500 mt-1">How clients and workers can reach you.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        <div className={sectionClass}>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
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

            <div className="space-y-2">
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
          </div>

          {agencyType === "corporate" && (
            <div className="space-y-2">
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
                  placeholder="www.tegrandmanpower.com"
                />
              </div>
            </div>
          )}

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
