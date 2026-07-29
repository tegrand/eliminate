import { useState, useEffect } from "react";
import { FileText, Download, Upload, Trash2, Edit, Loader2, FileCheck, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import api from "../../../api/axios";
import Button from "../../../components/ui/button/Button";
import { Modal } from "../../../components/ui/modal/Modal";
import { format, parseISO } from "date-fns";

const DOCUMENT_TYPES = [
  { value: "AADHAAR", label: "Aadhaar" },
  { value: "PAN", label: "PAN (Optional)" },
  { value: "DRIVING_LICENSE", label: "Driving License (If applicable)" },
  { value: "EXPERIENCE_CERTIFICATE", label: "Experience Certificate" },
  { value: "SKILL_CERTIFICATE", label: "Skill Certificate" },
  { value: "PHOTO", label: "Passport Size Photo" }
];

const getDocumentLabel = (type) => {
  const found = DOCUMENT_TYPES.find(d => d.value === type);
  return found ? found.label : type.replace('_', ' ');
};

export default function MyDocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("upload"); // 'upload' or 'replace'
  const [selectedDocId, setSelectedDocId] = useState(null);
  
  const [file, setFile] = useState(null);
  const [docType, setDocType] = useState("AADHAAR");
  const [uploading, setUploading] = useState(false);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/my-documents");
      setDocuments(res.data.data);
    } catch (error) {
      toast.error("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const openUploadModal = () => {
    setModalMode("upload");
    setDocType("AADHAAR");
    setFile(null);
    setSelectedDocId(null);
    setIsModalOpen(true);
  };

  const openReplaceModal = (doc) => {
    setModalMode("replace");
    setDocType(doc.documentType);
    setFile(null);
    setSelectedDocId(doc.id);
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      
      if (modalMode === "upload") {
        formData.append("documentType", docType);
        await api.post("/my-documents", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success("Document uploaded successfully");
      } else {
        await api.put(`/my-documents/${selectedDocId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success("Document replaced successfully");
      }
      
      setIsModalOpen(false);
      fetchDocuments();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload document");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;
    
    try {
      await api.delete(`/my-documents/${id}`);
      toast.success("Document deleted");
      fetchDocuments();
    } catch (error) {
      toast.error("Failed to delete document");
    }
  };

  const handleDownload = (doc) => {
    // Construct full URL using backend base URL if it's a relative path
    const url = doc.documentUrl.startsWith('http') 
      ? doc.documentUrl 
      : `${import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:5000'}${doc.documentUrl}`;
      
    const link = document.createElement('a');
    link.href = url;
    link.download = doc.fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-8 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Documents</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your identity proofs and certifications</p>
        </div>
        <Button onClick={openUploadModal}>
          <Upload className="w-4 h-4 mr-2" />
          Upload New
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      ) : documents.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">No documents yet</h3>
          <p className="text-slate-500 max-w-md mx-auto mb-6">
            Upload your Aadhaar, PAN card, or other required certificates to get your profile verified.
          </p>
          <Button onClick={openUploadModal}>Upload Document</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map(doc => (
            <div key={doc.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
              <div className="p-5 border-b border-slate-100 flex items-start gap-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 truncate" title={getDocumentLabel(doc.documentType)}>
                    {getDocumentLabel(doc.documentType)}
                  </h3>
                  <p className="text-xs text-slate-500 truncate mt-0.5" title={doc.fileName}>{doc.fileName}</p>
                  
                  <div className="mt-2 flex items-center gap-1.5">
                    {doc.status === 'VERIFIED' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700">
                        <FileCheck className="w-3 h-3" /> {doc.status}
                      </span>
                    ) : doc.status === 'REJECTED' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700">
                        <AlertCircle className="w-3 h-3" /> {doc.status}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700">
                        <Clock className="w-3 h-3" /> PENDING
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="p-3 bg-slate-50 flex items-center justify-between">
                <p className="text-[11px] text-slate-400 font-medium">
                  {format(parseISO(doc.createdAt), 'MMM dd, yyyy')}
                </p>
                <div className="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleDownload(doc)} className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Download/View">
                    <Download className="w-4 h-4" />
                  </button>
                  <button onClick={() => openReplaceModal(doc)} className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Replace">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(doc.id)} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload / Replace Modal */}
      <Modal isOpen={isModalOpen} onClose={() => !uploading && setIsModalOpen(false)} title={modalMode === 'upload' ? 'Upload Document' : 'Replace Document'}>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {modalMode === 'upload' && (
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Document Type</label>
              <select 
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                {DOCUMENT_TYPES.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
          )}

          {modalMode === 'replace' && (
            <div className="p-3 bg-blue-50 text-blue-800 rounded-lg text-sm border border-blue-100">
              Replacing <strong>{getDocumentLabel(docType)}</strong>. The old file will be overwritten and status will reset to pending.
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Select File</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-xl hover:bg-slate-50 transition-colors">
              <div className="space-y-1 text-center">
                <FileText className="mx-auto h-12 w-12 text-slate-300" />
                <div className="flex text-sm text-slate-600">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-transparent rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                    <span>Upload a file</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-slate-500">
                  PDF, PNG, JPG up to 5MB
                </p>
              </div>
            </div>
            {file && (
              <p className="text-sm text-emerald-600 font-medium mt-2 flex items-center gap-1">
                <FileCheck className="w-4 h-4" /> {file.name}
              </p>
            )}
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} disabled={uploading}>
              Cancel
            </Button>
            <Button type="submit" disabled={!file || uploading}>
              {uploading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {modalMode === 'upload' ? 'Uploading...' : 'Replacing...'}</>
              ) : (
                <><Upload className="w-4 h-4 mr-2" /> {modalMode === 'upload' ? 'Upload' : 'Replace'}</>
              )}
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
