export interface IColdShowerEntry {
    id: number;
    userId: number;
    date: string;
    feeling: number;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface IColdShowerStats {
    currentStreak: number;
    longestStreak: number;
    total: number;
    lastEntryDate: string | null;
    loggedToday: boolean;
}

export interface ILogColdShowerPayload {
    date?: string;
    feeling: number;
    notes?: string;
}
