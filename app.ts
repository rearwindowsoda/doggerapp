import express, { json} from 'express';
import fileUpload from 'express-fileupload';
import 'express-async-errors';
import 'reflect-metadata';
import {handleError} from "./utils/errors";
import {newPostRouter} from "./routers/newpost";
const app = express();

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

