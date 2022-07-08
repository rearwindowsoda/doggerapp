import {Router} from "express";
import {PostRecord} from "../records/post.record";

export const showpostsRouter = Router();

showpostsRouter
    .get('/posts/:pageNumber?', async (req, res) => {
const pageNumber = Number(req.params.pageNumber) ?? 1
const postList = await PostRecord.showPosts(pageNumber);
        res.json(postList)
    })
