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
    <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-84 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-fade-in-up flex flex-col group/widget font-sans">
      
      {/* Floating Close Button */}
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute top-3 right-3 z-20 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-slate-600 hover:text-slate-900 shadow-md flex items-center justify-center transition-all cursor-pointer border border-slate-100"
        aria-label="Close Advertisement"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {/* Sponsored Badge */}
      <div className="absolute top-3 left-3 z-20 px-2 py-0.5 bg-slate-900/70 backdrop-blur-md text-white text-[9px] font-extrabold tracking-wider uppercase rounded-full flex items-center gap-1 border border-white/20">
        <Sparkles className="w-3 h-3 text-amber-400" />
        <span>Sponsored</span>
      </div>

      {/* Image Banner */}
      {hasImage ? (
        <div className="h-36 w-full overflow-hidden bg-slate-100 relative shrink-0">
          <img
            src={activeAd.imageUrl}
            alt={activeAd.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/widget:scale-105"
            onError={(e) => { e.target.parentElement.style.display = 'none'; }}
          />
        </div>
      ) : (
        <div className="h-1.5 bg-violet-600 w-full" />
      )}

      {/* Content Body */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 relative space-y-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 leading-tight mb-1 truncate pr-2">{activeAd.title}</h3>
          {activeAd.description && (
            <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-3 break-words">
              {activeAd.description}
            </p>
          )}
        </div>
        
        <div className="flex items-center justify-between pt-1 mt-auto gap-2">
          {/* Action CTA Button */}
          {activeAd.linkUrl ? (
            <a
              href={getValidUrl(activeAd.linkUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs group/btn cursor-pointer"
            >
              <span>{activeAd.buttonText || "Learn More"}</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 transition-transform" />
            </a>
          ) : (
            <button 
              onClick={() => setIsVisible(false)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <span>{activeAd.buttonText || "Learn More"}</span>
            </button>
          )}

          {/* Pagination Controls */}
          {ads.length > 1 && (
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={handlePrev} className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer">
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-bold text-slate-400">
                {currentIndex + 1}/{ads.length}
              </span>
              <button onClick={handleNext} className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
