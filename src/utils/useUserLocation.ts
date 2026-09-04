import { useState, useEffect } from 'react';
import { STATE_MAP, toSlug } from './categoryUtils';

export interface UserLocation {
  stateName: string;
  stateSlug: string;
}

const STORAGE_KEY = 'nva_user_state';

/**
 * Matches an IP geolocation region/city string to an Indian State in STATE_MAP.
 */
export function matchStateFromRegion(regionStr: string): UserLocation | null {
  if (!regionStr) return null;
  const clean = regionStr.toLowerCase().trim();

  // 1. Direct match with state names
  for (const stateName of Object.keys(STATE_MAP)) {
    if (clean.includes(stateName.toLowerCase())) {
      return { stateName, stateSlug: toSlug(stateName) };
    }
  }

  // 2. Match with keywords (cities, acronyms, etc.)
  for (const [stateName, keywords] of Object.entries(STATE_MAP)) {
    for (const kw of keywords) {
      if (clean.includes(kw)) {
        return { stateName, stateSlug: toSlug(stateName) };
      }
    }
  }

  return null;
}

/**
 * Custom React hook for non-blocking client-side Geo-IP detection.
 * Caches result in localStorage for instant 0ms access on return visits.
 */
export function useUserLocation(): {
  userLocation: UserLocation | null;
  setUserLocation: (loc: UserLocation | null) => void;
} {
  const [userLocation, setLocationState] = useState<UserLocation | null>(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          return JSON.parse(cached) as UserLocation;
        }
      }
    } catch {
      // Ignore JSON parse or SSR storage errors
    }
    return null;
  });

  useEffect(() => {
    // If already detected and cached, no network request needed!
    if (userLocation) return;

    let isMounted = true;

    async function detect() {
      try {
        // Attempt 1: Same-origin /api/geo endpoint (Zero CORS issues, works behind CSP)
        const res0 = await fetch('/api/geo');
        if (res0.ok) {
          const data0 = await res0.json();
          const matched0 = matchStateFromRegion(data0.region || data0.city);
          if (matched0 && isMounted) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(matched0));
            setLocationState(matched0);
            return;
          }
        }
      } catch {
        // Continue to fallback
      }

      try {
        // Attempt 2: get.geojs.io (Fast, free, reliable, CORS-friendly)
        const res = await fetch('https://get.geojs.io/v1/ip/geo.json');
        if (res.ok) {
          const data = await res.json();
          const matched = matchStateFromRegion(data.region || data.city);
          if (matched && isMounted) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(matched));
            setLocationState(matched);
            return;
          }
        }
      } catch {
        // Silently continue to fallback
      }

      try {
        // Attempt 2 Fallback: ipapi.co
        const res2 = await fetch('https://ipapi.co/json/');
        if (res2.ok) {
          const data2 = await res2.json();
          const matched2 = matchStateFromRegion(data2.region || data2.city);
          if (matched2 && isMounted) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(matched2));
            setLocationState(matched2);
            return;
          }
        }
      } catch {
        // Fail silently - non-blocking
      }
    }

    detect();

    return () => {
      isMounted = false;
    };
  }, [userLocation]);

  const setUserLocation = (loc: UserLocation | null) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      if (loc) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(loc));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLocationState(loc);
  };

  return { userLocation, setUserLocation };
}
