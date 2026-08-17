import { useAuth } from "../../../../hooks/useAuth";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../../routes/routePaths";
import {
  MapPin, Briefcase, PhoneCall, Edit3,
  CheckCircle2, ChevronRight, Building, Users, Wallet, Target
} from "lucide-react";

export default function ClientProfileStatus() {
  const { user } = useAuth();
  
  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    const baseUrl = import.meta.env.VITE_API_BASE_URL 
      ? import.meta.env.VITE_API_BASE_URL.replace('/api/v1', '') 
      : 'http://localhost:5000';
    return `${baseUrl}/${path.replace(/\\/g, '/').replace(/^\//, '')}`;
  };

  const profileImageUrl = getImageUrl(user?.avatar || user?.clientProfile?.profilePhoto || user?.clientProfile?.companyLogo);
  const initials = user?.email ? user.email.charAt(0).toUpperCase() : "C";
  
  const clientProfile = user?.clientProfile || {};
  
  const firstName = user?.firstName || clientProfile.firstName || "";
  const lastName = user?.lastName || clientProfile.lastName || "";
  const name = `${firstName} ${lastName}`.trim() || user?.name || "Client";

  const isVerified = clientProfile.profileStatus === "APPROVED";
  const companyName = clientProfile.companyName || "Not specified";
  const industry = clientProfile.industry || "Not specified";

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start mt-4 animate-fade-in">
      {/* Left Sidebar */}
      <div className="w-full lg:w-[320px] shrink-0">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 relative">
          
          {/* Avatar */}
          <div className="flex flex-col items-center pt-2 mb-4">
            <div className="relative mb-3">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white border-4 border-white shadow-lg flex items-center justify-center shrink-0 text-blue-600 font-bold text-3xl overflow-hidden relative z-10 bg-gradient-to-br from-blue-50 to-indigo-100 -mt-12 sm:mt-0">
                {profileImageUrl ? (
                  <img src={profileImageUrl} alt={name} className="w-full h-full object-cover" />
                ) : (
                  initials
                )}
              </div>
            </div>
            
            <h1 className="text-lg font-semibold text-gray-900 mb-0.5 text-center">Ready to Hire</h1>
            <p className="text-xs text-gray-500 mb-2 text-center max-w-[200px]">
              Your profile is visible. You can now post jobs and hire workers.
            </p>
          </div>

          {/* Quick Info & Actions */}
          <div className="space-y-4 pt-2">
            <Link to={ROUTES.CLIENT_SETTINGS} className="block w-full">
              <button className="w-full px-4 py-2.5 bg-white text-slate-700 font-medium border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 shadow-sm">
                <Edit3 className="w-4 h-4 text-slate-400" />
                Edit Profile
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Right Content */}
      <div className="flex-1 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Phone Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <PhoneCall className="w-3 h-3" />
              </div>
              <h2 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Contact Number</h2>
            </div>
            <p className="text-sm font-semibold text-slate-800">{user?.phone || "Not provided"}</p>
          </div>

          {/* Location Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                <MapPin className="w-3 h-3" />
              </div>
              <h2 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Base Location</h2>
            </div>
            <p className="text-sm font-semibold text-slate-800">{clientProfile?.district || "Location not set"}</p>
          </div>

          {/* Company/Business Name */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                <Building className="w-3 h-3" />
              </div>
              <h2 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Business Name</h2>
            </div>
            <p className="text-sm font-semibold text-slate-800">{companyName}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Industry Details */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Briefcase className="w-3 h-3" />
              </div>
              <h2 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Industry & Type</h2>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-[10px] text-gray-400 font-medium mb-0.5">Industry</p>
                <p className="text-sm font-semibold text-gray-900">{industry}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-medium mb-0.5">Client Type</p>
                <p className="text-sm font-semibold text-gray-900">{clientProfile?.clientType || "Individual / Business"}</p>
              </div>
            </div>
          </div>

          {/* Active Requirements */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
                <Target className="w-3 h-3" />
              </div>
              <h2 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Job Postings</h2>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-[10px] text-gray-400 font-medium mb-0.5">Total Posted</p>
                <p className="text-sm font-semibold text-gray-900">0 Jobs</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-medium mb-0.5">Currently Active</p>
                <p className="text-sm font-semibold text-gray-900">0 Active</p>
              </div>
            </div>
          </div>

          {/* Total Spends / Workers */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-pink-50 flex items-center justify-center text-pink-600">
                <Users className="w-3 h-3" />
              </div>
              <h2 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Hiring Stats</h2>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-[10px] text-gray-400 font-medium mb-0.5">Total Workers Hired</p>
                <p className="text-sm font-semibold text-gray-900">0 Workers</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-medium mb-0.5">Total Connections</p>
                <p className="text-sm font-semibold text-gray-900">0</p>
              </div>
            </div>
          </div>
        </div>



      </div>
    </div>
  );
}
