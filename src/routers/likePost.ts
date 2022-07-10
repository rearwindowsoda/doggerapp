import {Request, Response, Router} from "express";
import {PostRecord} from "../records/post.record";
import {ValidationError} from "../utils/errors";
import {JwtPayload, verify} from "jsonwebtoken";
import {ACCESS_TOKEN_SECRET} from "../config/jwt/token.secret";

export const likePostRouter = Router();

likePostRouter
    .patch('/:id', async (req: Request, res: Response) => {
        const {id} = req.params;
        if (!id) {
            throw new ValidationError('Could not like this post. Try again later.')
        }
        try {
            const accessToken = req.cookies['access-token'];
            const payload: JwtPayload | string = verify(accessToken, ACCESS_TOKEN_SECRET);

            if (!payload) {
                return res.status(403).send({
                    message: 'Forbidden. Log in first.'
                });
            } else {
                const login = (payload as JwtPayload).login;
                const like = await PostRecord.likePost(id, login)
                res.json({message: 'Post with id: ' + like + ' liked.'})
            }
        } catch (e) {
            console.error(e)
        res.status(403).send({message: 'Something went wrong. Try again later.'})
        }
    })



