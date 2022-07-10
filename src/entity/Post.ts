import {BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm"
import {User} from "./User";

@Entity()
export class Post extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({
        length: 200,
    })
    link: string

    @Column({
        length: 200,
    })
    description: string

    @Column('datetime')
    createdAt: Date

@OneToMany(() => User, (user) => user.id, {cascade: true})
    users: User[];
}
