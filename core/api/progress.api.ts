import { type IProgress } from "@/core/interfaces";
import { emptySplitApi } from "@/infra/http";

export const progressApi = emptySplitApi.injectEndpoints({
    endpoints: (builder) => ({
        getMyProgress: builder.query<IProgress[], void>({
            query: () => ({
                url: "/progress",
                method: "GET",
            }),
            providesTags: ["Progress"],
        }),
        completeModule: builder.mutation<IProgress, number>({
            query: (subChapterId) => ({
                url: `/progress/${subChapterId}`,
                method: "POST",
            }),
            invalidatesTags: ["Progress"],
        }),
        uncompleteModule: builder.mutation<void, number>({
            query: (subChapterId) => ({
                url: `/progress/${subChapterId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Progress"],
        }),
    }),
});

export const {
    useGetMyProgressQuery,
    useCompleteModuleMutation,
    useUncompleteModuleMutation,
} = progressApi;
