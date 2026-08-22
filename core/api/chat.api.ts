import type {
    IConversation,
    IConversationDetails,
    IConversationSummary,
    ICommunitySummary,
    ICreateCommunityPayload,
    IJoinRequest,
    IMessage,
    ParticipantStatus,
} from "@/core/interfaces";
import { emptySplitApi } from "@/infra/http";

export const chatApi = emptySplitApi.injectEndpoints({
    endpoints: (builder) => ({
        getConversations: builder.query<IConversationSummary[], void>({
            query: () => ({
                url: "/conversations",
                method: "GET",
            }),
            providesTags: ["Conversations"],
        }),
        getCommunityConversation: builder.query<IConversation, void>({
            query: () => ({
                url: "/conversations/community",
                method: "GET",
            }),
        }),
        getCommunities: builder.query<ICommunitySummary[], void>({
            query: () => ({
                url: "/conversations/communities",
                method: "GET",
            }),
            providesTags: ["Communities"],
        }),
        createCommunity: builder.mutation<IConversation, ICreateCommunityPayload>({
            query: (body) => ({
                url: "/conversations/communities",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Communities", "Conversations"],
        }),
        joinCommunity: builder.mutation<{ status: ParticipantStatus }, number>({
            query: (conversationId) => ({
                url: `/conversations/${conversationId}/join`,
                method: "POST",
            }),
            invalidatesTags: ["Communities", "Conversations"],
        }),
        leaveCommunity: builder.mutation<void, number>({
            query: (conversationId) => ({
                url: `/conversations/${conversationId}/leave`,
                method: "POST",
            }),
            invalidatesTags: (_r, _e, id) => [
                { type: "Details" as const, id },
                "Communities",
                "Conversations",
            ],
        }),
        getJoinRequests: builder.query<IJoinRequest[], number>({
            query: (conversationId) => ({
                url: `/conversations/${conversationId}/requests`,
                method: "GET",
            }),
            providesTags: (_r, _e, id) => [{ type: "Requests" as const, id }],
        }),
        reviewJoinRequest: builder.mutation<
            void,
            { conversationId: number; userId: number; approve: boolean }
        >({
            query: ({ conversationId, userId, approve }) => ({
                url: `/conversations/${conversationId}/requests/${userId}/${
                    approve ? "approve" : "reject"
                }`,
                method: "POST",
            }),
            invalidatesTags: (_r, _e, arg) => [
                { type: "Requests" as const, id: arg.conversationId },
                { type: "Details" as const, id: arg.conversationId },
                "Communities",
            ],
        }),
        openDirectConversation: builder.mutation<IConversation, number>({
            query: (userId) => ({
                url: `/conversations/direct/${userId}`,
                method: "POST",
            }),
            invalidatesTags: ["Conversations"],
        }),
        getConversationDetails: builder.query<IConversationDetails, number>({
            query: (conversationId) => ({
                url: `/conversations/${conversationId}`,
                method: "GET",
            }),
            providesTags: (_r, _e, id) => [{ type: "Details" as const, id }],
        }),
        setConversationMuted: builder.mutation<
            void,
            { conversationId: number; muted: boolean }
        >({
            query: ({ conversationId, muted }) => ({
                url: `/conversations/${conversationId}/mute`,
                method: "POST",
                body: { muted },
            }),
            invalidatesTags: (_r, _e, arg) => [
                { type: "Details" as const, id: arg.conversationId },
            ],
        }),
        getMessages: builder.query<
            IMessage[],
            { conversationId: number; before?: number; limit?: number }
        >({
            query: ({ conversationId, before, limit }) => ({
                url: `/conversations/${conversationId}/messages`,
                method: "GET",
                params: { ...(before ? { before } : {}), ...(limit ? { limit } : {}) },
            }),
            providesTags: (_result, _error, arg) => [
                { type: "Messages" as const, id: arg.conversationId },
            ],
        }),
        sendMessage: builder.mutation<
            IMessage,
            { conversationId: number; content: string }
        >({
            query: ({ conversationId, content }) => ({
                url: `/conversations/${conversationId}/messages`,
                method: "POST",
                body: { content },
            }),
            invalidatesTags: (_result, _error, arg) => [
                { type: "Messages" as const, id: arg.conversationId },
                "Conversations",
            ],
        }),
        markConversationRead: builder.mutation<void, number>({
            query: (conversationId) => ({
                url: `/conversations/${conversationId}/read`,
                method: "POST",
            }),
            invalidatesTags: ["Conversations"],
        }),
    }),
});

export const {
    useGetConversationsQuery,
    useGetCommunityConversationQuery,
    useGetCommunitiesQuery,
    useCreateCommunityMutation,
    useJoinCommunityMutation,
    useLeaveCommunityMutation,
    useGetConversationDetailsQuery,
    useSetConversationMutedMutation,
    useGetJoinRequestsQuery,
    useReviewJoinRequestMutation,
    useOpenDirectConversationMutation,
    useGetMessagesQuery,
    useSendMessageMutation,
    useMarkConversationReadMutation,
} = chatApi;
