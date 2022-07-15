import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm"
import {Post} from "./Post";

@Entity()
export class User extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({
        length: 15,
        unique: true,
    })
    login: string

    @Column({
        length: 60,
        unique: true,
    })
    email: string

    @Column()
    password: string

    @Column('datetime')
    registeredAt: Date

@ManyToOne(() => Post, likedPost => likedPost.id)
    likes: Post;

}
