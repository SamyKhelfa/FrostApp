import type { ILesson } from "./lesson.interface";
import type { ISubchapter } from "./subchapter.interface";

export interface IChapter {
    id: number;
    title: string;
    description: string;
    image: string;
    images?: string[];
    status: boolean;
    position: number;
    lesson: ILesson;
    createdAt: string;
    updateAt: string;
    subChapters?: ISubchapter[];
}