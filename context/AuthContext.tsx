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

  const fetchProfile = useCallback(async (uid: string, fallback?: { name?: string | null; email?: string | null }) => {
    const fallbackName = fallback?.name?.trim() || "User";
    const fallbackEmail = fallback?.email?.trim() || "";

    try {
      const snap = await getDoc(doc(db, "users", uid));
      if (snap.exists()) {
        setProfile(snap.data() as UserProfile);
      } else {
        // Document doesn't exist — create a default profile
        const defaultProfile: UserProfile = {
          name: fallbackName,
          email: fallbackEmail,
          company: "",
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
        setProfile(defaultProfile);
        // Try to save it for next time (non-blocking)
        setDoc(doc(db, "users", uid), {
          ...defaultProfile,
          createdAt: serverTimestamp(),
        }).catch(() => {});
      }
    } catch (err) {
      // Firestore unavailable or permission denied — set default profile so app works
      console.error("Failed to fetch profile:", err);
      const defaultProfile: UserProfile = {
        name: fallbackName,
        email: fallbackEmail,
        company: "",
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
      setProfile(defaultProfile);
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

        // Mark auth as loaded immediately — don't wait for profile
        setLoading(false);
        setProfile((prev) => prev ?? {
          name: firebaseUser.displayName?.trim() || "User",
          email: firebaseUser.email || "",
          company: "",
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
        });
        // Fetch profile in background (or create default if missing)
        fetchProfile(firebaseUser.uid, {
          name: firebaseUser.displayName,
          email: firebaseUser.email,
        });
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
    // Set token and fetch profile in background — don't block sign-in
    cred.user.getIdToken().then((token) => {
      document.cookie = `__session=${token}; path=/; max-age=3600; SameSite=Strict`;
    }).catch(() => {});
    setProfile((prev) => prev ?? {
      name: cred.user.displayName?.trim() || "User",
      email: cred.user.email || "",
      company: "",
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
    });
    fetchProfile(cred.user.uid, {
      name: cred.user.displayName,
      email: cred.user.email,
    });
  };

  const signUp = async (
    email: string,
    password: string,
    name: string,
    company: string
  ) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    // Set token in background
    cred.user.getIdToken().then((token) => {
      document.cookie = `__session=${token}; path=/; max-age=3600; SameSite=Strict`;
    }).catch(() => {});

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
