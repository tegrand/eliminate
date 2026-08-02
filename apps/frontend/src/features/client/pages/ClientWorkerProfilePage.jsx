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
  const experience = worker.experienceYears != null ? `${worker.experienceYears} Years Experience` : "Experience N/A";
  
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

  const reviews = worker.reviews || [];
  const avgRating = reviews.length > 0 ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1) : 0;

  return (
    <div className="w-full h-[calc(100vh-4rem)] bg-[#f8f9fa] overflow-y-auto scrollbar-hide py-8 px-4 sm:px-8 animate-fade-in">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Top Navigation */}
        <div>
          <Link to="/search-workers" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm hover:shadow-md">
            <ArrowLeft className="w-4 h-4" />
            Back to Search
          </Link>
        </div>

        {/* Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Sidebar (Profile Info & Actions) */}
          <div className="w-full lg:w-80 shrink-0 space-y-5">
            {/* Main Profile Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full bg-gray-50 overflow-hidden flex items-center justify-center text-gray-400 border border-gray-200 shadow-sm">
                  {avatar ? (
                    <img src={avatar} alt={name} className="w-full h-full object-cover" />
                  ) : (
                    <UserCircle className="w-16 h-16" />
                  )}
                </div>
                {isVerified && (
                  <div className="absolute bottom-0 right-0 bg-white rounded-full p-0.5 shadow-sm border border-gray-100" title="Verified Worker">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  </div>
                )}
              </div>

              <h1 className="text-xl font-bold text-gray-900 leading-tight">
                {name}
              </h1>
              <p className="text-sm font-medium text-gray-600 mt-1">{skillName}</p>

              <div className="flex items-center justify-center gap-1 mt-2 mb-4">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="text-sm font-bold text-gray-900">{avgRating}</span>
                <span className="text-xs font-medium text-gray-500">({reviews.length} reviews)</span>
              </div>

              <div className="w-full space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="truncate">{location}</span>
                </div>
                {worker.expectedDailyWage && (
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <DollarSign className="w-4 h-4 text-gray-400 shrink-0" />
                    <span>₹{worker.expectedDailyWage} / day</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <CalendarCheck className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className={status === 'ACTIVE' ? 'text-emerald-600 font-medium' : ''}>{statusLabels[status] || statusLabels.ACTIVE}</span>
                </div>
              </div>

              <div className="w-full flex flex-col gap-3">
                <button 
                  onClick={() => setIsHireModalOpen(true)}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <Briefcase className="w-4 h-4" />
                  Hire Worker
                </button>
                <button className="w-full py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm">
                  <MessageSquare className="w-4 h-4 text-gray-500" />
                  Send Message
                </button>
              </div>
            </div>

            {/* Agency info */}
            {agencyName && (
              <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex flex-col gap-2">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Associated Agency</h3>
                <div className="flex items-center gap-3 mt-1">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{agencyName}</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Main Content Area */}
          <div className="flex-1 w-full space-y-6">
            
            {/* Professional Overview */}
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm space-y-8">
              
              {/* About Section */}
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">About</h2>
                {worker.notes ? (
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{worker.notes}</p>
                ) : (
                  <p className="text-sm text-gray-500 italic">No description provided.</p>
                )}
              </div>

              <hr className="border-gray-100" />

              {/* Work Details & Stats */}
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Work Details</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Experience</p>
                    <p className="text-sm font-bold text-gray-900">{experience}</p>
                  </div>
                  {worker.joiningDate && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Member Since</p>
                      <p className="text-sm font-bold text-gray-900">{new Date(worker.joiningDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                    </div>
                  )}
                  {worker.gender && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Gender</p>
                      <p className="text-sm font-bold text-gray-900 capitalize">{worker.gender.toLowerCase()}</p>
                    </div>
                  )}
                  {worker.dateOfBirth && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Age</p>
                      <p className="text-sm font-bold text-gray-900">{new Date().getFullYear() - new Date(worker.dateOfBirth).getFullYear()} Years</p>
                    </div>
                  )}
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* Skills & Languages */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-sm font-bold text-gray-900 mb-3">Skills & Expertise</h2>
                  {allSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {allSkills.map((s, idx) => (
                        <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg">
                          {s}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No skills specified.</p>
                  )}
                </div>

                <div>
                  <h2 className="text-sm font-bold text-gray-900 mb-3">Languages</h2>
                  {languages.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {languages.map((l, idx) => (
                        <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg">
                          {l}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No languages specified.</p>
                  )}
                </div>
              </div>

            </div>

            {/* Client Reviews */}
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Work History & Reviews</h2>
              
              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-sm font-bold text-gray-900">
                            {review.reviewer?.companyName || `${review.reviewer?.user?.firstName || ''} ${review.reviewer?.user?.lastName || ''}`.trim() || 'Client'}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`} />
                              ))}
                            </div>
                            <span className="text-xs font-medium text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          </div>
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {review.comment}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6">
                  <p className="text-sm text-gray-500 italic">No reviews yet for this worker.</p>
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
        targetRate={worker.expectedDailyWage}
        targetBaseRate={worker.baseExpectedDailyWage}
        targetPlatformFee={worker.platformFee}
      />
    </div>
  );
}
