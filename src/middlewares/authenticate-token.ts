import {JwtPayload, verify} from 'jsonwebtoken';
import {ACCESS_TOKEN_SECRET} from "../config/jwt/token.secret";
import {NextFunction, Request, Response} from "express";


interface RequestWithVerifiedUser extends Request {
    user: string | JwtPayload;
}

type PayloadVerification = JwtPayload | string;

export function authenticateToken(req: RequestWithVerifiedUser, res: Response, next: NextFunction) {
    console.log(req.cookies)
    try {
        const accessToken = req.cookies['access-token'];
        const payload: PayloadVerification = verify(accessToken, ACCESS_TOKEN_SECRET);
        console.log(payload)
        if (!payload) {
            return res.status(401).send({
                message: 'Unauthenticated.'
            });
        } else {
            next();
        }
    } catch (e) {
        console.error(e)
        res.status(500).send({message: 'Something went wrong, sorry'})

    }
}


