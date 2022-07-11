import {Request, Response, Router} from "express";
import {PostRecord} from "../records/post.record";
import {ValidationError} from "../utils/errors";
import {authenticateToken} from "../middlewares/authenticate-token";
import {PostLikeResponse} from "../types/post/post-like";

export const likePostRouter = Router();

likePostRouter
    .patch('/:id', authenticateToken, async (req: Request, res: Response) => {
        const {id} = req.params;
        if (!id) {
            throw new ValidationError('Could not like this post. Try again later.')
        }
        try {
            const like: PostLikeResponse = await PostRecord.likePost(id, res.locals.user)
            res.json({message: like.message})

        } catch (e) {
            console.error(e)
            res.status(403).send({message: 'Something went wrong. Try again later.'})
        }
    })



