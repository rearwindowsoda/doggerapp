import * as jwt from "jsonwebtoken";
import {ACCESS_TOKEN_SECRET} from "../config/jwt/token.secret";

export function generateAccessToken(user) {
    return jwt.sign(user, ACCESS_TOKEN_SECRET, {expiresIn: '5m'})
}
