import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { usersApi } from "../../../api/users.api";
import { workerApi } from "../api/worker.api";
import { Lock, Eye, EyeOff, Loader2, BarChart2, CheckCircle2, FileText, Upload, MapPin, Briefcase, Palette, IndianRupee, Languages, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { calculateWorkerProfileCompletion } from "../../../utils/profileCompletion";
import { documentsApi } from "../../../api/documents.api";
import api from "../../../api/axios";

export default function WorkerSettingsPage() {
  const { user } = useAuth();
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const [docType, setDocType] = useState("AADHAAR");
  const [docFile, setDocFile] = useState(null);
  const [expectedWage, setExpectedWage] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [experienceYears, setExperienceYears] = useState(() => localStorage.getItem("workerExperienceYears") || "");
  const [workTypes, setWorkTypes] = useState(() => JSON.parse(localStorage.getItem("workerWorkTypes") || "[]"));
  const [languageId, setLanguageId] = useState("");
  const [skillsText, setSkillsText] = useState(() => localStorage.getItem("workerSkillsText") || "");
  const [locationPreferences, setLocationPreferences] = useState(() => JSON.parse(localStorage.getItem("workerLocationPreferences") || "{}"));
  
  const { register: regSettings, handleSubmit: handleSettingsSubmit, formState: { isDirty: isSettingsDirty }, reset: resetSettings } = useForm({
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phone || ""
    }
  });
  
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const { data: documentsRes, refetch: refetchDocuments } = useQuery({
    queryKey: ["workerDocuments"],
    queryFn: () => documentsApi.getMyDocuments()
  });
  const existingDocs = documentsRes?.data?.data || [];
  const currentDocTypeDoc = existingDocs.find(d => d.documentType === docType);

  const [workPrefsSaved, setWorkPrefsSaved] = useState(() => localStorage.getItem("workPrefsSaved") === "true");

  const { data: workerProfileRes } = useQuery({
    queryKey: ["myWorkerProfile"],
    queryFn: () => workerApi.getMyWorkerProfile(),
  });
  const workerProfile = workerProfileRes?.data?.data || workerProfileRes?.data || workerProfileRes;
  const workerLanguages = workerProfile?.languages || [];

  const { data: languagesRes } = useQuery({
    queryKey: ["languages"],
    queryFn: async () => (await api.get("/languages", { params: { limit: 100, sortBy: "name", sortOrder: "asc" } })).data,
  });
  const languageOptions = Array.isArray(languagesRes)
    ? languagesRes
    : languagesRes?.data?.items || languagesRes?.data?.data?.items || languagesRes?.items || languagesRes?.data || [];
  const defaultLanguages = ["English", "Malayalam", "Hindi", "Tamil", "Kannada"];
  const apiLanguages = Array.isArray(languageOptions) ? languageOptions : [];
  const availableLanguages = defaultLanguages
    .map((name) => apiLanguages.find((language) => language.name?.toLowerCase() === name.toLowerCase()) || ({ name, id: null }))
    .filter((language) => !workerLanguages.some((item) => item.language?.name?.toLowerCase() === language.name.toLowerCase()));

  useEffect(() => {
    const wage = workerProfileRes?.data?.expectedDailyWage || workerProfileRes?.expectedDailyWage || "";
    if (wage) setExpectedWage(String(wage));
    const addr = workerProfileRes?.data?.addressLine1 || workerProfileRes?.addressLine1 || "";
    if (addr) setAddressLine1(addr);
  }, [workerProfileRes]);

  const { mutate: saveWage, isPending: isSavingWage } = useMutation({
    mutationFn: (wage) => workerApi.updateMyWorkerProfile({ expectedDailyWage: String(wage) }),
    onSuccess: () => {
      toast.success("Daily wage updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["myWorkerProfile"] });
    },
    onError: (e) => toast.error(e.response?.data?.message || "Failed to update wage"),
  });

  const handleSaveWage = () => {
    if (!expectedWage || isNaN(Number(expectedWage)) || Number(expectedWage) < 0) {
      return toast.error("Please enter a valid daily wage amount");
    }
    saveWage(expectedWage);
  };

  const saveWorkPreferences = () => {
    localStorage.setItem("workerExperienceYears", experienceYears);
    localStorage.setItem("workerWorkTypes", JSON.stringify(workTypes));
    localStorage.setItem("workerSkillsText", skillsText);
    setWorkPrefsSaved(true);
    setHasUnsavedChanges(false);
    toast.success("Work preferences saved successfully!");
  };

  const updateLocationPreference = (field, value) => {
    setLocationPreferences((current) => ({ ...current, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const saveLocationPreferences = () => {
    localStorage.setItem("workerLocationPreferences", JSON.stringify(locationPreferences));
    localStorage.setItem("locPrefsSaved", "true");
    setLocPrefsSaved(true);
    setHasUnsavedChanges(false);
    toast.success("Location preferences saved successfully!");
  };

  const toggleWorkType = (type) => {
    setWorkTypes((current) => current.includes(type)
      ? current.filter((item) => item !== type)
      : [...current, type]);
    setHasUnsavedChanges(true);
  };

  const addLanguage = async () => {
    if (!languageId || !workerProfile?.id) return;
    if (!languageId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)) {
      return toast.error("This language is not available yet");
    }
    try {
      await api.post(`/workers/${workerProfile.id}/languages`, {
        languageId,
        proficiencyLevel: "CONVERSATIONAL",
        canSpeak: true,
        canRead: true,
        canWrite: false,
        isPrimary: workerLanguages.length === 0,
      });
      setLanguageId("");
      queryClient.invalidateQueries({ queryKey: ["myWorkerProfile"] });
      toast.success("Language added successfully!");
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to add language");
    }
  };

  const removeLanguage = async (id) => {
    if (!workerProfile?.id) return;
    try {
      await api.delete(`/workers/${workerProfile.id}/languages/${id}`);
      queryClient.invalidateQueries({ queryKey: ["myWorkerProfile"] });
      toast.success("Language removed successfully!");
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to remove language");
    }
  };

  const [locPrefsSaved, setLocPrefsSaved] = useState(() => localStorage.getItem("locPrefsSaved") === "true");
  const [docsUploaded, setDocsUploaded] = useState(() => localStorage.getItem("docsUploaded") === "true");

  useEffect(() => {
    if (documentsRes) {
      const uploaded = existingDocs.length > 0;
      setDocsUploaded(uploaded);
      localStorage.setItem("docsUploaded", uploaded.toString());
    }
  }, [existingDocs.length, documentsRes]);

  const checklist = [
    { label: "Work Preferences", complete: workPrefsSaved },
    { label: "Location Preferences", complete: locPrefsSaved },
    { label: "Documents", complete: docsUploaded }
  ];
  const percent = Math.round((checklist.filter(i => i.complete).length / 3) * 100);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);

  const { mutate: verifyPwd, isPending: isVerifying } = useMutation({
    mutationFn: (pwd) => usersApi.verifyPassword({ password: pwd }),
    onSuccess: () => {
      setShowPasswordModal(false);
      setPassword("");
      setShowDocumentViewer(true);
    },
    onError: (e) => toast.error(e.response?.data?.message || "Invalid password")
  });

  const { mutate: deleteDoc, isPending: isDeleting } = useMutation({
    mutationFn: (id) => documentsApi.deleteDocument(id),
    onSuccess: () => {
      toast.success("Document removed");
      setShowDocumentViewer(false);
      setDocFile(null);
      queryClient.invalidateQueries({ queryKey: ["workerDocuments"] });
      refetchDocuments();
    },
    onError: (e) => toast.error(e.response?.data?.message || "Failed to remove document")
  });
  
  const { mutate: uploadDoc, isPending: isUploadingDoc } = useMutation({
    mutationFn: (data) => documentsApi.uploadDocument(data),
    onSuccess: () => { toast.success("Document uploaded successfully!"); setDocFile(null); refetchDocuments(); },
    onError: (e) => toast.error(e.response?.data?.message || "Failed to upload document"),
  });
  
  const handleDocumentSubmit = (e) => {
    e.preventDefault();
    if (!docFile) return toast.error("Please select a file to upload");
    const formData = new FormData();
    formData.append("documentType", docType);
    formData.append("file", docFile);
    uploadDoc(formData);
  };
  
  const { mutate: updateProfile, isPending: isUpdatingProfile } = useMutation({
    mutationFn: (data) => usersApi.updateProfile(data),
    onSuccess: (res) => {
      localStorage.setItem("workPrefsSaved", "true");
      localStorage.setItem("locPrefsSaved", "true");
      setWorkPrefsSaved(true);
      setLocPrefsSaved(true);
      setHasUnsavedChanges(false);
      resetSettings({
        firstName: res?.data?.data?.firstName || user?.firstName || "",
        lastName: res?.data?.data?.lastName || user?.lastName || "",
        phone: res?.data?.data?.phone || user?.phone || ""
      });
      toast.success("Settings saved successfully!");
    },
    onError: (e) => toast.error(e.response?.data?.message || "Failed to save settings")
  });

  const onSaveAllSettings = (data) => {
    const { email, ...rest } = data;
    updateProfile(rest);
    if (addressLine1 !== (workerProfile?.addressLine1 || "")) {
      workerApi.updateMyWorkerProfile({ addressLine1 }).catch(e => {
        toast.error("Failed to save address");
      }).finally(() => {
        queryClient.invalidateQueries({ queryKey: ["myWorkerProfile"] });
      });
    }
  };

  const { mutate: change, isPending } = useMutation({
    mutationFn: (d) => usersApi.changePassword({ currentPassword: d.currentPassword, newPassword: d.newPassword }),
    onSuccess: () => { toast.success("Password changed!"); reset(); },
    onError: (e) => toast.error(e.response?.data?.message || "Failed to change password"),
  });

  const toggle = (field) => setShow(s => ({ ...s, [field]: !s[field] }));

  return (
    <div className="py-6 w-full animate-fade-in space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Profile Completion Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        <div className="px-3 py-2 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
              <BarChart2 className="w-4 h-4 text-indigo-600" />
            </div>
            <h2 className="text-sm font-bold text-gray-900">Profile Completion</h2>
          </div>
          <button 
            onClick={() => navigate("/worker/profile")}
            className="px-3 py-1.5 border border-gray-200 rounded-md text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            View Details
          </button>
        </div>

        <div className="p-3 md:p-4 flex flex-col md:flex-row items-center gap-4">
          {/* Circular Progress */}
          <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background track */}
              <circle cx="50" cy="50" r="40" stroke="#F3F4F6" strokeWidth="12" fill="none" />
              {/* Progress track */}
              <circle cx="50" cy="50" r="40" stroke="#4F46E5" strokeWidth="12" fill="none" 
                strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * (percent/100))} className="transition-all duration-1000 ease-out" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-base font-black text-gray-900 leading-none">{percent}%</span>
              <span className="text-[8px] font-medium text-gray-500 uppercase mt-0.5">Complete</span>
            </div>
          </div>

          {/* Checklist */}
          <div className="flex-1 w-full">
            <p className="text-[11px] text-gray-500 mb-2 font-medium">Complete your profile to get better matches and opportunities.</p>
            <div className="space-y-1">
              {checklist.map((item, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className={`w-5 h-5 transition-colors ${item.complete ? "text-emerald-500" : "text-gray-300"}`} />
                    <span className={`text-sm font-medium transition-colors ${item.complete ? "text-gray-700 group-hover:text-gray-900" : "text-gray-400"}`}>
                      {item.label}
                    </span>
                  </div>
                  <span className={`text-xs font-semibold ${item.complete ? "text-emerald-600" : "text-gray-400"}`}>
                    {item.complete ? "Complete" : "Pending"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Document Upload Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Documents</h3>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <form onSubmit={handleDocumentSubmit} className="flex flex-col h-full">
            <div className="p-4 space-y-3 flex-1">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">Document Type</label>
                <select value={docType} onChange={e => setDocType(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all">
                  <option value="AADHAAR">Aadhaar Card</option>
                  <option value="PAN">PAN Card</option>
                  <option value="DRIVING_LICENSE">Driving License</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">Upload File</label>
                {currentDocTypeDoc ? (
                  <div className="border border-gray-200 rounded-lg p-5 flex flex-col items-center justify-center gap-3 bg-gray-50 h-[120px]">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">Document Uploaded</p>
                      <p className="text-xs text-gray-500">You have already uploaded this document</p>
                    </div>
                  </div>
                ) : (
                  <div className="relative border-2 border-dashed border-gray-200 rounded-lg p-5 flex flex-col items-center justify-center gap-2 hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer h-[120px]">
                    <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={e => setDocFile(e.target.files[0])} accept=".jpg,.jpeg,.png,.pdf" />
                    <Upload className="w-6 h-6 text-gray-400" />
                    <p className="text-xs text-gray-500 text-center">
                      {docFile ? (
                        <span className="font-medium text-blue-600">{docFile.name}</span>
                      ) : (
                        <><span className="font-medium text-blue-600">Click to upload</span> or drag and drop<br/>SVG, PNG, JPG or PDF (max. 5MB)</>
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-end mt-auto">
              {currentDocTypeDoc ? (
                <button type="button" onClick={() => setShowPasswordModal(true)}
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <form id="main-settings-form" onSubmit={handleSettingsSubmit(onSaveAllSettings)} className="contents">
          
          {/* Basic Information Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Basic Information</h3>
              </div>
            </div>
            <div className="p-4 space-y-3 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700">First Name</label>
                  <input {...regSettings("firstName")} type="text" placeholder="First Name" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700">Last Name</label>
                  <input {...regSettings("lastName")} type="text" placeholder="Last Name" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">Phone</label>
                <input {...regSettings("phone")} type="tel" placeholder="Phone Number" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">Email</label>
                <input value={user?.email || ""} readOnly type="email" placeholder="Email address" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-500 outline-none" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">Address</label>
                <input value={addressLine1} onChange={(e) => { setAddressLine1(e.target.value); setHasUnsavedChanges(true); }} type="text" placeholder="Your Address" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" />
              </div>
            </div>
          </div>

          {/* Work Preferences Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Work Preferences</h3>
              </div>
            </div>
            <div className="p-4 space-y-3 flex-1">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">Work Type</label>
                <div className="flex flex-wrap gap-2">
                  {["Daily Wage", "Contract", "Monthly Salary", "Part-Time"].map(type => (
                    <label key={type} className="cursor-pointer relative">
                      <input type="checkbox" className="peer sr-only" checked={workTypes.includes(type)} onChange={() => toggleWorkType(type)} />
                      <div className="px-3 py-1.5 border-2 border-gray-100 rounded-lg text-xs font-semibold text-gray-600 transition-all peer-checked:bg-blue-600 peer-checked:text-white peer-checked:border-blue-600 peer-checked:shadow-sm hover:border-blue-200 hover:bg-blue-50/50">
                        {type}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">Experience (Years)</label>
                <select value={experienceYears} onChange={(e) => { setExperienceYears(e.target.value); setHasUnsavedChanges(true); }} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all">
                  <option value="">Select experience</option>
                  {Array.from({ length: 31 }, (_, year) => <option key={year} value={year}>{year} {year === 1 ? "Year" : "Years"}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">Skills <span className="font-normal text-gray-400">(Optional)</span></label>
                <input type="text" value={skillsText} onChange={(e) => { setSkillsText(e.target.value); setHasUnsavedChanges(true); }} placeholder="e.g. Cleaning, Cooking, Driving" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" />
                <p className="text-xs text-gray-400">Add skills separated by commas</p>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5"><Languages className="w-4 h-4 text-blue-600" /> Languages</label>
                <div className="flex gap-2">
                  <select value={languageId} onChange={(e) => setLanguageId(e.target.value)} className="min-w-0 flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all">
                    <option value="">Select a language</option>
                    {availableLanguages.map((language) => <option key={language.name} value={language.id || language.name}>{language.name}</option>)}
                  </select>
                  <button type="button" onClick={addLanguage} disabled={!languageId} className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors">Add</button>
                </div>
                {workerLanguages.length > 0 && <div className="flex flex-wrap gap-2 mt-1">
                  {workerLanguages.map((item) => <span key={item.language?.id} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium">
                    {item.language?.name}<button type="button" onClick={() => removeLanguage(item.language?.id)} aria-label={`Remove ${item.language?.name}`}><X className="w-3.5 h-3.5" /></button>
                  </span>)}
                </div>}
              </div>
              <button type="button" onClick={saveWorkPreferences} className="self-end px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">Save Work Preferences</button>
            </div>
          </div>

          {/* Location Preferences Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Location Preferences</h3>
              </div>
            </div>
            <div className="p-4 space-y-3 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700">Preferred District</label>
                  <input type="text" value={locationPreferences.district || ""} onChange={(e) => updateLocationPreference("district", e.target.value)} placeholder="e.g. Ernakulam" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700">Preferred State</label>
                  <input type="text" value={locationPreferences.state || ""} onChange={(e) => updateLocationPreference("state", e.target.value)} placeholder="e.g. Kerala" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">Max Travel Distance (km)</label>
                <input type="number" value={locationPreferences.distance || ""} onChange={(e) => updateLocationPreference("distance", e.target.value)} placeholder="e.g. 50" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input type="checkbox" checked={Boolean(locationPreferences.relocate)} onChange={(e) => updateLocationPreference("relocate", e.target.checked)} className="sr-only" />
                  <div className="block w-10 h-5 bg-slate-300 rounded-full transition-colors peer-checked:bg-blue-600"></div>
                  <div className="absolute left-[2px] top-[2px] bg-white w-4 h-4 rounded-full transition-transform"></div>
                </div>
                <span className="text-sm font-semibold text-gray-700">Willing to Relocate</span>
              </label>
              <button type="button" onClick={saveLocationPreferences} className="self-end px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">Save Location</button>
            </div>
          </div>

          {/* Expected Daily Wage Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-emerald-600" />
                <h3 className="font-semibold text-gray-900">Expected Daily Wage</h3>
              </div>
            </div>
            <div className="p-4 flex-1">
              <p className="text-xs text-gray-500 mb-3">Set your expected daily wage. This will be shown to clients when they view your profile and used as the proposed rate in hiring requests.</p>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">Daily Wage (₹)</label>
                <div className="relative">
                  <IndianRupee className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    min="0"
                    value={expectedWage}
                    onChange={(e) => setExpectedWage(e.target.value)}
                    placeholder="e.g. 800"
                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 outline-none transition-all"
                  />
                </div>
                {expectedWage && !isNaN(Number(expectedWage)) && Number(expectedWage) > 0 && (
                  <p className="text-xs text-gray-400 mt-1">Clients will be charged platform fee on top of this amount.</p>
                )}
              </div>
            </div>
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button
                type="button"
                onClick={handleSaveWage}
                disabled={isSavingWage}
                className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
              >
                {isSavingWage ? <Loader2 className="w-4 h-4 animate-spin" /> : <IndianRupee className="w-4 h-4" />}
                {isSavingWage ? "Saving..." : "Save Wage"}
              </button>
            </div>
          </div>
        </form>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Change Password</h3>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <form onSubmit={handleSubmit(change)} className="flex flex-col h-full">
            <div className="p-4 space-y-3 flex-1">
              {[
                { id: "currentPassword", label: "Current Password", placeholder: "Enter current password", field: "current" },
                { id: "newPassword",     label: "New Password",     placeholder: "Enter new password",     field: "new",
                  validate: v => v.length >= 8 || "Minimum 8 characters" },
                { id: "confirmPassword", label: "Confirm Password", placeholder: "Re-enter new password",  field: "confirm",
                  validate: v => v === watch("newPassword") || "Passwords do not match" },
              ].map(({ id, label, placeholder, field, validate }) => (
                <div key={id} className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700">{label}</label>
                  <div className="relative">
                    <input
                      {...register(id, { required: `${label} is required`, validate })}
                      type={show[field] ? "text" : "password"}
                      placeholder={placeholder}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all pr-10"
                    />
                    <button type="button" onClick={() => toggle(field)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {show[field] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors[id] && <p className="text-xs text-red-500">{errors[id].message}</p>}
                </div>
              ))}
            </div>
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-end mt-auto">
              <button type="submit" disabled={isPending}
                className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors">
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                {isPending ? "Changing…" : "Change Password"}
              </button>
            </div>
          </form>
        </div>
      </div>

      </div>

      {/* Global Save Popup */}
      {(isSettingsDirty || hasUnsavedChanges) && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] flex justify-between items-center z-40 animate-in slide-in-from-bottom-full duration-300 md:ml-64">
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-900">You have unsaved changes</p>
            <p className="text-xs text-gray-500">Please save your settings to apply the changes.</p>
          </div>
          <button type="submit" form="main-settings-form" disabled={isUpdatingProfile}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all w-full sm:w-auto justify-center">
            {isUpdatingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            {isUpdatingProfile ? "Saving..." : "Save Settings"}
          </button>
        </div>
      )}
      
      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-600" /> Security Verification
              </h3>
              <button onClick={() => setShowPasswordModal(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">&times;</button>
            </div>
            <div className="p-5">
              <p className="text-sm text-gray-600 mb-4">Please enter your login password to view this document.</p>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none" />
            </div>
            <div className="px-5 py-3 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
              <button onClick={() => setShowPasswordModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
              <button onClick={() => verifyPwd(password)} disabled={isVerifying || !password}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-colors flex items-center gap-2">
                {isVerifying ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {showDocumentViewer && currentDocTypeDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" /> {currentDocTypeDoc.documentType} Document
              </h3>
              <button onClick={() => setShowDocumentViewer(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">&times;</button>
            </div>
            <div className="p-5 flex-1 overflow-auto flex items-center justify-center bg-gray-50 min-h-[50vh]">
              {currentDocTypeDoc.documentUrl.match(/\.(jpeg|jpg|gif|png)$/i) != null ? (
                <img src={currentDocTypeDoc.documentUrl.startsWith('http') ? currentDocTypeDoc.documentUrl : `http://localhost:5000${currentDocTypeDoc.documentUrl.startsWith('/') ? '' : '/'}${currentDocTypeDoc.documentUrl}`} alt="Document" className="max-w-full max-h-full object-contain rounded border border-gray-200" />
              ) : (
                <iframe src={currentDocTypeDoc.documentUrl.startsWith('http') ? currentDocTypeDoc.documentUrl : `http://localhost:5000${currentDocTypeDoc.documentUrl.startsWith('/') ? '' : '/'}${currentDocTypeDoc.documentUrl}`} className="w-full h-[60vh] border border-gray-200 rounded" title="Document"></iframe>
              )}
            </div>
            <div className="px-5 py-3 bg-white flex justify-between gap-3 border-t border-gray-100">
              <button type="button" onClick={() => {
                if (window.confirm("Are you sure you want to remove this document?")) {
                  deleteDoc(currentDocTypeDoc.id);
                }
              }} disabled={isDeleting}
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
