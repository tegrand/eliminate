import { useState, useRef } from "react";
import { Save, UploadCloud, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "../../../api/axios";

export default function DocumentsForm({ data, onSave, saving }) {
  const [formData, setFormData] = useState({
    aadhaarNumber: data?.aadhaarNumber || "",
    panNumber: data?.panNumber || "",
    bankAccountNumber: data?.bankAccountNumber || "",
    bankIfsc: data?.bankIfsc || "",
    bankName: data?.bankName || "",
  });
  
  const [uploadingResume, setUploadingResume] = useState(false);
  const [resumeUrl, setResumeUrl] = useState(data?.resumeUrl || "");
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData); // Note: we could include resumeUrl here if needed, but it's already saved by the upload endpoint
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formDataFile = new FormData();
    formDataFile.append("file", file);

    try {
      setUploadingResume(true);
      const res = await api.post("/workers/my-profile/resume", formDataFile, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setResumeUrl(res.data.data.resumeUrl);
      toast.success("Resume uploaded successfully");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to upload resume");
    } finally {
      setUploadingResume(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const renderFileUpload = (label, isUploaded) => (
    <div className="border border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer opacity-70">
      <div className={`p-3 rounded-full mb-3 ${isUploaded ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}>
        {isUploaded ? <FileText className="w-6 h-6" /> : <UploadCloud className="w-6 h-6" />}
      </div>
      <h4 className="font-semibold text-slate-800 mb-1">{label}</h4>
      <p className="text-xs text-slate-500 mb-4">{isUploaded ? "Document uploaded" : "Click to upload (Coming Soon)"}</p>
      <button type="button" className={`px-4 py-1.5 rounded-lg text-xs font-semibold ${isUploaded ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-white border border-slate-200 text-slate-700 shadow-sm'}`}>
        {isUploaded ? "Replace File" : "Upload File"}
      </button>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">Documents & Financial</h2>
        <p className="text-sm text-slate-500 mt-1">Manage your identity documents, bank details, and certificates.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Identity Numbers */}
        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4">Identity Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Aadhaar / ID Number</label>
              <input
                type="text"
                name="aadhaarNumber"
                value={formData.aadhaarNumber}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                placeholder="Enter 12 digit Aadhaar number"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">PAN Number (Optional)</label>
              <input
                type="text"
                name="panNumber"
                value={formData.panNumber}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                placeholder="Enter PAN"
              />
            </div>
          </div>
        </div>

        {/* Bank Details */}
        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4">Bank Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100/50">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-700">Bank Name</label>
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                placeholder="e.g., State Bank of India"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Account Number</label>
              <input
                type="text"
                name="bankAccountNumber"
                value={formData.bankAccountNumber}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                placeholder="Account Number"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">IFSC Code</label>
              <input
                type="text"
                name="bankIfsc"
                value={formData.bankIfsc}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                placeholder="IFSC Code"
              />
            </div>
          </div>
        </div>

        {/* File Uploads */}
        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4">Document Uploads</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Real Resume Upload */}
            <div className="relative border border-dashed border-indigo-300 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-indigo-50/50 hover:bg-indigo-50 transition-colors group overflow-hidden cursor-pointer">
              {uploadingResume && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                  <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-2" />
                  <span className="text-xs font-semibold text-indigo-800">Uploading...</span>
                </div>
              )}
              
              <div className={`p-3 rounded-full mb-3 ${resumeUrl ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600'}`}>
                {resumeUrl ? <FileText className="w-6 h-6" /> : <UploadCloud className="w-6 h-6" />}
              </div>
              <h4 className="font-semibold text-slate-800 mb-1">Resume / CV</h4>
              <p className="text-xs text-slate-500 mb-4">{resumeUrl ? "Document uploaded" : "Click to upload (PDF, DOCX)"}</p>
              
              <div className="relative">
                <input 
                  type="file" 
                  ref={fileInputRef}
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <button type="button" className={`px-4 py-1.5 rounded-lg text-xs font-semibold ${resumeUrl ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-white border border-indigo-200 text-indigo-700 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors'}`}>
                  {resumeUrl ? "Update Resume" : "Upload Resume"}
                </button>
              </div>
              
              {resumeUrl && (
                <a href={`http://localhost:5000${resumeUrl}`} target="_blank" rel="noreferrer" className="mt-3 text-[10px] font-semibold text-blue-600 hover:underline z-20 relative">
                  View Current Resume
                </a>
              )}
            </div>

            {/* Mock UI */}
            {renderFileUpload("Aadhaar Card", !!data?.aadhaarUrl)}
            {renderFileUpload("PAN Card", !!data?.panUrl)}
            {renderFileUpload("Bank Passbook", !!data?.bankPassbookUrl)}
            {renderFileUpload("Experience Certificates", false)}
            {renderFileUpload("Skill Certificates", false)}
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={saving || uploadingResume}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-70"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
