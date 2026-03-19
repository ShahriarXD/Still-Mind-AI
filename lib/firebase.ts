import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import type { Analytics } from "firebase/analytics";

const firebasePublicEnv = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const missingFirebaseKeys = Object.entries(firebasePublicEnv)
  .filter(([, value]) => !value)
  .map(([key]) => key);

export const isFirebaseConfigured = missingFirebaseKeys.length === 0;

if (!isFirebaseConfigured && typeof window !== "undefined") {
  console.error("Missing Firebase env vars:", missingFirebaseKeys);
}

// Fallback values prevent build errors when .env.local is not present.
// The app will not be functional without real Firebase credentials.
const firebaseConfig = {
  apiKey: firebasePublicEnv.apiKey ?? "build-placeholder",
  authDomain: firebasePublicEnv.authDomain ?? "build-placeholder.firebaseapp.com",
  projectId: firebasePublicEnv.projectId ?? "build-placeholder",
  storageBucket: firebasePublicEnv.storageBucket ?? "build-placeholder.appspot.com",
  messagingSenderId: firebasePublicEnv.messagingSenderId ?? "000000000000",
  appId: firebasePublicEnv.appId ?? "1:000000000000:web:build-placeholder",
  measurementId: firebasePublicEnv.measurementId,
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
