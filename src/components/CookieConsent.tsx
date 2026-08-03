import React, { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';
import { Link } from 'react-router';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent') || localStorage.getItem('cookie_consent_accepted');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const updateGoogleConsent = (granted: boolean) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: granted ? 'granted' : 'denied',
        ad_storage: granted ? 'granted' : 'denied',
        ad_user_data: granted ? 'granted' : 'denied',
        ad_personalization: granted ? 'granted' : 'denied',
      });
    }
  };

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    updateGoogleConsent(true);
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'declined');
    updateGoogleConsent(false);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie Consent Notice"
      className="fixed bottom-3 left-3 right-3 sm:right-auto sm:left-4 sm:max-w-sm z-40 bg-slate-900/95 backdrop-blur-md text-white p-3.5 sm:p-4 rounded-2xl shadow-2xl border border-slate-800/80 flex flex-col gap-2.5 animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Cookie className="h-4 w-4 shrink-0" />
          </div>
          <span className="font-black text-xs tracking-tight text-slate-100">Cookie & Privacy Settings</span>
        </div>
        <button
          onClick={handleDecline}
          className="text-slate-400 hover:text-slate-200 transition-colors p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
          aria-label="Decline and close cookie notice"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
        We use cookies to personalize content and analyze traffic. Read our{' '}
        <Link to="/privacy-policy" className="text-amber-400 hover:text-amber-300 underline font-semibold">
          Privacy Policy
        </Link>{' '}
        for details.
      </p>

      <div className="flex items-center justify-end gap-2 pt-0.5">
        <button
          onClick={handleDecline}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 hover:text-white font-extrabold text-[11px] rounded-xl transition-all cursor-pointer border border-slate-700"
        >
          Decline
        </button>
        <button
          onClick={handleAccept}
          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-extrabold text-[11px] rounded-xl shadow-xs transition-all cursor-pointer border border-blue-500"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
