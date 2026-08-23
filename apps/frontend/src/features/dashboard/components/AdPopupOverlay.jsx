import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { X, ChevronRight, ChevronLeft, ExternalLink, Megaphone, Sparkles } from "lucide-react";
import { advertisementsApi } from "../../../api/advertisements.api";

export default function AdPopupOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  
  const AD_DURATION_MS = 5000;

  const { data: ads = [], isLoading } = useQuery({
    queryKey: ["activeAdsPopup"],
    queryFn: async () => {
      const res = await advertisementsApi.getActive();
      return res.data || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (ads.length > 0 && !sessionStorage.getItem("ads_shown_this_session")) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem("ads_shown_this_session", "true");
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [ads]);

  useEffect(() => {
    if (!isOpen || ads.length === 0) return;

    const intervalTime = 50;
    const step = (intervalTime / AD_DURATION_MS) * 100;

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(progressTimer);
  }, [isOpen, currentIndex, ads.length]);

  const handleNext = () => {
    if (currentIndex < ads.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setProgress(0);
    } else {
      setIsOpen(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setProgress(0);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen || isLoading || ads.length === 0) return null;

  const currentAd = ads[currentIndex];

  const getValidUrl = (url) => {
    if (!url) return "#";
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://${url}`;
  };

  return (
    <div 
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-fade-in"
      style={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
    >
      <div className="relative w-full max-w-md sm:max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col animate-scale-up">
        
        {/* Top Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100 z-30">
          <div 
            className="h-full bg-violet-600 transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Floating Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-600 hover:text-slate-900 shadow-md flex items-center justify-center transition-all cursor-pointer border border-slate-100"
          aria-label="Close Advertisement"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Floating Sponsored Badge */}
        <div className="absolute top-3 left-3 z-30 px-2.5 py-1 bg-slate-900/70 backdrop-blur-md text-white text-[10px] font-extrabold tracking-wider uppercase rounded-full flex items-center gap-1 border border-white/20">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Sponsored</span>
        </div>

        {/* 16:9 Widescreen Image Banner Container */}
        <div className="w-full aspect-[16/9] bg-slate-100 relative overflow-hidden flex items-center justify-center shrink-0 border-b border-slate-100">
          {currentAd.imageUrl ? (
            <img 
              src={currentAd.imageUrl} 
              alt={currentAd.title} 
              className="w-full h-full object-cover"
              onError={(e) => { e.target.parentElement.style.display = 'none'; }}
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-violet-50 text-violet-500 flex items-center justify-center shadow-inner">
              <Megaphone className="w-8 h-8" />
            </div>
          )}

          {/* Ad Counter Badge */}
          {ads.length > 1 && (
            <div className="absolute bottom-2.5 right-3 px-2.5 py-0.5 bg-slate-900/60 backdrop-blur-sm text-white text-[10px] font-bold rounded-full border border-white/10">
              {currentIndex + 1} / {ads.length}
            </div>
          )}
        </div>

        {/* Body Content Section */}
        <div className="p-5 sm:p-6 flex flex-col justify-between flex-1 space-y-3">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight mb-1.5">
              {currentAd.title}
            </h3>

            {currentAd.description && (
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed line-clamp-3">
                {currentAd.description}
              </p>
            )}
          </div>

          {/* Action CTA Button */}
          <div className="pt-2 space-y-2">
            {currentAd.linkUrl ? (
              <a 
                href={getValidUrl(currentAd.linkUrl)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full py-3 bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{currentAd.buttonText || "Learn More"}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            ) : (
              <button 
                onClick={handleClose}
                className="w-full py-3 bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{currentAd.buttonText || "Learn More"}</span>
              </button>
            )}

            {/* Pagination Controls */}
            {ads.length > 1 && (
              <div className="flex items-center justify-between pt-1 text-xs font-semibold text-slate-400">
                <button 
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="flex items-center gap-1 hover:text-slate-700 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>
                <button 
                  onClick={handleNext}
                  className="flex items-center gap-1 hover:text-slate-700 transition-colors cursor-pointer"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
