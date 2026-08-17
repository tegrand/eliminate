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
    <div className="w-full min-h-screen bg-gray-50/50 pb-12 sm:pb-16 font-sans">
      
      {/* ── Cover Header ── */}
      <div className="h-32 sm:h-40 bg-gradient-to-r from-blue-600 to-indigo-700 w-full relative">
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
          <h1 className="text-xs sm:text-sm font-bold text-white/90 uppercase tracking-widest">My Profile</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 relative z-10 -mt-12 sm:-mt-16 space-y-4 sm:space-y-6">

        {/* ── Profile Overview Card ── */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm px-5 pb-6 pt-0 flex flex-col items-center text-center">
          
          {/* Avatar */}
          <div className="relative shrink-0 -mt-10 sm:-mt-12">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white p-1 border border-gray-100 shadow-sm">
              <div className="w-full h-full rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
                {avatar ? (
                  <img src={getAvatarUrl(avatar)} alt={name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl sm:text-4xl font-bold text-gray-400">{initials}</span>
                )}
              </div>
            </div>
            {profileData?.presentToday && (
              <div className="absolute bottom-2 right-2 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
            )}
          </div>

          {/* Name & Title */}
          <div className="mt-3 w-full">
            <div className="flex items-center gap-1.5 justify-center flex-wrap">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">{name}</h2>
              {profileData?.profileStatus === 'APPROVED' && (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              )}
            </div>
            <p className="text-sm font-medium text-gray-500 mt-1">{skillName}</p>

            {/* Status Badge */}
            <div className="mt-3 flex justify-center">
              {profileData?.profileStatus === 'APPROVED' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100">
                  <ShieldCheck className="w-4 h-4" /> Approved
                </span>
              )}
              {profileData?.profileStatus === 'PENDING' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-100">
                  <Clock className="w-4 h-4" /> Pending Approval
                </span>
              )}
              {profileData?.profileStatus === 'REJECTED' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-red-50 text-red-700 border border-red-100">
                  <XCircle className="w-4 h-4" /> Rejected
                </span>
              )}
              {profileData?.profileStatus === 'SUSPENDED' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-gray-100 text-gray-700 border border-gray-200">
                  <AlertTriangle className="w-4 h-4" /> Suspended
                </span>
              )}
            </div>
          </div>

          {/* Location & Joined Info */}
          <div className="w-full grid grid-cols-2 gap-4 border-t border-gray-100 mt-6 pt-5">
            <div className="flex flex-col items-center">
              <MapPin className="w-5 h-5 text-gray-400 mb-1.5" />
              <span className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider font-bold">Location</span>
              <span className="text-sm font-semibold text-gray-800 mt-0.5">{location}</span>
            </div>
            <div className="flex flex-col items-center">
              <User className="w-5 h-5 text-gray-400 mb-1.5" />
              <span className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider font-bold">Member Since</span>
              <span className="text-sm font-semibold text-gray-800 mt-0.5">{memberSince}</span>
            </div>
          </div>
        </div>

        {/* ── Profile Completion Card ── */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm sm:text-base font-bold text-gray-900">Profile Completion</span>
            <span className={`text-sm sm:text-base font-black ${isComplete ? 'text-emerald-500' : 'text-blue-600'}`}>{completion}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden mb-3">
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-out ${isComplete ? 'bg-emerald-500' : 'bg-blue-600'}`}
              style={{ width: `${completion}%` }}
            />
          </div>
          {isComplete ? (
            <div className="flex items-center justify-center gap-2 text-emerald-700 bg-emerald-50 px-4 py-2.5 rounded-xl text-sm font-bold border border-emerald-100">
              <CheckCircle2 className="w-4 h-4" /> Profile is 100% Complete!
            </div>
          ) : (
            <p className="text-xs sm:text-sm text-gray-500 text-center font-medium">Complete the sections below to reach 100% and get noticed.</p>
          )}
        </div>

        {/* ── Tabs + Form Card ── */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          {/* iOS-style Segmented Control for Tabs */}
          <div className="p-2 sm:p-3 border-b border-gray-100 bg-gray-50/50">
            <div className="flex p-1 bg-gray-200/60 rounded-xl overflow-x-auto scrollbar-hide gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-2.5 text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex-1 justify-center rounded-lg ${
                      isActive
                        ? 'bg-white text-gray-900 shadow-sm border border-gray-100/50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className={isActive ? 'block' : 'hidden sm:block'}>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab content */}
          <div className="p-4 sm:p-6">
            <div className={activeTab === 'personal' ? 'block animate-fade-in' : 'hidden'}>
              <div className="mb-5">
                <h3 className="text-lg font-bold text-gray-900">Personal Info</h3>
                <p className="text-sm text-gray-500 mt-1">Update your basic details and identification.</p>
              </div>
              <PersonalInfoForm data={profileData} onSave={handleSave} saving={saving} hideHeader />
            </div>

            <div className={activeTab === 'contact' ? 'block animate-fade-in' : 'hidden'}>
              <div className="mb-5">
                <h3 className="text-lg font-bold text-gray-900">Contact Details</h3>
                <p className="text-sm text-gray-500 mt-1">Manage how clients can reach out to you.</p>
              </div>
              <ContactInfoForm data={profileData} onSave={handleSave} saving={saving} hideHeader />
            </div>

            <div className={activeTab === 'professional' ? 'block animate-fade-in' : 'hidden'}>
              <div className="mb-5">
                <h3 className="text-lg font-bold text-gray-900">Professional Info</h3>
                <p className="text-sm text-gray-500 mt-1">Set your skills, experience, and work preferences.</p>
              </div>
              <ProfessionalInfoForm data={profileData} onSave={handleSave} saving={saving} hideHeader />
            </div>

            <div className={activeTab === 'documents' ? 'block animate-fade-in' : 'hidden'}>
              <div className="mb-5">
                <h3 className="text-lg font-bold text-gray-900">Documents</h3>
                <p className="text-sm text-gray-500 mt-1">Upload files for verification and client viewing.</p>
              </div>
              <DocumentsForm data={profileData} onSave={handleSave} saving={saving} hideHeader />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
