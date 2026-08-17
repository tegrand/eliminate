import { MapPin, Briefcase, CheckCircle2, XCircle, User } from "lucide-react";
import { Link } from "react-router-dom";

export default function WorkerSearchCard({ worker }) {

  // Normalize fields
  const firstName = worker.user?.firstName || worker.firstName || "";
  const lastName = worker.user?.lastName || worker.lastName || "";
  const name = `${firstName} ${lastName}`.trim() || worker.user?.name || worker.name || "Unknown";

  const skill = worker.primarySkill?.name || (typeof worker.primarySkill === 'string' ? worker.primarySkill : null) || worker.skills?.[0]?.name || "General Worker";
  const experience = worker.totalExperienceYears != null ? `${worker.totalExperienceYears} yrs exp.` : "Experience N/A";

  let location = "Location not specified";
  if (worker.district && worker.state) location = `${worker.district}, ${worker.state}`;
  else if (worker.district) location = worker.district;
  else if (worker.city && worker.state) location = `${worker.city}, ${worker.state}`;
  else if (worker.city) location = worker.city;
  else if (worker.state) location = worker.state;

  const isVerified = worker.profileStatus === "APPROVED";
  const isAgency = !!(worker.agency || worker.agencyProfile);
  const avatar = worker.user?.avatar || worker.profilePhoto;
  const initials = name !== "Unknown" ? name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() : "W";

  // Rating removed

  // Tag pills: skill + agency/independent
  const tags = [
    { label: skill },
    { label: isAgency ? "Agency Worker" : "Independent" },
  ];

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all group relative max-w-[550px]">
      <div className="flex flex-col sm:flex-row gap-3.5 sm:gap-5 items-start sm:items-center">

        {/* Avatar */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 text-indigo-600 font-bold text-lg">
          {avatar ? (
            <img src={avatar.startsWith('http') || avatar.startsWith('data:') ? avatar : `http://localhost:5000${avatar.startsWith('/') ? '' : '/'}${avatar}`} alt={name} className="w-full h-full object-cover rounded-xl" />
          ) : initials}
        </div>

        <div className="flex-1 min-w-0 w-full">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate pr-2">
              {name}
            </h3>

            {/* Verified / Unverified Badge */}
            <div className="flex items-center gap-2 shrink-0">
              {isVerified ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50 text-gray-600 text-xs font-semibold border border-gray-200">
                  <XCircle className="w-3.5 h-3.5" />
                  Unverified
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-gray-500 mt-2">

            {/* Location */}
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="truncate max-w-[150px]">{location}</span>
            </div>

            <div className="w-1 h-1 rounded-full bg-gray-300 hidden sm:block"></div>

            <div className="flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-gray-400" />
              <span>{experience}</span>
            </div>
          </div>

          {/* Skill + Type tags */}
          <div className="mt-2.5 sm:mt-4 flex flex-wrap gap-2">
            <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg">
              {skill}
            </span>
            <span className={`px-2.5 py-1 text-xs font-medium rounded-lg ${isAgency ? "bg-purple-50 text-purple-600" : "bg-orange-50 text-orange-600"}`}>
              {isAgency ? "Agency Worker" : "Independent"}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2.5 sm:gap-3 mt-4 sm:mt-5 w-full">
        <Link
          to={`/search-workers/${worker.id}`}
          className="flex-1 py-2.5 text-center bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          View Profile
        </Link>
        <a
          href={`tel:${worker.user?.phone || worker.phone || ''}`}
          className="flex-1 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 shadow-sm shadow-blue-200 transition-colors flex items-center justify-center gap-2"
        >
          <User className="w-4 h-4" />
          Call Now
        </a>
      </div>

    </div>
  );
}
