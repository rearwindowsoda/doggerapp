import {NewPostEntity, PostEntity} from "../types/post/post-entity";
import {ValidationError} from "../utils/errors";
import {v4} from "uuid";
import {Post} from "../entity/Post";
import {GetListOfPostsResponse, TopTenPostsResponse} from "../types/post/post-list";
import {AppDataSource} from "../data-source";

export class PostRecord implements PostEntity {
    public id: string;
    public createdAt: Date;
    public description: string;
    public likes: number;
    public link: string;

    constructor(obj: NewPostEntity) {
        if (!obj.link || typeof obj.link !== 'string' || obj.link.length > 200) {
            throw new ValidationError('Wystąpił błąd z zapisem zdjęcia do naszej bazy danych')
        }

        this.id = v4();
        this.createdAt = new Date();
        this.likes = 0;
        this.link = obj.link;
        this.description = obj.description;
    }

    async insert(): Promise<string> {
        const newPostSave = new Post();
        newPostSave.id = this.id
        newPostSave.link = this.link
        newPostSave.createdAt = this.createdAt;
        newPostSave.likes = this.likes;
        newPostSave.description = this.description;
        await newPostSave.save();

        return this.id
    }

    static async showPosts(currentPage): Promise<GetListOfPostsResponse> {
        const postRepository = AppDataSource.getRepository(Post)
        const maxOnPage = 5;
        const [posts, count] = await postRepository.findAndCount({
            skip: maxOnPage * (currentPage - 1),
            take: maxOnPage,
            order: {createdAt: 'DESC'}
        })
        const pagesCount = Math.ceil(count / maxOnPage)

        return {
            posts, pagesCount
        }
    }

    static async topPosts(): Promise<TopTenPostsResponse> {
        const postRepository = AppDataSource.getRepository(Post);

        return await postRepository.createQueryBuilder("post")
            .orderBy("post.likes", "DESC")
            .limit(10)
            .getMany()

    }
}