import React, { useState } from 'react';
import { 
  Building2, MapPin, Mail, Phone, Globe, ShieldCheck, 
  Clock, FileText, Briefcase, Camera, Edit2, Save,
  X, CheckCircle, AlertCircle, FileCheck
} from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';

export default function AgencyProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock data for the agency profile
  const [profile, setProfile] = useState({
    agencyName: user?.agencyProfile?.name || 'Tegrand Manpower Solutions',
    description: 'A leading manpower and staffing solutions provider with over 10 years of experience in the construction and hospitality sectors.',
    logo: null,
    isVerified: true,
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
      open: '09:00 AM',
      close: '06:00 PM',
      workingDays: 'Monday - Saturday'
    },
    feePercentage: 10,
    workerFixedAmount: 1580
  });

  const handleSave = async () => {
    if (user?.agencyProfile?.id) {
      try {
        const { agencyApi } = await import('../api/agency.api.js');
        await agencyApi.updateAgency(user.agencyProfile.id, {
          feePercentage: Number(profile.feePercentage),
          workerFixedAmount: Number(profile.workerFixedAmount)
        });
        alert("Settings saved successfully!");
      } catch (err) {
        console.error(err);
        alert("Failed to save settings");
      }
    }
    setIsEditing(false);
  };

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agency Profile</h1>
          <p className="text-gray-500 mt-1">Manage your agency's public profile and business details.</p>
        </div>
        <div className="flex items-center gap-3">
          {isEditing ? (
            <>
              <button 
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
              <button 
                onClick={handleSave}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors shadow-sm flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors shadow-sm flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4" /> Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Basic Info & Logo */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
            
            <div className="relative mt-12 flex flex-col items-center">
              <div className="relative group">
                <div className="w-28 h-28 bg-white rounded-full p-2 shadow-lg flex items-center justify-center border-4 border-white">
                  {profile.logo ? (
                    <img src={profile.logo} alt="Logo" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <Building2 className="w-12 h-12 text-indigo-300" />
                  )}
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 shadow-md transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="mt-4 text-center w-full">
                {isEditing ? (
                  <input 
                    type="text" 
                    value={profile.agencyName}
                    onChange={(e) => setProfile({...profile, agencyName: e.target.value})}
                    className="w-full text-center text-xl font-bold text-gray-900 border-b-2 border-indigo-200 focus:border-indigo-600 bg-transparent outline-none px-2 py-1"
                  />
                ) : (
                  <h2 className="text-xl font-bold text-gray-900">{profile.agencyName}</h2>
                )}
                
                <div className="flex items-center justify-center gap-1.5 mt-2">
                  {profile.isVerified ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-100">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified Agency
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-100">
                      <AlertCircle className="w-3.5 h-3.5" /> Unverified
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 space-y-4">
              <div className="flex items-start gap-3 text-gray-600">
                <Mail className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Email Address</p>
                  {isEditing ? (
                    <input type="email" value={profile.contact.email} onChange={(e) => setProfile({...profile, contact: {...profile.contact, email: e.target.value}})} className="w-full mt-1 text-sm border-gray-200 rounded-md p-1.5 focus:ring-indigo-500 focus:border-indigo-500" />
                  ) : (
                    <p className="text-sm mt-0.5">{profile.contact.email}</p>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-3 text-gray-600">
                <Phone className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Phone Number</p>
                  {isEditing ? (
                    <input type="text" value={profile.contact.phone} onChange={(e) => setProfile({...profile, contact: {...profile.contact, phone: e.target.value}})} className="w-full mt-1 text-sm border-gray-200 rounded-md p-1.5 focus:ring-indigo-500 focus:border-indigo-500" />
                  ) : (
                    <p className="text-sm mt-0.5">{profile.contact.phone}</p>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-3 text-gray-600">
                <Globe className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Website</p>
                  {isEditing ? (
                    <input type="text" value={profile.contact.website} onChange={(e) => setProfile({...profile, contact: {...profile.contact, website: e.target.value}})} className="w-full mt-1 text-sm border-gray-200 rounded-md p-1.5 focus:ring-indigo-500 focus:border-indigo-500" />
                  ) : (
                    <a href={`https://${profile.contact.website}`} className="text-sm mt-0.5 text-indigo-600 hover:underline">{profile.contact.website}</a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Info */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* About Section */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-indigo-500" /> About Agency
            </h3>
            {isEditing ? (
              <textarea 
                value={profile.description}
                onChange={(e) => setProfile({...profile, description: e.target.value})}
                rows={4}
                className="w-full text-sm text-gray-700 border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 p-3"
              />
            ) : (
              <p className="text-sm text-gray-600 leading-relaxed">{profile.description}</p>
            )}
          </div>

          {/* Compliance & Registration */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <FileCheck className="w-5 h-5 text-emerald-500" /> Compliance & Registration
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
                {isEditing ? (
                  <input type="text" value={profile.compliance.gst} onChange={(e) => setProfile({...profile, compliance: {...profile.compliance, gst: e.target.value}})} className="w-full text-sm border-gray-200 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500" />
                ) : (
                  <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100 font-mono">{profile.compliance.gst}</div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
                {isEditing ? (
                  <input type="text" value={profile.compliance.licenseNumber} onChange={(e) => setProfile({...profile, compliance: {...profile.compliance, licenseNumber: e.target.value}})} className="w-full text-sm border-gray-200 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500" />
                ) : (
                  <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100 font-mono">{profile.compliance.licenseNumber}</div>
                )}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <label className="block text-sm font-medium text-gray-700 mb-3">Registration Documents</label>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer group">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                    <FileText className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Trade License.pdf</p>
                    <p className="text-xs text-gray-500">2.4 MB • Uploaded Jan 12</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer group">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                    <FileText className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">GST Certificate.pdf</p>
                    <p className="text-xs text-gray-500">1.1 MB • Uploaded Jan 12</p>
                  </div>
                </div>
                {isEditing && (
                  <button className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-xl text-sm font-medium text-gray-600 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 transition-all min-w-[200px]">
                    + Upload Document
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Operational Details */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <Briefcase className="w-5 h-5 text-blue-500" /> Operational Details
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 text-gray-400" /> Office Address
                </label>
                {isEditing ? (
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="Street" value={profile.address.street} onChange={(e) => setProfile({...profile, address: {...profile.address, street: e.target.value}})} className="col-span-2 text-sm border-gray-200 rounded-md p-2" />
                    <input type="text" placeholder="City" value={profile.address.city} onChange={(e) => setProfile({...profile, address: {...profile.address, city: e.target.value}})} className="text-sm border-gray-200 rounded-md p-2" />
                    <input type="text" placeholder="State" value={profile.address.state} onChange={(e) => setProfile({...profile, address: {...profile.address, state: e.target.value}})} className="text-sm border-gray-200 rounded-md p-2" />
                    <input type="text" placeholder="Pincode" value={profile.address.pincode} onChange={(e) => setProfile({...profile, address: {...profile.address, pincode: e.target.value}})} className="text-sm border-gray-200 rounded-md p-2" />
                  </div>
                ) : (
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                    {profile.address.street}, {profile.address.city}, {profile.address.state} - {profile.address.pincode}
                  </p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Globe className="w-4 h-4 text-gray-400" /> Service Areas
                </label>
                <div className="flex flex-wrap gap-2">
                  {profile.serviceAreas.map((area, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full border border-blue-100">
                      {area}
                    </span>
                  ))}
                  {isEditing && (
                    <button className="px-3 py-1 border border-dashed border-gray-300 text-gray-500 text-sm font-medium rounded-full hover:border-indigo-400 hover:text-indigo-600 transition-colors">
                      + Add Area
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 text-gray-400" /> Business Hours
                </label>
                <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Working Days</p>
                    {isEditing ? (
                      <input type="text" value={profile.businessHours.workingDays} onChange={(e) => setProfile({...profile, businessHours: {...profile.businessHours, workingDays: e.target.value}})} className="w-full text-sm border-gray-200 rounded-md p-1.5" />
                    ) : (
                      <p className="text-sm font-medium text-gray-900">{profile.businessHours.workingDays}</p>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Timings</p>
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <input type="text" value={profile.businessHours.open} onChange={(e) => setProfile({...profile, businessHours: {...profile.businessHours, open: e.target.value}})} className="w-20 text-sm border-gray-200 rounded-md p-1.5" />
                        <span className="text-gray-400">-</span>
                        <input type="text" value={profile.businessHours.close} onChange={(e) => setProfile({...profile, businessHours: {...profile.businessHours, close: e.target.value}})} className="w-20 text-sm border-gray-200 rounded-md p-1.5" />
                      </div>
                    ) : (
                      <p className="text-sm font-medium text-gray-900">{profile.businessHours.open} - {profile.businessHours.close}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          
        </div>
      </div>
    </div>
  );
}
