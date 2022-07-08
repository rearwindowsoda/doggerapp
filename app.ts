import express, { json} from 'express';
import fileUpload from 'express-fileupload';
import 'express-async-errors';
import 'reflect-metadata';
import {handleError} from "./utils/errors";
import {newPostRouter} from "./routers/newpost";
import {createConnection} from "typeorm";
import {dbSettings} from "./config/db";
const app = express();

(async () => {
    try{
        await createConnection({
            type: "mysql",
            host: dbSettings.host,
            port: dbSettings.port,
            username: dbSettings.username,
            password: dbSettings.password,
            database: dbSettings.database,
        })
        console.log('Connected to database');
    }catch (e){
        console.error('Unable to connect to database');
        throw new Error('Unable to connect to database')
    }})()

app.use(fileUpload({
    limits:{fileSize: 5 * 1024 * 1024},
    abortOnLimit: true,
    useTempFiles : true,
    tempFileDir : 'uploads/tmp/',
    preserveExtension: 4,

}));

//Express.json middleware
app.use(json());

/*Express Router*/
app.use('/upload', newPostRouter);


/*Handling errors*/
app.use(handleError);


/* Starting application */
app.listen('3000', () => {
    console.log('Listening on http://localhost:3000');
});

