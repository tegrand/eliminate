import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { agencyApi } from "../../agency/api/agency.api";
import {
  MapPin, Briefcase, ShieldCheck, Building2, User, CheckCircle2
} from "lucide-react";
import AdvertisementBanner from "../../../components/ui/AdvertisementBanner";

export default function ClientAgencyProfilePage() {
  const { id } = useParams();

  const { data: agencyData, isLoading, error } = useQuery({
    queryKey: ["agencyForClient", id],
    queryFn: () => agencyApi.getAgencyById(id),
  });

  const agency = agencyData?.data;

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-[#f7f7f7]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !agency) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-[#f7f7f7]">
        <div className="text-center bg-white p-8 rounded-md shadow-sm border border-gray-200">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-900">Agency Not Found</h3>
          <p className="mt-1 text-sm text-gray-500 max-w-sm mb-5">
            The requested agency could not be found or you don't have permission to view their profile.
          </p>
          <Link to="/search-agencies" className="px-5 py-2 bg-gray-900 text-white rounded text-sm font-semibold hover:bg-black transition-colors">
            Back to Search
          </Link>
        </div>
      </div>
    );
  }

  const name = agency.companyName || "Unnamed Agency";
  const initials = name.substring(0, 2).toUpperCase() || "A";

  const location = agency.address || agency.location || "Not specified";
  const isVerified = agency.verificationStatus === "VERIFIED" || agency.profileStatus === "APPROVED";
  const logo = agency.logoUrl;

  const getFullUrl = (url) => {
    if (!url) return null;
    return url.startsWith('http') || url.startsWith('data:') ? url : `http://localhost:5000${url.startsWith('/') ? '' : '/'}${url}`;
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-[#f7f7f7] overflow-y-auto py-6 px-4 sm:px-6 font-sans text-[#404145]">
      <div className="max-w-[1200px] mx-auto">
        
        <AdvertisementBanner slotName="page" variant="standard" />

        <div className="flex flex-col md:flex-row gap-6">
          
          {/* Left Sidebar (Fiverr Style) */}
          <div className="w-full md:w-[320px] shrink-0 space-y-5">
            
            {/* Main Profile Card */}
            <div className="bg-white border border-[#e4e5e7] rounded p-5">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4 flex justify-center mx-auto">
                  <div className="w-[120px] h-[120px] rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200 relative shadow-sm">
                    {logo ? (
                      <img src={getFullUrl(logo)} alt={name} className="w-full h-full object-cover" />
                    ) : (
                      <Building2 className="w-12 h-12 text-gray-400" />
                    )}

                    {/* Perfect Verified Sash */}
                    <div className="absolute inset-0 z-10 pointer-events-none">
                      <svg viewBox="0 0 120 120" className="w-full h-full">
                        <defs>
                          <path id="textPath" d="M 12 84 A 53 53 0 0 0 108 84" />
                          <linearGradient id="verifiedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#10a35e" />
                            <stop offset="50%" stopColor="#1dbf73" />
                            <stop offset="100%" stopColor="#26d986" />
                          </linearGradient>
                          <linearGradient id="unverifiedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#6b7280" />
                            <stop offset="100%" stopColor="#9ca3af" />
                          </linearGradient>
                        </defs>
                        <path 
                          d="M 5 84 A 60 60 0 0 0 115 84" 
                          fill="none" 
                          stroke={isVerified ? "url(#verifiedGradient)" : "url(#unverifiedGradient)"} 
                          strokeWidth="28" 
                        />
                        <text className="text-[11px] font-black fill-white uppercase tracking-widest" style={{ letterSpacing: '0.12em' }}>
                          <textPath href="#textPath" startOffset="50%" textAnchor="middle" dy="4">
                            {isVerified ? 'VERIFIED' : 'UNVERIFIED'}
                          </textPath>
                        </text>
                      </svg>
                    </div>
                  </div>
                </div>
                
                <h1 className="text-xl font-bold text-[#404145] mb-1 flex items-center justify-center gap-1.5">
                  {name}
                  {isVerified && <CheckCircle2 className="w-4 h-4 text-[#1dbf73]" />}
                </h1>
                
                <p className="text-sm text-[#74767e] mb-5">Professional Agency</p>

                <a
                  href={`tel:${agency.phone || agency.user?.phone || ''}`}
                  className="w-full block py-2.5 px-4 bg-[#1dbf73] hover:bg-[#19a463] text-white font-bold rounded transition-colors"
                >
                  Contact Agency
                </a>
              </div>

              <hr className="my-6 border-[#e4e5e7]" />

              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2 text-[#74767e]">
                    <MapPin className="w-4 h-4" />
                    <span>From</span>
                  </div>
                  <span className="font-semibold text-[#404145]">{location}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2 text-[#74767e]">
                    <User className="w-4 h-4" />
                    <span>Member since</span>
                  </div>
                  <span className="font-semibold text-[#404145]">
                    {agency.createdAt ? new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(new Date(agency.createdAt)) : "Unknown"}
                  </span>
                </div>
              </div>
            </div>

            {/* Additional Details Card */}
            <div className="bg-white border border-[#e4e5e7] rounded p-5">
              {/* Specializations */}
              <div className="mb-6">
                <h3 className="text-base font-bold text-[#404145] mb-4">Specializations</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-white border border-[#e4e5e7] rounded-full text-sm text-[#74767e] hover:bg-gray-50 cursor-pointer">
                    Construction
                  </span>
                  <span className="px-3 py-1 bg-white border border-[#e4e5e7] rounded-full text-sm text-[#74767e] hover:bg-gray-50 cursor-pointer">
                    Manufacturing
                  </span>
                </div>
              </div>

              <hr className="my-5 border-[#e4e5e7]" />
              
              {/* Verified Info */}
              <div>
                <h3 className="text-base font-bold text-[#404145] mb-4">Verified Info</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm text-[#62646a]">
                    <ShieldCheck className="w-4 h-4 text-[#1dbf73]" /> Phone Number
                  </li>
                  {isVerified && (
                    <li className="flex items-center gap-3 text-sm text-[#62646a]">
                      <ShieldCheck className="w-4 h-4 text-[#1dbf73]" /> Identity Verified
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Main Content */}
          <div className="flex-1 space-y-6">
            
            {/* About / Description */}
            <div className="bg-white border border-[#e4e5e7] rounded p-6">
              <h2 className="text-xl font-bold text-[#404145] mb-6">About the Agency</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pb-6 border-b border-[#e4e5e7]">
                <div className="col-span-2 md:col-span-4">
                  <span className="text-xs text-[#74767e] uppercase tracking-wide font-semibold block mb-1">Full Address</span>
                  <span className="text-sm text-[#404145] font-medium">
                    {location}
                  </span>
                </div>
              </div>

              <div className="prose prose-sm text-[#62646a] max-w-none">
                <h3 className="text-sm font-bold text-[#404145] mb-3 uppercase tracking-wide">Bio</h3>
                {agency.description || agency.notes ? (
                  <p className="whitespace-pre-line leading-relaxed">
                    {agency.description || agency.notes}
                  </p>
                ) : (
                  <p className="whitespace-pre-line leading-relaxed text-gray-400 italic">
                    This agency hasn't added a bio yet.
                  </p>
                )}
              </div>

            </div>

            {/* Recent Work Details */}
            <div className="grid grid-cols-1 gap-5">
              <div className="bg-white border border-[#e4e5e7] rounded p-5">
                <div className="flex items-center gap-3 mb-4">
                  <Briefcase className="w-5 h-5 text-[#404145]" />
                  <h3 className="font-bold text-[#404145]">Agency Details</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <span className="text-xs text-[#74767e] uppercase tracking-wide font-semibold block mb-1">Company Size</span>
                    <span className="text-sm text-[#404145] font-medium">{agency.employeeCount ? `${agency.employeeCount} Employees` : 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-[#74767e] uppercase tracking-wide font-semibold block mb-1">Agency Type</span>
                    <span className="text-sm text-[#404145] font-medium">Verified Supplier</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
