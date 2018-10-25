import { injectable } from "inversify";
import { IUser } from "../shared/models";
import { UserModel, UserRepository } from "../repository/user.repository";
import { Model } from "mongoose";
import { pick } from 'lodash';

@injectable()
export class UserService {
    private readonly userRepository: Model<UserModel>;
    private readonly userCache = new Map<string, UserModel>();

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository.Model;
    }

    readonly getAllUsers = () => {
        return this.userRepository.find({});
    };

    readonly getUserById = (id: string) => {
        return this.userRepository.findById(id);
    };

    readonly getUserBySub = async (sub: string) => {
        const cachedUser = this.userCache.get(sub);
        if (cachedUser) {
            return cachedUser;
        }
        const userFromDB = await this.userRepository.findOne({ sub });
        if (userFromDB) {
            this.userCache.set(sub, userFromDB);
        }
        return userFromDB;
    };

    readonly createUser = (user: IUser) => {
        const newUser = new this.userRepository({
            ...user,
            registeredAt: new Date().getTime()
        });
        return newUser.save();
    };

    readonly updateUser = async (id: string, user: IUser) => {
        const updatedFields = pick(user, [
            'givenName', 'familyName', 'profilePicture', 'address', 'birthday', 'email', 'phone'
        ]);
        return this.userRepository.findByIdAndUpdate(
            id,
            { $set: updatedFields },
            { new: true }
        );
    };

    readonly deleteUser = async (id: string) => {
        return this.userRepository.findByIdAndDelete(id);
    };
}