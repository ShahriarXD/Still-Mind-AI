"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendEmailVerification,
  User,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export interface UserProfile {
  name: string;
  email: string;
  company: string;
  phone: string;
  plan: "free" | "starter" | "pro" | "business";
  dailyCount: number;
  dailyLimit: number;
  notifications: {
    emailFollowups: boolean;
    riskAlerts: boolean;
    weeklyReport: boolean;
    newFeatures: boolean;
  };
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    name: string,
    company: string
  ) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (uid: string) => {
    try {
      const snap = await getDoc(doc(db, "users", uid));
      if (snap.exists()) {
        setProfile(snap.data() as UserProfile);
      }
    } catch {
      // Firestore unavailable or permission denied — app still works without profile
    }
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Refresh session cookie whenever Firebase renews the token (~every hour)
        // Set 7-day expiry so the proxy doesn't force re-login before Firebase does
        firebaseUser.getIdToken().then((token) => {
          document.cookie = `__session=${token}; path=/; max-age=604800; SameSite=Strict`;
        }).catch(() => {});

        // Fetch profile in background — don't block UI
        fetchProfile(firebaseUser.uid).finally(() => setLoading(false));
      } else {
        document.cookie = "__session=; path=/; max-age=0";
        setProfile(null);
        setLoading(false);
      }
    });
    return unsub;
  }, [fetchProfile]);

  const signIn = async (email: string, password: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const token = await cred.user.getIdToken();
    document.cookie = `__session=${token}; path=/; max-age=3600; SameSite=Strict`;
    // Fetch profile and wait for it to complete
    await fetchProfile(cred.user.uid);
  };

  const signUp = async (
    email: string,
    password: string,
    name: string,
    company: string
  ) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const token = await cred.user.getIdToken();
    document.cookie = `__session=${token}; path=/; max-age=3600; SameSite=Strict`;

    const newProfile: UserProfile = {
      name,
      email,
      company,
      phone: "",
      plan: "free",
      dailyCount: 0,
      dailyLimit: 20,
      notifications: {
        emailFollowups: true,
        riskAlerts: true,
        weeklyReport: false,
        newFeatures: true,
      },
    };

    // Send email verification (non-blocking)
    sendEmailVerification(cred.user).catch(() => {});

    // Set local profile immediately so the app works even if Firestore write is slow
    setProfile(newProfile);

    // Save to Firestore in background — don't block navigation
    setDoc(doc(db, "users", cred.user.uid), {
      ...newProfile,
      createdAt: serverTimestamp(),
    }).catch(() => {
      // Profile will be re-attempted on next sign-in
    });
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    document.cookie = "__session=; path=/; max-age=0";
    setUser(null);
    setProfile(null);
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, "users", user.uid), data as Record<string, unknown>);
    } catch {
      // Silently fail — local state is still updated below
    }
    setProfile((prev) => (prev ? { ...prev, ...data } : prev));
  };

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.uid);
  };

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, signIn, signUp, signOut, updateProfile, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
