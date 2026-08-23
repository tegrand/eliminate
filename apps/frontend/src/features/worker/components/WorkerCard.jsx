import { Link } from "react-router-dom";
import { User, Briefcase, Phone } from "lucide-react";

export default function WorkerCard({ worker }) {
  const getInitials = (name) => {
    if (!name) return "W";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const name = worker.name || "Worker";
  const initials = getInitials(name);
  const phone = worker.phone && worker.phone !== "-" ? worker.phone : "+91 0000000000";
  const gender = worker.gender && worker.gender !== "—" ? worker.gender : "Male";
  
  // Experience format (e.g., 3 Years, 1 Year)
  const expYears = worker.performance?.experience ?? worker.totalExperienceYears ?? 1;
  const experienceText = `${expYears} ${expYears === 1 ? "Year" : "Years"}`;

  const status = worker.status || worker.profileStatus || "APPROVED";
  const isApproved = status === "APPROVED";

  // Palette matching screenshot (Lavender, Sky Blue, Soft Pink, Mint, Amber)
  const avatarColors = [
    "bg-[#eeebfe] text-[#6366f1]",
    "bg-[#e0f2fe] text-[#0284c7]",
    "bg-[#fce7f3] text-[#db2777]",
    "bg-[#e8f8f0] text-[#10b981]",
    "bg-[#fef3c7] text-[#d97706]",
  ];
  const avatarColor = avatarColors[name.length % avatarColors.length];

  return (
    <Link to={`/workers/${worker.id}`} className="block transition-all hover:scale-[1.01] active:scale-[0.99]">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)] p-4 relative">
        
        {/* Top Row: Avatar + Name + Status Badge */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${avatarColor}`}>
              {initials}
            </div>
            <h3 className="text-base font-bold text-slate-900 leading-tight">{name}</h3>
          </div>

          {/* Status Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#e6f7ed] text-[#10b981] border border-[#bbf7d0] shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
            {isApproved ? "Approved" : status}
          </div>
        </div>

        {/* Bottom Details Row (3 Columns with vertical dividers) */}
        <div className="grid grid-cols-3 gap-1 border-t border-slate-100 pt-3 text-xs text-slate-600">
          
          {/* Gender */}
          <div className="flex items-center justify-center gap-1.5 text-center">
            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-semibold text-slate-700 truncate">{gender}</span>
          </div>

          {/* Experience */}
          <div className="flex items-center justify-center gap-1.5 border-x border-slate-100 text-center px-1">
            <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-semibold text-slate-700 truncate">{experienceText}</span>
          </div>

          {/* Phone */}
          <div className="flex items-center justify-center gap-1.5 text-center">
            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-semibold text-slate-700 truncate">{phone}</span>
          </div>

        </div>

      </div>
    </Link>
  );
}
