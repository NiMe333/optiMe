import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

import { getCurrentUser, logoutUser } from "@/services/auth";
import { getAccessToken } from "@/services/authStorage";

export type AuthUser = {
  id: string;
  email?: string;
  username?: string;
  formFinished: boolean;
};

type AuthContextType = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  setUser: (user: AuthUser | null) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

function normalizeAuthUser(user: AuthUser | null): AuthUser | null {
  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    username: user.username,
    formFinished: user.formFinished === true,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  function setUser(nextUser: AuthUser | null) {
    setUserState(normalizeAuthUser(nextUser));
  }

  useEffect(() => {
    async function restoreUser() {
      try {
        const token = await getAccessToken();

        if (!token) {
          setUserState(null);
          return;
        }

        const data = await getCurrentUser();

        if (data.user) {
          setUserState(normalizeAuthUser(data.user));
        } else {
          setUserState(null);
        }
      } catch (error) {
        setUserState(null);
      } finally {
        setAuthLoading(false);
      }
    }

    restoreUser();
  }, []);

  async function logout() {
    try {
      await logoutUser();
    } finally {
      setUserState(null);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        authLoading,
        setUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
