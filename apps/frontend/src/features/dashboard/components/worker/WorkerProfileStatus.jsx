import { useState, useEffect } from "react";
import { useAuth } from "../../../../hooks/useAuth";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../../routes/routePaths";
import { toast } from "sonner";
import { workerApi } from "../../../worker/api/worker.api";
import {
  MapPin, Briefcase, PhoneCall, Edit3,
  CheckCircle2, ChevronRight, Award, Globe, Phone, Mail, Loader2
} from "lucide-react";

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

  const [isOpenToWork, setIsOpenToWork] = useState(() => workerProfile.isOpenToWork ?? true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (workerProfile.isOpenToWork !== undefined) {
      setIsOpenToWork(workerProfile.isOpenToWork);
    }
  }, [workerProfile.isOpenToWork]);

  const handleToggleOpenToWork = async () => {
    const nextState = !isOpenToWork;
    setIsOpenToWork(nextState);
    setIsUpdating(true);
    try {
      await workerApi.toggleOpenToWork(nextState);
      toast.success(nextState ? "You are now visible to clients!" : "You are now hidden from client searches.");
    } catch (err) {
      setIsOpenToWork(!nextState);
      toast.error("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  const firstName = user?.firstName || workerProfile.firstName || "";
  const lastName = user?.lastName || workerProfile.lastName || "";
  const name = `${firstName} ${lastName}`.trim() || user?.name || "Unknown Worker";

  const userEmail = user?.email || workerProfile?.user?.email || workerProfile?.email;

  const isVerified = workerProfile.profileStatus === "APPROVED";

  const experience = workerProfile.totalExperienceYears != null ? `${workerProfile.totalExperienceYears} Years` : "Not specified";
  const languages = workerProfile.languages?.length > 0 ? workerProfile.languages.map(l => l.language?.name || l).filter(Boolean) : [];
  const allSkills = workerProfile.skills?.length > 0 ? workerProfile.skills.map(s => s.skill?.name || s).filter(Boolean) : [workerProfile.primarySkill].filter(Boolean);

  const location = [workerProfile?.district, workerProfile?.state].filter(Boolean).join(", ") || "Location not set";

  return (
    <div className="flex flex-col gap-3 w-full pb-4">

      {/* ─── Hero Profile Card ─── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 relative overflow-hidden">
        {/* Decorative blob */}
        <div className="absolute right-0 top-0 w-36 h-36 opacity-30 pointer-events-none select-none">
          <svg viewBox="0 0 160 160" fill="none" className="w-full h-full">
            <path d="M80 10 C120 10, 150 40, 150 80 C150 120, 120 150, 80 150 C40 150, 10 120, 10 80 C10 40, 40 10, 80 10Z" fill="url(#grad1)" />
            <defs>
              <linearGradient id="grad1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#a5b4fc" />
                <stop offset="100%" stopColor="#c4b5fd" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="flex flex-row items-center gap-4 relative z-10">
          {/* Avatar with LinkedIn style #OPEN TO WORK SVG Arc Ring */}
          <div className="relative shrink-0 w-24 h-24">
            {/* Base Avatar Circle */}
            <div className="w-full h-full rounded-full border-4 border-white shadow-lg overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 font-bold text-3xl">
              {profileImageUrl ? (
                <img src={profileImageUrl} alt={name} className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </div>

            {/* LinkedIn Style Curved #OPEN TO WORK SVG Overlay */}
            {isOpenToWork && (
              <svg viewBox="0 0 100 100" className="absolute -inset-1.5 w-[112%] h-[112%] pointer-events-none z-10 drop-shadow-sm">
                <defs>
                  {/* Curved path along bottom half */}
                  <path id="openToWorkTextPath" d="M 14,50 A 36,36 0 0,0 86,50" fill="none" />
                </defs>

                {/* Outer thin green ring */}
                <circle cx="50" cy="50" r="46" fill="none" stroke="#059669" strokeWidth="2.5" />

                {/* Bottom curved green banner arc */}
                <path
                  d="M 14,50 A 36,36 0 0,0 86,50"
                  fill="none"
                  stroke="#059669"
                  strokeWidth="11"
                  strokeLinecap="round"
                />

                {/* Curved text along path */}
                <text fill="#ffffff" fontSize="4.8" fontWeight="900" letterSpacing="0.6">
                  <textPath href="#openToWorkTextPath" startOffset="50%" textAnchor="middle">
                    #OPEN TO WORK
                  </textPath>
                </text>
              </svg>
            )}

            {/* Checkmark verification badge */}
            <div className="absolute bottom-0 right-0 bg-emerald-500 rounded-full p-0.5 border-2 border-white z-20 shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            {isVerified ? (
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-emerald-200 text-emerald-600 text-[10px] font-bold tracking-widest uppercase mb-1.5 bg-white">
                <CheckCircle2 className="w-3 h-3" />
                VERIFIED
              </div>
            ) : (
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-amber-200 text-amber-600 text-[10px] font-bold tracking-widest uppercase mb-1.5 bg-white">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                PENDING
              </div>
            )}
            <h1 className="text-lg font-bold text-gray-900 leading-tight truncate">Welcome {name}!</h1>
            {userEmail && (
              <p className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-1.5 truncate">
                <Mail className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span className="truncate">{userEmail}</span>
              </p>
            )}
          </div>
        </div>

        {/* Action Row: Left side Edit Profile, Right side Open to Work Switch */}
        <div className="mt-3.5 flex items-center justify-between gap-2 relative z-10">
          <Link to={ROUTES.WORKER_PROFILE}>
            <button className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs rounded-lg border border-emerald-500/50 transition-all flex items-center gap-1.5 shadow-sm shadow-emerald-600/20 cursor-pointer">
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
          </Link>

          {/* Sliding Toggle Switch */}
          <div 
            onClick={handleToggleOpenToWork}
            className="flex items-center gap-2 cursor-pointer select-none bg-slate-50 border border-slate-200/80 hover:bg-slate-100 py-1 px-2.5 rounded-xl transition-all"
          >
            <span className="text-xs font-bold text-slate-700">Open to Work</span>
            <button
              type="button"
              disabled={isUpdating}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isOpenToWork ? "bg-emerald-500" : "bg-slate-300"
              }`}
              role="switch"
              aria-checked={isOpenToWork}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  isOpenToWork ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* ─── Contact Number Card ─── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
          <Phone className="w-5 h-5 text-indigo-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Contact Number</p>
          <p className="text-sm font-bold text-gray-900">{user?.phone || "Not provided"}</p>
        </div>
        <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
          <Phone className="w-4 h-4 text-indigo-400" />
        </div>
      </div>

      {/* ─── Service Area Card ─── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
          <MapPin className="w-5 h-5 text-purple-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Service Area</p>
          <p className="text-sm font-bold text-gray-900">{location}</p>
        </div>
        <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
          <Globe className="w-4 h-4 text-purple-400" />
        </div>
      </div>

      {/* ─── Work Details Card ─── */}
      <Link to={ROUTES.WORKER_PROFILE} className="block">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <Briefcase className="w-5 h-5 text-blue-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Work Details</p>
            <div className="flex items-center gap-4">
              <div>
                <p className="text-[10px] text-gray-400">Experience</p>
                <p className="text-xs font-bold text-gray-900">{experience}</p>
              </div>
              <div className="w-px h-8 bg-gray-100" />
              <div>
                <p className="text-[10px] text-gray-400">Work Type</p>
                <p className="text-xs font-bold text-gray-900">{workerProfile?.jobType || "Full-Time"}</p>
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
        </div>
      </Link>

      {/* ─── Skills & Expertise Card ─── */}
      <Link to={ROUTES.WORKER_PROFILE} className="block">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5 text-teal-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Skills & Expertise</p>
            {allSkills.length > 0 ? (
              <p className="text-sm font-bold text-gray-900 truncate">{allSkills.join(", ")}</p>
            ) : (
              <p className="text-xs text-gray-400">No skills specified.</p>
            )}
          </div>
          <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
        </div>
      </Link>

      {/* ─── Languages Card ─── */}
      <Link to={ROUTES.WORKER_PROFILE} className="block">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center shrink-0">
            <Globe className="w-5 h-5 text-pink-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Languages</p>
            {languages.length > 0 ? (
              <p className="text-sm font-bold text-gray-900 truncate">{languages.join(", ")}</p>
            ) : (
              <p className="text-xs text-gray-400">No languages specified.</p>
            )}
          </div>
          <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
        </div>
      </Link>

      {/* ─── CTA Banner ─── */}
      <div className="rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }}>
        {/* Decorative blob */}
        <div className="absolute right-0 top-0 w-24 h-24 opacity-20 pointer-events-none">
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
            <circle cx="70" cy="30" r="50" fill="white" />
          </svg>
        </div>
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <div className="flex-1 min-w-0 relative z-10">
          <h4 className="text-sm font-bold text-white">Want to get more calls?</h4>
          <p className="text-[11px] text-white/70 mt-0.5 leading-snug">Add more skills and details to your profile to rank higher in client searches.</p>
        </div>
        <Link to={ROUTES.WORKER_PROFILE} className="shrink-0 relative z-10">
          <button className="bg-white text-indigo-600 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1 whitespace-nowrap shadow-sm hover:bg-indigo-50 transition-colors">
            Update Profile
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </Link>
      </div>

    </div>
  );
}
