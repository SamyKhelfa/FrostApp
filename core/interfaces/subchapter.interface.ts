import { type IChapter } from "./chapter.interface";

export interface ISubchapter {
    id: number;
    title: string;
    description: string;
    video: string;
    duration: number;
    active: boolean;
    position: number;
    chapterId: number | null;

    chapter?: IChapter;
    status: boolean;
}