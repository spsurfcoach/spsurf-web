"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "firebase/auth";
import {
  getCurrentIdToken,
  onAuthChange,
  registerWithEmail,
  signInWithEmail,
  signInWithGoogle,
  signOutUser,
} from "@/lib/firebase/auth";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  token: string | null;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signupWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function setAuthCookie(token: string | null) {
  if (token) {
    document.cookie = `sp_auth=${token}; path=/; max-age=3600; samesite=lax`;
  } else {
    document.cookie = "sp_auth=; path=/; max-age=0; samesite=lax";
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (nextUser) => {
      setUser(nextUser);
      const idToken = await getCurrentIdToken();
      setToken(idToken);
      setAuthCookie(idToken);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      token,
      loginWithGoogle: async () => {
        await signInWithGoogle();
      },
      loginWithEmail: async (email, password) => {
        await signInWithEmail(email, password);
      },
      signupWithEmail: async (email, password) => {
        await registerWithEmail(email, password);
      },
      logout: async () => {
        await signOutUser();
        setAuthCookie(null);
      },
    }),
    [loading, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
