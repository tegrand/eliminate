import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { advertisementsApi } from '../api/advertisements.api';

const AdContext = createContext();

export function AdProvider({ children }) {
  // Fetch active ads from the backend
  const { data, isLoading } = useQuery({
    queryKey: ['activeAdvertisements'],
    queryFn: () => advertisementsApi.getActive(),
    refetchInterval: 300000, // Refetch every 5 mins
  });

  const ads = data?.data?.data || data?.data || data || [];
  
  // Track which ads are currently assigned to slots
  // Format: { slotName: adId }
  const [assignedAds, setAssignedAds] = useState({});

  /**
   * Request an ad for a specific slot.
   * If the slot already has an ad, it returns it.
   * Otherwise, it finds an available ad that isn't assigned to any other slot.
   */
  const requestAd = useCallback((slotName) => {
    setAssignedAds((prev) => {
      // If this slot already has an assigned ad, keep it
      if (prev[slotName]) return prev;

      // Find all currently assigned ad IDs
      const usedAdIds = Object.values(prev);

      // Filter available ads that aren't used yet
      const availableAds = ads.filter(ad => !usedAdIds.includes(ad.id));

      if (availableAds.length === 0) return prev; // No ads available

      // Pick a random available ad (or just the first one)
      const selectedAd = availableAds[Math.floor(Math.random() * availableAds.length)];

      return {
        ...prev,
        [slotName]: selectedAd.id
      };
    });
  }, [ads]);

  /**
   * Release an ad when a slot unmounts.
   */
  const releaseAd = useCallback((slotName) => {
    setAssignedAds((prev) => {
      if (!prev[slotName]) return prev;
      const next = { ...prev };
      delete next[slotName];
      return next;
    });
  }, []);

  /**
   * Get the actual ad object for a given slot.
   */
  const getAdForSlot = useCallback((slotName) => {
    const assignedId = assignedAds[slotName];
    if (!assignedId) return null;
    return ads.find(ad => ad.id === assignedId) || null;
  }, [assignedAds, ads]);

  return (
    <AdContext.Provider value={{
      ads,
      isLoading,
      requestAd,
      releaseAd,
      getAdForSlot
    }}>
      {children}
    </AdContext.Provider>
  );
}

export const useAdContext = () => {
  const context = useContext(AdContext);
  if (!context) {
    throw new Error('useAdContext must be used within an AdProvider');
  }
  return context;
};
