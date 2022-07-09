import {Router} from "express";

import {UserRecord} from "../records/user.record";

export const userRouter = Router();

userRouter
    .post('/login', async (req, res) => {
        const {login, password} = req.body;
        if(!login || !password){
            res.status(500).send('Something went wrong. Try again later.')
        }
        const loggedUser = await UserRecord.loginUser(login, password)
       res.json(loggedUser)
    })
    .post('/register', async (req, res) => {
        const {login, password, email} = req.body;
            const newUser = new UserRecord({login, password, email})
            await newUser.registerNewUser()
            res.status(201).send('User created.')
    })