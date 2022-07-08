export interface UserEntity{
id: string;
login: string;
email: string;
password: string;
registeredAt: Date;
}

export type NewUserEntity = Omit<UserEntity, "id" | "registeredAt">

