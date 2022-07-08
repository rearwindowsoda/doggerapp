import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Post {

    @PrimaryGeneratedColumn('uuid')
    id: number

    @Column()
    link: string

    @Column()
    likes: number

    @Column('datetime')
    createdAt: Date

}
