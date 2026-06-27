import { ILoginPayload, ILoginResponse, IUser, IRegisterPayload, IRegisterResponse } from "@/core/interfaces";
import { emptySplitApi } from "@/infra/http";

export const authApi = emptySplitApi.injectEndpoints?.({
    endpoints: (builder) => ({
        me: builder.query<IUser, void>({
            query: () => ({
                url: "/auth/me",
                method: "GET",
            }),
            providesTags: ["Me"],
        }),
        login: builder.mutation<ILoginResponse, ILoginPayload>({
            query: (body: ILoginPayload) => ({
                body,
                method: "POST",
                url: "/auth/login",
            }),
        }),
        register: builder.mutation<IRegisterResponse, IRegisterPayload>({
            query: (body: IRegisterPayload) => ({
                body,
                method:"POST",
                url:"/auth/register",
            })
        })
    }),
});

export const { useLoginMutation, useMeQuery, useRegisterMutation } = authApi;