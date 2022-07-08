import express, { json, Request, Response } from 'express';
import fileUpload, { UploadedFile } from 'express-fileupload';
import { createReadStream } from 'fs';
import {unlink} from 'fs/promises';
import ImgurClient from 'imgur';
import path from 'path';
import { v4 } from 'uuid';
import { CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN } from './config/config';
import {handleError, ValidationError} from "./utils/errors";
const app = express();

app.use(fileUpload({
    limits:{fileSize: 5 * 1024 * 1024},
    useTempFiles : true,
    tempFileDir : 'uploads/tmp/',
    preserveExtension: 4,

}));

//Express.json middleware
app.use(json());

/* Testing uploading files */
app.post('/upload', async(req: Request, res: Response) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
    console.log(req.files);

    const uploadedImage: UploadedFile = req.files.file as UploadedFile;

    const extensionFinder = uploadedImage.name.split('.');
    console.log(__dirname);

    const uploadPath = path.join( __dirname + '/uploads/images/' + v4() + '.' + extensionFinder[extensionFinder.length - 1]);
    console.log(uploadPath);

    /* Safely temporarily saving on a server */
    uploadedImage.mv(uploadPath, function(err) {
        if (err){
            res.status(500).send(err);
        }
    });
    /* Uploading to Imgur */
    try{
        const client = new ImgurClient({
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            refreshToken: REFRESH_TOKEN,
        });

        const imgUrResponse = 	await client.upload({
            image: createReadStream(uploadPath),
            type: 'stream',
        });
        console.log(imgUrResponse);
        await unlink(uploadPath);
    }catch(e){
        throw new ValidationError('Something went wrong, sorry');
    }

});

/*Handling errors*/
app.use(handleError);


/* Starting application */
app.listen('3000', () => {
    console.log('Listening on http://localhost:3000');
});

