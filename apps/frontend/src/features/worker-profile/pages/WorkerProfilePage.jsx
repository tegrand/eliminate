import { useState, useEffect } from "react";
import { toast } from "sonner";
import { User, Phone, Briefcase, FileText, Loader2, Building, ShieldCheck, AlertTriangle, Clock, XCircle, CheckCircle2, MapPin, Calendar } from "lucide-react";

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
      <div className="w-full h-[60vh] flex items-center justify-center bg-[#f7f7f7]">
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

  const tabs = [
    { id: 'personal', label: 'Personal', icon: User },
    { id: 'contact', label: 'Contact', icon: Phone },
    { id: 'professional', label: 'Professional', icon: Briefcase },
    { id: 'documents', label: 'Documents', icon: FileText },
  ];

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-[#f7f7f7] overflow-y-auto py-4 px-4 sm:px-6 font-sans text-[#404145]">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Header Title */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-[#404145] tracking-tight">
            My Profile
          </h1>
          <p className="text-sm text-[#74767e] mt-0.5">
            Fill in your details below to stand out and get hired faster.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-5">
          
          {/* Left Sidebar (Fiverr Style) */}
          <div className="w-full md:w-[320px] shrink-0 space-y-4">
            
            {/* Main Profile Overview Card */}
            <div className="bg-white border border-[#e4e5e7] rounded p-4 shadow-sm">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="w-[120px] h-[120px] rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200 shadow-inner">
                    {avatar ? (
                      <img src={avatar.startsWith('http') || avatar.startsWith('data:') ? avatar : `http://localhost:5000${avatar.startsWith('/') ? '' : '/'}${avatar}`} alt={name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-5xl text-gray-400 font-bold">{initials}</span>
                    )}
                  </div>
                  {profileData?.presentToday && (
                    <div className="absolute bottom-4 right-4 w-4 h-4 bg-[#1dbf73] rounded-full border-2 border-white" title="Available today"></div>
                  )}
                </div>
                
                <h2 className="text-lg font-bold text-[#404145] mb-1 flex items-center justify-center gap-1.5">
                  {name}
                  {profileData?.profileStatus === 'APPROVED' && <CheckCircle2 className="w-4 h-4 text-[#1dbf73]" />}
                </h2>
                
                <p className="text-sm text-[#74767e] mb-5">{skillName}</p>

                {/* Profile Status Badge */}
                <div className="w-full mb-5 flex justify-center">
                  {profileData?.profileStatus === 'APPROVED' && <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider bg-[#e8f8f0] text-[#1dbf73] border border-[#b2e5cc]"><ShieldCheck className="w-4 h-4"/> Approved</span>}
                  {profileData?.profileStatus === 'PENDING' && <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider bg-[#fff7e6] text-[#ffb33e] border border-[#ffe0a3]"><Clock className="w-4 h-4"/> Pending Approval</span>}
                  {profileData?.profileStatus === 'REJECTED' && <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider bg-[#ffebeb] text-[#ff6259] border border-[#ffb8b4]"><XCircle className="w-4 h-4"/> Rejected</span>}
                  {profileData?.profileStatus === 'SUSPENDED' && <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider bg-gray-100 text-gray-700 border border-gray-300"><AlertTriangle className="w-4 h-4"/> Suspended</span>}
                </div>
              </div>

              <hr className="my-4 border-[#e4e5e7]" />

              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2 text-[#74767e]">
                    <MapPin className="w-4 h-4" />
                    <span>From</span>
                  </div>
                  <span className="font-semibold text-[#404145]">{location}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2 text-[#74767e]">
                    <User className="w-4 h-4" />
                    <span>Member since</span>
                  </div>
                  <span className="font-semibold text-[#404145]">
                    {profileData?.createdAt ? new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(new Date(profileData.createdAt)) : "Unknown"}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Completion Card */}
            <div className="bg-white border border-[#e4e5e7] rounded p-4 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <span className="text-base font-bold text-[#404145]">Profile Completion</span>
                <span className={`text-sm font-bold ${isComplete ? 'text-[#1dbf73]' : 'text-blue-600'}`}>{completion}%</span>
              </div>
              <div className="w-full bg-[#f4f4f4] rounded-full h-2.5 overflow-hidden mb-4">
                <div 
                  className={`h-2.5 rounded-full transition-all duration-1000 ${isComplete ? 'bg-[#1dbf73]' : 'bg-blue-600'}`} 
                  style={{ width: `${completion}%` }}
                ></div>
              </div>
              
              {isComplete ? (
                <div className="flex items-center gap-2 text-[#1dbf73] bg-[#e8f8f0] px-3 py-2 rounded text-sm font-bold border border-[#b2e5cc]">
                  <CheckCircle2 className="w-4 h-4" /> All Set!
                </div>
              ) : (
                <p className="text-xs text-[#74767e]">
                  Please fill out the forms on the right to complete your profile to 100%.
                </p>
              )}
            </div>

          </div>

          {/* Right Main Content (Modern Tabs) */}
          <div className="flex-1 relative min-h-[600px] md:min-h-0">
            <div className="md:absolute md:inset-0 w-full h-full bg-white border border-[#e4e5e7] rounded shadow-sm overflow-hidden flex flex-col">
              
              {/* Tabs Navigation */}
              <div className="flex border-b border-[#e4e5e7] overflow-x-auto scrollbar-hide bg-[#fafafa] shrink-0">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-3 text-sm font-bold whitespace-nowrap transition-colors border-b-2 outline-none ${
                        isActive 
                          ? 'border-[#1dbf73] text-[#1dbf73] bg-white' 
                          : 'border-transparent text-[#74767e] hover:text-[#404145] hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Tab Content Area */}
              <div className="p-5 sm:p-6 flex-1 bg-white overflow-y-auto">
                <div className={activeTab === 'personal' ? 'block animate-fade-in' : 'hidden'}>
                  <div className="mb-5 pb-3 border-b border-[#e4e5e7]">
                    <h2 className="text-lg font-bold text-[#404145]">Personal Information</h2>
                    <p className="text-xs text-[#74767e] mt-1">Update your basic details and identification.</p>
                  </div>
                  <PersonalInfoForm data={profileData} onSave={handleSave} saving={saving} hideHeader />
                </div>

                <div className={activeTab === 'contact' ? 'block animate-fade-in' : 'hidden'}>
                  <div className="mb-5 pb-3 border-b border-[#e4e5e7]">
                    <h2 className="text-lg font-bold text-[#404145]">Contact Details</h2>
                    <p className="text-xs text-[#74767e] mt-1">Manage how clients can reach out to you.</p>
                  </div>
                  <ContactInfoForm data={profileData} onSave={handleSave} saving={saving} hideHeader />
                </div>

                <div className={activeTab === 'professional' ? 'block animate-fade-in' : 'hidden'}>
                  <div className="mb-5 pb-3 border-b border-[#e4e5e7]">
                    <h2 className="text-lg font-bold text-[#404145]">Professional Details</h2>
                    <p className="text-xs text-[#74767e] mt-1">Set your skills, experience, and work preferences.</p>
                  </div>
                  <ProfessionalInfoForm data={profileData} onSave={handleSave} saving={saving} hideHeader />
                </div>

                <div className={activeTab === 'documents' ? 'block animate-fade-in' : 'hidden'}>
                  <div className="mb-5 pb-3 border-b border-[#e4e5e7]">
                    <h2 className="text-lg font-bold text-[#404145]">Documents & Resume</h2>
                    <p className="text-xs text-[#74767e] mt-1">Upload files for verification and client viewing.</p>
                  </div>
                  <DocumentsForm data={profileData} onSave={handleSave} saving={saving} hideHeader />
                </div>

              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
