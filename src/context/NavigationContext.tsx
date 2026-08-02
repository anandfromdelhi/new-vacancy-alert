import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import { Briefcase, FileText, Search, Loader2 } from 'lucide-react';

interface NavigationContextType {
  isNavigating: boolean;
  loadingText: string;
  startLoading: (text?: string) => void;
  stopLoading: () => void;
}

const NavigationContext = createContext<NavigationContextType>({
  isNavigating: false,
  loadingText: 'Loading Govt Job Details...',
  startLoading: () => {},
  stopLoading: () => {}
});

export const useNavigationLoader = () => useContext(NavigationContext);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isNavigating, setIsNavigating] = useState(false);
  const [loadingText, setLoadingText] = useState('Loading Govt Job Details...');
  const location = useLocation();
  const prevPathRef = useRef(location.pathname);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startLoading = (text = 'Loading Govt Job Details...') => {
    setLoadingText(text);
    setIsNavigating(true);

    if (timerRef.current) clearTimeout(timerRef.current);

    // Auto safety timeout in case route never changes
    timerRef.current = setTimeout(() => {
      setIsNavigating(false);
    }, 4000);
  };

  const stopLoading = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setIsNavigating(false);
    }, 250); // smooth brief pause before hide
  };

  // Listen to route changes
  useEffect(() => {
    if (prevPathRef.current !== location.pathname) {
      // Scroll to top immediately when route changes
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

      // If navigation wasn't manually triggered, show brief loading indicator
      if (!isNavigating) {
        setIsNavigating(true);
        setLoadingText('Loading page...');
      }

      prevPathRef.current = location.pathname;

      // Keep spinner visible for a small pleasant duration so user registers transition
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setIsNavigating(false);
      }, 350);
    }
  }, [location.pathname]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <NavigationContext.Provider value={{ isNavigating, loadingText, startLoading, stopLoading }}>
      {/* Top Animated Progress Bar */}
      {isNavigating && (
        <div className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-gradient-to-r from-blue-600 via-amber-500 to-emerald-500 animate-pulse shadow-md" />
      )}

      {/* Floating Center Loading Overlay Modal */}
      {isNavigating && (
        <div className="fixed inset-0 z-[9998] bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 transition-opacity duration-200 animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 flex flex-col items-center text-center space-y-3.5 max-w-xs w-full transform scale-100 transition-all">
            <div className="relative flex items-center justify-center">
              {/* Outer Spinner Ring */}
              <div className="w-12 h-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
              <Briefcase className="w-5 h-5 text-blue-600 absolute" />
            </div>

            <div className="space-y-1">
              <p className="text-sm font-extrabold text-slate-900 leading-snug">
                {loadingText}
              </p>
              <p className="text-[11px] font-semibold text-slate-500">
                NewVacancyAlert.in • Verified Recruitment Portal
              </p>
            </div>

            {/* Pulsing Dots */}
            <div className="flex items-center gap-1.5 pt-1">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      )}

      {children}
    </NavigationContext.Provider>
  );
};
