import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { workerApi } from "../../worker/api/worker.api";
import {
  Home, ChevronRight, Heart, Share2,
  MapPin, Calendar, Briefcase, MessageSquare,
  ShieldCheck, Zap, Users, User, Info, Award, Globe, Star, CheckCircle2
} from "lucide-react";
import { useState } from "react";

export default function ClientWorkerProfilePage() {
  const { id } = useParams();

  const { data: workerData, isLoading, error } = useQuery({
    queryKey: ["workerForClient", id],
    queryFn: () => workerApi.getWorkerById(id),
  });

  const worker = workerData?.data;

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-[#f8f9fa]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !worker) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-[#f8f9fa]">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-900">Worker Not Found</h3>
          <p className="mt-1 text-sm text-gray-500 max-w-sm mb-5">
            The requested worker could not be found or you don't have permission to view their profile.
          </p>
          <Link to="/search-workers" className="px-5 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
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

  let location = "Location not specified";
  if (worker.district && worker.state) location = `${worker.district}, ${worker.state}`;
  else if (worker.district) location = worker.district;
  else if (worker.city && worker.state) location = `${worker.city}, ${worker.state}`;
  else if (worker.city) location = worker.city;
  else if (worker.state) location = worker.state;

  const isVerified = worker.profileStatus === "APPROVED";
  const avatar = worker.user?.avatar || worker.profilePhoto;
  
  const languages = worker.languages?.length > 0 ? worker.languages.map(l => l.language?.name).filter(Boolean) : [];
  const allSkills = worker.skills?.length > 0 ? worker.skills.map(s => s.skill?.name).filter(Boolean) : [skillName];

  const reviews = worker.reviews || [];
  const avgRating = reviews.length > 0
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  return (
    <div className="w-full h-[calc(100vh-4rem)] bg-[#f8f9fa] overflow-y-auto scrollbar-hide py-4 px-4 sm:px-6 animate-fade-in text-gray-900">
      <div className="max-w-7xl mx-auto space-y-4">

        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <Link to="/dashboard" className="hover:text-gray-900 transition-colors">
              <Home className="w-4 h-4" />
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link to="/search-workers" className="hover:text-gray-900 transition-colors">
              Workers
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-semibold">Worker Profile</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* Left Sidebar */}
          <div className="w-full lg:w-[320px] shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 relative">
              {/* Status Badge */}
              <div className={`absolute top-5 right-5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${worker.presentToday ? 'bg-emerald-50 text-emerald-700' : 'bg-orange-50 text-orange-700'} text-[10px] font-bold tracking-wide`}>
                <div className={`w-1.5 h-1.5 rounded-full ${worker.presentToday ? 'bg-emerald-500' : 'bg-orange-500'}`}></div>
                {worker.presentToday ? 'Available' : 'Not Available'}
              </div>

              {/* Avatar */}
              <div className="flex flex-col items-center pt-2 mb-4">
                <div className="relative mb-3">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white border-4 border-white shadow-lg flex items-center justify-center shrink-0 text-gray-400 font-bold text-3xl overflow-hidden relative z-10 -mt-12 sm:mt-0">
                    {avatar ? (
                      <img src={avatar.startsWith('http') || avatar.startsWith('data:') ? avatar : `http://localhost:5000${avatar.startsWith('/') ? '' : '/'}${avatar}`} alt={name} className="w-full h-full object-cover" />
                    ) : (
                      initials
                    )}
                  </div>
                  {isVerified && (
                    <div className="absolute bottom-0 right-0 bg-emerald-500 rounded-full p-1 border-2 border-white text-white">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
                <h1 className="text-lg font-bold text-gray-900 mb-0.5 text-center">{name}</h1>
                <p className="text-xs text-gray-600 mb-2 text-center">{skillName}</p>
                <div className="flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-xs font-bold">{avgRating}</span>
                  <span className="text-xs text-gray-500">({reviews.length} reviews)</span>
                </div>
              </div>

              {/* Quick Info */}
              <div className="space-y-3 mb-5">
                <div className="flex items-center gap-2.5 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="text-[13px]">{location} {worker.travelDistance ? `(Willing to travel ${worker.travelDistance} km)` : ''}</span>
                </div>
                <div className={`flex items-center gap-2.5 text-sm font-medium ${worker.presentToday ? 'text-emerald-600' : 'text-orange-600'}`}>
                  <Calendar className={`w-4 h-4 ${worker.presentToday ? 'text-emerald-600' : 'text-orange-600'}`} />
                  <span className="text-[13px]">{worker.presentToday ? 'Available for work' : 'Currently Unavailable'}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-4 border-t border-gray-100 mt-2">
                <a
                  href={`tel:${worker.user?.phone || worker.phone || ''}`}
                  className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm shadow-blue-200"
                >
                  Call Now
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-4 gap-1.5 text-center pt-5 border-t border-gray-100">
                <div className="flex flex-col items-center">
                  <ShieldCheck className="w-4 h-4 text-gray-500 mb-1.5" />
                  <span className="text-[9px] text-gray-500 font-medium leading-tight">Verified<br/>Profile</span>
                </div>
                <div className="flex flex-col items-center">
                  <Zap className="w-4 h-4 text-gray-500 mb-1.5" />
                  <span className="text-[9px] text-gray-500 font-medium leading-tight">Quick<br/>Response</span>
                </div>
                <div className="flex flex-col items-center">
                  <Heart className="w-4 h-4 text-gray-500 mb-1.5" />
                  <span className="text-[9px] text-gray-500 font-medium leading-tight">Reliable<br/>Service</span>
                </div>
                <div className="flex flex-col items-center">
                  <Users className="w-4 h-4 text-gray-500 mb-1.5" />
                  <span className="text-[9px] text-gray-500 font-medium leading-tight">Trusted<br/>Community</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="flex-1 space-y-6">
            

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Work Details */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <Briefcase className="w-3 h-3" />
                  </div>
                  <h2 className="text-sm font-bold text-gray-900">Work Details</h2>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-[11px] text-gray-500 font-medium mb-0.5">Experience</p>
                    <p className="text-sm font-bold text-gray-900 mb-0.5">{experience}</p>
                    <p className="text-[11px] text-gray-500">
                      {worker.totalExperienceYears ? "Overall experience" : "Experience not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-500 font-medium mb-0.5">Work Type</p>
                    <p className="text-sm font-bold text-gray-900 mb-0.5">{worker.jobType || skillName}</p>
                    <p className="text-[11px] text-gray-500">{worker.jobType ? "Job Type" : "Category"}</p>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <Award className="w-3 h-3" />
                  </div>
                  <h2 className="text-sm font-bold text-gray-900">Skills & Expertise</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {allSkills.length > 0 ? (
                    allSkills.map((s, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-gray-50 text-gray-700 text-xs font-semibold rounded-full flex items-center gap-1.5 border border-gray-100">
                        <Award className="w-3 h-3 text-gray-400" /> {s}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No skills specified.</p>
                  )}
                </div>
              </div>

              {/* Languages */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <Globe className="w-3 h-3" />
                  </div>
                  <h2 className="text-sm font-bold text-gray-900">Languages</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {languages.length > 0 ? (
                    languages.map((l, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-gray-50 text-gray-700 text-xs font-semibold rounded-full border border-gray-100">
                        {l}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No languages specified.</p>
                  )}
                </div>
              </div>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
}
