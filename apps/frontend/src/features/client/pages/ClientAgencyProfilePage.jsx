import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { agencyApi } from "../../agency/api/agency.api";
import {
  MapPin, Calendar, Briefcase, ShieldCheck, BadgeCheck, Phone, ArrowLeft,
  FileText, Download, User, Info, Award, Globe, Star, CheckCircle2,
  Clock, Heart, Share2, Users, Zap, Building2
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
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div>
      </div>
    );
  }

  if (error || !agency) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-slate-50">
        <div className="text-center bg-white p-8 rounded-3xl shadow-sm border border-slate-100 max-w-sm mx-4">
          <Building2 className="h-10 w-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">Agency Not Found</h3>
          <p className="mt-1.5 text-xs text-slate-500 mb-5">
            The requested agency could not be found or you don't have permission to view their profile.
          </p>
          <Link to="/search-agencies" className="inline-flex items-center justify-center w-full px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-colors">
            Back to Search
          </Link>
        </div>
      </div>
    );
  }

  const name = agency.companyName || "Unnamed Agency";
  const initials = name.split(" ").map(n => n?.[0] || "").join("").substring(0, 2).toUpperCase() || "A";

  let location = "Not specified";
  if (agency.district && agency.state) location = `${agency.district}, ${agency.state}`;
  else if (agency.district) location = agency.district;
  else if (agency.city && agency.state) location = `${agency.city}, ${agency.state}`;
  else if (agency.city) location = agency.city;
  else if (agency.state) location = agency.state;
  else if (agency.address) location = agency.address;

  const isVerified = agency.verificationStatus === "VERIFIED" || agency.profileStatus === "APPROVED";
  const logo = agency.logoUrl || agency.profilePhoto;
  
  const getFullUrl = (url) => {
    if (!url) return null;
    return url.startsWith('http') || url.startsWith('data:') ? url : `http://localhost:5000${url.startsWith('/') ? '' : '/'}${url}`;
  };

  return (
    <div className="max-w-[1250px] mx-auto animate-fade-in font-sans text-slate-650">
      
      {/* Back navigation */}
      <Link to="/search-agencies" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors mb-4 cursor-pointer">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Search</span>
      </Link>

      <AdvertisementBanner slotName="page" variant="standard" />

      {/* Premium Profile Header Cover Card (Solid Minimal Slate-900 style) */}
      <div className="bg-[#0f172a] rounded-2xl p-5 sm:p-6 text-white shadow-sm relative overflow-hidden mb-4 border border-slate-800">
        <div className="relative z-10 flex flex-col sm:flex-row gap-4.5 items-start sm:items-center justify-between w-full">
          <div className="flex gap-4 items-center">
            {/* Avatar Squircle */}
            <div className="relative shrink-0">
              <div className="w-[76px] h-[76px] rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-white font-extrabold text-2xl overflow-hidden shadow-inner">
                {logo ? (
                  <img src={getFullUrl(logo)} alt={name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl text-blue-600 font-bold">{initials}</span>
                )}
              </div>
            </div>

            {/* Title & Category Details */}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-white lowercase truncate leading-tight tracking-tight">
                  {name}
                </h1>
                {isVerified && (
                  <BadgeCheck className="w-5 h-5 text-blue-500 fill-white shrink-0" />
                )}
              </div>
              <p className="text-slate-400 text-xs font-semibold mt-0.5">Workforce Partner</p>
              <div className="flex items-center gap-1 mt-1.5 text-xs text-slate-400 font-medium">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>{location}</span>
              </div>
            </div>
          </div>

          {/* Quick Contact CTA */}
          <a
            href={`tel:${agency.phone || agency.user?.phone || ''}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/10 transition-all shrink-0 cursor-pointer"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call Now</span>
          </a>
        </div>
      </div>

      {/* Details Grid Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Left / Main Details Column (2/3 width) */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* About / Description Card */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
            <h2 className="text-xs font-extrabold text-slate-800 mb-4 uppercase tracking-wider relative pl-3 border-l-2 border-blue-600">
              About the Agency
            </h2>
            
            <div className="mb-4 pb-4 border-b border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Full Address</span>
              <span className="text-sm text-slate-700 font-semibold block mt-1 leading-relaxed">
                {location}
              </span>
            </div>

            <h3 className="text-[10px] text-slate-400 font-bold mb-1.5 uppercase tracking-wider">Bio</h3>
            {agency.description || agency.notes ? (
              <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">
                {agency.description || agency.notes}
              </p>
            ) : (
              <p className="text-sm text-slate-400 italic">
                This agency hasn't added a bio yet.
              </p>
            )}
          </div>

          {/* Agency preferences */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
            <h2 className="text-xs font-extrabold text-slate-800 mb-4 uppercase tracking-wider relative pl-3 border-l-2 border-blue-600">
              Agency Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Company Size</span>
                <span className="text-sm text-slate-700 font-bold leading-normal">
                  {agency.employeeCount ? `${agency.employeeCount} Employees` : 'N/A'}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Agency Type</span>
                <span className="text-sm text-slate-700 font-bold leading-normal">Verified Supplier</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column / Quick info (1/3 width) */}
        <div className="space-y-4">
          
          {/* Quick Stats Grid Card */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
            <h2 className="text-xs font-extrabold text-slate-800 mb-4 uppercase tracking-wider">Quick Stats</h2>
            <div className="grid grid-cols-2 gap-3">
              
              {/* Member since */}
              <div className="p-3.5 bg-slate-50/60 border border-slate-100/50 rounded-xl text-center">
                <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider leading-none">Established</span>
                <span className="text-sm text-slate-700 font-extrabold mt-2 block">
                  {agency.createdAt ? new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(new Date(agency.createdAt)) : "Unknown"}
                </span>
              </div>

              {/* Status */}
              <div className="p-3.5 bg-slate-50/60 border border-slate-100/50 rounded-xl text-center">
                <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider leading-none">Status</span>
                <span className="text-sm text-blue-600 font-extrabold mt-2 block">Active</span>
              </div>

            </div>
          </div>

          {/* Specializations Card */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
            <h3 className="text-xs font-bold text-slate-800 mb-3 uppercase tracking-wider">Specializations</h3>
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2.5 py-1.5 bg-slate-50 text-slate-700 border border-slate-200/50 text-xs font-semibold rounded-lg">
                Construction
              </span>
              <span className="px-2.5 py-1.5 bg-slate-50 text-slate-650 border border-slate-150 text-xs font-semibold rounded-lg">
                Manufacturing
              </span>
            </div>
          </div>

          {/* Verification checklist card */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
            <h3 className="text-xs font-bold text-slate-800 mb-3.5 uppercase tracking-wider">Verification Check</h3>
            <ul className="space-y-3.5 text-xs font-semibold text-slate-650">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 fill-emerald-50 shrink-0" />
                <span>Phone Number Verified</span>
              </li>
              <li className="flex items-center gap-2.5">
                {isVerified ? (
                  <>
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 fill-emerald-50 shrink-0" />
                    <span>Identity Verified (License)</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-4.5 h-4.5 text-amber-550 shrink-0" />
                    <span className="text-slate-400 font-semibold">Identity Verification Pending</span>
                  </>
                )}
              </li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
}
