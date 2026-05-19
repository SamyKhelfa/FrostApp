import { useRouter } from "expo-router";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export type AuthUser = {
  name: string;
  email: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const router = useRouter();

  const login = useCallback(async (email: string, _password: string) => {
    // Fake auth — accepts any non-empty credentials, no backend yet.
    const fallbackName = email.includes("@") ? email.split("@")[0] : email;
    setUser({ name: fallbackName || "Givré", email });
  }, []);

  const register = useCallback(
    async (name: string, email: string, _password: string) => {
      setUser({ name, email });
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    router.replace("/login");
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      login,
      register,
      logout,
    }),
    [user, login, register, logout]
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
