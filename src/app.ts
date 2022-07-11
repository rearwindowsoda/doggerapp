import * as express from 'express'
import * as fileUpload from 'express-fileupload';
import 'express-async-errors';
import 'reflect-metadata';
import * as cors from 'cors';
import * as cookieParser from 'cookie-parser'
import {handleError} from "./utils/errors";
import {newPostRouter} from "./routers/newPost";
import {AppDataSource} from "./data-source";
import {showpostsRouter} from "./routers/showPosts";
import {userRouter} from "./routers/user";
import {likePostRouter} from "./routers/likePost";
import {corsConfig} from "./config/cors/cors";

/*Initialize DB Connection*/
AppDataSource.initialize().then(async () => {
    const app = express();

    /*Cors*/
    app.use(cors({
        origin: corsConfig,
    }))


    /*Middlewares*/
    app.use(fileUpload({
        limits: {fileSize: 5 * 1024 * 1024},
        abortOnLimit: true,
        useTempFiles: true,
        tempFileDir: 'uploads/tmp/',
        preserveExtension: 4,

    }));

    app.use(express.json());
    app.use(cookieParser())



    /*Express Router*/
    app.use('/upload', newPostRouter);
    app.use('/show', showpostsRouter);
    app.use('/user', userRouter);
    app.use('/post', likePostRouter);

/*Error handling*/
    app.use(handleError);

    /* Starting application */
    app.listen('3001', () => {
        console.log('Listening on http://localhost:3001');
    });

}).catch(error => console.log(error))

