import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const IS_DEV = true;

const API_PORT = 3000;

/**
 * En dev, l'API tourne sur la machine de dev — pas sur l'appareil.
 * "localhost" fonctionne sur simulateur (même pile réseau que le Mac) mais
 * désigne le téléphone lui-même sur un appareil physique.
 *
 * Expo expose l'hôte du bundler Metro (ex: "192.168.0.214:8081") : on en
 * extrait l'IP de la machine de dev, valable dans les deux cas.
 */
function resolveDevUrl(): string {
    const hostUri =
        Constants.expoConfig?.hostUri ??
        (Constants.expoGoConfig as { debuggerHost?: string } | undefined)
            ?.debuggerHost;

    const host = hostUri?.split(":")[0];

    return host ? `http://${host}:${API_PORT}` : `http://localhost:${API_PORT}`;
}

const devUrl = resolveDevUrl();
const prodUrl = `http://localhost:${API_PORT}`;

const apiUrl = IS_DEV ? devUrl : prodUrl;

/**
 * Notifie l'app quand la session n'est plus valide (token expiré, compte
 * désactivé…). AuthContext s'y abonne pour vider son state et rediriger.
 */
type SessionExpiredReason = "unauthorized" | "disabled";
type SessionExpiredListener = (reason: SessionExpiredReason) => void;

const sessionExpiredListeners = new Set<SessionExpiredListener>();

export function onSessionExpired(listener: SessionExpiredListener) {
    sessionExpiredListeners.add(listener);
    return () => {
        sessionExpiredListeners.delete(listener);
    };
}

const baseQueryWithReauth =
    (baseQueryOptions: Parameters<typeof fetchBaseQuery>[0]) =>
        async (
            args: Parameters<ReturnType<typeof fetchBaseQuery>>[0],
            api: Parameters<ReturnType<typeof fetchBaseQuery>>[1],
            extraOptions: Parameters<ReturnType<typeof fetchBaseQuery>>[2],
        ) => {
            const result = await fetchBaseQuery(baseQueryOptions)(
                args,
                api,
                extraOptions,
            );

            const isAuthLogin =
                typeof args === "object" &&
                args !== null &&
                "url" in args &&
                (args as { url: string }).url.includes("/auth/login");

            if (
                !isAuthLogin &&
                (result?.error?.status === 401 || result?.error?.status === 403)
            ) {
                await SecureStore.deleteItemAsync("auth-token");
                await SecureStore.deleteItemAsync("user");

                const reason: SessionExpiredReason =
                    result.error.status === 403 ? "disabled" : "unauthorized";

                sessionExpiredListeners.forEach((listener) => listener(reason));
            }

            return result;
        };

export const emptySplitApi = createApi({
    reducerPath: "api",
    tagTypes: ["Me"],
    baseQuery: baseQueryWithReauth({
        baseUrl: apiUrl,
        prepareHeaders: async (headers: Headers) => {
            try {
                const authToken = await SecureStore.getItemAsync("auth-token");

                if (authToken) {
                    headers.set("Authorization", `Bearer ${authToken}`);
                }

                return headers;
            } catch (err) {
                console.log(err);
                return headers;
            }
        },
    }),
    endpoints: () => ({}),
});