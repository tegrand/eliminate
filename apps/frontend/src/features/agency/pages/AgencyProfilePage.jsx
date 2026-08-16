import React, { useState } from 'react';
import { 
  Building2, MapPin, Mail, Phone, Globe, ShieldCheck, 
  AlertCircle, Building, Briefcase, FileCheck, CheckCircle2,
  PhoneCall, AlertTriangle, Clock, XCircle, User
} from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import clsx from 'clsx';

import AgencyBasicInfoForm from '../components/AgencyBasicInfoForm';
import AgencyContactForm from '../components/AgencyContactForm';
import AgencyComplianceForm from '../components/AgencyComplianceForm';
import AgencyOperationsForm from '../components/AgencyOperationsForm';

const TABS = [
  { id: "basic", label: "Basic Info", icon: Building },
  { id: "contact", label: "Contact Details", icon: PhoneCall },
  { id: "compliance", label: "Compliance", icon: FileCheck },
  { id: "operations", label: "Operations", icon: Briefcase },
];

export default function AgencyProfilePage() {
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState("basic");
  const [saving, setSaving] = useState(false);
  const [agencyType, setAgencyType] = useState("corporate"); // 'corporate' or 'individual'

  // Mock data for the agency profile
  const [profile, setProfile] = useState({
    agencyName: user?.agencyProfile?.name || 'Tegrand Manpower Solutions',
    description: 'A leading manpower and staffing solutions provider with over 10 years of experience in the construction and hospitality sectors.',
    logo: null,
    isVerified: true,
    profileStatus: 'APPROVED',
    contact: {
      email: user?.email || 'contact@tegrand.com',
      phone: '+91 98765 43210',
      website: 'www.tegrandmanpower.com'
    },
    address: {
      street: '123 Business Park, Tech Boulevard',
      city: user?.agencyProfile?.city || 'Kochi',
      state: user?.agencyProfile?.state || 'Kerala',
      pincode: '682030'
    },
    compliance: {
      gst: '32ABCDE1234F1Z5',
      licenseNumber: 'LIC/2023/KOC/8892'
    },
    serviceAreas: ['Kochi', 'Trivandrum', 'Calicut', 'Bangalore'],
    businessHours: {
      open: '09:00',
      close: '18:00',
      workingDays: 'Monday - Saturday'
    },
    feePercentage: 10,
    workerFixedAmount: 1580,
    createdAt: new Date().toISOString()
  });

  const handleSave = async (updatedData) => {
    setSaving(true);
    setProfile(updatedData);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Existing save logic for fee
    if (user?.agencyProfile?.id) {
      try {
        const { agencyApi } = await import('../api/agency.api.js');
        await agencyApi.updateAgency(user.agencyProfile.id, {
          feePercentage: Number(updatedData.feePercentage),
          workerFixedAmount: Number(updatedData.workerFixedAmount)
        });
      } catch (err) {
        console.error(err);
      }
    }
    setSaving(false);
  };

  const name = agencyType === 'corporate' ? profile.agencyName : (profile.ownerName || user?.name || "Individual Recruiter");
  const initials = name.split(" ").map(n => n?.[0] || "").join("").substring(0, 2).toUpperCase() || "A";

  let location = "Location not set";
  if (profile?.address?.city && profile?.address?.state) location = `${profile.address.city}, ${profile.address.state}`;
  else if (profile?.address?.city) location = profile.address.city;

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-[#f7f7f7] overflow-y-auto py-4 px-4 sm:px-6 font-sans text-[#404145]">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Header Title */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-[#404145] tracking-tight">Agency Profile</h1>
          <p className="text-sm text-[#74767e] mt-0.5">Manage your agency's public profile and business details.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-5">
          
          {/* Left Sidebar */}
          <div className="w-full md:w-[320px] shrink-0 space-y-4">
            
            {/* Profile Card */}
            <div className="bg-white border border-[#e4e5e7] rounded p-4 shadow-sm">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="w-[120px] h-[120px] rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200 shadow-inner">
                    {profile.logo ? (
                      <img src={profile.logo} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-5xl text-gray-400 font-bold">{initials}</span>
                    )}
                  </div>
                </div>
                
                <h2 className="text-lg font-bold text-[#404145] mb-1 flex items-center justify-center gap-1.5">
                  {name}
                  {profile.isVerified && <CheckCircle2 className="w-4 h-4 text-[#1dbf73]" />}
                </h2>
                
                <p className="text-sm text-[#74767e] mb-5">{agencyType === 'corporate' ? 'Corporate Agency' : 'Individual Recruiter'}</p>

                {/* Profile Status Badge */}
                <div className="w-full mb-5 flex justify-center">
                  {profile.profileStatus === 'APPROVED' && <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider bg-[#e8f8f0] text-[#1dbf73] border border-[#b2e5cc]"><ShieldCheck className="w-4 h-4"/> Verified</span>}
                  {profile.profileStatus === 'PENDING' && <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider bg-[#fff7e6] text-[#ffb33e] border border-[#ffe0a3]"><Clock className="w-4 h-4"/> Pending Verification</span>}
                  {profile.profileStatus === 'REJECTED' && <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider bg-[#ffebeb] text-[#ff6259] border border-[#ffb8b4]"><XCircle className="w-4 h-4"/> Rejected</span>}
                  {profile.profileStatus === 'SUSPENDED' && <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider bg-gray-100 text-gray-700 border border-gray-300"><AlertTriangle className="w-4 h-4"/> Suspended</span>}
                </div>
              </div>

              <hr className="my-4 border-[#e4e5e7]" />

              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2 text-[#74767e]">
                    <MapPin className="w-4 h-4" />
                    <span>Location</span>
                  </div>
                  <span className="font-semibold text-[#404145]">{location}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2 text-[#74767e]">
                    <Mail className="w-4 h-4" />
                    <span>Email</span>
                  </div>
                  <span className="font-semibold text-[#404145] truncate max-w-[150px]">{profile.contact.email}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2 text-[#74767e]">
                    <Building className="w-4 h-4" />
                    <span>Member since</span>
                  </div>
                  <span className="font-semibold text-[#404145]">
                    {profile.createdAt ? new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(new Date(profile.createdAt)) : "Unknown"}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Completion Card */}
            <div className="bg-white border border-[#e4e5e7] rounded p-4 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <span className="text-base font-bold text-[#404145]">Profile Completion</span>
                <span className="text-sm font-bold text-[#1dbf73]">100%</span>
              </div>
              <div className="w-full bg-[#f4f4f4] rounded-full h-2.5 overflow-hidden mb-4">
                <div className="h-2.5 rounded-full transition-all duration-1000 bg-[#1dbf73]" style={{ width: `100%` }}></div>
              </div>
              <div className="flex items-center gap-2 text-[#1dbf73] bg-[#e8f8f0] px-3 py-2 rounded text-sm font-bold border border-[#b2e5cc]">
                <CheckCircle2 className="w-4 h-4" /> All Set!
              </div>
            </div>

          </div>

          {/* Right Main Content */}
          <div className="flex-1 relative min-h-[600px] md:min-h-0">
            <div className="md:absolute md:inset-0 w-full h-full bg-white border border-[#e4e5e7] rounded shadow-sm overflow-hidden flex flex-col">
              
              {/* Tabs Header */}
              <div className="flex border-b border-[#e4e5e7] overflow-x-auto scrollbar-hide bg-[#fafafa] shrink-0">
                {TABS.filter(tab => !(agencyType === 'individual' && tab.id === 'compliance')).map(tab => {
                  let Icon = tab.icon;
                  let label = tab.label;
                  if (agencyType === 'individual' && tab.id === 'basic') {
                    Icon = User;
                    label = 'Personal Info';
                  }

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

              {/* Tab Content */}
              <div className="p-5 sm:p-6 flex-1 bg-white overflow-y-auto">
                <div className={activeTab === 'basic' ? 'block animate-fade-in' : 'hidden'}>
                  <div className="mb-5 pb-3 border-b border-[#e4e5e7]">
                    <h2 className="text-lg font-bold text-[#404145]">{agencyType === 'corporate' ? 'Basic Information' : 'Personal Information'}</h2>
                    <p className="text-xs text-[#74767e] mt-1">{agencyType === 'corporate' ? "Update your agency's name and description." : "Update your personal details."}</p>
                  </div>
                  <AgencyBasicInfoForm data={profile} onSave={handleSave} saving={saving} agencyType={agencyType} setAgencyType={setAgencyType} hideHeader />
                </div>
                <div className={activeTab === 'contact' ? 'block animate-fade-in' : 'hidden'}>
                  <div className="mb-5 pb-3 border-b border-[#e4e5e7]">
                    <h2 className="text-lg font-bold text-[#404145]">Contact Details</h2>
                    <p className="text-xs text-[#74767e] mt-1">How clients and workers can reach you.</p>
                  </div>
                  <AgencyContactForm data={profile} onSave={handleSave} saving={saving} agencyType={agencyType} hideHeader />
                </div>
                <div className={activeTab === 'compliance' ? 'block animate-fade-in' : 'hidden'}>
                  <div className="mb-5 pb-3 border-b border-[#e4e5e7]">
                    <h2 className="text-lg font-bold text-[#404145]">Compliance & Registration</h2>
                    <p className="text-xs text-[#74767e] mt-1">Manage your agency's legal registration details.</p>
                  </div>
                  <AgencyComplianceForm data={profile} onSave={handleSave} saving={saving} agencyType={agencyType} hideHeader />
                </div>
                <div className={activeTab === 'operations' ? 'block animate-fade-in' : 'hidden'}>
                  <div className="mb-5 pb-3 border-b border-[#e4e5e7]">
                    <h2 className="text-lg font-bold text-[#404145]">{agencyType === 'corporate' ? 'Operational Details' : 'Work Details'}</h2>
                    <p className="text-xs text-[#74767e] mt-1">{agencyType === 'corporate' ? "Manage your office address, service areas, and business hours." : "Manage your address and service areas."}</p>
                  </div>
                  <AgencyOperationsForm data={profile} onSave={handleSave} saving={saving} agencyType={agencyType} hideHeader />
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
