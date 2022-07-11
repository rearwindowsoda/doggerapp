import {JwtPayload, verify} from 'jsonwebtoken';
import {ACCESS_TOKEN_SECRET} from "../config/jwt/token.secret";
import {NextFunction, Request, Response} from "express";



export function authenticateToken(req: Request, res: Response, next: NextFunction) {
    console.log(req.cookies)
    try {
        const accessToken = req.cookies['access-token'];
        const payload = verify(accessToken, ACCESS_TOKEN_SECRET);
        if (!payload) {
            return res.status(401).send({
                message: 'User unauthenticated. Log in'
            });
        } else {
            res.locals.user = (payload as JwtPayload).login;
            next();
        }
    } catch (e) {
        console.error(e)
        res.status(401).send({message: 'User unauthenticated. Log in'})

    }
}


