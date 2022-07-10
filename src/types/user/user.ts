export interface UserEntity{
id: string;
login: string;
email: string;
password: string;
registeredAt: Date;
likes: string | null;
}

export type NewUserEntity = Omit<UserEntity, "id" | "registeredAt" | "likes">

export type LoggedUserResponse = {
    isAuth: boolean;
}
export interface LoggedUserSuccessfulResponse extends LoggedUserResponse {
    accessToken: string;
    refreshToken: string;
}