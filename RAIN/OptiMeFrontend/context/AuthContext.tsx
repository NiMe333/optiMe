import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, logoutUser } from "@/services/auth";
import { getAccessToken } from "@/services/authStorage";

type AuthUser = {
  id: string;
  email: string;
  username?: string;
  education?: string;
  employment?: string;
  mood?: number;
  sleepHours?: string;
  activity?: string;
  socialConnection?: number;
  phoneScreenTime?: string;
  stress?: string;
  formFinished?: boolean;
};

type AuthContextType = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  setUser: (user: AuthUser | null) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    async function restoreUser() {
      try {
        const token = await getAccessToken();

        if (!token) {
          setUser(null);
          return;
        }

        const data = await getCurrentUser();

        console.log("RESTORED USER DATA:", data);

        if (data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.log("RESTORE USER FAILED:", error);
        setUser(null);
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
      setUser(null);
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
