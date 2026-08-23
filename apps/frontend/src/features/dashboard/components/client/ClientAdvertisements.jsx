import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { advertisementsApi } from "../../../../api/advertisements.api";
import { ExternalLink, X, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

export default function ClientAdvertisements() {
  const [isVisible, setIsVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  // Auto-slide every 5 seconds if multiple ads exist
  useEffect(() => {
    if (ads.length <= 1 || !isVisible) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [ads.length, isVisible]);

  if (!isLoading && (isError || ads.length === 0)) return null;
  if (!isVisible) return null;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % ads.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + ads.length) % ads.length);
  };

  // Clean up URL if it's missing protocol
  const getValidUrl = (url) => {
    if (!url) return "#";
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://${url}`;
  };

  if (isLoading) {
    return (
      <div className="fixed bottom-6 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-pulse flex flex-col">
        <div className="h-32 bg-gray-100" />
        <div className="p-4 space-y-2">
          <div className="h-4 bg-gray-100 rounded w-3/4" />
          <div className="h-3 bg-gray-100 rounded w-full" />
          <div className="h-8 bg-gray-100 rounded-lg mt-3 w-1/3" />
        </div>
      </div>
    );
  }

  const activeAd = ads[currentIndex];
  if (!activeAd) return null;
  const hasImage = Boolean(activeAd.imageUrl);

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-gray-200 overflow-hidden animate-fade-in-up flex flex-col group/widget">
      
      {/* Close Button */}
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 z-20 p-1.5 bg-black/40 hover:bg-black/70 backdrop-blur-sm text-white rounded-full transition-colors cursor-pointer"
        aria-label="Close Advertisement"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {/* Header (optional small indicator) */}
      <div className="absolute top-2 left-2 z-20 flex items-center gap-1 px-2 py-1 bg-black/40 backdrop-blur-sm rounded-md">
        <Sparkles className="w-3 h-3 text-amber-400" />
        <span className="text-[10px] font-bold text-white tracking-wider uppercase">Sponsored</span>
      </div>

      {/* Image */}
      {hasImage ? (
        <div className="h-36 w-full overflow-hidden bg-gray-100 relative">
          <img
            src={activeAd.imageUrl}
            alt={activeAd.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/widget:scale-105"
            onError={(e) => { e.target.parentElement.style.display = 'none'; }}
          />
        </div>
      ) : (
        <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600 w-full" />
      )}

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 relative">
        <h3 className="text-sm font-bold text-gray-900 mb-1.5 truncate pr-4">{activeAd.title}</h3>
        {activeAd.description && (
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-3 mb-4 break-words">
            {activeAd.description}
          </p>
        )}
        
        <div className="flex items-center justify-between mt-auto">
          {/* Action Button */}
          {activeAd.linkUrl ? (
            <a
              href={getValidUrl(activeAd.linkUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white text-xs font-semibold rounded-lg transition-all duration-300 border border-blue-100 hover:border-transparent group/btn"
            >
              {activeAd.buttonText || "Learn More"}
              <ExternalLink className="w-3 h-3 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 transition-transform" />
            </a>
          ) : (
            <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg border border-gray-200">
              {activeAd.buttonText || "Learn More"}
            </span>
          )}

          {/* Pagination Controls */}
          {ads.length > 1 && (
            <div className="flex items-center gap-1.5">
              <button onClick={handlePrev} className="p-1 hover:bg-gray-100 text-gray-400 hover:text-gray-800 rounded transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="text-[10px] font-medium text-gray-400">
                {currentIndex + 1} / {ads.length}
              </div>
              <button onClick={handleNext} className="p-1 hover:bg-gray-100 text-gray-400 hover:text-gray-800 rounded transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
