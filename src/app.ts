import * as express from 'express'
import * as fileUpload from 'express-fileupload';
import 'express-async-errors';
import 'reflect-metadata';
import * as cookieParser from 'cookie-parser'
import {handleError} from "./utils/errors";
import {newPostRouter} from "./routers/newPost";
import {AppDataSource} from "./data-source";
import {showpostsRouter} from "./routers/showPosts";
import {userRouter} from "./routers/user";

/*Initialize DB Connection*/
AppDataSource.initialize().then(async () => {
    const app = express();

    app.use(fileUpload({
        limits: {fileSize: 5 * 1024 * 1024},
        abortOnLimit: true,
        useTempFiles: true,
        tempFileDir: 'uploads/tmp/',
        preserveExtension: 4,

    }));

    /*Middlewares*/
    app.use(express.json());
    app.use(cookieParser())
    app.use(handleError);

    /*Express Router*/
    app.use('/upload', newPostRouter);
    app.use('/show', showpostsRouter);
    app.use('/user', userRouter)


    /* Starting application */
    app.listen('3000', () => {
        console.log('Listening on http://localhost:3000');
    });

}).catch(error => console.log(error))

