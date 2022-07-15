import {Request, Response, Router} from "express";
import {UserRecord} from "../records/user.record";
import {LoggedUserSuccessfulResponse} from "../types";


export const userRouter = Router();

userRouter
    .post('/login', async (req: Request, res: Response) => {
        const {login, password} = req.body;

        if (!login || !password) {
            res.status(500).send({message: 'Something went wrong. Try again later.'})
        }
        const loginResponseFromDb = await UserRecord.loginUser(login, password);
        if (loginResponseFromDb.isAuth === true) {
            const verifiedUserToken = (loginResponseFromDb as LoggedUserSuccessfulResponse).accessToken;
            res.cookie('access-token', verifiedUserToken, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000
            }).send(loginResponseFromDb)
        } else {
            res.status(401).send(loginResponseFromDb);
        }

    })
    .post('/register', async (req: Request, res: Response) => {
        const {login, password, email} = req.body;
        const newUser = new UserRecord({login, password, email})
        await newUser.registerNewUser();

        res.status(201).send({message: `User ${login}  created.`})
    })


    .delete('/logout', async (req: Request, res: Response) => {
        try {
            res.clearCookie('refresh-token').send({message: 'User successfully logged out'})
        } catch (e) {
            res.status(500).send({message: 'Something went wrong, try again'})
        }
    })
