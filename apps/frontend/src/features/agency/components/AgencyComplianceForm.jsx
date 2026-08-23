import { useState } from "react";
import { Save, Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";

export default function AgencyComplianceForm({ data, onSave, saving, hideHeader, agencyType, isOpen, onClose }) {
  const [formData, setFormData] = useState({
    gst: data?.compliance?.gst || "",
    licenseNumber: data?.compliance?.licenseNumber || "",
  });

  if (isOpen === false) return null;

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
    if (onClose) onClose();
  };

  const inputClass = "w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all text-slate-800 placeholder:text-slate-400 text-sm font-medium outline-none";
  const labelClass = "block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide";

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-4">
      {agencyType === 'corporate' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
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

          <div className="space-y-1">
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

      <div className="pt-2 border-t border-slate-100">
        <label className={labelClass}>Registration & Compliance Documents</label>
        <div className="mt-2 bg-slate-50 border border-dashed border-slate-300 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:bg-violet-50/50 transition-colors group relative">
          <div className="w-full text-left mb-3 max-w-sm mx-auto">
            <label className="text-xs font-bold text-slate-700 mb-1 block">Document Type</label>
            <select
              id="agencyDocType"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 outline-none"
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
                  toast.loading("Uploading document...", { id: "agency-doc-upload" });
                  await agencyApi.uploadDocument(formDataFile);
                  toast.success("Document uploaded successfully", { id: "agency-doc-upload" });
                } catch (err) {
                  toast.error(err?.response?.data?.message || "Failed to upload document", { id: "agency-doc-upload" });
                } finally {
                  e.target.value = "";
                }
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <button type="button" className="px-4 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 shadow-xs group-hover:border-violet-300 group-hover:text-violet-700 transition-colors flex items-center gap-2 cursor-pointer">
              <Upload className="w-4 h-4 text-violet-600" />
              <span>Upload Selected Document</span>
            </button>
            <p className="text-[11px] text-slate-500 mt-2">Supported formats: PDF, JPG, PNG. Admin will verify uploaded documents.</p>
          </div>
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
            <h2 className="text-base font-bold text-slate-900">Edit Compliance & Documents</h2>
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
          <h2 className="text-lg font-bold text-slate-900">Compliance & Registration</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage your agency's legal registration details.</p>
        </div>
      )}
      {formContent}
    </div>
  );
}
