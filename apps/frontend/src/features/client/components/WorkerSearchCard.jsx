import { MapPin, Briefcase, CheckCircle2, XCircle, Eye, Phone, BadgeCheck } from "lucide-react";
import { Link } from "react-router-dom";

export default function WorkerSearchCard({ worker }) {

  // Normalize fields
  const firstName = worker.user?.firstName || worker.firstName || "";
  const lastName = worker.user?.lastName || worker.lastName || "";
  const name = `${firstName} ${lastName}`.trim() || worker.user?.name || worker.name || "Unknown";

  const skill = worker.primarySkill?.name || (typeof worker.primarySkill === 'string' ? worker.primarySkill : null) || worker.skills?.[0]?.name || "General Worker";
  const experience = worker.totalExperienceYears != null ? `${worker.totalExperienceYears} yrs exp.` : "Experience N/A";

  let location = "Location not specified";
  if (worker.district && worker.state) location = `${worker.district}, ${worker.state}`;
  else if (worker.district) location = worker.district;
  else if (worker.city && worker.state) location = `${worker.city}, ${worker.state}`;
  else if (worker.city) location = worker.city;
  else if (worker.state) location = worker.state;

  const isVerified = worker.profileStatus === "APPROVED";
  const isAgency = !!(worker.agency || worker.agencyProfile);
  const avatar = worker.user?.avatar || worker.profilePhoto;
  const initials = name !== "Unknown" ? name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() : "W";

  const getAvatarUrl = (src) => {
    if (!src) return null;
    if (src.startsWith('http') || src.startsWith('data:')) return src;
    return `http://localhost:5000${src.startsWith('/') ? '' : '/'}${src}`;
  };

  return (
    <div className="bg-white rounded-[32px] p-5 border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.015)] hover:shadow-md hover:border-slate-200/80 transition-all duration-305 group relative overflow-hidden w-full max-w-[550px]">
      
      {/* Premium Background Mesh Gradient Wave */}
      <div className="absolute bottom-0 right-0 w-36 h-36 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-blue-100/40 via-purple-100/10 to-transparent rounded-br-[32px] pointer-events-none" />

      <div className="flex gap-4 sm:gap-5 items-start">

        {/* Avatar with Availability Dot */}
        <div className="relative shrink-0">
          <div className="w-[92px] h-[92px] rounded-[24px] bg-gradient-to-br from-blue-50 to-indigo-50 border border-indigo-100/50 flex items-center justify-center text-blue-600 font-extrabold text-2xl overflow-hidden shadow-inner">
            {avatar ? (
              <img src={getAvatarUrl(avatar)} alt={name} className="w-full h-full object-cover rounded-[24px]" />
            ) : initials}
          </div>
          {/* Availability Badge (Green Dot) */}
          <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full shadow-sm z-10" />
        </div>

        {/* Content Details */}
        <div className="flex-1 min-w-0 h-[92px] flex flex-col justify-between py-0.5">
          <div className="flex justify-between items-start w-full gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <h3 className="text-base sm:text-[17px] font-bold text-slate-800 lowercase truncate leading-none">
                {name}
              </h3>
              {isVerified && (
                <BadgeCheck className="w-[19px] h-[19px] text-white fill-blue-600 shrink-0" />
              )}
            </div>

            {/* Verified / Unverified Badge in Top-Right */}
            {isVerified ? (
              <div className="flex items-center gap-1 px-2.5 py-0.5 bg-[#eff6ff] text-blue-600 text-[11px] font-semibold rounded-full border border-blue-100 shrink-0 select-none">
                <CheckCircle2 className="w-3 h-3 text-blue-600" />
                Verified
              </div>
            ) : (
              <div className="flex items-center gap-1 px-2.5 py-0.5 bg-slate-50 text-slate-500 text-[11px] font-semibold rounded-full border border-slate-200 shrink-0 select-none">
                <XCircle className="w-3 h-3 text-slate-400" />
                Unverified
              </div>
            )}
          </div>

          {/* Skill Title */}
          <p className="text-[13px] font-medium text-slate-400 leading-none">{skill}</p>

          {/* Rating */}
          <div className="flex items-center gap-1 leading-none">
            <span className="text-amber-500 text-sm">★</span>
            <span className="text-xs font-extrabold text-slate-700">4.8</span>
            <span className="text-[10px] text-slate-400 font-medium">(32 reviews)</span>
          </div>

          {/* Location & Experience */}
          <div className="flex items-center gap-2.5 text-xs text-slate-400 font-semibold leading-none">
            <div className="flex items-center gap-1 min-w-0">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{location}</span>
            </div>
            <span className="text-slate-200 shrink-0">|</span>
            <div className="flex items-center gap-1 shrink-0">
              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
              <span>{experience}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Skill + Type Tags */}
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="px-3.5 py-1 bg-blue-50/70 text-blue-600 text-xs font-semibold rounded-full border border-blue-100/10">
          {skill}
        </span>
        <span className={`px-3.5 py-1 text-xs font-semibold rounded-full border ${isAgency ? "bg-purple-50/70 text-purple-650 border-purple-100/10" : "bg-orange-50/70 text-orange-650 border-orange-100/10"}`}>
          {isAgency ? "Agency Worker" : "Independent"}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 mt-4 w-full relative z-10">
        <Link
          to={`/search-workers/${worker.id}`}
          className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-[0_2px_6px_rgba(0,0,0,0.01)] cursor-pointer"
        >
          <Eye className="w-4 h-4 text-slate-500" />
          View Profile
        </Link>
        <a
          href={`tel:${worker.user?.phone || worker.phone || ''}`}
          className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white text-sm font-bold rounded-2xl shadow-md shadow-blue-500/10 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Phone className="w-4 h-4 text-white" />
          Call Now
        </a>
      </div>

    </div>
  );
}
