import { Star, ChevronRight, MapPin, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function ClientFavouriteWorkers({ workers = [] }) {
  const { t } = useTranslation();
  // Use mock data if API doesn't provide
  const displayWorkers = workers?.length > 0 ? workers : [
    { id: 1, name: "Rahul Sharma", role: "Electrician", location: "Kochi, Kerala", rating: 4.8, jobs: 12, image: "https://i.pravatar.cc/150?u=1" },
    { id: 2, name: "Sneha Nair", role: "Catering Staff", location: "Trivandrum", rating: 4.9, jobs: 8, image: "https://i.pravatar.cc/150?u=2" },
    { id: 3, name: "Mohammed Ali", role: "Plumber", location: "Kozhikode", rating: 4.7, jobs: 15, image: "https://i.pravatar.cc/150?u=3" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col h-full">
      <div className="p-5 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            {t('clientDashboard.favouriteWorkers')}
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">{t('clientDashboard.trustedProfessionals')}</p>
        </div>
        <button className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
          {t('clientDashboard.viewAllLower')} <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 flex-1 flex flex-col gap-4">
        {displayWorkers.map((worker) => (
          <div key={worker.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group">
            <img src={worker.image} alt={worker.name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
            
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-gray-900 truncate">{worker.name}</h3>
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5 text-gray-400" />{worker.role}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-gray-400" />{worker.location}</span>
              </div>
            </div>

            <div className="text-right shrink-0 flex flex-col items-end gap-2">
              <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full text-xs font-medium text-amber-700">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> {worker.rating}
              </div>
              <button className="text-xs font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                {t('clientDashboard.request')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
