import { MapPin, Star, Building2, CheckCircle2, XCircle, Briefcase } from "lucide-react";
import { useState } from "react";
import ClientHiringModal from "./ClientHiringModal";

export default function AgencySearchCard({ agency }) {
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);
  // Use a mock rating since rating is not implemented in DB
  const rating = 5.0; 
  const isVerified = agency.verificationStatus === "VERIFIED";

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full animate-fade-in group">
      <div className="flex items-start gap-4">
        
        {/* Avatar / Logo */}
        <div className="relative shrink-0">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6 text-blue-600" />
          </div>
          {isVerified && (
            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm" title="Verified Agency">
              <CheckCircle2 className="w-4 h-4 text-blue-500" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 pt-0.5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-bold text-gray-900 truncate text-base leading-tight group-hover:text-blue-600 transition-colors">
                {agency.companyName || "Unnamed Agency"}
              </h3>
              <p className="text-xs font-medium text-blue-600 mt-0.5 truncate">Agency</p>
            </div>
            
            {/* Verification Badge */}
            <span className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
              isVerified ? "bg-blue-50 text-blue-700 border border-blue-100" : "bg-gray-50 text-gray-600 border border-gray-200"
            }`}>
              {isVerified ? "Verified" : "Unverified"}
            </span>
          </div>

          <div className="mt-1.5 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 shrink-0" />
              <span className="truncate">{rating.toFixed(1)} Rating</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className="truncate">
                {agency.address || agency.location || "Location N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between gap-3 mt-auto">
        <button 
          onClick={() => setIsHireModalOpen(true)}
          className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Briefcase className="w-3.5 h-3.5" />
          Hire
        </button>
        <button 
          className="flex-1 py-1.5 text-center text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-blue-50 hover:text-blue-700 border border-gray-200 hover:border-blue-200 rounded-lg transition-all"
        >
          View Profile
        </button>
      </div>

      <ClientHiringModal 
        isOpen={isHireModalOpen} 
        onClose={() => setIsHireModalOpen(false)} 
        targetId={agency.id}
        targetType="AGENCY"
        targetName={agency.companyName || "Unnamed Agency"}
      />
    </div>
  );
}
