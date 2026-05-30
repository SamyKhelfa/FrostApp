import { useRouter } from "expo-router";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { loginRequest, registerRequest } from "@/lib/auth.service";
import type { IUser } from "@/types/auth";

type AuthContextValue = {
  user: IUser | null;
  isAuthenticated: boolean;
  isLogging: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLogging, setIsLogging] = useState(false);

  const router = useRouter();

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLogging(true);
      try {
        const { user: userResponse } = await loginRequest({ email, password });
        setUser(userResponse);
        router.replace("/");
      } finally {
        setIsLogging(false);
      }
    },
    [router]
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      setIsLogging(true);
      try {
        const { user: userResponse } = await registerRequest({
          name,
          email,
          password,
        });
        setUser(userResponse);
        router.replace("/");
      } finally {
        setIsLogging(false);
      }
    },
    [router]
  );

  const logout = useCallback(() => {
    setUser(null);
    router.replace("/login");
  }, [router]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      isLogging,
      login,
      register,
      logout,
    }),
    [user, isLogging, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
