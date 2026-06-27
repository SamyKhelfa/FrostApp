import {emptySplitApi} from "@/infra/http";
import type {
    IChangePasswordPayload,
    IChangePasswordResponse,
    IUpdateMePayload,
    IUser
} from "@/core/interfaces";

export const userApi = emptySplitApi.injectEndpoints({
    endpoints: (builder) => ({
        getMe: builder.query<IUser, void>({
            query: () => ({
                url: "/users/me",
                method: "GET",
            }),
            providesTags: ["Me"],
        }),
        updateMe: builder.mutation<IUser, IUpdateMePayload>({
            query: (body) => ({
                url: "/users/me",
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["Me"],
        }),
        changePassword: builder.mutation<IChangePasswordResponse, IChangePasswordPayload>({
            query: (body) => ({
                url: "/users/me/password",
                method: "PATCH",
                body
            }),
        }),
    }),
})

export const {
    useGetMeQuery,
    useUpdateMeMutation,
    useChangePasswordMutation,
} = userApi;