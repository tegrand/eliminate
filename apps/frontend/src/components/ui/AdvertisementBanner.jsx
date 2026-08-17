import React, { useEffect, useState } from 'react';
import { useAdContext } from '../../contexts/AdContext';
import { useAuth } from '../../hooks/useAuth';
import { X } from 'lucide-react';

export default function AdvertisementBanner({ slotName, className = "" }) {
  const { requestAd, releaseAd, getAdForSlot, isLoading } = useAdContext();
  const { user } = useAuth();
  const ad = getAdForSlot(slotName);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (user?.profileType !== 'CLIENT') return;
    
    // Request an ad for this slot on mount
    requestAd(slotName);
    
    // Release the ad when this component is unmounted
    return () => {
      releaseAd(slotName);
    };
  }, [slotName, requestAd, releaseAd, user?.profileType]);

  if (isLoading || !ad || user?.profileType !== 'CLIENT' || !isVisible) {
    return null; 
  }

  const adLink = ad.linkUrl && (ad.linkUrl.startsWith('http') ? ad.linkUrl : `https://${ad.linkUrl}`);

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md p-4 animate-fade-in ${className}`}>
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Close Button */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            setIsVisible(false);
          }}
          className="absolute top-3 right-3 z-10 p-2 bg-white/80 hover:bg-white rounded-full text-gray-500 hover:text-gray-900 transition-colors shadow-sm backdrop-blur-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {adLink ? (
          <a href={adLink} target="_blank" rel="noopener noreferrer" className="flex flex-col group">
            {/* Image */}
            {ad.imageUrl && (
              <div className="w-full h-64 bg-gray-100 flex items-center justify-center overflow-hidden">
                <img 
                  src={ad.imageUrl.startsWith('http') ? ad.imageUrl : `http://localhost:5000${ad.imageUrl.startsWith('/') ? '' : '/'}${ad.imageUrl}`} 
                  alt={ad.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
              </div>
            )}
            
            {/* Content */}
            <div className="p-6 flex flex-col">
              <span className="text-xs uppercase tracking-wider font-bold text-indigo-500 mb-2">Sponsored</span>
              <h4 className="text-xl font-bold text-gray-900 leading-tight mb-2 group-hover:text-indigo-600 transition-colors">
                {ad.title}
              </h4>
              {ad.description && (
                <p className="text-sm text-gray-600 line-clamp-3">
                  {ad.description}
                </p>
              )}
              <div className="mt-6 flex items-center justify-center w-full py-3 bg-indigo-50 text-indigo-700 font-semibold rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                Learn More
              </div>
            </div>
          </a>
        ) : (
          <div className="flex flex-col">
            {/* Image */}
            {ad.imageUrl && (
              <div className="w-full h-64 bg-gray-100 flex items-center justify-center overflow-hidden">
                <img 
                  src={ad.imageUrl.startsWith('http') ? ad.imageUrl : `http://localhost:5000${ad.imageUrl.startsWith('/') ? '' : '/'}${ad.imageUrl}`} 
                  alt={ad.title} 
                  className="w-full h-full object-cover" 
                />
              </div>
            )}
            
            {/* Content */}
            <div className="p-6 flex flex-col">
              <span className="text-xs uppercase tracking-wider font-bold text-indigo-500 mb-2">Sponsored</span>
              <h4 className="text-xl font-bold text-gray-900 leading-tight mb-2">
                {ad.title}
              </h4>
              {ad.description && (
                <p className="text-sm text-gray-600 line-clamp-3">
                  {ad.description}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
