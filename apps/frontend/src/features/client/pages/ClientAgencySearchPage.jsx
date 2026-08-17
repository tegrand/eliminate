import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Building2, Filter, X } from "lucide-react";
import { agencyApi } from "../../agency/api/agency.api";
import AgencySearchFilters from "../components/AgencySearchFilters";
import AgencySearchCard from "../components/AgencySearchCard";

export default function ClientAgencySearchPage() {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    skill: "",
    verifiedOnly: false,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["allAgenciesForSearch"],
    queryFn: async () => {
      const res = await agencyApi.getAgencies({ limit: 100 }); 
      return res.data?.items || res.data?.agencies || [];
    },
  });

  // Client-side filtering logic
  const filteredAgencies = useMemo(() => {
    if (!data) return [];
    return data.filter(agency => {
      // Search by agency name
      if (filters.search && !agency.companyName?.toLowerCase().includes(filters.search.toLowerCase())) return false;
      // Location
      if (filters.location && !agency.address?.toLowerCase().includes(filters.location.toLowerCase()) && !agency.location?.toLowerCase().includes(filters.location.toLowerCase())) return false;
      // Verified only
      if (filters.verifiedOnly && agency.verificationStatus !== "VERIFIED") return false;
      
      return true;
    });
  }, [data, filters]);

  const handleClearFilters = () => {
    setFilters({
      search: "",
      location: "",
      skill: "",
      verifiedOnly: false,
    });
  };

  return (
    <div className="w-full flex flex-col animate-fade-in h-[calc(100vh-4rem)] overflow-y-auto scrollbar-hide">
          
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2.5">
          <Building2 className="w-6 h-6 text-blue-600" />
          Agencies Search
        </h1>
        <p className="text-sm text-gray-500 mt-1.5 max-w-2xl">
          Discover and collaborate with the best verified agencies.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start relative">
        
        {/* Main Content Area */}
        <div className="flex-1 w-full min-w-0">
          {/* Header Controls */}
          <div className="flex items-center mb-6 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-sm font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 flex items-center justify-center text-sm font-medium">
              Failed to load agencies. Please try again.
            </div>
          )}

          {/* Loading State */}
          {isLoading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm animate-pulse h-40">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
                    <div className="flex-1 space-y-3 mt-2">
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Agency Grid */}
          {!isLoading && !error && filteredAgencies.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredAgencies.map((agency) => (
                <AgencySearchCard key={agency.id} agency={agency} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && filteredAgencies.length === 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center flex flex-col items-center justify-center shadow-sm">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Building2 className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">No agencies found</h3>
              <p className="text-sm text-gray-500 max-w-sm mb-6">
                Try adjusting your filters or search terms to find what you're looking for.
              </p>
              <button 
                onClick={handleClearFilters}
                className="px-5 py-2.5 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 text-sm font-semibold rounded-xl transition-colors"
              >
                Clear all filters
              </button>
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
            <AgencySearchFilters 
              filters={filters} 
              setFilters={setFilters} 
              onClear={handleClearFilters}
            />
          </div>
        </div>
      )}
    </div>
  );
}
