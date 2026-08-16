import { useState } from "react";
import { Save, Loader2, FileText, Upload } from "lucide-react";

export default function AgencyComplianceForm({ data, onSave, saving, hideHeader }) {
  const [formData, setFormData] = useState({
    gst: data?.compliance?.gst || "",
    licenseNumber: data?.compliance?.licenseNumber || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...data,
      compliance: {
        ...data.compliance,
        gst: formData.gst,
        licenseNumber: formData.licenseNumber,
      }
    });
  };

  const inputClass = "w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 placeholder:text-slate-400 text-sm";
  const labelClass = "block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide";
  const sectionClass = "space-y-6";

  return (
    <div className="animate-fade-in">
      {!hideHeader && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900">Compliance & Registration</h2>
          <p className="text-sm text-slate-500 mt-1">Manage your agency's legal registration details.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        <div className={sectionClass}>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className={labelClass}>GST Number</label>
              <input
                type="text"
                name="gst"
                value={formData.gst}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. 32ABCDE1234F1Z5"
              />
            </div>

            <div className="space-y-2">
              <label className={labelClass}>License Number</label>
              <input
                type="text"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. LIC/2023/KOC/8892"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <label className={labelClass}>Registration Documents</label>
            <div className="flex flex-wrap gap-3 mt-3">
              {/* Dummy documents to match UI */}
              <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer group">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                  <FileText className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Trade License.pdf</p>
                  <p className="text-[11px] text-slate-500">2.4 MB • Uploaded Jan 12</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer group">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                  <FileText className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">GST Certificate.pdf</p>
                  <p className="text-[11px] text-slate-500">1.1 MB • Uploaded Jan 12</p>
                </div>
              </div>
              
              <button type="button" className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-slate-300 rounded-xl text-sm font-medium text-slate-600 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 transition-all min-w-[200px]">
                <Upload className="w-4 h-4" /> Upload Document
              </button>
            </div>
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
