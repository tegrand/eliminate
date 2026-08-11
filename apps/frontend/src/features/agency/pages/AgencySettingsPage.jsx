import { useState, useEffect } from "react";
import { Settings, Save, Loader2, DollarSign, ShieldCheck, FileText, Camera, Upload, Eye, EyeOff } from "lucide-react";
import api from "../../../api/axios";
import { useAuth } from "../../../hooks/useAuth";
import { documentsApi } from "../../../api/documents.api";
import { usersApi } from "../../../api/users.api";
import toast from "react-hot-toast";

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
      
      const res = await documentsApi.uploadDocument(formData);
      const documentUrl = res.data?.data?.documentUrl || res.data?.documentUrl;
      
      if (documentUrl) {
        await usersApi.updateProfile({ avatar: documentUrl });
        const { agencyApi } = await import('../api/agency.api.js');
        await agencyApi.updateAgency(user.agencyProfile.id, { logoUrl: documentUrl });
        updateUser({ avatar: documentUrl });
        setLogoUrl(documentUrl);
        toast.success("Profile picture updated successfully");
      }
    } catch (error) {
      toast.error("Failed to upload profile picture");
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
      setBasicInfoMessage({ type: "error", text: "Failed to save basic info." });
      toast.error("Failed to save basic info");
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
    <div className="w-full py-6 animate-fade-in max-w-6xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Settings className="w-6 h-6 text-indigo-600" />
          Agency Settings
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          Manage your profile, financial configurations and account security.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        {/* Basic Information Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Basic Information
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Update your agency profile details and picture.
            </p>
          </div>

          <div className="p-5 space-y-6">
            <div className="flex flex-col items-center justify-center gap-3 pt-2">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-gray-200 overflow-hidden flex items-center justify-center relative shadow-sm">
                  {logoUrl ? (
                    <img src={logoUrl.startsWith('http') ? logoUrl : `http://localhost:5000${logoUrl.startsWith('/') ? '' : '/'}${logoUrl}`} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl font-bold text-gray-300">{agencyName?.charAt(0) || user?.firstName?.charAt(0) || "A"}</span>
                  )}
                  {isUploadingAvatar && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                    </div>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 shadow-md transition-all duration-200 border-2 border-white hover:scale-110">
                  <Camera className="w-4 h-4" />
                  <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={isUploadingAvatar} />
                </label>
              </div>
              <p className="text-[11px] text-gray-500 font-medium">Upload a profile picture / logo</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Agency Name</label>
                <input type="text" value={agencyName} onChange={(e) => setAgencyName(e.target.value)} placeholder="Agency Name" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person</label>
                <input type="text" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} placeholder="Contact Person" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone Number" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input type="email" value={user?.email || ""} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <input type="text" value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} placeholder="Address Line 1" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>

            {basicInfoMessage.text && (
              <div className={`mt-4 p-3 rounded-md text-sm ${basicInfoMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {basicInfoMessage.text}
              </div>
            )}
          </div>
          
          <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 flex justify-end">
            <button onClick={handleSaveBasicInfo} disabled={isSaving} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Profile
            </button>
          </div>
        </div>

        {/* Document Upload Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Documents
              </h2>
              <p className="text-sm text-gray-500 mt-1">Upload necessary verification documents.</p>
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            <form onSubmit={handleDocumentSubmit} className="flex flex-col h-full">
              <div className="p-5 space-y-4 flex-1">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">Document Type</label>
                  <select value={docType} onChange={e => setDocType(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all">
                    <option value="AADHAAR">Aadhaar Card</option>
                    <option value="PAN">PAN Card</option>
                    <option value="GST">GST Certificate</option>
                    <option value="LICENSE">License</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">Upload File</label>
                  {currentDocUrl ? (
                    <div className="border border-gray-200 rounded-lg p-5 flex flex-col items-center justify-center gap-3 bg-gray-50 h-[140px]">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-900">Document Uploaded</p>
                        <p className="text-xs text-gray-500 mt-1">You have already uploaded this document</p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-5 flex flex-col items-center justify-center gap-3 hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer h-[140px]">
                      <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={e => setDocFile(e.target.files[0])} accept=".jpg,.jpeg,.png,.pdf" />
                      <Upload className="w-8 h-8 text-gray-400" />
                      <p className="text-xs text-gray-500 text-center mt-1">
                        {docFile ? (
                          <span className="font-medium text-blue-600 text-sm">{docFile.name}</span>
                        ) : (
                          <><span className="font-medium text-blue-600">Click to upload</span> or drag and drop<br/>SVG, PNG, JPG or PDF (max. 5MB)</>
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 flex justify-end mt-auto">
                {currentDocUrl ? (
                  <button type="button" onClick={() => {
                    setDocumentToView({ type: docType, url: currentDocUrl });
                    setShowDocumentViewer(true);
                  }}
                    className="flex items-center gap-2 px-5 py-2 bg-gray-900 hover:bg-black text-white text-sm font-medium rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                    View Document
                  </button>
                ) : (
                  <button type="submit" disabled={isUploadingDoc}
                    className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors">
                    {isUploadingDoc ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    Upload Document
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Location Preferences Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Location Preferences
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Set the preferred district and state for your agency.
            </p>
          </div>

          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred District</label>
                <input type="text" value={agencyCity} onChange={(e) => setAgencyCity(e.target.value)} placeholder="e.g. Malappuram" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred State</label>
                <input type="text" value={agencyState} onChange={(e) => setAgencyState(e.target.value)} placeholder="e.g. Kerala" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>

            {locationMessage.text && (
              <div className={`mt-4 p-3 rounded-md text-sm ${locationMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {locationMessage.text}
              </div>
            )}
          </div>

          <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 flex justify-end">
            <button onClick={handleSaveLocation} disabled={isSavingLocation} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {isSavingLocation ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Preferences
            </button>
          </div>
        </div>

        {/* Financial Settings Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              Financial Settings
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Configure your agency fee and fixed worker amount.
            </p>
          </div>

          <div className="p-5 flex-1">
            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Agency Fee Percentage (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={feePercentage}
                    onChange={(e) => setFeePercentage(e.target.value)}
                    placeholder="e.g. 10"
                    className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">%</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fixed Worker Amount (₹)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">₹</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={workerFixedAmount}
                    onChange={(e) => setWorkerFixedAmount(e.target.value)}
                    placeholder="e.g. 1580"
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              <p className="mt-2 text-xs text-gray-500">
                These values are used to calculate the total amount when a client hires your agency.
              </p>
            </div>

            {message.text && (
              <div className={`mt-4 p-3 rounded-md text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {message.text}
              </div>
            )}
          </div>

          <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 flex justify-end">
            <button
              onClick={handleSaveFinancials}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Financials
            </button>
          </div>
        </div>

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
