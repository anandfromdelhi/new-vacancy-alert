import React, { useEffect } from 'react';

export default function CookieConsent() {
  useEffect(() => {
    // Automatically grant cookies and consent to all users
    try {
      localStorage.setItem('cookie_consent', 'accepted');
      localStorage.setItem('cookie_consent_accepted', 'true');
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          analytics_storage: 'granted',
          ad_storage: 'granted',
          ad_user_data: 'granted',
          ad_personalization: 'granted',
        });
      }
    } catch (e) {}
  }, []);

  return null;
}
