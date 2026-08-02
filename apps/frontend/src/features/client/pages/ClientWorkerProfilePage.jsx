import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { workerApi } from "../../worker/api/worker.api";
import { 
  ArrowLeft, MapPin, Briefcase, Star, 
  CheckCircle2, Languages, Building2, UserCircle,
  MessageSquare, CalendarCheck, DollarSign
} from "lucide-react";
import { useState } from "react";
import ClientHiringModal from "../components/ClientHiringModal";

export default function ClientWorkerProfilePage() {
  const { id } = useParams();
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);

  const { data: workerData, isLoading, error } = useQuery({
    queryKey: ["workerForClient", id],
    queryFn: () => workerApi.getWorkerById(id),
  });

  const worker = workerData?.data;

  if (isLoading) {
    return <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-[#f8f9fa]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  }

  if (error || !worker) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-[#f8f9fa]">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
          <UserCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-900">Worker Not Found</h3>
          <p className="mt-1 text-sm text-gray-500 max-w-sm mb-5">The requested worker could not be found or you don't have permission to view their profile.</p>
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
  
  const skillName = worker.primarySkill?.name || (typeof worker.primarySkill === 'string' ? worker.primarySkill : null) || worker.skills?.[0]?.skill?.name || "General Worker";
  const experience = worker.experienceYears ? `${worker.experienceYears} Years Experience` : "Experience N/A";
  
  let location = "Location not specified";
  if (worker.city && worker.state) location = `${worker.city}, ${worker.state}`;
  else if (worker.city) location = worker.city;
  else if (worker.state) location = worker.state;

  const isVerified = worker.profileStatus === "APPROVED";
  const agencyName = worker.agency?.companyName || worker.agencyProfile?.companyName || null;
  const avatar = worker.user?.avatar || worker.profilePhoto;
  const status = worker.employmentStatus || "ACTIVE";
  
  const statusLabels = {
    ACTIVE: 'Available',
    BUSY: 'Busy',
    ON_LEAVE: 'On Leave',
    INACTIVE: 'Offline'
  };

  const languages = worker.languages?.length > 0 ? worker.languages.map(l => l.language?.name).filter(Boolean) : [];
  const allSkills = worker.skills?.length > 0 ? worker.skills.map(s => s.skill?.name).filter(Boolean) : [skillName];

  return (
    <div className="w-full h-[calc(100vh-4rem)] bg-[#f8f9fa] overflow-y-auto scrollbar-hide py-8 px-4 sm:px-8 lg:px-12 animate-fade-in">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Navigation */}
        <div>
          <Link to="/search-workers" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors gap-2 bg-white px-4 py-2.5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md">
            <ArrowLeft className="w-4 h-4" />
            Back to Search
          </Link>
        </div>

        {/* Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Sidebar (Profile Info & Actions) */}
          <div className="w-full lg:w-[340px] shrink-0 space-y-6">
            {/* Main Profile Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden flex flex-col">
              <div className="h-32 bg-gradient-to-br from-blue-600 to-indigo-700 w-full relative">
                {/* Decorative pattern */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
              </div>
              
              <div className="px-6 pb-6 pt-0 flex flex-col items-center text-center relative">
                <div className="relative -mt-16 mb-4">
                  <div className="w-32 h-32 rounded-full bg-white p-1.5 shadow-md">
                    <div className="w-full h-full rounded-full bg-gray-50 overflow-hidden flex items-center justify-center text-gray-400 border border-gray-100">
                      {avatar ? (
                        <img src={avatar} alt={name} className="w-full h-full object-cover" />
                      ) : (
                        <UserCircle className="w-20 h-20" />
                      )}
                    </div>
                  </div>
                  {isVerified && (
                    <div className="absolute bottom-1 right-1 bg-white rounded-full p-1 shadow-sm border border-gray-100" title="Verified Worker">
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    </div>
                  )}
                </div>

                <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                  {name}
                </h1>
                <p className="text-sm font-semibold text-blue-600 mt-1">{skillName}</p>

                <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mt-3 w-full bg-gray-50 py-2 rounded-lg border border-gray-100">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">{location}</span>
                </div>

                <div className="w-full grid grid-cols-2 gap-3 mt-6">
                  <button className="py-2.5 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 text-gray-700 text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm">
                    <MessageSquare className="w-4 h-4 text-gray-500" />
                    Message
                  </button>
                  <button 
                    onClick={() => setIsHireModalOpen(true)}
                    className="py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
                  >
                    <Briefcase className="w-4 h-4" />
                    Hire Now
                  </button>
                </div>
              </div>
            </div>

            {/* Agency info */}
            {agencyName && (
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col gap-3">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600" /> Current Agency
                </h3>
                <div className="bg-blue-50 text-blue-800 p-4 rounded-xl border border-blue-100 font-semibold text-sm">
                  {agencyName}
                </div>
              </div>
            )}
          </div>
          
          {/* Main Content Area */}
          <div className="flex-1 w-full space-y-6">
            
            {/* Professional Overview */}
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" /> Professional Overview
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 hover:border-gray-300 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                      <Briefcase className="w-4 h-4 text-blue-600" />
                    </div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Experience</p>
                  </div>
                  <p className="font-black text-gray-900 text-lg">{experience}</p>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 hover:border-gray-300 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                      <CalendarCheck className="w-4 h-4 text-emerald-600" />
                    </div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Availability</p>
                  </div>
                  <p className="font-black text-gray-900 text-lg">{statusLabels[status] || statusLabels.ACTIVE}</p>
                </div>
                
                {worker.expectedDailyWage && (
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 hover:border-gray-300 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                        <DollarSign className="w-4 h-4 text-amber-600" />
                      </div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Expected Wage</p>
                    </div>
                    <p className="font-black text-gray-900 text-lg">₹{worker.expectedDailyWage} <span className="text-sm font-medium text-gray-500">/ day</span></p>
                  </div>
                )}
              </div>

              {worker.notes && (
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3">About</h3>
                  <div className="prose prose-sm max-w-none text-gray-600 bg-gray-50 p-5 rounded-xl border border-gray-100 leading-relaxed">
                    <p>{worker.notes}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Skills & Languages */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Skills */}
              {(allSkills.length > 0) && (
                <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm h-full">
                  <h3 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-indigo-500" /> Skills & Expertise
                  </h3>
                  <div className="flex flex-wrap gap-2.5">
                    {allSkills.map((s, idx) => (
                      <span key={idx} className="px-4 py-2 bg-indigo-50 text-indigo-700 border border-indigo-100 text-sm font-semibold rounded-xl">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Languages */}
              {(languages.length > 0) && (
                <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm h-full">
                  <h3 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
                    <Languages className="w-5 h-5 text-teal-500" /> Languages
                  </h3>
                  <div className="flex flex-wrap gap-2.5">
                    {languages.map((l, idx) => (
                      <span key={idx} className="px-4 py-2 bg-teal-50 text-teal-700 border border-teal-100 text-sm font-semibold rounded-xl">
                        {l}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
      
      {/* Hiring Modal */}
      <ClientHiringModal 
        isOpen={isHireModalOpen} 
        onClose={() => setIsHireModalOpen(false)} 
        targetId={worker.id}
        targetType="WORKER"
        targetName={name}
      />
    </div>
  );
}
