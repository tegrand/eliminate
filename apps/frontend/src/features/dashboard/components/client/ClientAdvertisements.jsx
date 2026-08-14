import { useQuery } from "@tanstack/react-query";
import { advertisementsApi } from "../../../../api/advertisements.api";
import { ExternalLink, ChevronRight } from "lucide-react";

// Skeleton loader for a single ad card
function AdCardSkeleton() {
  return (
    <div className="flex-shrink-0 w-[280px] sm:w-[320px] bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="h-36 bg-gray-100" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-100 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-2/3" />
        <div className="h-8 bg-gray-100 rounded-lg mt-3 w-1/3" />
      </div>
    </div>
  );
}

// Single Ad Card
function AdCard({ ad }) {
  const hasImage = Boolean(ad.imageUrl);

  return (
    <div className="flex-shrink-0 w-[280px] sm:w-[320px] bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden group">
      {/* Image */}
      {hasImage && (
        <div className="h-36 overflow-hidden bg-gray-50">
          <img
            src={ad.imageUrl}
            alt={ad.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => { e.target.parentElement.style.display = 'none'; }}
          />
        </div>
      )}

      {/* Content */}
      <div className={`p-4 ${!hasImage ? "pt-5" : ""}`}>
        <h3 className="text-sm font-semibold text-gray-900 mb-1 truncate">{ad.title}</h3>
        {ad.description && (
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">{ad.description}</p>
        )}
        {ad.linkUrl ? (
          <a
            href={ad.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            {ad.buttonText || "Learn More"}
            <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-lg">
            {ad.buttonText || "Learn More"}
          </span>
        )}
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
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });

  const ads = data || [];

  // Don't render anything if no ads and not loading (no empty state for clients)
  if (!isLoading && (isError || ads.length === 0)) return null;

  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Featured Partners & Services</p>
      </div>

      {/* Horizontal Scrollable Strip */}
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
        {isLoading ? (
          <>
            <AdCardSkeleton />
            <AdCardSkeleton />
            <AdCardSkeleton />
          </>
        ) : (
          ads.map((ad) => (
            <div key={ad.id} className="snap-start">
              <AdCard ad={ad} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
