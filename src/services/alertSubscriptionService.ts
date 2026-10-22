import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { JobAlertSubscription, AlertCombination } from '../types/alertTypes';
import { QUAL_CATEGORIES, STATE_MAP, toSlug } from '../utils/categoryUtils';

export const SUBSCRIPTIONS_COLLECTION = 'job_alert_subscriptions';

/**
 * Builds a deterministic document ID for a subscription to naturally enforce
 * uniqueness per user + qualification + location at the database level.
 */
export function buildSubscriptionDocId(
  userId: string,
  qualificationSlug: string,
  locationSlug: string
): string {
  return `${userId}_${qualificationSlug}_${locationSlug}`;
}

/**
 * Subscribes a user to one or more explicit (qualification + location) alert combinations.
 * Automatically avoids creating duplicates if the combination already exists for the user.
 */
export async function subscribeToAlertCombinations(params: {
  userId: string;
  userEmail: string;
  userName?: string;
  combinations: AlertCombination[];
  sourceJobId?: string;
  sourceJobTitle?: string;
}): Promise<{ savedCount: number; alreadyActiveCount: number; errors: string[] }> {
  const { userId, userEmail, userName, combinations, sourceJobId, sourceJobTitle } = params;

  if (!userId || !combinations || combinations.length === 0) {
    return { savedCount: 0, alreadyActiveCount: 0, errors: ['No combinations provided'] };
  }

  let savedCount = 0;
  let alreadyActiveCount = 0;
  const errors: string[] = [];
  const nowIso = new Date().toISOString();

  for (const combo of combinations) {
    try {
      const docId = buildSubscriptionDocId(userId, combo.qualificationSlug, combo.locationSlug);
      const docRef = doc(db, SUBSCRIPTIONS_COLLECTION, docId);

      // Check if this subscription already exists
      let docExists = false;
      let existingData: any = null;

      try {
        const existingSnap = await getDoc(docRef);
        if (existingSnap.exists()) {
          docExists = true;
          existingData = existingSnap.data();
        }
      } catch (checkErr: any) {
        // If getDoc encountered an error on non-existent document, log warning and proceed to setDoc
        console.warn('Existing subscription check encountered:', checkErr?.message || checkErr);
      }

      if (docExists && existingData) {
        if (existingData.isActive) {
          alreadyActiveCount++;
          continue;
        } else {
          // Reactivate previously paused subscription
          await updateDoc(docRef, {
            isActive: true,
            updatedAt: nowIso,
            sourceJobId: sourceJobId || existingData.sourceJobId || '',
            sourceJobTitle: sourceJobTitle || existingData.sourceJobTitle || '',
            lastReactivatedAt: nowIso
          });
          savedCount++;
          continue;
        }
      }

      // Create new subscription record
      const subscriptionRecord: JobAlertSubscription = {
        id: docId,
        userId,
        userEmail: userEmail || '',
        userName: userName || '',
        qualification: combo.qualificationSlug,
        qualificationLabel: combo.qualificationLabel,
        location: combo.locationSlug,
        locationLabel: combo.locationLabel,
        isActive: true,
        sourceJobId: sourceJobId || '',
        sourceJobTitle: sourceJobTitle || '',
        createdAt: nowIso,
        updatedAt: nowIso
      };

      await setDoc(docRef, {
        ...subscriptionRecord,
        serverCreatedAt: serverTimestamp(),
        serverUpdatedAt: serverTimestamp()
      });

      savedCount++;
    } catch (err: any) {
      console.error('Error creating subscription for combination:', combo, err);
      errors.push(err.message || 'Unknown database error');
    }
  }

  return { savedCount, alreadyActiveCount, errors };
}

/**
 * Retrieves all job alert subscriptions for a specific user.
 */
export async function getUserSubscriptions(userId: string): Promise<JobAlertSubscription[]> {
  if (!userId) return [];

  try {
    const q = query(
      collection(db, SUBSCRIPTIONS_COLLECTION),
      where('userId', '==', userId)
    );

    const snapshot = await getDocs(q);
    const subscriptions: JobAlertSubscription[] = [];

    snapshot.forEach((d) => {
      const data = d.data() as JobAlertSubscription;
      subscriptions.push({
        ...data,
        id: d.id
      });
    });

    // Sort by createdAt descending (most recent first)
    subscriptions.sort((a, b) => {
      const timeA = new Date(a.createdAt || 0).getTime();
      const timeB = new Date(b.createdAt || 0).getTime();
      return timeB - timeA;
    });

    return subscriptions;
  } catch (err) {
    console.error('Failed to load user subscriptions from Firestore:', err);
    return [];
  }
}

/**
 * Pauses or reactivates an existing alert subscription.
 */
export async function toggleSubscriptionStatus(
  subscriptionId: string,
  isActive: boolean
): Promise<boolean> {
  try {
    const docRef = doc(db, SUBSCRIPTIONS_COLLECTION, subscriptionId);
    await updateDoc(docRef, {
      isActive,
      updatedAt: new Date().toISOString(),
      serverUpdatedAt: serverTimestamp()
    });
    return true;
  } catch (err) {
    console.error('Error toggling subscription status:', err);
    return false;
  }
}

/**
 * Permanently deletes a subscription record.
 */
export async function deleteSubscription(subscriptionId: string): Promise<boolean> {
  try {
    const docRef = doc(db, SUBSCRIPTIONS_COLLECTION, subscriptionId);
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.error('Error deleting subscription:', err);
    return false;
  }
}

/**
 * Adds a new alert manually from custom qualification and location dropdowns.
 */
export async function addManualSubscription(params: {
  userId: string;
  userEmail: string;
  userName?: string;
  qualificationSlug: string;
  locationSlug: string;
}): Promise<{ success: boolean; message: string }> {
  const { userId, userEmail, userName, qualificationSlug, locationSlug } = params;

  // Resolve qualification label
  const qualObj = QUAL_CATEGORIES.find((q) => q.slug === qualificationSlug);
  const qualificationLabel = qualObj ? qualObj.name : qualificationSlug;

  // Resolve location label
  let locationLabel = 'All India';
  if (locationSlug !== 'all-india') {
    const matchedState = Object.keys(STATE_MAP).find((s) => toSlug(s) === locationSlug);
    locationLabel = matchedState || locationSlug;
  }

  const combination: AlertCombination = {
    qualificationSlug,
    qualificationLabel,
    locationSlug,
    locationLabel
  };

  const result = await subscribeToAlertCombinations({
    userId,
    userEmail,
    userName,
    combinations: [combination],
    sourceJobId: 'manual',
    sourceJobTitle: 'Manual Custom Alert'
  });

  if (result.errors.length > 0) {
    return { success: false, message: result.errors[0] };
  }

  if (result.alreadyActiveCount > 0) {
    return {
      success: true,
      message: `You are already subscribed to ${qualificationLabel} alerts in ${locationLabel}.`
    };
  }

  return {
    success: true,
    message: `Alert activated for ${qualificationLabel} in ${locationLabel}!`
  };
}
