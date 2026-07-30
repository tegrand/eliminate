import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Building2 } from "lucide-react";
import { agencyApi } from "../../agency/api/agency.api";
import AgencySearchFilters from "../components/AgencySearchFilters";
import AgencySearchCard from "../components/AgencySearchCard";

export default function ClientAgencySearchPage() {
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
        
        {/* Sidebar Filters */}
        <div className="w-full lg:w-72 shrink-0">
          <AgencySearchFilters 
            filters={filters} 
            setFilters={setFilters} 
            onClear={handleClearFilters}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 w-full min-w-0">
          {/* Header Controls */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-3 mb-6 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm font-medium text-gray-700">
              Showing <span className="font-bold text-gray-900">{filteredAgencies.length}</span> agenc{filteredAgencies.length !== 1 ? 'ies' : 'y'}
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Sort by:</span>
              <select className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all font-medium text-gray-700">
                <option>Recommended</option>
                <option>Highest Rated</option>
                <option>Newest</option>
              </select>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 flex items-center justify-center text-sm font-medium">
              Failed to load agencies. Please try again.
            </div>
          )}

          {/* Loading State */}
          {isLoading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5 pb-10">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm animate-pulse h-40">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                    <div className="flex-1 space-y-3 mt-1">
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
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5 pb-10">
              {filteredAgencies.map((agency) => (
                <AgencySearchCard key={agency.id} agency={agency} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && filteredAgencies.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-gray-200 shadow-sm text-center px-4">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Building2 className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">No agencies found</h3>
              <p className="text-sm text-gray-500 mt-1 max-w-sm">Try adjusting your filters or search terms to find more candidates.</p>
              <button 
                onClick={handleClearFilters}
                className="mt-6 px-6 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl text-sm font-semibold transition-colors shadow-sm hover:shadow"
              >
                Clear All Filters
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
