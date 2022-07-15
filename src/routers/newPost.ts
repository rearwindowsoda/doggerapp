import {Request, Response, Router} from 'express';
import {UploadedFile} from "express-fileupload";
import * as path from "path";
import {v4} from "uuid";
import {unlink} from "fs/promises";
import {ValidationError} from "../utils/errors";
import {imgurClient} from "../utils/imgurClient";
import {PostRecord} from "../records/post.record";
import {authenticateToken} from "../middlewares/authenticate-token";

export const newPostRouter = Router();

newPostRouter
    .post('/post', authenticateToken, async (req: Request, res: Response) => {
        const description = req.body.description.trim();
        /*Validating description*/
        if(!description || description.length > 200 || description.length < 20){
            throw new ValidationError('Your post must contain a short description with minimal number of 20 characters but not longer than 200 characters.')
        }
        if(typeof description !== 'string'){
            throw new ValidationError('Please type in the description in correct (plain text) format.')
        }

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
        console.log(description)
        try{
            const newPost = new PostRecord({
                description: description,
            link: imgurResponse.data.link,
            })
           await newPost.insert();
            res.status(201).send({message: newPost.id})
        }catch(e){
            console.error(e);
            throw new Error('Something went wrong')
        }


    });