import { MapPin, Briefcase, Star, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function WorkerSearchCard({ worker }) {
  // Normalize fields based on worker object structure
  const firstName = worker.user?.firstName || worker.firstName || "";
  const lastName = worker.user?.lastName || worker.lastName || "";
  const name = `${firstName} ${lastName}`.trim() || worker.user?.name || worker.name || "Unknown";
  
  const skill = worker.primarySkill?.name || (typeof worker.primarySkill === 'string' ? worker.primarySkill : null) || worker.skills?.[0]?.name || "General Worker";
  const experience = worker.experienceYears ? `${worker.experienceYears} Years Exp.` : "Experience N/A";
  
  // Safe location extraction
  let location = "Location N/A";
  if (worker.city && worker.state) location = `${worker.city}, ${worker.state}`;
  else if (worker.city) location = worker.city;
  else if (worker.state) location = worker.state;

  const isVerified = worker.profileStatus === "APPROVED";
  const isAgency = !!(worker.agency || worker.agencyProfile);
  const avatar = worker.user?.avatar || worker.profilePhoto;
  const status = worker.employmentStatus || "ACTIVE";
  
  const initials = name !== "Unknown" ? name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() : "W";

  const statusColors = {
    ACTIVE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    BUSY: 'bg-amber-50 text-amber-700 border-amber-200',
    ON_LEAVE: 'bg-orange-50 text-orange-700 border-orange-200',
    INACTIVE: 'bg-gray-50 text-gray-700 border-gray-200'
  };

  const statusLabels = {
    ACTIVE: 'Available',
    BUSY: 'Busy',
    ON_LEAVE: 'On Leave',
    INACTIVE: 'Offline'
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full animate-fade-in group">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg shadow-sm">
            {avatar ? (
              <img src={avatar} alt={name} className="w-full h-full object-cover rounded-xl" />
            ) : initials}
          </div>
          {isVerified && (
            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm" title="Verified Worker">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
            </div>
          )}
        </div>
        
        {/* Basic Info */}
        <div className="flex-1 min-w-0 pt-0.5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-bold text-gray-900 truncate text-base leading-tight group-hover:text-blue-600 transition-colors">
                {name}
              </h3>
              <p className="text-xs font-medium text-blue-600 mt-0.5 truncate">{skill}</p>
            </div>
            
            {/* Agency/Independent Badge */}
            <span className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
              isAgency ? "bg-purple-50 text-purple-700 border border-purple-100" : "bg-orange-50 text-orange-700 border border-orange-100"
            }`}>
              {isAgency ? "Agency" : "Independent"}
            </span>
          </div>
          
          <div className="mt-1.5 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Briefcase className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className="truncate">{experience}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className="truncate">{location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between gap-3 mt-auto">
        <span className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${statusColors[status] || statusColors.ACTIVE}`}>
          {statusLabels[status] || statusLabels.ACTIVE}
        </span>
        <Link 
          to={`/search-workers/${worker.id}`}
          className="flex-1 py-1.5 text-center text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-blue-50 hover:text-blue-700 border border-gray-200 hover:border-blue-200 rounded-lg transition-all"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
}
