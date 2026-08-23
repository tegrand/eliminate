import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { User, Phone, Briefcase, FileText, Loader2, ShieldCheck, AlertTriangle, Clock, XCircle, CheckCircle2, MapPin, Camera, Save, X, Check } from "lucide-react";

import { useAuth } from "../../../hooks/useAuth";
import api from "../../../api/axios";
import PersonalInfoForm from "../components/PersonalInfoForm";
import ContactInfoForm from "../components/ContactInfoForm";
import ProfessionalInfoForm from "../components/ProfessionalInfoForm";
import DocumentsForm from "../components/DocumentsForm";

export default function WorkerProfilePage() {
  const { user, updateUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formDataFile = new FormData();
      formDataFile.append("file", file);

      const { usersApi } = await import("../../../api/users.api.js");
      const res = await usersApi.uploadAvatar(formDataFile);
      const documentUrl = res.data?.data?.avatar || res.data?.avatar;

      if (!documentUrl) throw new Error("Upload failed");

      // Save to worker profile too
      handleSave({ profilePhoto: documentUrl });
      toast.success("Profile photo uploaded successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to upload photo");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await api.get("/workers/my-profile");
      setProfileData(response.data.data);
    } catch (error) {
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async (updatedFields) => {
    try {
      setSaving(true);
      const response = await api.patch(`/workers/my-profile`, updatedFields);
      setProfileData(response.data.data);
      if (updatedFields.email) {
        updateUser({ email: updatedFields.email });
      }
      toast.success("Profile updated successfully");
      setIsDirty(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const avatar = profileData?.user?.avatar || profileData?.profilePhoto || user?.avatar;

  const firstName = profileData?.user?.firstName || profileData?.firstName || user?.firstName || "";
  const lastName = profileData?.user?.lastName || profileData?.lastName || user?.lastName || "";
  const name = `${firstName} ${lastName}`.trim() || profileData?.user?.name || user?.name || "Worker";
  const initials = name.split(" ").map(n => n?.[0] || "").join("").substring(0, 2).toUpperCase() || "W";

  const skillName = profileData?.primarySkill?.name || (typeof profileData?.primarySkill === 'string' ? profileData?.primarySkill : null) || profileData?.skills?.[0]?.skill?.name || "Complete your profile";

  const city = profileData?.city || profileData?.user?.city || "";
  const district = profileData?.district || profileData?.user?.district || "";
  const state = profileData?.state || profileData?.user?.state || "";

  let location = "Location not set";
  if (city && district) location = `${city}, ${district}`;
  else if (city && state) location = `${city}, ${state}`;
  else if (district && state) location = `${district}, ${state}`;
  else if (city) location = city;
  else if (district) location = district;
  else if (state) location = state;
  else if (profileData?.addressLine1) location = profileData.addressLine1;

  const createdAtRaw = profileData?.createdAt || profileData?.user?.createdAt || user?.createdAt;
  const memberSince = createdAtRaw
    ? new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(new Date(createdAtRaw))
    : "Unknown";

  const getAvatarUrl = (src) => {
    if (!src) return null;
    if (src.startsWith('http') || src.startsWith('data:')) return src;
    return `http://localhost:5000${src.startsWith('/') ? '' : '/'}${src}`;
  };

  const tabs = [
    { id: 'personal', label: 'Personal', icon: User },
    { id: 'contact', label: 'Contact', icon: Phone },
    { id: 'professional', label: 'Profession', icon: Briefcase },
    { id: 'documents', label: 'Documents', icon: FileText },
  ];

  // Checklist items completion status
  const checklistItems = [
    {
      id: 'avatar',
      label: 'Profile Photo',
      subtitle: (avatar || profileData?.profilePhoto) ? 'Completed' : 'Upload photo',
      icon: Camera,
      isCompleted: Boolean(avatar || profileData?.profilePhoto),
      onClick: () => fileInputRef.current?.click(),
    },
    {
      id: 'personal',
      label: 'Personal Details',
      subtitle: (profileData?.firstName || profileData?.user?.firstName) ? 'Completed' : 'Basic info & identification',
      icon: User,
      isCompleted: Boolean(profileData?.firstName || profileData?.user?.firstName),
      onClick: () => setActiveModalTab('personal'),
    },
    {
      id: 'contact',
      label: 'Contact Details',
      subtitle: (profileData?.phone || profileData?.user?.email || profileData?.email) ? 'Completed' : 'Phone number & email',
      icon: Phone,
      isCompleted: Boolean(profileData?.phone || profileData?.user?.email || profileData?.email),
      onClick: () => setActiveModalTab('contact'),
    },
    {
      id: 'professional',
      label: 'Skills & Experience',
      subtitle: (profileData?.skills?.length > 0 || profileData?.primarySkill || profileData?.jobType || profileData?.expectedDailyWage || profileData?.totalExperienceYears !== null) ? 'Completed' : 'Add skills, experience & wages',
      icon: Briefcase,
      isCompleted: Boolean(profileData?.skills?.length > 0 || profileData?.primarySkill || profileData?.jobType || profileData?.expectedDailyWage || profileData?.totalExperienceYears !== null),
      onClick: () => setActiveModalTab('professional'),
    },
    {
      id: 'documents',
      label: 'Documents & Verification',
      subtitle: (profileData?.documents?.length > 0 || profileData?.resumeUrl || profileData?.aadhaarNumber) ? 'Completed' : 'Upload ID & certificates',
      icon: FileText,
      isCompleted: Boolean(profileData?.documents?.length > 0 || profileData?.resumeUrl || profileData?.aadhaarNumber),
      onClick: () => setActiveModalTab('documents'),
    },
  ];

  // Calculate profile completion percentage dynamically from checklist items
  const calculateCompletion = () => {
    if (!checklistItems || checklistItems.length === 0) return 0;
    const completedCount = checklistItems.filter(item => item.isCompleted).length;
    return Math.round((completedCount / checklistItems.length) * 100);
  };

  if (loading) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-gray-900" />
      </div>
    );
  }

  const completion = calculateCompletion();
  const isComplete = completion === 100;

  return (
    <div className="w-full min-h-screen bg-transparent pb-24 sm:pb-28 font-sans">
      
      <div className="max-w-4xl mx-auto px-2 sm:px-4 pt-4 sm:pt-5 space-y-3 sm:space-y-4">

        {/* ── Profile Overview Card ── */}
        <div className="bg-white rounded-[28px] border border-gray-100 shadow-sm p-4 sm:p-5 relative mt-7 sm:mt-8">
          
          <div className="flex flex-row items-center gap-4 sm:gap-6">
            {/* Avatar with Circular SVG Progress Ring */}
            <div className="relative shrink-0 -mt-14 sm:-mt-16 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              
              {/* Circular SVG Progress Ring wrapped around avatar */}
              <div className="relative w-26 h-26 sm:w-30 sm:h-30 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                  {/* Track Ring */}
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="5"
                  />
                  {/* Progress Stroke */}
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    fill="none"
                    stroke={isComplete ? "#10b981" : "#059669"}
                    strokeWidth="5.5"
                    strokeLinecap="round"
                    strokeDasharray={276.46}
                    strokeDashoffset={276.46 * (1 - completion / 100)}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>

                {/* Inner Round Avatar Photo */}
                <div className="w-[82%] h-[82%] rounded-full bg-white p-0.5 shadow-sm relative overflow-hidden flex items-center justify-center">
                  {isUploading ? (
                    <Loader2 className="w-7 h-7 text-emerald-600 animate-spin" />
                  ) : avatar ? (
                    <img src={getAvatarUrl(avatar)} alt={name} className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <span className="text-2xl sm:text-3xl font-bold text-slate-400">{initials}</span>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
              
              {/* Camera badge */}
              <div className="absolute bottom-0 right-0 w-6.5 h-6.5 sm:w-7.5 sm:h-7.5 bg-emerald-600 rounded-full flex items-center justify-center shadow-md border-2 border-white z-10 hover:bg-emerald-700 transition-colors">
                <Camera className="w-3.5 h-3.5 text-white" />
              </div>

              {/* Completion Percentage Badge */}
              <div className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full border border-white shadow-sm z-10">
                {completion}%
              </div>

              <input ref={fileInputRef} onChange={handlePhotoUpload} type="file" className="hidden" accept="image/png,image/jpg,image/jpeg" />
            </div>

            {/* Name & Status on Right */}
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight truncate">{name}</h2>
                {profileData?.profileStatus === 'APPROVED' && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                )}
              </div>

              {/* Status Badge directly under name */}
              <div className="mt-1 flex items-center gap-2">
                {profileData?.profileStatus === 'APPROVED' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100">
                    <ShieldCheck className="w-3.5 h-3.5" /> Approved
                  </span>
                )}
                {profileData?.profileStatus === 'PENDING' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-100">
                    <Clock className="w-3.5 h-3.5" /> Pending Approval
                  </span>
                )}
                {profileData?.profileStatus === 'REJECTED' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-700 border border-red-100">
                    <XCircle className="w-3.5 h-3.5" /> Rejected
                  </span>
                )}
                {profileData?.profileStatus === 'SUSPENDED' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-700 border border-gray-200">
                    <AlertTriangle className="w-3.5 h-3.5" /> Suspended
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Location & Joined Info */}
          <div className="w-full grid grid-cols-2 gap-2 border-t border-gray-100 mt-3 pt-3">
            <div className="flex flex-col items-center sm:items-start sm:pl-2">
              <span className="text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-wider font-bold flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-gray-400" /> Location
              </span>
              <span className="text-xs font-semibold text-gray-800 mt-0.5">{location}</span>
            </div>
            <div className="flex flex-col items-center sm:items-start sm:pl-2">
              <span className="text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-wider font-bold flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-gray-400" /> Member Since
              </span>
              <span className="text-xs font-semibold text-gray-800 mt-0.5">{memberSince}</span>
            </div>
          </div>
        </div>

        {/* ── Segmented Control Tab Toggle Bar ── */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-1.5 sm:p-2">
          <div className="flex items-center p-1 bg-slate-100/80 rounded-2xl gap-1 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveModalTab(tab.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white text-slate-800 hover:text-emerald-700 hover:bg-emerald-50/80 rounded-xl shadow-xs border border-slate-200/50 transition-all text-xs sm:text-sm font-bold cursor-pointer whitespace-nowrap"
                >
                  <Icon className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Profile Completion Checklist Items ── */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between px-1 mb-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Profile Checklist</h3>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
              {checklistItems.filter(i => i.isCompleted).length} / {checklistItems.length} Completed
            </span>
          </div>

          <div className="space-y-2">
            {checklistItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={item.onClick}
                  className="bg-white rounded-2xl border border-gray-100 shadow-xs p-3.5 sm:p-4 flex items-center justify-between transition-all hover:border-emerald-200 hover:shadow-sm cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center font-bold transition-colors ${
                      item.isCompleted 
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100/60' 
                        : 'bg-slate-100 text-slate-400 border border-slate-200/50 group-hover:bg-emerald-50/50 group-hover:text-emerald-500'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                        {item.label}
                      </h4>
                      <p className={`text-xs font-medium mt-0.5 ${item.isCompleted ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Green Checkmark Circle vs Empty Circle */}
                  <div className="shrink-0 ml-3">
                    {item.isCompleted ? (
                      <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 text-slate-300 flex items-center justify-center group-hover:border-emerald-300 group-hover:text-emerald-400 transition-colors">
                        <div className="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-emerald-400" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* ── Full-Screen / Blurred Background Modal for Forms ── */}
      {activeModalTab && (
        <div className="fixed inset-0 z-[110] bg-slate-900/50 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 flex flex-col max-h-[85vh] overflow-hidden animate-scale-up">
            
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-2.5">
                <div className="w-8.5 h-8.5 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  {activeModalTab === 'personal' && <User className="w-4.5 h-4.5" />}
                  {activeModalTab === 'contact' && <Phone className="w-4.5 h-4.5" />}
                  {activeModalTab === 'professional' && <Briefcase className="w-4.5 h-4.5" />}
                  {activeModalTab === 'documents' && <FileText className="w-4.5 h-4.5" />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-tight">
                    {activeModalTab === 'personal' && "Personal Information"}
                    {activeModalTab === 'contact' && "Contact Details"}
                    {activeModalTab === 'professional' && "Professional Info"}
                    {activeModalTab === 'documents' && "Documents & Verification"}
                  </h3>
                  <p className="text-[11px] text-slate-500">Update and save your information below.</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModalTab(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Modal Body (Scrollable Form) */}
            <div className="p-5 sm:p-6 overflow-y-auto flex-1">
              {activeModalTab === 'personal' && (
                <PersonalInfoForm 
                  data={profileData} 
                  onSave={async (fields) => { await handleSave(fields); setActiveModalTab(null); }} 
                  saving={saving} 
                  hideHeader 
                  isActive={true}
                />
              )}
              {activeModalTab === 'contact' && (
                <ContactInfoForm 
                  data={profileData} 
                  onSave={async (fields) => { await handleSave(fields); setActiveModalTab(null); }} 
                  saving={saving} 
                  hideHeader 
                  isActive={true}
                />
              )}
              {activeModalTab === 'professional' && (
                <ProfessionalInfoForm 
                  data={profileData} 
                  onSave={async (fields) => { await handleSave(fields); setActiveModalTab(null); }} 
                  saving={saving} 
                  hideHeader 
                  isActive={true}
                />
              )}
              {activeModalTab === 'documents' && (
                <DocumentsForm 
                  data={profileData} 
                  onSave={async (fields) => { await handleSave(fields); setActiveModalTab(null); }} 
                  saving={saving} 
                  hideHeader 
                  isActive={true}
                />
              )}
            </div>

            {/* Modal Footer with Save Button */}
            <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setActiveModalTab(null)}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="profile-form"
                disabled={saving}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-70"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{saving ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
