import { useState } from "react";
import { Save, Loader2, FileText, Upload } from "lucide-react";

export default function AgencyComplianceForm({ data, onSave, saving, hideHeader, agencyType }) {
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
          
          {agencyType === 'corporate' && (
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
          )}

          <div className="pt-6 border-t border-slate-100">
            <label className={labelClass}>Registration Documents</label>
            <div className="mt-3 bg-slate-50 border border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-100 transition-colors group relative">
              <div className="w-full text-left mb-4 max-w-sm mx-auto">
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Select Document Type</label>
                <select
                  id="agencyDocType"
                  className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors text-sm"
                  defaultValue={agencyType === 'corporate' ? "LICENSE" : "AADHAAR"}
                >
                  {agencyType === 'corporate' ? (
                    <>
                      <option value="LICENSE">Trade License</option>
                      <option value="GST">GST Certificate</option>
                      <option value="OTHER">Other Document</option>
                    </>
                  ) : (
                    <>
                      <option value="AADHAAR">Aadhaar Card</option>
                      <option value="PAN">PAN Card</option>
                      <option value="OTHER">Other Document</option>
                    </>
                  )}
                </select>
              </div>

              <div className="relative w-full flex flex-col items-center">
                <input 
                  type="file" 
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    
                    const docType = document.getElementById('agencyDocType')?.value || "OTHER";
                    const formDataFile = new FormData();
                    formDataFile.append("file", file);
                    formDataFile.append("documentType", docType);

                    try {
                      const { agencyApi } = await import('../api/agency.api.js');
                      
                      // Using a dynamic import for toast to avoid breaking if not at top level, 
                      // or just standard alert if toast is not imported.
                      // Wait, I can just import toast at the top of the file!
                      const { toast } = await import('sonner');
                      
                      toast.loading("Uploading document...", { id: "agency-doc-upload" });
                      await agencyApi.uploadDocument(formDataFile);
                      toast.success("Document uploaded successfully", { id: "agency-doc-upload" });
                    } catch (err) {
                      const { toast } = await import('sonner');
                      toast.error(err?.response?.data?.message || "Failed to upload document", { id: "agency-doc-upload" });
                    } finally {
                      e.target.value = "";
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <button type="button" className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-white border border-slate-200 text-slate-700 shadow-sm group-hover:border-indigo-300 group-hover:text-indigo-700 transition-colors flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Selected Document
                </button>
                <p className="text-xs text-slate-500 mt-3">Supported formats: PDF, JPG, PNG. Admin will verify uploaded documents.</p>
              </div>
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
