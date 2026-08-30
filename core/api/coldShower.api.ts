import type {
    IColdShowerEntry,
    IColdShowerStats,
    ILogColdShowerPayload,
} from "@/core/interfaces";
import { emptySplitApi } from "@/infra/http";

export const coldShowerApi = emptySplitApi.injectEndpoints({
    endpoints: (builder) => ({
        getColdShowerStats: builder.query<IColdShowerStats, void>({
            query: () => ({
                url: "/cold-showers/stats",
                method: "GET",
            }),
            providesTags: ["ColdShowers"],
        }),
        getColdShowers: builder.query<
            IColdShowerEntry[],
            { from: string; to: string }
        >({
            query: ({ from, to }) => ({
                url: "/cold-showers",
                method: "GET",
                params: { from, to },
            }),
            providesTags: ["ColdShowers"],
        }),
        logColdShower: builder.mutation<IColdShowerEntry, ILogColdShowerPayload>({
            query: (body) => ({
                url: "/cold-showers",
                method: "POST",
                body,
            }),
            invalidatesTags: ["ColdShowers"],
        }),
        removeColdShower: builder.mutation<void, string>({
            query: (date) => ({
                url: `/cold-showers/${date}`,
                method: "DELETE",
            }),
            invalidatesTags: ["ColdShowers"],
        }),
    }),
});

export const {
    useGetColdShowerStatsQuery,
    useGetColdShowersQuery,
    useLogColdShowerMutation,
    useRemoveColdShowerMutation,
} = coldShowerApi;
