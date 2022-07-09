
export interface PostEntity {
    id: string;
    link: string;
    likes: number;
    description: string;
    createdAt: Date;
}

export type NewPostEntity = Omit<PostEntity, "id" | "createdAt" | "likes">