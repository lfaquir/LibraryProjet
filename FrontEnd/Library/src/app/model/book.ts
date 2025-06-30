import { Author } from "./author";


export interface Book {
    id: number;
    title: string;
    description: string;
    authorId: number;
    authorName?:string;
    imageFileName?: string;
}