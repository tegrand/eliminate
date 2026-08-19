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
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !worker) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-slate-50">
        <div className="text-center bg-white p-8 rounded-3xl shadow-sm border border-slate-100 max-w-sm mx-4">
          <User className="h-12 w-12 text-slate-350 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">Worker Not Found</h3>
          <p className="mt-1.5 text-sm text-slate-500 mb-6">
            The requested worker could not be found or you don't have permission to view their profile.
          </p>
          <Link to="/search-workers" className="inline-flex items-center justify-center w-full px-5 py-2.5 bg-blue-600 text-white rounded-2xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/10">
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
    <div className="w-full min-h-[calc(100vh-4rem)] bg-slate-50 overflow-y-auto py-6 px-4 sm:px-6 font-sans text-slate-700">
      <div className="max-w-[1100px] mx-auto">
        
        {/* Back navigation */}
        <Link to="/search-workers" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-5 cursor-pointer">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Workforce Search</span>
        </Link>

        <AdvertisementBanner slotName="page" variant="standard" />

        {/* Premium Profile Header Cover Card */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 rounded-[28px] p-6 sm:p-8 text-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden mb-6">
          {/* Subtle design wave lines overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,100 C150,200 350,0 500,100 L500,0 L0,0 Z" fill="white"></path>
            </svg>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between w-full">
            <div className="flex gap-4 sm:gap-5 items-center">
              {/* Avatar Squircle */}
              <div className="relative shrink-0">
                <div className="w-20 h-20 sm:w-[92px] sm:h-[92px] rounded-[22px] bg-white/10 backdrop-blur border-4 border-white/95 flex items-center justify-center text-white font-extrabold text-3xl overflow-hidden shadow-md">
                  {avatar ? (
                    <img src={avatar.startsWith('http') || avatar.startsWith('data:') ? avatar : `http://localhost:5000${avatar.startsWith('/') ? '' : '/'}${avatar}`} alt={name} className="w-full h-full object-cover" />
                  ) : initials}
                </div>
                {/* Available Today Badge */}
                {worker.presentToday && (
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-sm z-10" />
                )}
              </div>

              {/* Title & Category Details */}
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 min-w-0">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-white lowercase truncate leading-tight">
                    {name}
                  </h1>
                  {isVerified && (
                    <BadgeCheck className="w-6 h-6 text-white fill-blue-550 shrink-0" />
                  )}
                </div>
                <p className="text-blue-100 text-sm font-semibold mt-1">{skillName}</p>
                <div className="flex items-center gap-1.5 mt-2 text-xs text-blue-50/80 font-medium">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{location}</span>
                </div>
              </div>
            </div>

            {/* Quick Contact CTA */}
            <a
              href={`tel:${worker.user?.phone || worker.phone || ''}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-600 hover:bg-blue-50 text-sm font-extrabold rounded-[18px] shadow-lg transition-all shrink-0 cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              <span>Call Now</span>
            </a>
          </div>
        </div>

        {/* Details Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left / Main Details Column (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* About / Description Card */}
            <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                <span>About the Worker</span>
              </h2>
              
              {worker.notes ? (
                <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">
                  {worker.notes}
                </p>
              ) : (
                <p className="text-sm text-slate-400 italic">
                  This worker hasn't added a bio yet.
                </p>
              )}
            </div>

            {/* Resume / Portfolio Card */}
            <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span>Resume / CV</span>
              </h2>
              {worker.resumeUrl ? (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-slate-100 bg-slate-50/50 rounded-2xl hover:shadow-sm transition-all">
                  <div className="flex items-center gap-3.5 overflow-hidden">
                    <div className="w-11 h-11 shrink-0 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                      <FileText className="w-5.5 h-5.5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-700 text-sm truncate">{name}_Resume.pdf</h4>
                      <p className="text-xs text-slate-400">PDF Document</p>
                    </div>
                  </div>
                  <a 
                    href={worker.resumeUrl.startsWith('http') ? worker.resumeUrl : `http://localhost:5000${worker.resumeUrl.startsWith('/') ? '' : '/'}${worker.resumeUrl}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 py-2 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl shadow-sm transition-colors cursor-pointer"
                  >
                    View Resume <Download className="w-3.5 h-3.5" />
                  </a>
                </div>
              ) : (
                <div className="p-5 border border-dashed border-slate-200 rounded-2xl text-center text-slate-400">
                  <p className="italic text-sm">This worker has not uploaded a resume yet.</p>
                </div>
              )}
            </div>

            {/* Work Details & Travel preferences */}
            <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                <span>Work Preferences</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl">
                  <span className="text-xs text-slate-400 font-bold block mb-1 uppercase tracking-wider">Job Type</span>
                  <span className="text-sm text-slate-700 font-bold">{worker.jobType || skillName}</span>
                </div>
                <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl">
                  <span className="text-xs text-slate-400 font-bold block mb-1 uppercase tracking-wider">Travel Preference</span>
                  <span className="text-sm text-slate-700 font-bold">
                    {worker.travelDistance ? `Willing to travel up to ${worker.travelDistance} km` : 'Local work only'}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column / Quick info (1/3 width) */}
          <div className="space-y-6">
            
            {/* Quick Stats Grid Card */}
            <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Quick Stats</h2>
              <div className="grid grid-cols-2 gap-3.5">
                <div className="p-3 bg-slate-50/50 border border-slate-100 rounded-2xl text-center">
                  <span className="text-[10px] text-slate-400 font-bold block mb-1 uppercase tracking-wider">Experience</span>
                  <span className="text-sm text-slate-700 font-extrabold">{experience}</span>
                </div>
                {worker.expectedDailyWage && (
                  <div className="p-3 bg-slate-50/50 border border-slate-100 rounded-2xl text-center">
                    <span className="text-[10px] text-slate-400 font-bold block mb-1 uppercase tracking-wider">Daily Rate</span>
                    <span className="text-sm text-blue-600 font-extrabold">₹{worker.expectedDailyWage}</span>
                  </div>
                )}
                <div className="p-3 bg-slate-50/50 border border-slate-100 rounded-2xl text-center">
                  <span className="text-[10px] text-slate-400 font-bold block mb-1 uppercase tracking-wider">Age</span>
                  <span className="text-sm text-slate-700 font-extrabold">
                    {worker.dateOfBirth ? (new Date().getFullYear() - new Date(worker.dateOfBirth).getFullYear()) + ' Yrs' : 'N/A'}
                  </span>
                </div>
                <div className="p-3 bg-slate-50/50 border border-slate-100 rounded-2xl text-center">
                  <span className="text-[10px] text-slate-400 font-bold block mb-1 uppercase tracking-wider">Gender</span>
                  <span className="text-sm text-slate-700 font-extrabold capitalize">{worker.gender?.toLowerCase() || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Skills & Tags Card */}
            <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
              <h3 className="text-base font-bold text-slate-800 mb-3.5">Specialized Skills</h3>
              <div className="flex flex-wrap gap-2">
                {allSkills.map((s, i) => (
                  <span key={i} className="px-3 py-1 bg-blue-50/60 text-blue-600 text-xs font-bold rounded-full border border-blue-100/10">
                    {s}
                  </span>
                ))}
              </div>

              <hr className="my-5 border-slate-100" />

              <h3 className="text-base font-bold text-slate-800 mb-3.5">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {languages.map((l, i) => (
                  <span key={i} className="px-3 py-1 bg-slate-50 text-slate-500 text-xs font-bold rounded-full border border-slate-100">
                    {l}
                  </span>
                ))}
              </div>
            </div>

            {/* Verification checklist card */}
            <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
              <h3 className="text-base font-bold text-slate-800 mb-4">Verification Check</h3>
              <ul className="space-y-3.5">
                <li className="flex items-center gap-3 text-sm font-semibold text-slate-600">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/10 shrink-0" />
                  <span>Phone Number Verified</span>
                </li>
                <li className="flex items-center gap-3 text-sm font-semibold text-slate-600">
                  {isVerified ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/10 shrink-0" />
                      <span>Identity Verified (ID Card)</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-5 h-5 text-amber-500 shrink-0" />
                      <span className="text-slate-400">Identity Verification Pending</span>
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
