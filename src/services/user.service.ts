import {inject, injectable} from "inversify";
import { IUser } from "../shared/models";
import { UserModel, UserRepository } from "../repository/user.repository";
import { Model } from "mongoose";

@injectable()
export class UserService {
    private readonly userRepository: Model<UserModel>;

    constructor(@inject('UserRepository') userRepository: UserRepository) {
        this.userRepository = userRepository.Model;
    }

    readonly getAllUsers = () => {
        return this.userRepository.find({});
    };

    readonly getUserById = (id: string) => {
        return this.userRepository.findById(id);
    };

    readonly createUser = (user: IUser) => {
        return new this.userRepository(user);
    };

    readonly updateUser = async (id: string, user: IUser) => {
        const { givenName, familyName, profilePicture, address, birthday, email, phone } = user;
        return this.userRepository.findByIdAndUpdate(
            id,
            { $set: { givenName, familyName, profilePicture, address, birthday, email, phone } },
            { new: true }
        );
    };

    readonly deleteUser = async (id: string) => {
        return this.userRepository.findByIdAndDelete(id);
    };
}