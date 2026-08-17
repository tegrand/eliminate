import React, { useEffect } from 'react';
import { useAdContext } from '../../contexts/AdContext';
import { useAuth } from '../../hooks/useAuth';

export default function AdvertisementBanner({ slotName, className = "", variant = "standard" }) {
  const { requestAd, releaseAd, getAdForSlot, isLoading } = useAdContext();
  const { user } = useAuth();
  const ad = getAdForSlot(slotName);

  useEffect(() => {
    if (user?.profileType !== 'CLIENT') return;
    
    // Request an ad for this slot on mount
    requestAd(slotName);
    
    // Release the ad when this component is unmounted
    return () => {
      releaseAd(slotName);
    };
  }, [slotName, requestAd, releaseAd, user?.profileType]);

  if (isLoading || !ad || user?.profileType !== 'CLIENT') {
    return null; // Return nothing if loading, no ad available, or user is not a Client
  }

  // Common styling logic based on variant
  const getVariantStyles = () => {
    switch (variant) {
      case 'small': // for Header
        return 'flex items-center gap-2 p-1.5 bg-indigo-50 border border-indigo-100 rounded-lg max-w-[200px] hover:bg-indigo-100 transition-colors';
      case 'sidebar': // for Sidebar
        return 'flex flex-col gap-2 p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl hover:shadow-md transition-shadow';
      case 'standard': // for Page contents
      default:
        return 'flex flex-col sm:flex-row items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl w-full shadow-sm';
    }
  };

  const adLink = ad.linkUrl && (ad.linkUrl.startsWith('http') ? ad.linkUrl : `https://${ad.linkUrl}`);

  const content = (
    <>
      {ad.imageUrl && (
        <div className={`shrink-0 overflow-hidden ${variant === 'small' ? 'w-8 h-8 rounded' : variant === 'sidebar' ? 'w-full h-24 rounded-lg' : 'w-16 h-16 rounded-xl'} bg-white flex items-center justify-center`}>
          <img 
            src={ad.imageUrl.startsWith('http') ? ad.imageUrl : `http://localhost:5000${ad.imageUrl.startsWith('/') ? '' : '/'}${ad.imageUrl}`} 
            alt={ad.title} 
            className="w-full h-full object-cover" 
          />
        </div>
      )}
      <div className={`flex flex-col ${variant === 'small' ? 'flex-1 overflow-hidden' : 'flex-1'}`}>
        <span className="text-[9px] uppercase tracking-wider font-bold text-indigo-500 mb-0.5">Sponsored</span>
        <h4 className={`font-bold text-gray-900 ${variant === 'small' ? 'text-xs truncate' : 'text-sm'} leading-tight`}>
          {ad.title}
        </h4>
        {variant !== 'small' && ad.description && (
          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{ad.description}</p>
        )}
      </div>
    </>
  );

  return (
    <div className={`${getVariantStyles()} ${className} animate-fade-in`}>
      {adLink ? (
        <a href={adLink} target="_blank" rel="noopener noreferrer" className={`w-full ${variant === 'small' ? 'flex items-center gap-2' : variant === 'sidebar' ? 'flex flex-col gap-2' : 'flex flex-col sm:flex-row items-center gap-4'}`}>
          {content}
        </a>
      ) : (
        <div className={`w-full ${variant === 'small' ? 'flex items-center gap-2' : variant === 'sidebar' ? 'flex flex-col gap-2' : 'flex flex-col sm:flex-row items-center gap-4'}`}>
          {content}
        </div>
      )}
    </div>
  );
}
