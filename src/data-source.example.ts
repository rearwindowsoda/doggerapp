import "reflect-metadata"
import { DataSource } from "typeorm"
import {Post} from "./entity/Post";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "123",
    port: 123,
    username: "root",
    password: "123",
    database: "123",
    synchronize: true,
    logging: true,
    entities: [Post],
    migrations: [],
    subscribers: [],
    bigNumberStrings: false,
})
