export interface UserEntity{
id: string;
login: string;
email: string;
password: string;
registeredAt: Date;
}

export type NewUserEntity = Omit<UserEntity, "id" | "registeredAt">

export type LoggedUserResponse = {
    isAuth: boolean;
}
export interface LoggedUserSuccessfulResponse extends LoggedUserResponse {
    accessToken: string;
    refreshToken: string;
}