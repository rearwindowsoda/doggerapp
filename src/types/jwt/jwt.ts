import {JwtPayload} from "jsonwebtoken";

export interface RefreshTokenVerifiedResponse extends JwtPayload {
    login: string;
}