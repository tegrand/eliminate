import { useAuth } from "../../../../hooks/useAuth";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../../routes/routePaths";
import {
  MapPin, Briefcase, PhoneCall, Edit3,
  CheckCircle2, ChevronRight, Award, Globe
} from "lucide-react";
import WorkerAttendanceDropdown from "./WorkerAttendanceDropdown";

export default function WorkerProfileStatus() {
  const { user } = useAuth();
  
  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    const baseUrl = import.meta.env.VITE_API_BASE_URL 
      ? import.meta.env.VITE_API_BASE_URL.replace('/api/v1', '') 
      : 'http://localhost:5000';
    return `${baseUrl}/${path.replace(/\\/g, '/').replace(/^\//, '')}`;
  };

  const profileImageUrl = getImageUrl(user?.avatar || user?.workerProfile?.profilePhoto);
  const initials = user?.email ? user.email.charAt(0).toUpperCase() : "W";
  
  const workerProfile = user?.workerProfile || {};
  
  const firstName = user?.firstName || workerProfile.firstName || "";
  const lastName = user?.lastName || workerProfile.lastName || "";
  const name = `${firstName} ${lastName}`.trim() || user?.name || "Unknown Worker";

  const isVerified = workerProfile.profileStatus === "APPROVED";
  
  const experience = workerProfile.totalExperienceYears != null ? `${workerProfile.totalExperienceYears} Years` : "Not specified"; 
  const languages = workerProfile.languages?.length > 0 ? workerProfile.languages.map(l => l.language?.name || l).filter(Boolean) : [];
  const allSkills = workerProfile.skills?.length > 0 ? workerProfile.skills.map(s => s.skill?.name || s).filter(Boolean) : [workerProfile.primarySkill].filter(Boolean);

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start mt-4">
      {/* Left Sidebar */}
      <div className="w-full lg:w-[320px] shrink-0">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 relative">
          
          {/* Avatar */}
          <div className="flex flex-col items-center pt-2 mb-4">
            <div className="relative mb-3">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white border-4 border-white shadow-lg flex items-center justify-center shrink-0 text-indigo-600 font-bold text-3xl overflow-hidden relative z-10 bg-gradient-to-br from-indigo-50 to-purple-100 -mt-12 sm:mt-0">
                {profileImageUrl ? (
                  <img src={profileImageUrl} alt={name} className="w-full h-full object-cover" />
                ) : (
                  initials
                )}
              </div>
              <div className="absolute bottom-0 right-0 bg-emerald-500 rounded-full p-1 border-2 border-white text-white z-20">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>
            
            {isVerified ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-200 text-emerald-600 text-[11px] font-semibold tracking-wider uppercase mb-3 bg-white">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                VERIFIED
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-200 text-amber-600 text-[11px] font-semibold tracking-wider uppercase mb-3 bg-white">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                PENDING VERIFICATION
              </div>
            )}
            
            <h1 className="text-lg font-semibold text-gray-900 mb-0.5 text-center">Ready for work</h1>
            <p className="text-xs text-gray-500 mb-2 text-center max-w-[200px]">
              Your profile is now actively visible to clients. They will contact you directly.
            </p>
          </div>

          {/* Quick Info & Actions */}
          <div className="space-y-4 pt-2">
            <div className="flex justify-center w-full">
              <WorkerAttendanceDropdown />
            </div>

            <Link to={ROUTES.WORKER_SETTINGS} className="block w-full">
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
              <h2 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Service Area</h2>
            </div>
            <p className="text-sm font-semibold text-slate-800">{workerProfile?.district || "Location not set"}</p>
          </div>

          {/* Skill Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                <Briefcase className="w-3 h-3" />
              </div>
              <h2 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Primary Skill</h2>
            </div>
            <p className="text-sm font-semibold text-slate-800">{workerProfile?.primarySkill || "Skill not set"}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Work Details */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Briefcase className="w-3 h-3" />
              </div>
              <h2 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Work Details</h2>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-[10px] text-gray-400 font-medium mb-0.5">Experience</p>
                <p className="text-sm font-semibold text-gray-900">{experience}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-medium mb-0.5">Work Type</p>
                <p className="text-sm font-semibold text-gray-900">{workerProfile?.jobType || "Full-Time"}</p>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
                <Award className="w-3 h-3" />
              </div>
              <h2 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Skills & Expertise</h2>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {allSkills.length > 0 ? (
                allSkills.map((s, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-gray-50 text-gray-700 text-[11px] font-semibold rounded-lg border border-gray-100">
                    {s}
                  </span>
                ))
              ) : (
                <p className="text-xs text-gray-500">No skills specified.</p>
              )}
            </div>
          </div>

          {/* Languages */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-pink-50 flex items-center justify-center text-pink-600">
                <Globe className="w-3 h-3" />
              </div>
              <h2 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Languages</h2>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {languages.length > 0 ? (
                languages.map((l, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-gray-50 text-gray-700 text-[11px] font-semibold rounded-lg border border-gray-100">
                    {l}
                  </span>
                ))
              ) : (
                <p className="text-xs text-gray-500">No languages specified.</p>
              )}
            </div>
          </div>
        </div>

        {/* Suggestion Banner */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-row items-start gap-4 w-full">
            <div className="w-10 h-10 bg-indigo-50/80 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
              <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-slate-800">Want to get more calls?</h4>
              <p className="text-[12px] text-slate-500 mt-0.5 leading-relaxed max-w-sm">Add more skills and details to your profile to rank higher in client searches.</p>
            </div>
          </div>
          <Link to={ROUTES.WORKER_SETTINGS} className="self-end sm:self-auto flex-shrink-0 group flex items-center justify-center gap-1 text-xs font-semibold text-indigo-600 px-4 py-2 border border-indigo-100 rounded-lg transition-colors hover:bg-indigo-50">
            Update Profile 
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

      </div>
    </div>
  );
}
