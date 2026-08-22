import type { ConversationType, IMessageAuthor } from "./chat.interface";

export type NotificationType = "JOIN_REQUEST" | "JOIN_APPROVED";

export interface INotification {
    id: number;
    type: NotificationType;
    readAt: string | null;
    createdAt: string;
    actor: IMessageAuthor | null;
    conversation: {
        id: number;
        name: string | null;
        type: ConversationType;
    } | null;
}

export interface INotificationFeed {
    items: INotification[];
    unreadCount: number;
}
