import { Building2, ChevronRight, Users, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function ClientFavouriteAgencies({ agencies = [] }) {
  // Use mock data if API doesn't provide
  const displayAgencies = agencies?.length > 0 ? agencies : [
    { id: 1, name: "Alpha Staffing", rating: 4.9, activeWorkers: 24, completed: 156, logo: "A" },
    { id: 2, name: "Kerala Workforce", rating: 4.8, activeWorkers: 18, completed: 98, logo: "K" },
    { id: 3, name: "Prime Builders Network", rating: 4.7, activeWorkers: 12, completed: 45, logo: "P" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col h-full">
      <div className="p-5 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-500" />
            Favourite Agencies
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">Your top rated staffing partners</p>
        </div>
        <button className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
          View all <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 flex-1 flex flex-col gap-4">
        {displayAgencies.map((agency) => (
          <div key={agency.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-lg border border-indigo-100/50 shadow-sm shrink-0">
              {agency.logo}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-gray-900 truncate">{agency.name}</h3>
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-gray-400" />{agency.activeWorkers} Workers</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />{agency.completed} Jobs</span>
              </div>
            </div>

            <div className="text-right shrink-0 flex flex-col items-end gap-2">
              <div className="flex items-center gap-1 bg-indigo-50 px-2 py-0.5 rounded-full text-xs font-medium text-indigo-700">
                ★ {agency.rating}
              </div>
              <button className="text-xs font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                Post Job
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
