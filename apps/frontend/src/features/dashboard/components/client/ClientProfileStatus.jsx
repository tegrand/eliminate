import { useAuth } from "../../../../hooks/useAuth";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../../routes/routePaths";
import {
  MapPin, PhoneCall, Edit3, Mail
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

  return (
    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 items-start mt-4 animate-fade-in w-full">
      {/* Left Sidebar */}
      <div className="w-full lg:w-[320px] shrink-0">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 relative w-full">
          
          {/* Avatar */}
          <div className="flex flex-col items-center pt-2 mb-4">
            <div className="relative mb-3">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white border-4 border-white shadow-lg flex items-center justify-center shrink-0 text-blue-600 font-bold text-3xl overflow-hidden relative z-10 bg-gradient-to-br from-blue-50 to-indigo-100 mx-auto">
                {profileImageUrl ? (
                  <img src={profileImageUrl} alt={name} className="w-full h-full object-cover" />
                ) : (
                  initials
                )}
              </div>
            </div>
            
            <h1 className="text-lg font-semibold text-gray-900 mb-0.5 text-center px-2">{name}</h1>
            <p className="text-xs text-gray-500 mb-2 text-center max-w-[200px]">
              Client Profile
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
      <div className="flex-1 space-y-4 sm:space-y-6 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Phone Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 w-full">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                <PhoneCall className="w-3 h-3" />
              </div>
              <h2 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Contact Number</h2>
            </div>
            <p className="text-sm font-semibold text-slate-800">{user?.phone || "Not provided"}</p>
          </div>

          {/* Email Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 w-full">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-pink-50 flex items-center justify-center text-pink-600 shrink-0">
                <Mail className="w-3 h-3" />
              </div>
              <h2 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Email Address</h2>
            </div>
            <p className="text-sm font-semibold text-slate-800 break-all">{user?.email || "Not provided"}</p>
          </div>

          {/* Location Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 w-full">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                <MapPin className="w-3 h-3" />
              </div>
              <h2 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Location</h2>
            </div>
            <p className="text-sm font-semibold text-slate-800">{clientProfile?.district || "Location not set"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
