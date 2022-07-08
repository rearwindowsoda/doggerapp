
export interface PostEntity {
    id: string;
    link: string;
    likes: number;
    createdAt: Date;
}

export type NewPostEntity = Omit<PostEntity, "id" | "createdAt" | "likes">