import React, { useState, useRef } from 'react';
import { 
  Building2, MapPin, Mail, Phone, Globe, ShieldCheck, 
  AlertCircle, Building, Briefcase, FileCheck, CheckCircle2,
  PhoneCall, AlertTriangle, Clock, XCircle, User, Camera,
  Edit3, Check, Loader2, Award, FileText
} from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import clsx from 'clsx';
import { toast } from 'sonner';

import AgencyBasicInfoForm from '../components/AgencyBasicInfoForm';
import AgencyContactForm from '../components/AgencyContactForm';
import AgencyComplianceForm from '../components/AgencyComplianceForm';
import AgencyOperationsForm from '../components/AgencyOperationsForm';

export default function AgencyProfilePage() {
  const { user, updateUser } = useAuth();
  
  const [activeTab, setActiveTab] = useState("basic");
  const [activeModalTab, setActiveModalTab] = useState(null);
  const [saving, setSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [agencyType, setAgencyType] = useState(user?.agencyProfile?.agencyType?.toLowerCase() || "corporate");

  const fileInputRef = useRef(null);

  // Real data for the agency profile
  const [profile, setProfile] = useState({
    agencyName: user?.agencyProfile?.agencyName || '',
    description: user?.agencyProfile?.notes || '',
    logo: user?.agencyProfile?.logoUrl || null,
    isVerified: user?.agencyProfile?.profileStatus === 'APPROVED',
    profileStatus: user?.agencyProfile?.profileStatus || 'PENDING',
    contact: {
      email: user?.agencyProfile?.email || user?.email || '',
      phone: user?.agencyProfile?.phone || '',
      website: user?.agencyProfile?.website || ''
    },
    address: {
      street: user?.agencyProfile?.addressLine1 || '',
      addressLine2: user?.agencyProfile?.addressLine2 || '',
      city: user?.agencyProfile?.city || '',
      state: user?.agencyProfile?.state || '',
      country: user?.agencyProfile?.country || '',
      pincode: user?.agencyProfile?.postalCode || ''
    },
    compliance: {
      gst: user?.agencyProfile?.gstNumber || '',
      licenseNumber: user?.agencyProfile?.licenseNumber || ''
    },
    serviceAreas: user?.agencyProfile?.serviceAreas || [],
    businessHours: {
      workingDays: user?.agencyProfile?.workingDays || '',
      open: user?.agencyProfile?.openTime || '',
      close: user?.agencyProfile?.closeTime || ''
    },
    feePercentage: user?.agencyProfile?.feePercentage || 10,
    workerFixedAmount: user?.agencyProfile?.workerFixedAmount || 1580,
    createdAt: user?.agencyProfile?.createdAt || new Date().toISOString()
  });

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("documentType", "PHOTO");
      formData.append("file", file);

      const { agencyApi } = await import('../api/agency.api.js');
      const res = await agencyApi.uploadDocument(formData);
      const documentUrl = res?.data?.documentUrl || res?.documentUrl || res?.data?.data?.documentUrl;

      if (!documentUrl) throw new Error("Upload failed");

      setProfile(prev => ({ ...prev, logo: documentUrl }));
      
      if (user?.agencyProfile?.id) {
        await agencyApi.updateAgency(user.agencyProfile.id, { logoUrl: documentUrl });
      }

      try {
        const { usersApi } = await import('../../../api/users.api.js');
        await usersApi.updateProfile({ avatar: documentUrl });
        updateUser({ avatar: documentUrl });
      } catch (userErr) {
        console.warn('Failed to update avatar globally:', userErr);
      }

      toast.success("Agency logo updated successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to upload logo");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSave = async (updatedData) => {
    setSaving(true);
    setProfile(updatedData);
    
    if (user?.agencyProfile?.id) {
      try {
        const { agencyApi } = await import('../api/agency.api.js');
        
        const payload = {
          agencyName: updatedData.agencyName || undefined,
          notes: updatedData.description || undefined,
          logoUrl: updatedData.logo || undefined,
          agencyType: agencyType.toUpperCase(),
          
          email: updatedData.contact?.email || undefined,
          phone: updatedData.contact?.phone || undefined,
          website: updatedData.contact?.website || undefined,
          
          addressLine1: updatedData.address?.street || undefined,
          addressLine2: updatedData.address?.addressLine2 || undefined,
          city: updatedData.address?.city || undefined,
          state: updatedData.address?.state || undefined,
          country: updatedData.address?.country || undefined,
          postalCode: updatedData.address?.pincode || undefined,
          
          gstNumber: updatedData.compliance?.gst || undefined,
          licenseNumber: updatedData.compliance?.licenseNumber || undefined,
          
          serviceAreas: updatedData.serviceAreas || undefined,
          workingDays: updatedData.businessHours?.workingDays || undefined,
          openTime: updatedData.businessHours?.open || undefined,
          closeTime: updatedData.businessHours?.close || undefined,
          
          feePercentage: Number(updatedData.feePercentage),
          workerFixedAmount: Number(updatedData.workerFixedAmount)
        };
        
        Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

        await agencyApi.updateAgency(user.agencyProfile.id, payload);
        if (payload.email) {
          updateUser({ email: payload.email });
        }
        toast.success("Profile saved successfully!");
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Failed to save profile");
      }
    }
    setSaving(false);
  };

  const name = agencyType === 'corporate' ? (profile.agencyName || "Agency Name") : (user?.name || "Individual Recruiter");
  const initials = name.split(" ").map(n => n?.[0] || "").join("").substring(0, 2).toUpperCase() || "A";

  let location = "Location not set";
  if (profile?.address?.city && profile?.address?.state) location = `${profile.address.city}, ${profile.address.state}`;
  else if (profile?.address?.city) location = profile.address.city;
  else if (profile?.address?.state) location = profile.address.state;

  const getAvatarUrl = (src) => {
    if (!src) return null;
    if (src.startsWith('http') || src.startsWith('data:')) return src;
    return `http://localhost:5000${src.startsWith('/') ? '' : '/'}${src}`;
  };

  // Profile completion checklist items
  const checklistItems = [
    {
      id: 'logo',
      label: 'Agency Logo / Photo',
      subtitle: profile.logo ? 'Completed' : 'Upload agency logo or photo',
      icon: Camera,
      isCompleted: Boolean(profile.logo),
      onClick: () => fileInputRef.current?.click(),
    },
    {
      id: 'basic',
      label: 'Basic Agency Info',
      subtitle: profile.agencyName ? 'Completed' : 'Agency name & description',
      icon: Building,
      isCompleted: Boolean(profile.agencyName),
      onClick: () => setActiveModalTab('basic'),
    },
    {
      id: 'contact',
      label: 'Contact Details',
      subtitle: (profile.contact?.phone || profile.contact?.email) ? 'Completed' : 'Phone & email contact info',
      icon: PhoneCall,
      isCompleted: Boolean(profile.contact?.phone || profile.contact?.email),
      onClick: () => setActiveModalTab('contact'),
    },
    {
      id: 'compliance',
      label: 'Compliance & Registration',
      subtitle: (profile.compliance?.gst || profile.compliance?.licenseNumber) ? 'Completed' : 'GST or Trade License number',
      icon: FileCheck,
      isCompleted: Boolean(profile.compliance?.gst || profile.compliance?.licenseNumber),
      onClick: () => setActiveModalTab('compliance'),
    },
    {
      id: 'operations',
      label: 'Operational Details',
      subtitle: (profile.address?.city || profile.serviceAreas?.length > 0) ? 'Completed' : 'Office address & service areas',
      icon: Briefcase,
      isCompleted: Boolean(profile.address?.city || profile.serviceAreas?.length > 0),
      onClick: () => setActiveModalTab('operations'),
    },
  ];

  const completion = Math.round((checklistItems.filter(item => item.isCompleted).length / checklistItems.length) * 100);
  const isComplete = completion === 100;

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: Building },
    { id: 'contact', label: 'Contact', icon: PhoneCall },
    { id: 'compliance', label: 'Compliance', icon: FileCheck },
    { id: 'operations', label: 'Operations', icon: Briefcase },
  ];

  return (
    <div className="w-full min-h-screen bg-transparent pb-24 sm:pb-28 font-sans">
      
      <div className="max-w-4xl mx-auto px-2 sm:px-4 pt-4 sm:pt-5 space-y-3 sm:space-y-4">

        {/* ── Profile Overview Card ── */}
        <div className="bg-white rounded-[28px] border border-gray-100 shadow-xs p-4 sm:p-5 relative mt-7 sm:mt-8">
          
          <div className="flex flex-row items-center gap-4 sm:gap-6">
            {/* Logo Avatar with SVG Progress Ring */}
            <div className="relative shrink-0 -mt-14 sm:-mt-16 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              
              <div className="relative w-26 h-26 sm:w-30 sm:h-30 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="5"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    fill="none"
                    stroke="#c084fc"
                    strokeWidth="5.5"
                    strokeLinecap="round"
                    strokeDasharray={276.46}
                    strokeDashoffset={276.46 * (1 - completion / 100)}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>

                {/* Inner Round Avatar Photo */}
                <div className="w-[82%] h-[82%] rounded-full bg-white p-0.5 shadow-xs relative overflow-hidden flex items-center justify-center">
                  {isUploading ? (
                    <Loader2 className="w-7 h-7 text-violet-600 animate-spin" />
                  ) : profile.logo ? (
                    <img src={getAvatarUrl(profile.logo)} alt={name} className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <span className="text-2xl sm:text-3xl font-bold text-violet-400">{initials}</span>
                  )}
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
              
              {/* Camera Badge */}
              <div className="absolute bottom-0 right-0 w-6.5 h-6.5 sm:w-7.5 sm:h-7.5 bg-violet-500 rounded-full flex items-center justify-center shadow-md border-2 border-white z-10 hover:bg-violet-600 transition-colors">
                <Camera className="w-3.5 h-3.5 text-white" />
              </div>

              {/* Completion Percentage Badge */}
              <div className="absolute -top-1 -right-1 bg-violet-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full border border-white shadow-xs z-10">
                {completion}%
              </div>

              <input ref={fileInputRef} onChange={handleLogoUpload} type="file" className="hidden" accept="image/png,image/jpg,image/jpeg" />
            </div>

            {/* Name & Status */}
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight truncate">{name}</h2>
                {profile.profileStatus === 'APPROVED' && (
                  <CheckCircle2 className="w-4 h-4 text-violet-500 shrink-0" />
                )}
              </div>

              {/* Verification Badge */}
              <div className="mt-1 flex items-center gap-2">
                {profile.profileStatus === 'APPROVED' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-violet-50 text-violet-700 border border-violet-100">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified Agency
                  </span>
                )}
                {profile.profileStatus === 'PENDING' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-100">
                    <Clock className="w-3.5 h-3.5" /> Pending Verification
                  </span>
                )}
                {profile.profileStatus === 'REJECTED' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-700 border border-red-100">
                    <XCircle className="w-3.5 h-3.5" /> Rejected
                  </span>
                )}
                {profile.profileStatus === 'SUSPENDED' && (
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
              <span className="text-xs font-semibold text-gray-800 mt-0.5 truncate max-w-full">{location}</span>
            </div>
            <div className="flex flex-col items-center sm:items-start sm:pl-2">
              <span className="text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-wider font-bold flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-gray-400" /> Member Since
              </span>
              <span className="text-xs font-semibold text-gray-800 mt-0.5">
                {profile.createdAt ? new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(new Date(profile.createdAt)) : "Unknown"}
              </span>
            </div>
          </div>
        </div>

        {/* ── Complete Profile Checklist Card ── */}
        {!isComplete && (
          <div className="bg-white rounded-[24px] border border-violet-100 p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">Complete Your Agency Profile</h3>
                <p className="text-xs text-slate-500">Fill in all details to get verified faster.</p>
              </div>
              <span className="text-xs font-extrabold px-2.5 py-1 bg-violet-100 text-violet-700 rounded-full border border-violet-200">
                {completion}%
              </span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-violet-400 to-purple-500 rounded-full transition-all duration-1000"
                style={{ width: `${completion}%` }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {checklistItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={item.onClick}
                    className={clsx(
                      "flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer",
                      item.isCompleted 
                        ? "bg-violet-50/40 border-violet-100 hover:bg-violet-50/70"
                        : "bg-white border-slate-200 hover:border-violet-300 hover:bg-slate-50"
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={clsx(
                        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                        item.isCompleted ? "bg-violet-100 text-violet-600" : "bg-slate-100 text-slate-500"
                      )}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">{item.label}</div>
                        <div className="text-[10px] text-slate-500 truncate">{item.subtitle}</div>
                      </div>
                    </div>
                    {item.isCompleted ? (
                      <Check className="w-4 h-4 text-violet-600 shrink-0 ml-2" />
                    ) : (
                      <span className="text-[10px] font-bold text-violet-600 shrink-0 ml-2 uppercase">Edit</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Tabs Navigation ── */}
        <div className="flex bg-white/80 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200 shadow-xs overflow-x-auto scrollbar-none">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={clsx(
                  "flex-1 min-w-[100px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap",
                  isActive
                    ? "bg-violet-500 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* ── Tab Section Content Cards ── */}
        <div className="space-y-4">
          
          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <div className="bg-white rounded-[24px] border border-slate-100 p-5 shadow-xs space-y-4 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-violet-600" />
                  <h3 className="text-base font-bold text-slate-900">Basic Information</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModalTab('basic')}
                  className="px-3 py-1.5 bg-violet-50 hover:bg-violet-100 text-violet-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-violet-100"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Details</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Agency Name</span>
                  <span className="text-sm font-semibold text-slate-800 mt-0.5 block">{profile.agencyName || "Not specified"}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Account Type</span>
                  <span className="text-sm font-semibold text-slate-800 mt-0.5 block capitalize">{agencyType} Agency</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">About Agency</span>
                  <span className="text-xs text-slate-600 mt-0.5 block leading-relaxed">{profile.description || "No description provided yet."}</span>
                </div>
              </div>
            </div>
          )}

          {/* Contact Details Tab */}
          {activeTab === 'contact' && (
            <div className="bg-white rounded-[24px] border border-slate-100 p-5 shadow-xs space-y-4 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-5 h-5 text-violet-600" />
                  <h3 className="text-base font-bold text-slate-900">Contact Details</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModalTab('contact')}
                  className="px-3 py-1.5 bg-violet-50 hover:bg-violet-100 text-violet-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-violet-100"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Details</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                    <Mail className="w-3 h-3 text-slate-400" /> Email Address
                  </span>
                  <span className="text-sm font-semibold text-slate-800 mt-0.5 block">{profile.contact?.email || "Not specified"}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" /> Phone Number
                  </span>
                  <span className="text-sm font-semibold text-slate-800 mt-0.5 block">{profile.contact?.phone || "Not specified"}</span>
                </div>
                {profile.contact?.website && (
                  <div className="sm:col-span-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                      <Globe className="w-3 h-3 text-slate-400" /> Website
                    </span>
                    <a
                      href={profile.contact.website.startsWith('http') ? profile.contact.website : `https://${profile.contact.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-violet-600 hover:underline mt-0.5 inline-block"
                    >
                      {profile.contact.website}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Compliance & Registration Tab */}
          {activeTab === 'compliance' && (
            <div className="bg-white rounded-[24px] border border-slate-100 p-5 shadow-xs space-y-4 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-violet-600" />
                  <h3 className="text-base font-bold text-slate-900">Compliance & Registration</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModalTab('compliance')}
                  className="px-3 py-1.5 bg-violet-50 hover:bg-violet-100 text-violet-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-violet-100"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Details</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">GST Number</span>
                  <span className="text-sm font-semibold text-slate-800 mt-0.5 block">{profile.compliance?.gst || "Not specified"}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">License Number</span>
                  <span className="text-sm font-semibold text-slate-800 mt-0.5 block">{profile.compliance?.licenseNumber || "Not specified"}</span>
                </div>
              </div>
            </div>
          )}

          {/* Operational Details Tab */}
          {activeTab === 'operations' && (
            <div className="bg-white rounded-[24px] border border-slate-100 p-5 shadow-xs space-y-4 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-violet-600" />
                  <h3 className="text-base font-bold text-slate-900">Operational Details</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModalTab('operations')}
                  className="px-3 py-1.5 bg-violet-50 hover:bg-violet-100 text-violet-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-violet-100"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Details</span>
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Office Address</span>
                  <span className="text-xs text-slate-700 font-semibold mt-0.5 block">
                    {[profile.address?.street, profile.address?.city, profile.address?.state, profile.address?.pincode].filter(Boolean).join(", ") || "Address not set"}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Service Areas</span>
                  {profile.serviceAreas?.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {profile.serviceAreas.map((area, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-violet-50 text-violet-700 rounded-lg text-xs font-bold border border-violet-100">
                          {area}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500">No service areas added.</span>
                  )}
                </div>

                {profile.businessHours?.workingDays && (
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Working Days & Hours</span>
                    <span className="text-xs text-slate-700 font-semibold mt-0.5 block">
                      {profile.businessHours.workingDays} {profile.businessHours.open && `(${profile.businessHours.open} - ${profile.businessHours.close})`}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* ── Section Edit Modals ── */}
      <AgencyBasicInfoForm
        data={profile}
        onSave={handleSave}
        saving={saving}
        agencyType={agencyType}
        setAgencyType={setAgencyType}
        isOpen={activeModalTab === 'basic'}
        onClose={() => setActiveModalTab(null)}
      />

      <AgencyContactForm
        data={profile}
        onSave={handleSave}
        saving={saving}
        agencyType={agencyType}
        isOpen={activeModalTab === 'contact'}
        onClose={() => setActiveModalTab(null)}
      />

      <AgencyComplianceForm
        data={profile}
        onSave={handleSave}
        saving={saving}
        agencyType={agencyType}
        isOpen={activeModalTab === 'compliance'}
        onClose={() => setActiveModalTab(null)}
      />

      <AgencyOperationsForm
        data={profile}
        onSave={handleSave}
        saving={saving}
        agencyType={agencyType}
        isOpen={activeModalTab === 'operations'}
        onClose={() => setActiveModalTab(null)}
      />

    </div>
  );
}
