import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import type { Analytics } from "firebase/analytics";

const defaultFirebasePublicConfig = {
  apiKey: "AIzaSyCcovDbWew5iwahusJ7B0v7yqkreh_h-RE",
  authDomain: "simple-prac-72cd7.firebaseapp.com",
  projectId: "simple-prac-72cd7",
  storageBucket: "simple-prac-72cd7.firebasestorage.app",
  messagingSenderId: "332299034074",
  appId: "1:332299034074:web:aff23cfeb1c1c63c7bf4e3",
  measurementId: "G-TTQBWHHCXK",
};

const firebasePublicEnv = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const requiredFirebasePublicEnv = {
  apiKey: firebasePublicEnv.apiKey ?? defaultFirebasePublicConfig.apiKey,
  authDomain: firebasePublicEnv.authDomain ?? defaultFirebasePublicConfig.authDomain,
  projectId: firebasePublicEnv.projectId ?? defaultFirebasePublicConfig.projectId,
  storageBucket: firebasePublicEnv.storageBucket ?? defaultFirebasePublicConfig.storageBucket,
  messagingSenderId: firebasePublicEnv.messagingSenderId ?? defaultFirebasePublicConfig.messagingSenderId,
  appId: firebasePublicEnv.appId ?? defaultFirebasePublicConfig.appId,
};

export const missingRequiredFirebaseKeys = Object.entries(requiredFirebasePublicEnv)
  .filter(([, value]) => !value)
  .map(([key]) => key);

export const isFirebaseConfigured = missingRequiredFirebaseKeys.length === 0;

if (!isFirebaseConfigured && typeof window !== "undefined") {
  console.error("Missing Firebase env vars:", missingRequiredFirebaseKeys);
}

// Public Firebase config values can safely be in client bundles.
// Env vars override defaults in each deployment.
const firebaseConfig = {
  apiKey: requiredFirebasePublicEnv.apiKey,
  authDomain: requiredFirebasePublicEnv.authDomain,
  projectId: requiredFirebasePublicEnv.projectId,
  storageBucket: requiredFirebasePublicEnv.storageBucket,
  messagingSenderId: requiredFirebasePublicEnv.messagingSenderId,
  appId: requiredFirebasePublicEnv.appId,
  measurementId: firebasePublicEnv.measurementId ?? defaultFirebasePublicConfig.measurementId,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);

let analyticsInstance: Analytics | null = null;

export async function initializeAnalytics(): Promise<Analytics | null> {
  if (analyticsInstance) return analyticsInstance;
  if (typeof window === "undefined") return null;
  if (!firebasePublicEnv.measurementId) return null;

  try {
    const { getAnalytics, isSupported } = await import("firebase/analytics");
    const supported = await isSupported();
    if (!supported) return null;

    analyticsInstance = getAnalytics(app);
    return analyticsInstance;
  } catch {
    return null;
  }
}

export default app;
