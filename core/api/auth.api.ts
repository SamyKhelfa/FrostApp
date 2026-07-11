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
        }),
        forgotPassword: builder.mutation<{ message: string }, { email: string }>({
            query: (body) => ({
                url: "/auth/forgot-password",
                method: "POST",
                body,
            }),
        }),
        resetPassword: builder.mutation<
            { message: string },
            { token: string; newPassword: string }
        >({
            query: (body) => ({
                url: "/auth/reset-password",
                method: "POST",
                body,
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useMeQuery,
    useRegisterMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
} = authApi;