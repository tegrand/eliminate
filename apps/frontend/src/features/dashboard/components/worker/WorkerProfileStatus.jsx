import { useAuth } from "../../../../hooks/useAuth";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../../routes/routePaths";
import { CheckCircle2, PhoneCall, MapPin, Briefcase, Sparkles, ChevronRight, Edit3 } from "lucide-react";
import WorkerAttendanceDropdown from "./WorkerAttendanceDropdown";

export default function WorkerProfileStatus() {
  const { user } = useAuth();
  
  return (
    <div className="w-full px-4 sm:px-6 md:px-0 md:w-[90%] max-w-6xl mx-auto space-y-5 sm:space-y-6 animate-fade-in mt-2 mb-8">
      {/* Premium Banner */}
      <div className="relative overflow-hidden rounded-[1.5rem] bg-white p-6 sm:p-8 border border-gray-100 shadow-[0_4px_30px_rgb(0,0,0,0.04)]">
        {/* Subtle background waves */}
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_right,_var(--tw-gradient-stops))] from-indigo-50/50 via-transparent to-transparent pointer-events-none opacity-80"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-10">
          <div className="flex flex-row items-center gap-4 sm:gap-6 w-full lg:w-auto">
            
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-[4.5rem] h-[4.5rem] sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center text-indigo-600 text-3xl sm:text-5xl font-medium shadow-inner">
                {user?.email ? user.email.charAt(0).toUpperCase() : "W"}
              </div>
              <div className="absolute bottom-0 right-0 sm:bottom-1 sm:right-1 w-5 h-5 sm:w-7 sm:h-7 bg-emerald-500 rounded-full border-2 sm:border-[3px] border-white flex items-center justify-center shadow-sm">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            
            {/* Text Content */}
            <div className="flex-1">
              {user?.workerProfile?.profileStatus === "APPROVED" ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-200 text-emerald-600 text-[11px] font-bold tracking-wider uppercase mb-3 bg-white">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  VERIFIED
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-200 text-amber-600 text-[11px] font-bold tracking-wider uppercase mb-3 bg-white">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                  PENDING VERIFICATION
                </div>
              )}
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight mb-2">
                Ready for work
              </h2>
              <p className="text-slate-500 text-[13px] leading-relaxed max-w-sm mt-1.5">
                Your profile is now actively visible to clients. They will contact you directly when they need your expertise.
              </p>
            </div>
          </div>
          
          {/* Actions */}
          <div className="w-full lg:w-auto mt-4 lg:mt-0 flex flex-col items-stretch lg:items-end gap-4">
            <div className="flex w-full justify-center lg:justify-end">
              <WorkerAttendanceDropdown />
            </div>
            
            <Link to={ROUTES.WORKER_SETTINGS} className="block w-full">
              <button className="w-full flex items-center justify-center gap-2 px-6 py-2.5 sm:py-3 bg-white border border-gray-200 shadow-[0_2px_10px_rgb(0,0,0,0.02)] rounded-xl text-sm font-semibold text-slate-700 hover:bg-gray-50 transition-colors">
                <Edit3 className="w-4 h-4 text-slate-500" />
                Edit Profile
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Info List */}
      <div className="flex flex-col sm:grid sm:grid-cols-3 gap-3 sm:gap-5 pt-1">
        {/* Phone Card */}
        <div className="bg-white rounded-[1rem] p-4 sm:p-5 border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex sm:flex-col items-center sm:items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50/80 flex items-center justify-center flex-shrink-0">
            <PhoneCall className="w-5 h-5 text-blue-500" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Contact Number</p>
            <p className="text-sm sm:text-lg font-bold text-slate-800">{user?.phone || "Not provided"}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-300 sm:hidden" />
        </div>

        {/* Location Card */}
        <div className="bg-white rounded-[1rem] p-4 sm:p-5 border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex sm:flex-col items-center sm:items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50/80 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5 text-purple-500" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Service Area</p>
            <p className="text-sm sm:text-lg font-bold text-slate-800">{user?.workerProfile?.district || "Location not set"}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-300 sm:hidden" />
        </div>

        {/* Skill Card */}
        <div className="bg-white rounded-[1rem] p-4 sm:p-5 border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex sm:flex-col items-center sm:items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-50/80 flex items-center justify-center flex-shrink-0">
            <Briefcase className="w-5 h-5 text-orange-500" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Primary Skill</p>
            <p className="text-sm sm:text-lg font-bold text-slate-800">{user?.workerProfile?.primarySkill || "Skill not set"}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-300 sm:hidden" />
        </div>
      </div>

      {/* Suggestion Banner */}
      <div className="bg-white rounded-[1rem] p-4 sm:p-6 border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-row items-start gap-4 w-full">
          <div className="w-10 h-10 bg-indigo-50/80 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
            <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-slate-800">Want to get more calls?</h4>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed max-w-sm">Add more skills and details to your profile to rank higher in client searches.</p>
          </div>
        </div>
        <Link to={ROUTES.WORKER_SETTINGS} className="self-end sm:self-auto flex-shrink-0 group flex items-center justify-center gap-1 text-[11px] font-bold text-indigo-600 px-3 py-1.5 border border-indigo-100 rounded-md transition-colors hover:bg-indigo-50">
          Update Profile 
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

    </div>
  );
}
