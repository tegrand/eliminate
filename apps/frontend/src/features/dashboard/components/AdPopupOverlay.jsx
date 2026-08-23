import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { X, ChevronRight, ChevronLeft, ExternalLink, Megaphone } from "lucide-react";
import { advertisementsApi } from "../../../api/advertisements.api";

export default function AdPopupOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  
  const AD_DURATION_MS = 5000; // 5 seconds per ad

  // Only fetch active ads (the endpoint automatically filters for isActive=true)
  const { data: ads = [], isLoading } = useQuery({
    queryKey: ["activeAdsPopup"],
    queryFn: async () => {
      const res = await advertisementsApi.getActive();
      return res.data || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  // Open popup if there are ads and we haven't seen them yet this session
  useEffect(() => {
    if (ads.length > 0 && !sessionStorage.getItem("ads_shown_this_session")) {
      // Small delay for better UX
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem("ads_shown_this_session", "true");
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [ads]);

  // Handle auto-advance and progress bar
  useEffect(() => {
    if (!isOpen || ads.length === 0) return;

    const intervalTime = 50; // Update progress every 50ms
    const step = (intervalTime / AD_DURATION_MS) * 100;

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Time to move to next ad
          handleNext();
          return 0; // Reset progress
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
      // Reached the end, close the modal
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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-500">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 flex flex-col md:flex-row min-h-[400px]">
        
        {/* Progress bar at the top */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-100 z-20">
          <div 
            className="h-full bg-indigo-600 transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 p-2 bg-black/10 hover:bg-black/20 text-slate-700 hover:text-black backdrop-blur-md rounded-full transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image Section */}
        <div className="w-full md:w-1/2 bg-slate-50 relative flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-slate-100 min-h-[250px]">
          {currentAd.imageUrl ? (
             <img 
               src={currentAd.imageUrl} 
               alt={currentAd.title} 
               className="w-full h-full object-cover rounded-2xl shadow-sm"
               onError={(e) => { e.target.style.display = 'none'; }}
             />
          ) : (
            <div className="w-24 h-24 rounded-full bg-indigo-50 flex items-center justify-center shadow-inner">
               <Megaphone className="w-12 h-12 text-indigo-300" />
            </div>
          )}
          
          {/* Ad Counter Badge */}
          <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/40 backdrop-blur-md text-white text-xs font-bold rounded-full">
            Ad {currentIndex + 1} of {ads.length}
          </div>
        </div>

        {/* Content Section */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-extrabold uppercase tracking-widest mb-6 w-fit">
            <Megaphone className="w-3.5 h-3.5" /> Featured Sponsor
          </div>
          
          <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight mb-4">
            {currentAd.title}
          </h2>
          
          {currentAd.description && (
            <p className="text-base font-medium text-slate-500 leading-relaxed mb-8 line-clamp-4">
              {currentAd.description}
            </p>
          )}

          <div className="mt-auto pt-6 flex flex-col sm:flex-row items-center gap-4 w-full">
            {currentAd.linkUrl ? (
              <a 
                href={currentAd.linkUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all hover:-translate-y-0.5 active:translate-y-0 w-full"
              >
                {currentAd.buttonText || "Learn More"} <ExternalLink className="w-4 h-4" />
              </a>
            ) : (
              <button 
                onClick={handleClose}
                className="flex-1 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all hover:-translate-y-0.5 active:translate-y-0 w-full"
              >
                Continue to Dashboard
              </button>
            )}

            {ads.length > 1 && (
              <div className="flex items-center gap-2">
                <button 
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="p-3.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:hover:bg-slate-100 text-slate-600 rounded-xl transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={handleNext}
                  className="p-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
