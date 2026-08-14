import { MapPin, Star, Building2, CheckCircle2, XCircle, Briefcase } from "lucide-react";

export default function AgencySearchCard({ agency }) {
  // Use a mock rating since rating is not implemented in DB
  const rating = 5.0; 
  const isVerified = agency.verificationStatus === "VERIFIED";

  const getFullUrl = (url) => {
    if (!url) return null;
    return url.startsWith('http') ? url : `http://localhost:5000${url.startsWith('/') ? '' : '/'}${url}`;
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all group relative">
      <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
        
        {/* Avatar / Logo */}
        <div className="w-16 h-16 rounded-xl bg-blue-50 border border-blue-100 overflow-hidden flex items-center justify-center shrink-0">
          {agency.logoUrl ? (
            <img src={getFullUrl(agency.logoUrl)} alt="Agency Logo" className="w-full h-full object-cover" />
          ) : (
            <Building2 className="w-8 h-8 text-blue-600" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
            <h3 className="text-lg font-bold text-gray-900 truncate pr-4">
              {agency.companyName || "Unnamed Agency"}
            </h3>
            
            {/* Badges */}
            <div className="flex items-center gap-2 shrink-0">
              {isVerified ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50 text-gray-600 text-xs font-semibold border border-gray-200">
                  <XCircle className="w-3.5 h-3.5" />
                  Unverified
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-gray-500 mt-2">
            
            {/* Location */}
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="truncate max-w-[150px]">
                {agency.address || agency.location || "Location not specified"}
              </span>
            </div>

            <div className="w-1 h-1 rounded-full bg-gray-300 hidden sm:block"></div>

            {/* Rating */}
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="font-medium text-gray-700">{rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Skills / Specializations (Mocked as Agencies don't have direct skills array usually, but we display something) */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg">
              Construction
            </span>
            <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg">
              Manufacturing
            </span>
            <span className="px-2.5 py-1 bg-gray-50 text-gray-500 text-xs font-medium rounded-lg border border-gray-200 border-dashed">
              +3 more
            </span>
          </div>

        </div>
      </div>
      
      {/* Absolute contact button for desktop hover */}
      <div className="flex items-center gap-3 mt-5 w-full">
        <button className="flex-1 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-colors">
          View Profile
        </button>
        <a 
          href={`tel:${agency.phone || agency.user?.phone || ''}`}
          className="flex-1 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 shadow-sm shadow-blue-200 transition-colors flex items-center justify-center gap-2"
        >
          <Briefcase className="w-4 h-4" />
          Call Now
        </a>
      </div>

    </div>
  );
}
