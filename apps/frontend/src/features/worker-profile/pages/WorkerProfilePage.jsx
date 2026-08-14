import { useState, useEffect } from "react";
import { toast } from "sonner";
import { User, Phone, Briefcase, FileText, Loader2, Save, Building, ShieldCheck, AlertTriangle, Clock, XCircle, CheckCircle2 } from "lucide-react";

import { useAuth } from "../../../hooks/useAuth";
import api from "../../../api/axios";
import PersonalInfoForm from "../components/PersonalInfoForm";
import ContactInfoForm from "../components/ContactInfoForm";
import ProfessionalInfoForm from "../components/ProfessionalInfoForm";
import DocumentsForm from "../components/DocumentsForm";
import AgencyInfoForm from "../components/AgencyInfoForm";

export default function WorkerProfilePage() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const completion = calculateCompletion();
  const isComplete = completion === 100;

  return (
    <div className="w-full max-w-3xl mx-auto pt-8 pb-16 space-y-8 animate-fade-in px-4 sm:px-0">
      
      {/* Header & Status */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Complete Your Profile
        </h1>
        <p className="text-sm text-slate-500 max-w-lg mx-auto">
          Fill in all the necessary details below to stand out and get hired faster. A complete profile attracts more clients.
        </p>
        
        <div className="flex justify-center items-center gap-3 pt-2">
          {profileData?.profileStatus === 'APPROVED' && <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200"><ShieldCheck className="w-4 h-4"/> Approved</span>}
          {profileData?.profileStatus === 'PENDING' && <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200"><Clock className="w-4 h-4"/> Pending Approval</span>}
          {profileData?.profileStatus === 'REJECTED' && <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-red-50 text-red-700 border border-red-200"><XCircle className="w-4 h-4"/> Rejected</span>}
          {profileData?.profileStatus === 'SUSPENDED' && <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200"><AlertTriangle className="w-4 h-4"/> Suspended</span>}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-slate-800">Profile Completion</span>
            <span className={`text-sm font-bold ${isComplete ? 'text-emerald-600' : 'text-indigo-600'}`}>{completion}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div 
              className={`h-2.5 rounded-full transition-all duration-1000 ${isComplete ? 'bg-emerald-500' : 'bg-indigo-500'}`} 
              style={{ width: `${completion}%` }}
            ></div>
          </div>
        </div>
        {isComplete && (
          <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl shrink-0 border border-emerald-100">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-sm font-bold">All Set!</span>
          </div>
        )}
      </div>

      {/* Forms Sections Stacked vertically in minimal cards */}
      <div className="space-y-6">
        
        {/* Personal Info */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600"><User className="w-5 h-5" /></div>
            <h2 className="text-lg font-bold text-slate-900">Personal Information</h2>
          </div>
          <PersonalInfoForm data={profileData} onSave={handleSave} saving={saving} hideHeader />
        </section>

        {/* Contact Info */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600"><Phone className="w-5 h-5" /></div>
            <h2 className="text-lg font-bold text-slate-900">Contact Details</h2>
          </div>
          <ContactInfoForm data={profileData} onSave={handleSave} saving={saving} hideHeader />
        </section>

        {/* Professional Info */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600"><Briefcase className="w-5 h-5" /></div>
            <h2 className="text-lg font-bold text-slate-900">Professional Details</h2>
          </div>
          <ProfessionalInfoForm data={profileData} onSave={handleSave} saving={saving} hideHeader />
        </section>

        {/* Documents & Resume */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600"><FileText className="w-5 h-5" /></div>
            <h2 className="text-lg font-bold text-slate-900">Documents & Resume</h2>
          </div>
          <DocumentsForm data={profileData} onSave={handleSave} saving={saving} hideHeader />
        </section>

        {/* Agency Info */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600"><Building className="w-5 h-5" /></div>
            <h2 className="text-lg font-bold text-slate-900">Agency & Workforce</h2>
          </div>
          <AgencyInfoForm data={profileData} hideHeader />
        </section>

      </div>
    </div>
  );
}
