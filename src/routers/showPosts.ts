import {Request, Response, Router} from "express";
import {PostRecord} from "../records/post.record";

export const showpostsRouter = Router();

showpostsRouter
    .get('/posts/top', async (req: Request, res: Response) => {
        const postList = await PostRecord.getTopTen();
        console.log(postList)
        res.json(postList)
    })
    .get('/posts/:pageNumber?', async (req: Request, res: Response) => {
        const pageNumber = Number(req.params.pageNumber) ?? 1
        const postList = await PostRecord.showPosts(pageNumber);

        res.json(postList)
    })

