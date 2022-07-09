import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm"

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
}
