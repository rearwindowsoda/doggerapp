import {Request, Response, Router} from 'express';
import {UploadedFile} from "express-fileupload";
import * as path from "path";
import {v4} from "uuid";
import {unlink} from "fs/promises";
import {ValidationError} from "../utils/errors";
import {imgurClient} from "../utils/imgurClient";
import {PostRecord} from "../records/post.record";

export const newPostRouter = Router();

newPostRouter
    .post('/post', async (req: Request, res: Response) => {
        /*Validating files request*/
        if (!req.files || Object.keys(req.files).length === 0) {
            throw new ValidationError('No files were uploaded')
        }
        const uploadedImage: UploadedFile = req.files.file as UploadedFile;
        /*Validating user's file*/
        if (uploadedImage.mimetype !== 'image/jpeg' && uploadedImage.mimetype !== 'image/png') {
            throw new ValidationError('You can only upload JPG and PNG files ')
        }
        const extensionFinder = uploadedImage.name.split('.');
        console.log(__dirname);

        const uploadPath = path.join(__dirname, '..', 'uploads/images' + v4() + '.' + extensionFinder[extensionFinder.length - 1]);
        console.log(uploadPath);

        /* Safely temporarily saving on a server */
        uploadedImage.mv(uploadPath, function (err) {
            if (err) {
                throw new ValidationError('Something went wrong, sorry.');
            }
        });

        /* Uploading to Imgur */
         const imgurResponse = await imgurClient(uploadPath);

        /*Safely removing picture from local server*/
        await unlink(uploadPath);

        /* Save image link do database */
        try{
            const newPost = new PostRecord({
            link: imgurResponse.data.link,
            })
           await newPost.insert();
            res.json(newPost.id)
        }catch(e){
            console.error(e);
            throw new Error('Something went wrong')
        }


    });