import {Router} from "express";

import {UserRecord} from "../records/user.record";

export const userRouter = Router();

userRouter
    .get('/login', async (req, res) => {
        res.send('ok')
    })
    .post('/register', async (req, res) => {
        const {login, password, email} = req.body;
            const newUser = new UserRecord({login, password, email})
            await newUser.registerNewUser()
            res.status(201).send('User created.')
    })