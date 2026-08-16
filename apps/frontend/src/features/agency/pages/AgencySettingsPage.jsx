import { useState, useEffect } from "react";
import { Settings, Save, Loader2, DollarSign, ShieldCheck, FileText, Camera, Upload, Eye, EyeOff } from "lucide-react";
import api from "../../../api/axios";
import { useAuth } from "../../../hooks/useAuth";
import { documentsApi } from "../../../api/documents.api";
import { usersApi } from "../../../api/users.api";
import toast from "react-hot-toast";
import AdvertisementBanner from "../../../components/ui/AdvertisementBanner";

export default function AgencySettingsPage() {
  const { user, updateUser } = useAuth();
  const [feePercentage, setFeePercentage] = useState("");
  const [workerFixedAmount, setWorkerFixedAmount] = useState("");
  
  // Basic Info States
  const [agencyName, setAgencyName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [agencyCity, setAgencyCity] = useState("");
  const [agencyState, setAgencyState] = useState("");

  // Document States
  const [docType, setDocType] = useState("AADHAAR");
  const [docFile, setDocFile] = useState(null);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [agencyDocs, setAgencyDocs] = useState({
    aadhaarUrl: "",
    panUrl: "",
    gstCertificateUrl: "",
    licenseUrl: ""
  });
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  const [documentToView, setDocumentToView] = useState({ type: "", url: "" });
  const [isDeleting, setIsDeleting] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [basicInfoMessage, setBasicInfoMessage] = useState({ type: "", text: "" });
  const [isSavingLocation, setIsSavingLocation] = useState(false);
  const [locationMessage, setLocationMessage] = useState({ type: "", text: "" });

  const fetchSettings = async () => {
    if (!user?.agencyProfile?.id) {
      setIsLoading(false);
      return;
    }
    try {
      const { agencyApi } = await import('../api/agency.api.js');
      const response = await agencyApi.getAgencyById(user.agencyProfile.id);
      const data = response.data || response;
      setFeePercentage(data.feePercentage ?? "");
      setWorkerFixedAmount(data.workerFixedAmount ?? "");
      
      setAgencyName(data.agencyName ?? "");
      setContactPerson(data.contactPerson ?? "");
      setPhone(data.phone ?? "");
      setAddressLine1(data.addressLine1 ?? "");
      setLogoUrl(data.logoUrl ?? user?.avatar ?? "");
      setAgencyCity(data.city ?? "");
      setAgencyState(data.state ?? "");

      setAgencyDocs({
        aadhaarUrl: data.aadhaarUrl ?? "",
        panUrl: data.panUrl ?? "",
        gstCertificateUrl: data.gstCertificateUrl ?? "",
        licenseUrl: data.licenseUrl ?? ""
      });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to load settings." });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [user]);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append("documentType", "PHOTO");
      formData.append("file", file);
      
      const { agencyApi } = await import('../api/agency.api.js');
      const res = await agencyApi.uploadDocument(formData);
      console.log('[Avatar Upload] upload response:', res);
      const documentUrl = res?.data?.documentUrl || res?.documentUrl;
      console.log('[Avatar Upload] extracted URL:', documentUrl);
      
      if (!documentUrl) {
        throw new Error("Upload failed: no URL returned from server");
      }

      // Save logoUrl to agency profile
      try {
        await agencyApi.updateAgency(user.agencyProfile.id, { logoUrl: documentUrl });
        console.log('[Avatar Upload] agency logoUrl saved');
      } catch (updateErr) {
        console.error('[Avatar Upload] failed to update agency logoUrl:', updateErr?.response?.data || updateErr);
        throw updateErr;
      }

      // Also update user avatar (non-critical)
      try {
        await usersApi.updateProfile({ avatar: documentUrl });
        updateUser({ avatar: documentUrl });
      } catch (userErr) {
        console.warn('[Avatar Upload] failed to update user avatar (non-critical):', userErr?.response?.data || userErr);
      }

      setLogoUrl(documentUrl);
      toast.success("Profile picture updated successfully");
    } catch (error) {
      console.error('[Avatar Upload] error:', error?.response?.data || error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to upload profile picture";
      toast.error(errorMessage);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const getDocFieldForType = (type) => {
    switch(type) {
      case "AADHAAR": return "aadhaarUrl";
      case "PAN": return "panUrl";
      case "GST": return "gstCertificateUrl";
      case "LICENSE": return "licenseUrl";
      default: return "";
    }
  };

  const handleDocumentSubmit = async (e) => {
    e.preventDefault();
    if (!docFile) return toast.error("Please select a file to upload");
    if (!user?.agencyProfile?.id) return;
    
    setIsUploadingDoc(true);
    try {
      const formData = new FormData();
      formData.append("documentType", docType);
      formData.append("file", docFile);
      
      const { agencyApi } = await import('../api/agency.api.js');
      const res = await agencyApi.uploadDocument(formData);
      const documentUrl = res.data?.documentUrl || res.documentUrl || res.data?.data?.documentUrl;
      
      if (documentUrl) {
        const fieldName = getDocFieldForType(docType);
        await agencyApi.updateAgency(user.agencyProfile.id, { [fieldName]: documentUrl });
        setAgencyDocs(prev => ({ ...prev, [fieldName]: documentUrl }));
        toast.success("Document uploaded successfully!");
        setDocFile(null);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to upload document");
    } finally {
      setIsUploadingDoc(false);
    }
  };

  const handleDeleteDocument = async () => {
    if (!window.confirm("Are you sure you want to remove this document?")) return;
    setIsDeleting(true);
    try {
      const { agencyApi } = await import('../api/agency.api.js');
      const fieldName = getDocFieldForType(documentToView.type);
      await agencyApi.updateAgency(user.agencyProfile.id, { [fieldName]: null });
      setAgencyDocs(prev => ({ ...prev, [fieldName]: "" }));
      toast.success("Document removed");
      setShowDocumentViewer(false);
    } catch (error) {
      toast.error("Failed to remove document");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveBasicInfo = async () => {
    if (!user?.agencyProfile?.id) return;
    setIsSaving(true);
    setBasicInfoMessage({ type: "", text: "" });
    try {
      const { agencyApi } = await import('../api/agency.api.js');
      await agencyApi.updateAgency(user.agencyProfile.id, { 
        agencyName,
        contactPerson,
        phone,
        addressLine1
      });
      if (phone !== user.phone) {
        await usersApi.updateProfile({ phone });
        updateUser({ phone });
      }
      setBasicInfoMessage({ type: "success", text: "Basic info saved successfully!" });
      toast.success("Basic info saved successfully!");
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Failed to save basic info.";
      setBasicInfoMessage({ type: "error", text: errorMessage });
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveLocation = async () => {
    if (!user?.agencyProfile?.id) return;
    setIsSavingLocation(true);
    setLocationMessage({ type: "", text: "" });
    try {
      const { agencyApi } = await import('../api/agency.api.js');
      await agencyApi.updateAgency(user.agencyProfile.id, { 
        city: agencyCity,
        state: agencyState
      });
      setLocationMessage({ type: "success", text: "Location preferences saved successfully!" });
      toast.success("Location preferences saved!");
    } catch (error) {
      setLocationMessage({ type: "error", text: "Failed to save location." });
      toast.error("Failed to save location preferences");
    } finally {
      setIsSavingLocation(false);
    }
  };

  const handleSaveFinancials = async () => {
    if (!user?.agencyProfile?.id) return;
    setIsSaving(true);
    setMessage({ type: "", text: "" });
    try {
      const { agencyApi } = await import('../api/agency.api.js');
      await agencyApi.updateAgency(user.agencyProfile.id, { 
        feePercentage: Number(feePercentage),
        workerFixedAmount: Number(workerFixedAmount)
      });
      setMessage({ type: "success", text: "Financial settings saved successfully!" });
      toast.success("Financial settings saved successfully!");
    } catch (error) {
      setMessage({ type: "error", text: "Failed to save settings." });
      toast.error("Failed to save financial settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const currentDocField = getDocFieldForType(docType);
  const currentDocUrl = agencyDocs[currentDocField];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Agency Settings</h1>
        <p className="text-slate-500 mt-1">Manage your account security and preferences.</p>
      </div>

      {/* Advertisement Banner */}
      <AdvertisementBanner slotName="page" variant="standard" />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Change Password Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              Change Password
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Update your account password securely.
            </p>
          </div>

          <div className="p-5 flex-1">
            <div className="max-w-md space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 flex justify-end">
            <button
              onClick={() => {
                 const current = document.getElementById('currentPassword').value;
                 const newPass = document.getElementById('newPassword').value;
                 const confirm = document.getElementById('confirmPassword').value;
                 
                 if (!current || !newPass || !confirm) {
                   toast.error("Please fill all fields.");
                   return;
                 }
                 
                 if (newPass !== confirm) {
                   toast.error("New passwords do not match.");
                   return;
                 }
                 
                 import('../../auth/api/auth.api.js').then(module => {
                   module.authApi.changePassword({ oldPassword: current, newPassword: newPass })
                     .then(() => {
                       toast.success("Password changed successfully!");
                       document.getElementById('currentPassword').value = '';
                       document.getElementById('newPassword').value = '';
                       document.getElementById('confirmPassword').value = '';
                     })
                     .catch(err => toast.error(err?.response?.data?.message || "Failed to change password"));
                 });
              }}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Change Password
            </button>
          </div>
        </div>
        
        {/* Theme Settings Card (Placeholder) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Settings className="w-5 h-5 text-purple-600" />
              Theme Settings
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Customize the appearance of your dashboard.
            </p>
          </div>
          <div className="p-5 flex-1 flex flex-col items-center justify-center text-center">
            <p className="text-gray-500 text-sm">Theme customization will be available in a future update.</p>
          </div>
        </div>
      </div>

      {/* Document Viewer Modal */}
      {showDocumentViewer && documentToView.url && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" /> {documentToView.type} Document
              </h3>
              <button onClick={() => setShowDocumentViewer(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">&times;</button>
            </div>
            <div className="p-5 flex-1 overflow-auto flex items-center justify-center bg-gray-50 min-h-[50vh]">
              {documentToView.url.match(/\.(jpeg|jpg|gif|png)$/i) != null ? (
                <img src={documentToView.url.startsWith('http') ? documentToView.url : `http://localhost:5000${documentToView.url.startsWith('/') ? '' : '/'}${documentToView.url}`} alt="Document" className="max-w-full max-h-full object-contain rounded border border-gray-200" />
              ) : (
                <iframe src={documentToView.url.startsWith('http') ? documentToView.url : `http://localhost:5000${documentToView.url.startsWith('/') ? '' : '/'}${documentToView.url}`} className="w-full h-[60vh] border border-gray-200 rounded" title="Document"></iframe>
              )}
            </div>
            <div className="px-5 py-3 bg-white flex justify-between gap-3 border-t border-gray-100">
              <button type="button" onClick={handleDeleteDocument} disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2">
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Remove Document"}
              </button>
              <button onClick={() => setShowDocumentViewer(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
