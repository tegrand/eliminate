import { useState, useRef } from "react";
import { Save, UploadCloud, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "../../../api/axios";

export default function DocumentsForm({ data, onSave, saving, hideHeader, isActive }) {
  const [formData, setFormData] = useState({
    aadhaarNumber: data?.aadhaarNumber || "",
    panNumber: data?.panNumber || "",
  });
  
  const [uploadingResume, setUploadingResume] = useState(false);
  const [resumeUrl, setResumeUrl] = useState(data?.resumeUrl || "");
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Identity fields were removed because they aren't in the schema, 
    // and all file uploads trigger their own endpoints instantly on selection.
    // So there is nothing else left to save here!
    toast.success("Documents section is up to date");
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

  // Mock UI renderer removed

  return (
    <div className="animate-fade-in">
      {!hideHeader && (
        <div className="mb-4">
          <h2 className="text-xl font-bold text-slate-900">Documents & Verification</h2>
          <p className="text-sm text-slate-500 mt-1">Manage your identity documents and certificates.</p>
        </div>
      )}

      <form id={isActive ? "profile-form" : undefined} onSubmit={handleSubmit} className="space-y-5">
        {/* File Uploads */}
        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-3">Document Uploads</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            
            {/* Real Resume Upload */}
            <div className="relative border border-dashed border-indigo-300 rounded-xl p-4 sm:p-5 flex flex-col items-center justify-center text-center bg-indigo-50/50 hover:bg-indigo-50 transition-colors group overflow-hidden cursor-pointer">
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
              <p className="text-xs text-slate-500 mb-4">{resumeUrl ? "Document uploaded" : "Click to upload (PDF, DOCX, JPG, PNG)"}</p>
              
              <div className="relative">
                <input 
                  type="file" 
                  ref={fileInputRef}
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
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

            {/* Document Upload */}
            <div className="relative border border-dashed border-slate-300 rounded-xl p-4 sm:p-5 flex flex-col items-center justify-center text-center bg-slate-50 hover:bg-slate-100 transition-colors group overflow-hidden md:col-span-2">
              <div className="w-full text-left mb-4">
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Select Document Type</label>
                <select
                  className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors text-sm"
                  onChange={(e) => {
                    if (fileInputRef.current) {
                      fileInputRef.current.dataset.docType = e.target.value;
                    }
                  }}
                  defaultValue="AADHAAR"
                >
                  <option value="AADHAAR">Aadhaar Card</option>
                  <option value="PAN">PAN Card</option>
                  <option value="PASSPORT">Passport</option>
                  <option value="DRIVING_LICENSE">Driving License</option>
                  <option value="EXPERIENCE_CERTIFICATE">Experience Certificate</option>
                  <option value="SKILL_CERTIFICATE">Skill Certificate</option>
                  <option value="OTHER">Other Document</option>
                </select>
              </div>

              <div className="relative w-full flex flex-col items-center">
                <input 
                  type="file" 
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    
                    const docType = fileInputRef.current?.dataset?.docType || "AADHAAR";
                    const formDataFile = new FormData();
                    formDataFile.append("file", file);
                    formDataFile.append("documentType", docType);

                    try {
                      toast.loading("Uploading document...", { id: "doc-upload" });
                      await api.post("/workers/my-profile/documents", formDataFile, {
                        headers: { "Content-Type": "multipart/form-data" }
                      });
                      toast.success("Document uploaded successfully for admin verification", { id: "doc-upload" });
                    } catch (err) {
                      toast.error(err?.response?.data?.message || "Failed to upload document", { id: "doc-upload" });
                    } finally {
                      e.target.value = "";
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <button type="button" className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-white border border-slate-200 text-slate-700 shadow-sm group-hover:border-indigo-300 group-hover:text-indigo-700 transition-colors flex items-center gap-2">
                  <UploadCloud className="w-4 h-4" />
                  Upload Selected Document
                </button>
                <p className="text-xs text-slate-500 mt-3">Supported formats: PDF, JPG, PNG. Admin will verify uploaded documents.</p>
              </div>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}
