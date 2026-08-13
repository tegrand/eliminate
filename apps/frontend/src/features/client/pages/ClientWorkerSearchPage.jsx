import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Users, Loader2, Filter, X } from "lucide-react";
import WorkerSearchFilters from "../components/WorkerSearchFilters";
import WorkerSearchCard from "../components/WorkerSearchCard";
import { workerApi } from "../../worker/api/worker.api";

const DEFAULT_FILTERS = {
  search: "",
  skill: "",
  location: "",
  minExperience: "",
  maxExperience: "",
  verifiedOnly: false,
  availableOnly: false,
};

export default function ClientWorkerSearchPage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Fetch all workers (backend will return paginated, we just use items for this UI demo)
  const { data, isLoading, error } = useQuery({
    queryKey: ["allWorkersForSearch"],
    queryFn: async () => {
      const res = await workerApi.getWorkers({ limit: 100 }); 
      return res.data?.items || res.data?.workers || [];
    },
  });

  const workers = data || [];

  // Client-side filtering logic based on UI state
  const filteredWorkers = useMemo(() => {
    return workers.filter((worker) => {
      // Basic normalization
      const firstName = worker.user?.firstName || worker.firstName || "";
      const lastName = worker.user?.lastName || worker.lastName || "";
      const name = `${firstName} ${lastName}`.trim() || worker.user?.name || worker.name || "Unknown";
      
      const skill = worker.primarySkill?.name || (typeof worker.primarySkill === 'string' ? worker.primarySkill : "") || worker.skills?.[0]?.name || "";
      const experience = worker.experienceYears || 0;
      const isAgency = !!(worker.agency || worker.agencyProfile);
      
      let locationStr = "";
      if (worker.city && worker.state) locationStr = `${worker.city}, ${worker.state}`;
      else if (worker.city) locationStr = worker.city;
      else if (worker.state) locationStr = worker.state;

      const isVerified = worker.profileStatus === "APPROVED";
      // Availability mock: assuming ACTIVE employment status means available
      const isAvailable = worker.employmentStatus === "ACTIVE"; 

      // 1. Search (Name match)
      if (filters.search && !name.toLowerCase().includes(filters.search.toLowerCase())) return false;
      
      // 2. Skill Match
      if (filters.skill && skill !== filters.skill) return false;
      
      // 3. Location Match
      if (filters.location && locationStr !== filters.location) return false;
      
      // 4. Experience Range
      if (filters.minExperience && experience < parseInt(filters.minExperience, 10)) return false;
      if (filters.maxExperience && experience > parseInt(filters.maxExperience, 10)) return false;

      // 5. Verification
      if (filters.verifiedOnly && !isVerified) return false;
      
      // 6. Availability
      if (filters.availableOnly && !isAvailable) return false;

      // 7. Only show independent workers
      if (isAgency) return false;

      // Note: Category filter is omitted from logic since we are relying on primarySkill string in this basic implementation, but it can be expanded if category ID is available on worker.
      
      return true;
    });
  }, [workers, filters]);

  return (
    <div className="w-full flex flex-col animate-fade-in h-[calc(100vh-4rem)] overflow-y-auto scrollbar-hide">
          
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2.5">
          <Users className="w-6 h-6 text-blue-600" />
          Workforce Search
        </h1>
        <p className="text-sm text-gray-500 mt-1.5 max-w-2xl">
          Discover and hire the best independent workers or agency talent for your requirements.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start relative">
        
        {/* Results Grid */}
        <div className="flex-1 min-w-0 w-full">
              
              {/* Results count bar */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-3 mb-6 flex flex-wrap items-center justify-between gap-4">
                <p className="text-sm font-medium text-gray-700">
                  Showing <span className="font-bold text-gray-900">{filteredWorkers.length}</span> worker{filteredWorkers.length !== 1 ? 's' : ''}
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsFilterModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-sm font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                  >
                    <Filter className="w-4 h-4" />
                    Filters
                  </button>
                  <div className="flex items-center gap-2 text-sm text-gray-500 border-l border-gray-200 pl-3">
                    <span>Sort by:</span>
                    <select className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all font-medium text-gray-700">
                      <option>Recommended</option>
                      <option>Experience: High to Low</option>
                      <option>Recently Added</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Grid */}
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 border-dashed">
                  <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                  <p className="text-sm font-medium text-gray-500 mt-4">Finding the best talent...</p>
                </div>
              ) : error ? (
                <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 text-center text-sm font-medium">
                  Failed to load workers. Please try again.
                </div>
              ) : filteredWorkers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-gray-200 shadow-sm text-center px-4">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <Users className="w-8 h-8 text-gray-300" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">No workers found</h3>
                  <p className="text-sm text-gray-500 mt-1 max-w-sm">Try adjusting your filters or search terms to find more candidates.</p>
                  <button 
                    onClick={() => setFilters(DEFAULT_FILTERS)}
                    className="mt-6 px-6 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl text-sm font-semibold transition-colors shadow-sm hover:shadow"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5 pb-10">
                  {filteredWorkers.map(worker => (
                    <WorkerSearchCard key={worker.id} worker={worker} />
                  ))}
                </div>
              )}

            </div>
          </div>
          
      {/* Filter Modal */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="relative w-full max-w-sm">
            <button 
              onClick={() => setIsFilterModalOpen(false)}
              className="absolute -top-3 -right-3 z-10 p-1.5 bg-white rounded-full shadow-md text-gray-500 hover:text-gray-700 border border-gray-200"
            >
              <X className="w-4 h-4" />
            </button>
            <WorkerSearchFilters 
              filters={filters} 
              setFilters={setFilters} 
              onClear={() => setFilters(DEFAULT_FILTERS)} 
              workers={workers}
            />
          </div>
        </div>
      )}
        </div>
  );
}
