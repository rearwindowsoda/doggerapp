import {NewPostEntity, PostEntity} from "../types/post/post-entity";
import {ValidationError} from "../utils/errors";
import {v4} from "uuid";
import {Post} from "../entity/Post";

export class PostRecord implements PostEntity {
    public id: string;
    public createdAt: Date;
    public likes: number;
    public link: string;

    constructor(obj: NewPostEntity) {
     if (!obj.link|| typeof obj.link !== 'string' || obj.link.length > 200){
         throw new ValidationError('Wystąpił błąd z zapisem zdjęcia do naszej bazy danych')
     }

     this.id = v4();
     this.createdAt = new Date();
     this.likes = 0;
     this.link = obj.link;
    }

    async insert(): Promise<string>{
        const newPostSave = new Post();
        newPostSave.id = this.id
        newPostSave.link = this.link
        newPostSave.createdAt = this.createdAt;
        newPostSave.likes = this.likes;
        await newPostSave.save();

    return this.id
    }

}