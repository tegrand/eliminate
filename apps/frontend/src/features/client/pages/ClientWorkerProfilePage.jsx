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
  
  // Mock rating and reviews for a complete UI feel
  const mockRating = 4.8;
  const mockReviewCount = 24;
  const mockReviews = [
    { id: 1, author: "Rahul M.", text: "Very professional and completed the work on time. Highly recommended!", date: "2 weeks ago", rating: 5 },
    { id: 2, author: "Priya S.", text: "Good skills, but arrived a bit late. Overall satisfied with the quality of work.", date: "1 month ago", rating: 4 }
  ];

  const languages = worker.languages?.length > 0 ? worker.languages.map(l => l.language?.name).filter(Boolean) : ["Malayalam", "English (Basic)"];
  const allSkills = worker.skills?.length > 0 ? worker.skills.map(s => s.skill?.name).filter(Boolean) : [skillName, "Teamwork", "Time Management"];

  return (
    <div className="w-full h-[calc(100vh-4rem)] bg-[#f8f9fa] overflow-y-auto scrollbar-hide py-6 px-4 sm:px-8 lg:px-12 animate-fade-in">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Top Navigation */}
        <Link to="/search-workers" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
          <ArrowLeft className="w-4 h-4" />
          Back to Search
        </Link>

        {/* Profile Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-70 pointer-events-none"></div>

          <div className="relative z-10 flex flex-col sm:flex-row gap-6 sm:gap-8 items-start sm:items-center">
            
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-gray-100 border-4 border-white shadow-lg overflow-hidden flex items-center justify-center text-gray-400">
                {avatar ? (
                  <img src={avatar} alt={name} className="w-full h-full object-cover" />
                ) : (
                  <UserCircle className="w-16 h-16 sm:w-20 sm:h-20" />
                )}
              </div>
              {isVerified && (
                <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-md" title="Verified Worker">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight leading-tight">
                    {name}
                  </h1>
                  <p className="text-lg font-medium text-blue-600 mt-1">{skillName}</p>
                </div>
                
                <div className="flex items-center gap-3 shrink-0">
                  <button className="px-5 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Message
                  </button>
                  <button 
                    onClick={() => setIsHireModalOpen(true)}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm shadow-blue-200 transition-all flex items-center justify-center gap-2"
                  >
                    <Briefcase className="w-4 h-4" />
                    Hire Worker
                  </button>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1.5 font-medium">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-gray-900">{mockRating}</span>
                  <span className="text-gray-500">({mockReviewCount} reviews)</span>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-gray-300 hidden sm:block"></div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  {location}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Main Info Column */}
          <div className="md:col-span-2 space-y-6">
            
            {/* About / Overview */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Professional Overview</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <Briefcase className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Experience</span>
                  </div>
                  <p className="font-semibold text-gray-900">{experience}</p>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <CalendarCheck className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Availability</span>
                  </div>
                  <p className="font-semibold text-emerald-600">Available Now</p>
                </div>
              </div>

              {worker.notes && (
                <div className="prose prose-sm max-w-none text-gray-600">
                  <p>{worker.notes}</p>
                </div>
              )}
            </div>

            {/* Reviews (Mocked) */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Client Reviews</h2>
                <div className="text-sm font-bold text-blue-600 cursor-pointer hover:underline">View all</div>
              </div>
              
              <div className="space-y-5">
                {mockReviews.map(review => (
                  <div key={review.id} className="border-b border-gray-100 last:border-0 pb-5 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{review.author}</h4>
                      <span className="text-xs text-gray-400">{review.date}</span>
                    </div>
                    <div className="flex items-center gap-0.5 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`} />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">{review.text}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar Info Column */}
          <div className="space-y-6">
            
            {/* Verified Badge */}
            {isVerified && (
              <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-emerald-900 text-sm">Verified Profile</h3>
                  <p className="text-xs text-emerald-700 mt-1">Identity and documents have been reviewed and approved.</p>
                </div>
              </div>
            )}

            {/* Agency info */}
            {agencyName && (
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gray-400" /> Current Agency
                </h3>
                <p className="text-sm font-semibold text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  {agencyName}
                </p>
              </div>
            )}

            {/* Skills */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-gray-400" /> Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {allSkills.map((s, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700 text-xs font-semibold rounded-lg">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Languages className="w-4 h-4 text-gray-400" /> Languages
              </h3>
              <div className="flex flex-wrap gap-2">
                {languages.map((l, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 text-xs font-semibold rounded-lg">
                    {l}
                  </span>
                ))}
              </div>
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
