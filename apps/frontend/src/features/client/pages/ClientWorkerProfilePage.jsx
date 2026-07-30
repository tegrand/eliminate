import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { workerApi } from "../../worker/api/worker.api";
import { 
  ArrowLeft, MapPin, Briefcase, Star, 
  CheckCircle2, Languages, Building2, UserCircle,
  MessageSquare, CalendarCheck
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
    <div className="w-full h-[calc(100vh-4rem)] bg-[#f8f9fa] overflow-y-auto scrollbar-hide py-6 px-4 sm:px-8 lg:px-12 animate-fade-in">
      <div className="max-w-4xl mx-auto space-y-5">
        
        {/* Top Navigation */}
        <Link to="/search-workers" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
          <ArrowLeft className="w-4 h-4" />
          Back to Search
        </Link>

        {/* Content Layout */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* Left Sidebar (Profile Info & Actions) */}
          <div className="w-full lg:w-80 shrink-0 space-y-5">
            {/* Main Profile Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm relative overflow-hidden flex flex-col items-center text-center">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-50 to-indigo-50"></div>
              
              <div className="relative mt-8 mb-4">
                <div className="w-24 h-24 rounded-2xl bg-white border-4 border-white shadow-md overflow-hidden flex items-center justify-center text-gray-400">
                  {avatar ? (
                    <img src={avatar} alt={name} className="w-full h-full object-cover" />
                  ) : (
                    <UserCircle className="w-16 h-16" />
                  )}
                </div>
                {isVerified && (
                  <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-sm" title="Verified Worker">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  </div>
                )}
              </div>

              <h1 className="text-xl font-bold text-gray-900 leading-tight">
                {name}
              </h1>
              <p className="text-sm font-semibold text-blue-600 mt-1">{skillName}</p>

              <div className="flex items-center justify-center gap-4 text-xs text-gray-600 mt-3 w-full">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  {location}
                </div>
              </div>

              <div className="w-full grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-gray-100">
                <button className="py-2.5 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Chat
                </button>
                <button 
                  onClick={() => setIsHireModalOpen(true)}
                  className="py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <Briefcase className="w-4 h-4" />
                  Hire
                </button>
              </div>
            </div>

            {/* Agency info */}
            {agencyName && (
              <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gray-400" /> Current Agency
                </h3>
                <p className="text-sm font-semibold text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  {agencyName}
                </p>
              </div>
            )}
          </div>
          
          {/* Main Content Area */}
          <div className="flex-1 min-w-0 space-y-5">
            
            {/* Professional Overview */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <h2 className="text-base font-bold text-gray-900 mb-5 pb-4 border-b border-gray-100">Professional Overview</h2>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1 bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">Experience</p>
                    <p className="font-semibold text-gray-900 text-sm">{experience}</p>
                  </div>
                </div>
                
                <div className="flex-1 bg-emerald-50/50 rounded-xl p-4 border border-emerald-100 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <CalendarCheck className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-0.5">Availability</p>
                    <p className="font-semibold text-emerald-900 text-sm">{statusLabels[status] || statusLabels.ACTIVE}</p>
                  </div>
                </div>
              </div>

              {worker.notes && (
                <div className="prose prose-sm max-w-none text-gray-600 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                  <p>{worker.notes}</p>
                </div>
              )}
            </div>

            {/* Skills & Languages (Side by Side on Large Screens) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Skills */}
              {(allSkills.length > 0) && (
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-500" /> Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {allSkills.map((s, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-700 text-xs font-semibold rounded-lg">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Languages */}
              {(languages.length > 0) && (
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100 flex items-center gap-2">
                    <Languages className="w-4 h-4 text-blue-500" /> Languages
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {languages.map((l, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 text-xs font-semibold rounded-lg">
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
