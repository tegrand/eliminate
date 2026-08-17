import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { workerApi } from "../../worker/api/worker.api";
import {
  Home, ChevronRight, Heart, Share2,
  MapPin, Calendar, Briefcase, MessageSquare,
  ShieldCheck, Zap, Users, User, Info, Award, Globe, Star, CheckCircle2,
  Clock, Download, FileText
} from "lucide-react";
import { useState } from "react";
import AdvertisementBanner from "../../../components/ui/AdvertisementBanner";

export default function ClientWorkerProfilePage() {
  const { id } = useParams();

  const { data: workerData, isLoading, error } = useQuery({
    queryKey: ["workerForClient", id],
    queryFn: () => workerApi.getWorkerById(id),
  });

  const worker = workerData?.data;

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-[#f7f7f7]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !worker) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-[#f7f7f7]">
        <div className="text-center bg-white p-8 rounded-md shadow-sm border border-gray-200">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-900">Worker Not Found</h3>
          <p className="mt-1 text-sm text-gray-500 max-w-sm mb-5">
            The requested worker could not be found or you don't have permission to view their profile.
          </p>
          <Link to="/search-workers" className="px-5 py-2 bg-gray-900 text-white rounded text-sm font-semibold hover:bg-black transition-colors">
            Back to Search
          </Link>
        </div>
      </div>
    );
  }

  const firstName = worker.user?.firstName || worker.firstName || "";
  const lastName = worker.user?.lastName || worker.lastName || "";
  const name = `${firstName} ${lastName}`.trim() || worker.user?.name || worker.name || "Unknown Worker";
  const initials = name.split(" ").map(n => n?.[0] || "").join("").substring(0, 2).toUpperCase() || "W";

  const skillName = worker.primarySkill?.name || (typeof worker.primarySkill === 'string' ? worker.primarySkill : null) || worker.skills?.[0]?.skill?.name || "General Worker";
  const experience = worker.totalExperienceYears != null ? `${worker.totalExperienceYears} Years` : "N/A";

  let location = "Not specified";
  if (worker.district && worker.state) location = `${worker.district}, ${worker.state}`;
  else if (worker.district) location = worker.district;
  else if (worker.city && worker.state) location = `${worker.city}, ${worker.state}`;
  else if (worker.city) location = worker.city;
  else if (worker.state) location = worker.state;

  const isVerified = worker.profileStatus === "APPROVED";
  const avatar = worker.user?.avatar || worker.profilePhoto;
  
  const languages = worker.languages?.length > 0 ? worker.languages.map(l => l.language?.name).filter(Boolean) : ["English"];
  const allSkills = worker.skills?.length > 0 ? worker.skills.map(s => s.skill?.name).filter(Boolean) : [skillName];

  const reviews = worker.reviews || [];

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-[#f7f7f7] overflow-y-auto py-6 px-4 sm:px-6 font-sans text-[#404145]">
      <div className="max-w-[1200px] mx-auto">
        
        <div className="mb-6">
          <AdvertisementBanner slotName="page" variant="standard" />
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          
          {/* Left Sidebar (Fiverr Style) */}
          <div className="w-full md:w-[320px] shrink-0 space-y-5">
            
            {/* Main Profile Card */}
            <div className="bg-white border border-[#e4e5e7] rounded p-5">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="w-[120px] h-[120px] rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                    {avatar ? (
                      <img src={avatar.startsWith('http') || avatar.startsWith('data:') ? avatar : `http://localhost:5000${avatar.startsWith('/') ? '' : '/'}${avatar}`} alt={name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-5xl text-gray-400 font-bold">{initials}</span>
                    )}
                  </div>
                  {worker.presentToday && (
                    <div className="absolute bottom-4 right-4 w-4 h-4 bg-[#1dbf73] rounded-full border-2 border-white" title="Available today"></div>
                  )}
                </div>
                
                <h1 className="text-xl font-bold text-[#404145] mb-1 flex items-center justify-center gap-1.5">
                  {name}
                  {isVerified && <CheckCircle2 className="w-4 h-4 text-[#1dbf73]" />}
                </h1>
                
                <p className="text-sm text-[#74767e] mb-5">{skillName}</p>

                <a
                  href={`tel:${worker.user?.phone || worker.phone || ''}`}
                  className="w-full block py-2.5 px-4 bg-[#1dbf73] hover:bg-[#19a463] text-white font-bold rounded transition-colors"
                >
                  Contact Me
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
                    {worker.createdAt ? new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(new Date(worker.createdAt)) : "Unknown"}
                  </span>
                </div>
                {worker.expectedDailyWage && (
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2 text-[#74767e]">
                      <Briefcase className="w-4 h-4" />
                      <span>Daily Rate</span>
                    </div>
                    <span className="font-semibold text-[#404145]">₹{worker.expectedDailyWage}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Details Card */}
            <div className="bg-white border border-[#e4e5e7] rounded p-5">
              {/* Languages */}
              <div className="mb-6">
                <h3 className="text-base font-bold text-[#404145] mb-4">Languages</h3>
                <ul className="space-y-2">
                  {languages.map((l, i) => (
                    <li key={i} className="text-sm text-[#62646a]">
                      {l} - <span className="text-[#b5b6ba]">Conversational</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <hr className="my-5 border-[#e4e5e7]" />
              
              {/* Skills */}
              <div className="mb-6">
                <h3 className="text-base font-bold text-[#404145] mb-4">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {allSkills.map((s, i) => (
                    <span key={i} className="px-3 py-1 bg-white border border-[#e4e5e7] rounded-full text-sm text-[#74767e] hover:bg-gray-50 cursor-pointer">
                      {s}
                    </span>
                  ))}
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
              <h2 className="text-xl font-bold text-[#404145] mb-6">About the Worker</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pb-6 border-b border-[#e4e5e7]">
                <div>
                  <span className="text-xs text-[#74767e] uppercase tracking-wide font-semibold block mb-1">Gender</span>
                  <span className="text-sm text-[#404145] font-medium capitalize">{worker.gender?.toLowerCase() || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-xs text-[#74767e] uppercase tracking-wide font-semibold block mb-1">Age</span>
                  <span className="text-sm text-[#404145] font-medium">{worker.dateOfBirth ? (new Date().getFullYear() - new Date(worker.dateOfBirth).getFullYear()) + ' Years' : 'N/A'}</span>
                </div>
                <div className="col-span-2 md:col-span-4">
                  <span className="text-xs text-[#74767e] uppercase tracking-wide font-semibold block mb-1">Full Address</span>
                  <span className="text-sm text-[#404145] font-medium">
                    {[worker.addressLine1, worker.addressLine2, worker.city, worker.district, worker.state, worker.postalCode, worker.country].filter(Boolean).join(", ") || location}
                  </span>
                </div>
              </div>

              <div className="prose prose-sm text-[#62646a] max-w-none">
                <h3 className="text-sm font-bold text-[#404145] mb-3 uppercase tracking-wide">Bio</h3>
                {worker.notes ? (
                  <p className="whitespace-pre-line leading-relaxed">
                    {worker.notes}
                  </p>
                ) : (
                  <p className="whitespace-pre-line leading-relaxed text-gray-400 italic">
                    This worker hasn't added a bio yet.
                  </p>
                )}
              </div>

            </div>

            {/* Resume / Portfolio */}
            <div className="bg-white border border-[#e4e5e7] rounded p-6">
              <h2 className="text-xl font-bold text-[#404145] mb-6">Resume / CV</h2>
              {worker.resumeUrl ? (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-[#e4e5e7] rounded hover:shadow-sm transition-shadow">
                  <div className="flex items-center gap-4 overflow-hidden">
                    <div className="w-12 h-12 shrink-0 bg-gray-100 rounded flex items-center justify-center text-[#ffb33e]">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-[#404145] truncate">{name}_Resume.pdf</h4>
                      <p className="text-xs text-[#74767e]">PDF Document</p>
                    </div>
                  </div>
                  <a 
                    href={worker.resumeUrl.startsWith('http') ? worker.resumeUrl : `http://localhost:5000${worker.resumeUrl.startsWith('/') ? '' : '/'}${worker.resumeUrl}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center justify-center sm:justify-start gap-2 p-2 px-4 border border-[#e4e5e7] rounded text-[#74767e] hover:bg-gray-50 hover:text-[#404145] font-semibold text-sm transition-colors w-full sm:w-auto"
                  >
                    View Resume <Download className="w-4 h-4 ml-1" />
                  </a>
                </div>
              ) : (
                <div className="p-4 border border-dashed border-[#e4e5e7] rounded text-center text-[#74767e]">
                  <p className="italic text-sm">This worker has not uploaded a resume yet.</p>
                </div>
              )}
            </div>

            {/* Recent Work Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-white border border-[#e4e5e7] rounded p-5">
                <div className="flex items-center gap-3 mb-4">
                  <Briefcase className="w-5 h-5 text-[#404145]" />
                  <h3 className="font-bold text-[#404145]">Work Details</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <span className="text-xs text-[#74767e] uppercase tracking-wide font-semibold block mb-1">Total Experience</span>
                    <span className="text-sm text-[#404145] font-medium">{experience}</span>
                  </div>
                  <div>
                    <span className="text-xs text-[#74767e] uppercase tracking-wide font-semibold block mb-1">Job Type</span>
                    <span className="text-sm text-[#404145] font-medium">{worker.jobType || skillName}</span>
                  </div>
                  <div>
                    <span className="text-xs text-[#74767e] uppercase tracking-wide font-semibold block mb-1">Travel Preference</span>
                    <span className="text-sm text-[#404145] font-medium">
                      {worker.travelDistance ? `Willing to travel up to ${worker.travelDistance} km` : 'Local work only'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#e4e5e7] rounded p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-5 h-5 text-[#404145]" />
                  <h3 className="font-bold text-[#404145]">Availability</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <span className="text-xs text-[#74767e] uppercase tracking-wide font-semibold block mb-1">Current Status</span>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${worker.presentToday ? 'bg-[#1dbf73]' : 'bg-[#ff6259]'}`}></span>
                      <span className="text-sm text-[#404145] font-medium">
                        {worker.presentToday ? 'Available for new work' : 'Currently busy'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-[#74767e] uppercase tracking-wide font-semibold block mb-1">Profile Status</span>
                    <span className="text-sm text-[#404145] font-medium flex items-center gap-1.5">
                      {isVerified ? (
                        <><ShieldCheck className="w-4 h-4 text-[#1dbf73]" /> Verified by Admin</>
                      ) : (
                        <><Info className="w-4 h-4 text-[#ffb33e]" /> Pending Verification</>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews Section Removed */}

          </div>
        </div>
      </div>
    </div>
  );
}
