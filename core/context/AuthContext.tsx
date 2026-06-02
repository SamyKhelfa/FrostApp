import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import {
    createContext,
    ReactNode,
    useCallback,
    useContext, useEffect,
    useMemo,
    useState,
} from "react";
import {useLoginMutation, useRegisterMutation, useMeQuery} from "@/core/api";
import type {IUser} from "@/core/interfaces";

const TOKEN_KEY = "auth-token";


type AuthContextValue = {
  user: IUser | null;
  isAuthenticated: boolean;
  isLogging: boolean;
  isInitializing: boolean
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const [loginMutation, {isLoading: isLoggingIn}] = useLoginMutation();
  const [registerMutation, {isLoading: isRegistering}] = useRegisterMutation();

  const {data: meData, isLoading: isMeLoading} = useMeQuery(undefined, {skip: !token});

    useEffect(() => {
        SecureStore.getItemAsync(TOKEN_KEY).then((storedToken) => {
            if (storedToken) {
                setToken(storedToken);
            }
            setIsInitializing(false);
        });
    }, []);

    useEffect(() => {
        if (meData) {
            setUser(meData);
        }
    }, [meData]);


    const router = useRouter();

    const login = useCallback(
        async (email: string, password: string) => {
            const { authToken, user: userResponse } = await loginMutation({
                email,
                password,
            }).unwrap();

            await SecureStore.setItemAsync(TOKEN_KEY, authToken);
            setToken(authToken);
            setUser(userResponse);
            router.replace("/");
        },
        [router, loginMutation]
    );

    const register = useCallback(
        async (name: string, email: string, password: string) => {
            const { authToken, user: userResponse } = await registerMutation({
                name,
                email,
                password,
            }).unwrap();

            await SecureStore.setItemAsync(TOKEN_KEY, authToken);
            setToken(authToken);
            setUser(userResponse);
            router.replace("/");
        },
        [router, registerMutation]
    );


    const logout = useCallback(async () => {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        setToken(null);
        setUser(null);
        router.replace("/login");
    }, [router]);

    const value = useMemo<AuthContextValue>(
        () => ({
            user,
            isAuthenticated: !!user,
            isLogging: isLoggingIn || isRegistering || isMeLoading,
            isInitializing,
            login,
            register,
            logout,
        }),
        [
            user,
            isLoggingIn,
            isRegistering,
            isMeLoading,
            isInitializing,
            login,
            register,
            logout,
        ]
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
