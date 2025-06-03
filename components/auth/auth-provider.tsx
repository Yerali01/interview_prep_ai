"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  signUpWithEmail,
  signInWithEmail,
  signInWithGitHub,
  linkGitHubAccount,
  signOutUser,
  resetPassword,
  onAuthStateChange,
  type AuthUser,
} from "@/lib/auth-service";

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGitHub: () => Promise<void>;
  linkGitHubAccount: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signUp: async () => {},
  signIn: async () => {},
  signInWithGitHub: async () => {},
  linkGitHubAccount: async () => {},
  signOut: async () => {},
  resetPassword: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen for auth state changes
  useEffect(() => {
    console.log("🔥 Setting up auth state listener...");

    const unsubscribe = onAuthStateChange((user) => {
      console.log(
        "🔥 Auth state changed:",
        user ? `User: ${user.email}` : "No user"
      );
      setUser(user);
      setLoading(false);
    });

    return () => {
      console.log("🔥 Cleaning up auth state listener");
      unsubscribe();
    };
  }, []);

  // Sign up wrapper
  const handleSignUp = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await signUpWithEmail(email, password);
      if (result.error) {
        throw new Error(result.error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Sign in wrapper
  const handleSignIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await signInWithEmail(email, password);
      if (result.error) {
        throw new Error(result.error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // GitHub sign in wrapper
  const handleSignInWithGitHub = async () => {
    setLoading(true);
    try {
      const result = await signInWithGitHub();
      if (result.error) {
        throw new Error(result.error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Link GitHub wrapper
  const handleLinkGitHub = async () => {
    setLoading(true);
    try {
      const result = await linkGitHubAccount();
      if (result.error) {
        throw new Error(result.error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Sign out wrapper
  const handleSignOut = async () => {
    setLoading(true);
    try {
      const result = await signOutUser();
      if (result.error) {
        throw new Error(result.error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Reset password wrapper
  const handleResetPassword = async (email: string) => {
    const result = await resetPassword(email);
    if (result.error) {
      throw new Error(result.error.message);
    }
  };

  const value = {
    user,
    loading,
    signUp: handleSignUp,
    signIn: handleSignIn,
    signInWithGitHub: handleSignInWithGitHub,
    linkGitHubAccount: handleLinkGitHub,
    signOut: handleSignOut,
    resetPassword: handleResetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
