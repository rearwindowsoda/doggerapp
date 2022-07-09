import {Request, Response, Router} from "express";
import {UserRecord} from "../records/user.record";
import {LoggedUserSuccessfulResponse} from "../types/user/user";
import {authenticateToken} from "../middlewares/authenticate-token";
import {JwtPayload, verify} from "jsonwebtoken";
import {REFRESH_TOKEN_SECRET} from "../config/jwt/token.secret";
import {generateAccessToken} from "../utils/generateTokens";
import {RefreshTokenVerifiedResponse} from "../types/jwt/jwt";


export const userRouter = Router();

userRouter
    .post('/login', async (req: Request, res: Response) => {
        const {login, password} = req.body;

        if (!login || !password) {
            res.status(500).send('Something went wrong. Try again later.')
        }
        const loginResponseFromDb = await UserRecord.loginUser(login, password);
        if (loginResponseFromDb.isAuth === true) {
            const verifiedUserToken = (loginResponseFromDb as LoggedUserSuccessfulResponse).accessToken;
            const verifiedUserAccessToken = (loginResponseFromDb as LoggedUserSuccessfulResponse).refreshToken;
            res.cookie('access-token', verifiedUserToken, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000
            }).cookie('refresh-token', verifiedUserAccessToken, {
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

        res.status(201).send('User created.')
    })

    .post('/token', authenticateToken, async (req: Request, res: Response) => {

        try {
            const refreshToken = req.cookies['refresh-token'];
            const payload: JwtPayload | string = verify(refreshToken, REFRESH_TOKEN_SECRET);
            if (!payload) {
                return res.status(401).send({
                    message: 'Unauthenticated token'
                });
            }
           const newAccessToken =  generateAccessToken({login: (payload as RefreshTokenVerifiedResponse).login});
            res.cookie('access-token', newAccessToken, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000
            });
            res.send(
                {message: 'New access token granted'}
            )
        } catch (e) {
            return res.status(401).send({
                message: 'Unauthenticated token'
            })
        }

    })

.post('/logout', async (req: Request, res: Response) => {
    try{
        res.clearCookie('access-token').clearCookie('refresh-token').send({message: 'User successfully logged out'})
    }catch (e) {
        res.status(500).send({message: 'Something went wrong, try again'})
    }
})
