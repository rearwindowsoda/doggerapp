import {Request, Response, Router} from "express";
import {PostRecord} from "../records/post.record";

export const showpostsRouter = Router();

showpostsRouter
    .get('/posts/top', async (req: Request, res: Response) => {
        try{
            const postList = await PostRecord.getTopTen();
            console.log(postList)
            res.json(postList)
        }
        catch (e) {
            res.status(500).send({message: 'Something went wrong, try again later.'})
        }

    })
    .get('/posts/:pageNumber?', async (req: Request, res: Response) => {
        try{
            const pageNumber = Number(req.params.pageNumber) ?? 1
            const postList = await PostRecord.showPosts(pageNumber);
            res.json(postList)
        }
    catch (e) {
            res.status(500).send({message:'Something went wrong, try again later.'})
        }
    })

