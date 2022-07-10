import {LoggedUserResponse, LoggedUserSuccessfulResponse, NewUserEntity, UserEntity} from "../types/user/user";
import {ValidationError} from "../utils/errors";
import {v4} from "uuid";
import * as bcrypt from 'bcrypt';
import {AppDataSource} from "../data-source";
import {User} from "../entity/User";
import {generateAccessToken, generateRefreshToken} from "../utils/generateTokens";


export class UserRecord implements UserEntity {
    public email: string;
    public id: string;
    public login: string;
    public password: string;
    public registeredAt: Date;
    public likes: null | string;

    constructor(obj: NewUserEntity) {
        if (!obj.login || !obj.password || !obj.email || typeof obj.login !== 'string' || typeof obj.password !== 'string' || typeof obj.email !== 'string') {
            throw new ValidationError('User not created, please provide correct data.')
        }
        if (obj.login.length < 6 || obj.login.length > 15 || obj.password.length < 6 || obj.password.length > 15) {
            throw new ValidationError('Login/password should be at least 6 letters long and not longer than 15 characters.')
        }

        if (obj.email.includes('@') === false || obj.email.length > 60) {
            throw new ValidationError('E-mail address cannot be longer than 60 characters and must be in correct format.')
        }
        this.id = v4();
        this.email = obj.email;
        this.login = obj.login;
        this.password = obj.password;
        this.registeredAt = new Date();
        this.likes = null;

    }


    async registerNewUser(): Promise<string> {
        const userRepository = await AppDataSource.getRepository(User);
        const checkIfLoginUnique = await userRepository.find({where: {login: this.login}});
        const checkIfEmailUnique = await userRepository.find({where: {email: this.email}});

        if (checkIfEmailUnique.length > 0) {
            throw new ValidationError('This email already exists in our database.')
        }

        if (checkIfLoginUnique.length > 0) {
            throw new ValidationError('This login already exists in our database.')
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(this.password, salt);
        const user = new User();
        user.email = this.email;
        user.password = hashedPassword;
        user.login = this.login;
        user.id = v4();
        user.registeredAt = new Date();
        user.likes = null;
        await user.save();

        return this.id;
    }

    static async loginUser(login, password): Promise<LoggedUserResponse | LoggedUserSuccessfulResponse> {
        const userRepository = await AppDataSource.getRepository(User);
        const dbResponseWithUser = await userRepository.findOne({where: {login}});
        if (!dbResponseWithUser) {
            throw new ValidationError('This user does not exist in our database.')
        }
        if (await bcrypt.compare(password, dbResponseWithUser.password)) {
            const user = {login: dbResponseWithUser.login};
            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user)
            return {isAuth: true, accessToken, refreshToken}
        }

        return {isAuth: false}
    }

}