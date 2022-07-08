import {PostEntity} from "./post-entity";

export interface GetListOfPostsResponse {
    posts: PostEntity[];
    pagesCount: number;
}