import * as jwt from "jsonwebtoken";
import {ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET} from "../config/jwt/token.secret";

export function generateAccessToken(user) {
    return jwt.sign(user, ACCESS_TOKEN_SECRET, {expiresIn: '5m'})
}

export function generateRefreshToken(user) {
    return jwt.sign(user, REFRESH_TOKEN_SECRET, {expiresIn: '3d'})
}