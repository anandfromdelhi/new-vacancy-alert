import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { doc, updateDoc, increment, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function Analytics() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    // Wait for gtag to be available on window
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'page_view', {
        page_path: location.pathname + location.search,
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

