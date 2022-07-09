import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm"

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

    @Column()
    likes: number

    @Column('datetime')
    createdAt: Date

}
