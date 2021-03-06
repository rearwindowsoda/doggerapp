import {PostEntity} from "./post-entity";

export interface GetListOfPostsResponse {
    posts: PostEntity[];
    pagesCount: number;
}

export type TopTenPostsResponse = PostEntity[];