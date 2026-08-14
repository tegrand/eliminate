import { useQuery } from "@tanstack/react-query";
import { advertisementsApi } from "../../../../api/advertisements.api";
import { ExternalLink, Sparkles } from "lucide-react";

// Skeleton loader for a single ad card
function AdCardSkeleton() {
  return (
    <div className="flex-shrink-0 w-[300px] sm:w-[380px] bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="h-44 bg-gray-100" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-gray-100 rounded w-3/4" />
        <div className="h-3.5 bg-gray-100 rounded w-full" />
        <div className="h-3.5 bg-gray-100 rounded w-2/3" />
        <div className="h-9 bg-gray-100 rounded-xl mt-4 w-1/3" />
      </div>
    </div>
  );
}

// Single Ad Card
function AdCard({ ad }) {
  const hasImage = Boolean(ad.imageUrl);
  
  // Clean up URL if it's missing protocol
  const getValidUrl = (url) => {
    if (!url) return "#";
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://${url}`;
  };

  return (
    <div className="flex-shrink-0 w-[300px] sm:w-[380px] bg-white rounded-3xl border border-gray-200/60 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 overflow-hidden group flex flex-col h-full">
      {/* Image Container */}
      {hasImage ? (
        <div className="h-44 w-full overflow-hidden bg-gray-100 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <img
            src={ad.imageUrl}
            alt={ad.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            onError={(e) => { e.target.parentElement.style.display = 'none'; }}
          />
        </div>
      ) : (
        <div className="h-3 bg-gradient-to-r from-blue-500 to-indigo-600 w-full" />
      )}

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-base font-bold text-gray-900 mb-2 truncate group-hover:text-blue-600 transition-colors">{ad.title}</h3>
        {ad.description && (
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-5 break-words flex-1">
            {ad.description}
          </p>
        )}
        
        <div className="mt-auto pt-2">
          {ad.linkUrl ? (
            <a
              href={getValidUrl(ad.linkUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white text-sm font-semibold rounded-xl transition-all duration-300 w-full sm:w-auto border border-blue-100 hover:border-transparent group/btn"
            >
              {ad.buttonText || "Learn More"}
              <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
            </a>
          ) : (
            <span className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-50 text-gray-700 text-sm font-semibold rounded-xl w-full sm:w-auto border border-gray-200">
              {ad.buttonText || "Learn More"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ClientAdvertisements() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["clientAdvertisements"],
    queryFn: async () => {
      const res = await advertisementsApi.getActive();
      return res.data || [];
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const ads = data || [];

  if (!isLoading && (isError || ads.length === 0)) return null;

  return (
    <div className="w-full mt-8 animate-fade-in">
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-5 px-1">
        <Sparkles className="w-5 h-5 text-amber-500" />
        <h2 className="text-lg font-bold text-gray-900 tracking-tight">Featured Partners & Services</h2>
      </div>

      {/* Horizontal Scrollable Strip with padding for shadows */}
      <div className="flex gap-6 overflow-x-auto pb-6 pt-2 px-1 scrollbar-hide snap-x snap-mandatory -mx-1">
        {isLoading ? (
          <>
            <AdCardSkeleton />
            <AdCardSkeleton />
            <AdCardSkeleton />
          </>
        ) : (
          ads.map((ad) => (
            <div key={ad.id} className="snap-start flex items-stretch">
              <AdCard ad={ad} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
