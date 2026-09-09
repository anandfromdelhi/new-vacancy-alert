import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import { doc, updateDoc, increment, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function Analytics() {
  const location = useLocation();
  const isFirstMount = useRef(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Skip the first render because gtag('config', 'G-Y0ZRZMMFSP') in index.html already records the initial landing pageview.
    // All subsequent client-side SPA route navigations are tracked cleanly.
    if (isFirstMount.current) {
      isFirstMount.current = false;
    } else if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'page_view', {
        page_path: location.pathname + location.search,
        page_location: window.location.href,
        page_title: document.title,
      });
    }

    // Automatic Referral Link Tracking
    try {
      const searchParams = new URLSearchParams(location.search);
      const refUid = searchParams.get('ref');

      if (refUid && typeof window !== 'undefined') {
        const sessionKey = `ref_tracked_${refUid}`;
        if (!sessionStorage.getItem(sessionKey)) {
          sessionStorage.setItem(sessionKey, 'true');
          
          const partnerRef = doc(db, 'marketingPartners', refUid);
          updateDoc(partnerRef, {
            totalClicks: increment(1)
          }).catch(() => {
            // Fallback if field or doc doesn't exist yet
            setDoc(partnerRef, { totalClicks: increment(1) }, { merge: true }).catch((err) => {
              console.error('Error tracking referral click:', err);
            });
          });
        }
      }
    } catch (e) {
      console.error('Analytics tracking error:', e);
    }
  }, [location]);

  return null;
}

