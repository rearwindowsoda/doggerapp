import {Request, Response, Router} from 'express';
import {UploadedFile} from "express-fileupload";
import path from "path";
import {v4} from "uuid";
import ImgurClient from "imgur";
import {CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN} from "../config/config";
import {createReadStream} from "fs";
import {unlink} from "fs/promises";
import {ValidationError} from "../utils/errors";

export const newPostRouter = Router();

newPostRouter
.post('/post', async(req: Request, res: Response) => {
     if (!req.files || Object.keys(req.files).length === 0) {
            throw new ValidationError('No files were uploaded')
        }
        const uploadedImage: UploadedFile = req.files.file as UploadedFile;
if(uploadedImage.mimetype !== 'image/jpeg' && uploadedImage.mimetype !=='image/png'){
    throw new ValidationError('You can only upload JPG and PNG files ')
}
        const extensionFinder = uploadedImage.name.split('.');
        console.log(__dirname);

        const uploadPath = path.join(__dirname, '..', 'uploads/images' + v4() + '.' + extensionFinder[extensionFinder.length - 1]);
        console.log(uploadPath);

        /* Safely temporarily saving on a server */
        uploadedImage.mv(uploadPath, function(err) {
            if (err){
                throw new ValidationError('Something went wrong, sorry.');
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