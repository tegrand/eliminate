import { useState, useRef, useEffect } from "react";
import { UploadCloud, FileText, Loader2, CheckCircle2, ExternalLink, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import api from "../../../api/axios";

export default function DocumentsForm({ data, onSave, saving, hideHeader, isActive, onDirty }) {
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [resumeUrl, setResumeUrl] = useState(data?.resumeUrl || "");
  const [selectedDocType, setSelectedDocType] = useState("AADHAAR");
  const [documents, setDocuments] = useState(data?.documents || []);

  const resumeInputRef = useRef(null);
  const docInputRef = useRef(null);

  useEffect(() => {
    if (data?.resumeUrl) setResumeUrl(data.resumeUrl);
    if (data?.documents) setDocuments(data.documents);
  }, [data]);

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const formDataFile = new FormData();
    formDataFile.append("file", file);

    try {
      setUploadingResume(true);
      const res = await api.post("/workers/my-profile/resume", formDataFile, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      const newResumeUrl = res.data?.data?.resumeUrl || res.data?.resumeUrl;
      setResumeUrl(newResumeUrl);
      toast.success("Resume uploaded and saved successfully!");
      if (onSave) onSave({ resumeUrl: newResumeUrl });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to upload resume");
    } finally {
      setUploadingResume(false);
      if (resumeInputRef.current) resumeInputRef.current.value = "";
    }
  };

  const handleDocUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const formDataFile = new FormData();
    formDataFile.append("file", file);
    formDataFile.append("documentType", selectedDocType);

    try {
      setUploadingDoc(true);
      const res = await api.post("/workers/my-profile/documents", formDataFile, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      const newDoc = res.data?.data;
      if (newDoc) {
        setDocuments(prev => [newDoc, ...prev.filter(d => d.id !== newDoc.id)]);
      }
      toast.success("Document uploaded successfully for admin verification!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to upload document");
    } finally {
      setUploadingDoc(false);
      if (docInputRef.current) docInputRef.current.value = "";
    }
  };

  const getDocTypeLabel = (type) => {
    switch (type) {
      case "AADHAAR": return "Aadhaar Card";
      case "PAN": return "PAN Card";
      case "PASSPORT": return "Passport";
      case "DRIVING_LICENSE": return "Driving License";
      case "EXPERIENCE_CERTIFICATE": return "Experience Certificate";
      case "SKILL_CERTIFICATE": return "Skill Certificate";
      default: return type || "Other Document";
    }
  };

  const getFullUrl = (url) => {
    if (!url) return "#";
    if (url.startsWith("http")) return url;
    return `http://localhost:5000${url.startsWith("/") ? "" : "/"}${url}`;
  };

  return (
    <div className="animate-fade-in">
      {!hideHeader && (
        <div className="mb-4">
          <h2 className="text-xl font-bold text-slate-900">Documents & Verification</h2>
          <p className="text-sm text-slate-500 mt-1">Manage your identity documents and certificates.</p>
        </div>
      )}

      <div className="space-y-5">
        {/* File Uploads Section */}
        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-3">Document Uploads</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            
            {/* Resume Upload Card */}
            <div className="relative border border-dashed border-indigo-300 rounded-xl p-4 sm:p-5 flex flex-col items-center justify-center text-center bg-indigo-50/50 hover:bg-indigo-50 transition-colors group overflow-hidden cursor-pointer">
              {uploadingResume && (
                <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                  <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-2" />
                  <span className="text-xs font-bold text-indigo-800">Uploading Resume...</span>
                </div>
              )}
              
              <div className={`p-3 rounded-full mb-3 ${resumeUrl ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600'}`}>
                {resumeUrl ? <FileText className="w-6 h-6" /> : <UploadCloud className="w-6 h-6" />}
              </div>

              <div className="flex items-center gap-1.5 mb-1">
                <h4 className="font-semibold text-slate-800">Resume / CV</h4>
                {resumeUrl && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
              </div>

              <p className="text-xs text-slate-500 mb-4">{resumeUrl ? "Resume Uploaded" : "Click to upload (PDF, DOCX, JPG, PNG)"}</p>
              
              <div className="relative">
                <input 
                  type="file" 
                  ref={resumeInputRef}
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  onChange={handleResumeUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <button type="button" className={`px-4 py-2 rounded-lg text-xs font-bold ${resumeUrl ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-white border border-indigo-200 text-indigo-700 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors'}`}>
                  {resumeUrl ? "Update Resume" : "Upload Resume"}
                </button>
              </div>
              
              {resumeUrl && (
                <a href={getFullUrl(resumeUrl)} target="_blank" rel="noreferrer" className="mt-3 text-[11px] font-bold text-indigo-600 hover:underline z-20 relative flex items-center gap-1">
                  <ExternalLink className="w-3 h-3" /> View Current Resume
                </a>
              )}
            </div>

            {/* Verification Document Upload Card */}
            <div className="relative border border-dashed border-slate-300 rounded-xl p-4 sm:p-5 flex flex-col items-center justify-center text-center bg-slate-50 hover:bg-slate-100 transition-colors group overflow-hidden md:col-span-2">
              {uploadingDoc && (
                <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                  <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-2" />
                  <span className="text-xs font-bold text-indigo-800">Uploading Document...</span>
                </div>
              )}

              <div className="w-full text-left mb-4">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5 block">Select Document Type</label>
                <select
                  value={selectedDocType}
                  onChange={(e) => setSelectedDocType(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors text-sm font-semibold text-slate-800 cursor-pointer"
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
                  ref={docInputRef}
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleDocUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <button type="button" className="px-5 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 text-white shadow-md hover:bg-indigo-700 transition-colors flex items-center gap-2 cursor-pointer">
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload {getDocTypeLabel(selectedDocType)}</span>
                </button>
                <p className="text-xs text-slate-500 mt-2.5">Supported formats: PDF, JPG, PNG. Admin will verify uploaded documents.</p>
              </div>
            </div>

          </div>
        </div>

        {/* Uploaded Documents Status List */}
        {documents && documents.length > 0 && (
          <div className="mt-6 border-t border-slate-100 pt-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Uploaded Documents ({documents.length})</span>
              </h3>
            </div>

            <div className="space-y-3">
              {documents.map((doc) => (
                <div key={doc.id || doc.documentUrl} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{getDocTypeLabel(doc.documentType)}</span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Uploaded
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 font-medium truncate max-w-xs">{doc.fileName || "Uploaded Document"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      doc.status === 'VERIFIED' || doc.status === 'APPROVED'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {doc.status === 'VERIFIED' || doc.status === 'APPROVED' ? 'Verified' : 'Pending Verification'}
                    </span>
                    <a 
                      href={getFullUrl(doc.documentUrl)} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 hover:border-indigo-300 text-indigo-600 rounded-lg text-xs font-bold transition-all shadow-sm"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>View</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
