import { MapPin, Building2, CheckCircle2, XCircle, Eye, Phone } from "lucide-react";
import { Link } from "react-router-dom";

export default function AgencySearchCard({ agency }) {
  const isVerified = agency.verificationStatus === "VERIFIED";

  const getFullUrl = (url) => {
    if (!url) return null;
    return url.startsWith('http') ? url : `http://localhost:5000${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const name = agency.companyName || "Unnamed Agency";
  const initials = name.split(" ").map(n => n?.[0] || "").join("").substring(0, 2).toUpperCase() || "A";
  const logo = agency.logoUrl || agency.profilePhoto;

  let location = "Not specified";
  if (agency.district && agency.state) location = `${agency.district}, ${agency.state}`;
  else if (agency.district) location = agency.district;
  else if (agency.city && agency.state) location = `${agency.city}, ${agency.state}`;
  else if (agency.city) location = agency.city;
  else if (agency.state) location = agency.state;
  else if (agency.address) location = agency.address;

  return (
    <div className="bg-white rounded-[24px] p-3 border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.015)] hover:shadow-md hover:border-slate-200/80 transition-all duration-300 group relative overflow-hidden w-full max-w-[550px]">
      
      {/* Premium Overlapping Background Wave SVG */}
      <svg className="absolute bottom-0 right-0 w-44 h-32 pointer-events-none select-none" viewBox="0 0 176 128" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 128C50 70 100 45 176 70V128H0Z" fill="url(#paint0_linear)" opacity="0.08" />
        <path d="M40 128C80 95 120 80 176 90V128H40Z" fill="url(#paint1_linear)" opacity="0.11" />
        <path d="M80 128C110 110 140 105 176 108V128H80Z" fill="url(#paint2_linear)" opacity="0.14" />
        <defs>
          <linearGradient id="paint0_linear" x1="176" y1="70" x2="0" y2="128" gradientUnits="userSpaceOnUse">
            <stop stopColor="#818cf8" />
            <stop offset="1" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="paint1_linear" x1="176" y1="90" x2="40" y2="128" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6366f1" />
            <stop offset="1" stopColor="#a855f7" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="paint2_linear" x1="176" y1="108" x2="80" y2="128" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3b82f6" />
            <stop offset="1" stopColor="#60a5fa" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Verified / Unverified Badge in Top-Right (Absolute Positioned to prevent name truncation) */}
      {isVerified ? (
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-0.5 bg-[#eff6ff] text-[#2563eb] text-xs font-semibold rounded-full border border-blue-100/60 shrink-0 select-none">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#2563eb]" />
          Verified
        </div>
      ) : (
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-0.5 bg-slate-50 text-slate-500 text-xs font-semibold rounded-full border border-slate-200 shrink-0 select-none">
          <XCircle className="w-3.5 h-3.5 text-slate-400" />
          Unverified
        </div>
      )}

      <div className="flex gap-4 sm:gap-5 items-start">

        {/* Logo/Avatar Squircle */}
        <div className="relative shrink-0">
          <div className="w-[76px] h-[76px] rounded-[12px] bg-gradient-to-br from-blue-50 to-indigo-50 border border-indigo-100/50 flex items-center justify-center text-blue-600 font-extrabold text-xl overflow-hidden shadow-inner">
            {logo ? (
              <img src={getFullUrl(logo)} alt="Agency Logo" className="w-full h-full object-cover rounded-[12px]" />
            ) : (
              <span className="text-2xl text-blue-600 font-bold">{initials}</span>
            )}
          </div>
        </div>

        {/* Content Details */}
        <div className="flex-1 min-w-0 flex flex-col gap-1 py-0.5">
          {/* Title Row with Truncation Protection */}
          <div className="pr-[85px] min-w-0 flex items-center gap-1">
            <h3 className="text-sm font-bold text-slate-800 lowercase truncate leading-snug">
              {name}
            </h3>
          </div>

          <p className="text-[11px] text-slate-400 font-semibold leading-none">
            Workforce Partner
          </p>

          {/* Location row */}
          <div className="flex items-center gap-1 mt-1 text-slate-500 min-w-0">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-xs text-slate-500 truncate leading-none">
              {location}
            </span>
          </div>

          {/* Tags */}
          <div className="mt-2.5 flex flex-wrap gap-1.5 z-10 relative">
            <span className="px-2.5 py-0.5 bg-slate-50 text-slate-650 border border-slate-200/50 text-[10px] font-bold rounded-full">
              Construction
            </span>
            <span className="px-2.5 py-0.5 bg-slate-50 text-slate-650 border border-slate-200/50 text-[10px] font-bold rounded-full">
              Manufacturing
            </span>
            <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full border bg-purple-50/70 text-purple-650 border-purple-100/10">
              Agency
            </span>
          </div>

        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2.5 mt-3.5 w-full relative z-10">
        <Link
          to={`/search-agencies/${agency.id}`}
          className="flex-1 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-1.5 shadow-[0_2px_6px_rgba(0,0,0,0.01)] cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5 text-slate-500" />
          View Profile
        </Link>
        <a
          href={`tel:${agency.phone || agency.user?.phone || ''}`}
          className="flex-1 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/10 hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Phone className="w-3.5 h-3.5 text-white" />
          Call Now
        </a>
      </div>

    </div>
  );
}
