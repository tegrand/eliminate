import { useState, useEffect } from "react";
import { toast } from "sonner";
import { User, Phone, Briefcase, FileText, Loader2, ShieldCheck, AlertTriangle, Clock, XCircle, CheckCircle2, MapPin } from "lucide-react";

import { useAuth } from "../../../hooks/useAuth";
import api from "../../../api/axios";
import PersonalInfoForm from "../components/PersonalInfoForm";
import ContactInfoForm from "../components/ContactInfoForm";
import ProfessionalInfoForm from "../components/ProfessionalInfoForm";
import DocumentsForm from "../components/DocumentsForm";

export default function WorkerProfilePage() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => {
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
    fetchProfile();
  }, []);

  const handleSave = async (updatedFields) => {
    try {
      setSaving(true);
      const response = await api.patch(`/workers/my-profile`, updatedFields);
      setProfileData(response.data.data);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // Calculate profile completion percentage
  const calculateCompletion = () => {
    if (!profileData) return 0;
    const requiredFields = [
      profileData.firstName,
      profileData.phone,
      profileData.gender,
      profileData.dateOfBirth,
      profileData.city,
      profileData.district,
      profileData.jobType || (profileData.skills && profileData.skills.length > 0),
      profileData.totalExperienceYears !== null,
      profileData.expectedDailyWage,
      profileData.resumeUrl || profileData.aadhaarNumber,
    ];
    const filledFields = requiredFields.filter(field => Boolean(field));
    return Math.round((filledFields.length / requiredFields.length) * 100);
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

  const firstName = profileData?.user?.firstName || profileData?.firstName || user?.firstName || "";
  const lastName = profileData?.user?.lastName || profileData?.lastName || user?.lastName || "";
  const name = `${firstName} ${lastName}`.trim() || profileData?.user?.name || user?.name || "Worker";
  const initials = name.split(" ").map(n => n?.[0] || "").join("").substring(0, 2).toUpperCase() || "W";

  const skillName = profileData?.primarySkill?.name || (typeof profileData?.primarySkill === 'string' ? profileData?.primarySkill : null) || profileData?.skills?.[0]?.skill?.name || "Complete your profile";
  const avatar = profileData?.user?.avatar || profileData?.profilePhoto || user?.avatar;

  let location = "Location not set";
  if (profileData?.district && profileData?.state) location = `${profileData.district}, ${profileData.state}`;
  else if (profileData?.district) location = profileData.district;

  const memberSince = profileData?.createdAt
    ? new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(new Date(profileData.createdAt))
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

  return (
    <div className="w-full min-h-screen bg-gray-50 pb-12">
      <div className="max-w-2xl mx-auto px-3 sm:px-4 pt-3 sm:pt-5 space-y-3 sm:space-y-4">

        <div>
          <h1 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">My Profile</h1>
        </div>

        {/* ── Profile Overview Card ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 sm:p-4">
          {/* Top row: avatar + info */}
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden border border-gray-200 shadow-inner flex items-center justify-center">
                {avatar ? (
                  <img src={getAvatarUrl(avatar)} alt={name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-gray-400">{initials}</span>
                )}
              </div>
              {profileData?.presentToday && (
                <div className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" />
              )}
            </div>

            {/* Name + skill + status */}
            <div className="flex-1 min-w-0 pt-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 className="text-lg font-bold text-gray-900 leading-tight">{name}</h2>
                {profileData?.profileStatus === 'APPROVED' && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                )}
              </div>
              <p className="text-sm text-gray-500 mt-0.5">{skillName}</p>

              {/* Status badge */}
              <div className="mt-2">
                {profileData?.profileStatus === 'APPROVED' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5" /> Approved
                  </span>
                )}
                {profileData?.profileStatus === 'PENDING' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-amber-50 text-amber-600 border border-amber-200">
                    <Clock className="w-3.5 h-3.5" /> Pending Approval
                  </span>
                )}
                {profileData?.profileStatus === 'REJECTED' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-red-50 text-red-600 border border-red-200">
                    <XCircle className="w-3.5 h-3.5" /> Rejected
                  </span>
                )}
                {profileData?.profileStatus === 'SUSPENDED' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600 border border-gray-200">
                    <AlertTriangle className="w-3.5 h-3.5" /> Suspended
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 mt-3 pt-3 sm:mt-4 sm:pt-4 grid grid-cols-2 gap-2 sm:gap-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">From</p>
                <p className="text-sm font-semibold text-gray-800">{location}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400 shrink-0" />
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Member since</p>
                <p className="text-sm font-semibold text-gray-800">{memberSince}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Profile Completion Card ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 sm:p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-bold text-gray-900">Profile Completion</span>
            <span className={`text-sm font-bold ${isComplete ? 'text-emerald-500' : 'text-blue-600'}`}>{completion}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden mb-3">
            <div
              className={`h-2.5 rounded-full transition-all duration-1000 ${isComplete ? 'bg-emerald-500' : 'bg-blue-500'}`}
              style={{ width: `${completion}%` }}
            />
          </div>
          {isComplete ? (
            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-2 rounded-xl text-sm font-bold border border-emerald-100">
              <CheckCircle2 className="w-4 h-4" /> All Set!
            </div>
          ) : (
            <p className="text-xs text-gray-500">Please fill out the forms below to complete your profile to 100%.</p>
          )}
        </div>

        {/* ── Tabs + Form Card ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Tab bar */}
          <div className="flex border-b border-gray-100 overflow-x-auto scrollbar-hide bg-gray-50/80">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-3 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 outline-none flex-1 justify-center ${
                    isActive
                      ? 'border-emerald-500 text-emerald-600 bg-white'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          <div className="p-3 sm:p-4">
            <div className={activeTab === 'personal' ? 'block animate-fade-in' : 'hidden'}>
              <div className="mb-4 pb-3 border-b border-gray-100">
                <h3 className="text-base font-bold text-gray-900">Personal Information</h3>
                <p className="text-xs text-gray-500 mt-0.5">Update your basic details and identification.</p>
              </div>
              <PersonalInfoForm data={profileData} onSave={handleSave} saving={saving} hideHeader />
            </div>

            <div className={activeTab === 'contact' ? 'block animate-fade-in' : 'hidden'}>
              <div className="mb-4 pb-3 border-b border-gray-100">
                <h3 className="text-base font-bold text-gray-900">Contact Details</h3>
                <p className="text-xs text-gray-500 mt-0.5">Manage how clients can reach out to you.</p>
              </div>
              <ContactInfoForm data={profileData} onSave={handleSave} saving={saving} hideHeader />
            </div>

            <div className={activeTab === 'professional' ? 'block animate-fade-in' : 'hidden'}>
              <div className="mb-4 pb-3 border-b border-gray-100">
                <h3 className="text-base font-bold text-gray-900">Professional Details</h3>
                <p className="text-xs text-gray-500 mt-0.5">Set your skills, experience, and work preferences.</p>
              </div>
              <ProfessionalInfoForm data={profileData} onSave={handleSave} saving={saving} hideHeader />
            </div>

            <div className={activeTab === 'documents' ? 'block animate-fade-in' : 'hidden'}>
              <div className="mb-4 pb-3 border-b border-gray-100">
                <h3 className="text-base font-bold text-gray-900">Documents & Resume</h3>
                <p className="text-xs text-gray-500 mt-0.5">Upload files for verification and client viewing.</p>
              </div>
              <DocumentsForm data={profileData} onSave={handleSave} saving={saving} hideHeader />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
