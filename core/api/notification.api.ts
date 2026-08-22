import type { INotificationFeed } from "@/core/interfaces";
import { emptySplitApi } from "@/infra/http";

export const notificationApi = emptySplitApi.injectEndpoints({
    endpoints: (builder) => ({
        getNotifications: builder.query<INotificationFeed, void>({
            query: () => ({
                url: "/notifications",
                method: "GET",
            }),
            providesTags: ["Notifications"],
        }),
        markNotificationsRead: builder.mutation<void, void>({
            query: () => ({
                url: "/notifications/read",
                method: "POST",
            }),
            invalidatesTags: ["Notifications"],
        }),
    }),
});

export const { useGetNotificationsQuery, useMarkNotificationsReadMutation } =
    notificationApi;
