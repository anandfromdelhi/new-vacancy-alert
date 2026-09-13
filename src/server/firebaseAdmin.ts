import { initializeApp, getApps, cert, applicationDefault, Credential, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';
import fs from 'fs';
import path from 'path';

// Firebase Web API Key for Identity Toolkit fallback token verification
const FIREBASE_WEB_API_KEY = process.env.VITE_FIREBASE_API_KEY || "AIzaSyCBU_DgzSo2JKXqzQXlGfj_3mV6HHuN20E";
const FIREBASE_PROJECT_ID = process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || "newvacancyalert";

let isFirebaseAdminInitialized = false;
let hasValidCredentials = false;
let adminApp: App | null = null;
let adminFirestoreInstance: Firestore | null = null;
let adminAuthInstance: Auth | null = null;

/**
 * Initializes the Firebase Admin SDK safely.
 * Checks for FIREBASE_SERVICE_ACCOUNT (JSON string or path) or individual env vars.
 */
export function initFirebaseAdmin(): boolean {
  if (isFirebaseAdminInitialized) {
    return hasValidCredentials;
  }

  try {
    let credential: Credential | null = null;

    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const raw = process.env.FIREBASE_SERVICE_ACCOUNT.trim();
      if (raw.startsWith('{')) {
        const parsed = JSON.parse(raw);
        credential = cert(parsed);
      } else if (fs.existsSync(raw)) {
        const fileContent = fs.readFileSync(raw, 'utf-8');
        credential = cert(JSON.parse(fileContent));
      }
    } else if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
      credential = cert({
        projectId: FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      });
    } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS && fs.existsSync(process.env.GOOGLE_APPLICATION_CREDENTIALS)) {
      credential = applicationDefault();
    }

    if (credential) {
      const existingApps = getApps();
      adminApp = existingApps.length > 0 ? existingApps[0] : initializeApp({
        credential,
        projectId: FIREBASE_PROJECT_ID
      });
      isFirebaseAdminInitialized = true;
      hasValidCredentials = true;
      adminFirestoreInstance = getFirestore(adminApp);
      adminAuthInstance = getAuth(adminApp);
      console.log('✅ Firebase Admin SDK successfully initialized with service credentials.');
      return true;
    } else {
      isFirebaseAdminInitialized = true;
      hasValidCredentials = false;
      console.log('ℹ️ Running in local development mode without service account. Using Identity Toolkit & local persistence store.');
      return false;
    }
  } catch (err: any) {
    console.warn('⚠️ Firebase Admin SDK initialization notice:', err.message);
    isFirebaseAdminInitialized = true;
    hasValidCredentials = false;
    return false;
  }
}

/**
 * Returns the admin Firestore instance if available with valid credentials.
 */
export function getAdminDb(): Firestore | null {
  if (!isFirebaseAdminInitialized) {
    initFirebaseAdmin();
  }
  return hasValidCredentials ? adminFirestoreInstance : null;
}

/**
 * Verifies a Firebase Auth ID Token sent by the browser.
 * Uses Firebase Admin Auth if credentials are valid, or falls back to Google's Identity Toolkit API.
 */
export async function verifyFirebaseIdToken(idToken: string): Promise<{ uid: string; email?: string } | null> {
  if (!idToken || typeof idToken !== 'string') {
    return null;
  }

  if (!isFirebaseAdminInitialized) {
    initFirebaseAdmin();
  }

  // 1. Try Firebase Admin Auth if credentials are valid
  if (hasValidCredentials && adminAuthInstance) {
    try {
      const decoded = await adminAuthInstance.verifyIdToken(idToken);
      if (decoded && decoded.uid) {
        return { uid: decoded.uid, email: decoded.email };
      }
    } catch {
      // Fall through to Identity Toolkit fallback
    }
  }

  // 2. High-reliability fallback: Google Identity Toolkit REST API
  try {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_WEB_API_KEY}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken })
    });

    if (!response.ok) {
      return null;
    }

    const data: any = await response.json();
    if (data.users && data.users[0] && data.users[0].localId) {
      return {
        uid: data.users[0].localId,
        email: data.users[0].email
      };
    }
  } catch (err) {
    console.error('Error verifying Firebase ID token with Identity Toolkit:', err);
  }

  return null;
}
