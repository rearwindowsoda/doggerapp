import {NewPostEntity, PostEntity} from "../types/post/post-entity";
import {ValidationError} from "../utils/errors";
import {v4} from "uuid";
import {Post} from "../entity/Post";
import {GetListOfPostsResponse, TopTenPostsResponse} from "../types/post/post-list";
import {AppDataSource} from "../data-source";
import {User} from "../entity/User";

export class PostRecord implements PostEntity {
    public id: string;
    public createdAt: Date;
    public description: string;
    public link: string;

    constructor(obj: NewPostEntity) {
        if (!obj.link || typeof obj.link !== 'string' || obj.link.length > 200) {
            throw new ValidationError('Saving picture to db could not be done')
        }

        this.id = v4();
        this.createdAt = new Date();
        this.link = obj.link;
        this.description = obj.description;
    }

    async insert(): Promise<string> {
        const newPostSave = new Post();
        newPostSave.id = this.id
        newPostSave.link = this.link
        newPostSave.createdAt = this.createdAt;
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

    /*This might not be the best idea ever ;D */
    static async getTopTen(): Promise<TopTenPostsResponse> {
        const postRepository = AppDataSource.getRepository(Post)
        const query = await postRepository.query('SELECT `post`.`id`, `post`.`link`, `post`.`createdAt`, `post`.`description`, COUNT(`user`.`likesId`) "likes" FROM `user` INNER JOIN post ON `user`.`likesId` = `post`.`id` GROUP BY `user`.`likesId` ORDER BY COUNT(`user`.`likesId`) DESC LIMIT 10')
return await Promise.all(query.map(el => new PostRecord(el) ))
    }

 static async likePost(id: string, login: string):Promise<string>{

        const postRepository = AppDataSource.getRepository(User)
         await postRepository.query('UPDATE `user` SET `user`.`likesId` = ? WHERE `user`.`login` = ?', [id, login])
        return id
 }

}