import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { workerApi } from "../../worker/api/worker.api";
import {
  MapPin, Calendar, Briefcase, ShieldCheck, BadgeCheck, Phone, ArrowLeft,
  FileText, Download, User, Info, Award, Globe, Star, CheckCircle2,
  Clock, Heart, Share2, Users, Zap
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
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div>
      </div>
    );
  }

  if (error || !worker) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-slate-50">
        <div className="text-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100 max-w-sm mx-4">
          <User className="h-10 w-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">Worker Not Found</h3>
          <p className="mt-1.5 text-xs text-slate-500 mb-5">
            The requested worker could not be found or you don't have permission to view their profile.
          </p>
          <Link to="/search-workers" className="inline-flex items-center justify-center w-full px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-colors">
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

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-slate-50 overflow-y-auto py-4 px-4 sm:px-6 font-sans text-slate-650">
      <div className="max-w-[1250px] mx-auto animate-fade-in">
        
        {/* Back navigation */}
        <Link to="/search-workers" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors mb-4 cursor-pointer">
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
                  {avatar ? (
                    <img src={avatar.startsWith('http') || avatar.startsWith('data:') ? avatar : `http://localhost:5000${avatar.startsWith('/') ? '' : '/'}${avatar}`} alt={name} className="w-full h-full object-cover" />
                  ) : initials}
                </div>
                {/* Available Today Badge */}
                {worker.presentToday && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#0f172a] rounded-full shadow-sm z-10" />
                )}
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
                <p className="text-slate-400 text-xs font-semibold mt-0.5">{skillName}</p>
                <div className="flex items-center gap-1 mt-1.5 text-xs text-slate-400 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{location}</span>
                </div>
              </div>
            </div>

            {/* Quick Contact CTA */}
            <a
              href={`tel:${worker.user?.phone || worker.phone || ''}`}
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
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
              <h2 className="text-xs font-extrabold text-slate-800 mb-3.5 uppercase tracking-wider">
                About the Worker
              </h2>
              
              <div className="mb-4 pb-4 border-b border-slate-100">
                <span className="text-[10px] text-slate-450 font-bold block uppercase tracking-wider">Full Address</span>
                <span className="text-xs text-slate-650 font-semibold block mt-1.5 leading-relaxed">
                  {[worker.addressLine1, worker.addressLine2, worker.city, worker.district, worker.state, worker.postalCode, worker.country].filter(Boolean).join(", ") || location}
                </span>
              </div>

              <h3 className="text-[10px] text-slate-450 font-bold mb-1.5 uppercase tracking-wider">Bio</h3>
              {worker.notes ? (
                <p className="text-xs sm:text-sm text-slate-650 whitespace-pre-line leading-relaxed">
                  {worker.notes}
                </p>
              ) : (
                <p className="text-xs text-slate-400 italic">
                  This worker hasn't added a bio yet.
                </p>
              )}
            </div>

            {/* Resume / Portfolio Card */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
              <h2 className="text-xs font-extrabold text-slate-800 mb-3.5 uppercase tracking-wider">
                Resume / CV
              </h2>
              {worker.resumeUrl ? (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3.5 border border-slate-100 bg-slate-50/50 rounded-xl hover:shadow-sm transition-all">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 shrink-0 bg-slate-100 rounded-lg flex items-center justify-center text-slate-650">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-700 text-xs truncate">{name}_Resume.pdf</h4>
                      <p className="text-[10px] text-slate-400">PDF Document</p>
                    </div>
                  </div>
                  <a 
                    href={worker.resumeUrl.startsWith('http') ? worker.resumeUrl : `http://localhost:5000${worker.resumeUrl.startsWith('/') ? '' : '/'}${worker.resumeUrl}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 py-2 px-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    View Resume <Download className="w-3.5 h-3.5" />
                  </a>
                </div>
              ) : (
                <div className="p-4 border border-dashed border-slate-200 rounded-xl text-center text-slate-400">
                  <p className="italic text-xs">This worker has not uploaded a resume yet.</p>
                </div>
              )}
            </div>

            {/* Work Details & Travel preferences */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
              <h2 className="text-xs font-extrabold text-slate-800 mb-3.5 uppercase tracking-wider">
                Work Preferences
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-3.5 bg-slate-50/60 border border-slate-100 rounded-xl">
                  <span className="text-[10px] text-slate-450 font-bold block uppercase tracking-wider">Job Type</span>
                  <span className="text-xs text-slate-755 font-bold mt-1.5 block">{worker.jobType || skillName}</span>
                </div>
                <div className="p-3.5 bg-slate-50/60 border border-slate-100 rounded-xl">
                  <span className="text-[10px] text-slate-450 font-bold block uppercase tracking-wider">Travel Preference</span>
                  <span className="text-xs text-slate-755 font-bold mt-1.5 block">
                    {worker.travelDistance ? `Willing to travel up to ${worker.travelDistance} km` : 'Local work only'}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column / Quick info (1/3 width) */}
          <div className="space-y-4">
            
            {/* Quick Stats Grid Card */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
              <h2 className="text-xs font-extrabold text-slate-800 mb-3.5 uppercase tracking-wider">Quick Stats</h2>
              <div className="grid grid-cols-2 gap-3">
                
                {/* Experience */}
                <div className="p-3 bg-slate-50/60 border border-slate-100/50 rounded-xl text-center">
                  <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider leading-none">Experience</span>
                  <span className="text-xs text-slate-700 font-extrabold mt-1.5 block">{experience}</span>
                </div>

                {/* Daily Rate */}
                {worker.expectedDailyWage && (
                  <div className="p-3 bg-slate-50/60 border border-slate-100/50 rounded-xl text-center">
                    <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider leading-none">Daily Rate</span>
                    <span className="text-xs text-blue-600 font-extrabold mt-1.5 block">₹{worker.expectedDailyWage}</span>
                  </div>
                )}

                {/* Age */}
                <div className="p-3 bg-slate-50/60 border border-slate-100/50 rounded-xl text-center">
                  <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider leading-none">Age</span>
                  <span className="text-xs text-slate-700 font-extrabold mt-1.5 block">
                    {worker.dateOfBirth ? (new Date().getFullYear() - new Date(worker.dateOfBirth).getFullYear()) + ' Yrs' : 'N/A'}
                  </span>
                </div>

                {/* Gender */}
                <div className="p-3 bg-slate-50/60 border border-slate-100/50 rounded-xl text-center">
                  <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider leading-none">Gender</span>
                  <span className="text-xs text-slate-700 font-extrabold capitalize mt-1.5 block">{worker.gender?.toLowerCase() || 'N/A'}</span>
                </div>

              </div>
            </div>

            {/* Skills & Tags Card */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
              <h3 className="text-xs font-bold text-slate-800 mb-3 uppercase tracking-wider">Specialized Skills</h3>
              <div className="flex flex-wrap gap-1.5">
                {allSkills.map((s, i) => (
                  <span key={i} className="px-2.5 py-1 bg-slate-50 text-slate-700 border border-slate-200/50 text-[11px] font-semibold rounded-md">
                    {s}
                  </span>
                ))}
              </div>

              <hr className="my-4 border-slate-100" />

              <h3 className="text-xs font-bold text-slate-800 mb-3 uppercase tracking-wider">Languages</h3>
              <div className="flex flex-wrap gap-1.5">
                {languages.map((l, i) => (
                  <span key={i} className="px-2.5 py-1 bg-slate-50 text-slate-650 border border-slate-150 text-[11px] font-semibold rounded-md">
                    {l}
                  </span>
                ))}
              </div>
            </div>

            {/* Verification checklist card */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
              <h3 className="text-xs font-bold text-slate-800 mb-3.5 uppercase tracking-wider">Verification Check</h3>
              <ul className="space-y-3.5 text-xs font-semibold text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                  <span>Phone Number Verified</span>
                </li>
                <li className="flex items-center gap-2">
                  {isVerified ? (
                    <>
                      <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                      <span>Identity Verified (ID Card)</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-4.5 h-4.5 text-amber-500 shrink-0" />
                      <span className="text-slate-400 font-medium">Identity Verification Pending</span>
                    </>
                  )}
                </li>
              </ul>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
