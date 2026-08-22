export type ConversationType = "COMMUNITY" | "DIRECT";
export type JoinPolicy = "OPEN" | "APPROVAL";
export type ParticipantStatus = "ACTIVE" | "PENDING";
export type ParticipantRole = "OWNER" | "ADMIN" | "MEMBER";

export interface IMessageAuthor {
    id: number;
    name: string;
    avatar?: string | null;
}

export interface IMessage {
    id: number;
    conversationId: number;
    authorId: number;
    content: string;
    createdAt: string;
    author: IMessageAuthor;
}

export interface IConversation {
    id: number;
    type: ConversationType;
    pairKey?: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface IConversationSummary {
    id: number;
    type: ConversationType;
    updatedAt: string;
    lastMessage: IMessage | null;
    participants: IMessageAuthor[];
    unreadCount: number;
}

export interface ICommunitySummary {
    id: number;
    name: string | null;
    description: string | null;
    image: string | null;
    joinPolicy: JoinPolicy;
    updatedAt: string;
    memberCount: number;
    lastMessage: IMessage | null;
    membership: ParticipantStatus | null;
    role: ParticipantRole | null;
    pendingCount: number;
}

export interface IJoinRequest {
    id: number;
    userId: number;
    joinedAt: string;
    user: IMessageAuthor;
}

export interface ICreateCommunityPayload {
    name: string;
    description?: string;
    joinPolicy?: JoinPolicy;
}

export interface IConversationMember {
    userId: number;
    role: ParticipantRole;
    joinedAt: string;
    user: IMessageAuthor;
}

export interface IConversationDetails {
    id: number;
    type: ConversationType;
    name: string | null;
    description: string | null;
    image: string | null;
    joinPolicy: JoinPolicy;
    createdAt: string;
    members: IConversationMember[];
    memberCount: number;
    pendingCount: number;
    me: {
        role: ParticipantRole;
        muted: boolean;
        isAdmin: boolean;
        isOwner: boolean;
    };
}
