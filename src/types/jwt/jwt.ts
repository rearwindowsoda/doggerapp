import {JwtPayload} from "jsonwebtoken";

export interface RefreshTokenVerifiedResponse extends JwtPayload {
    login: string;
}


export interface PayloadVerification {
    JwtPayload,
    login: string
}