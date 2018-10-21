import { Document, model, Schema } from 'mongoose';
import { injectable } from "inversify";
import { IUser } from "../shared/models";

export interface UserModel extends Document, IUser { }

@injectable()
export class UserRepository {
    private readonly UserSchema = new Schema({
        givenName: {
            type: String,
            required: true,
            minlength: 1,
            trim: true
        },
        familyName: {
            type: String,
            required: true,
            minlength: 1,
            trim: true
        },
        profilePicture: {
            type: String,
            required: true,
            minlength: 1,
            trim: true
        },
        registeredAt: {
            type: Number
        },
        email: {
            type: String,
            required: false,
            minlength: 1,
            trim: true
        },
        phone: {
            type: String,
            required: false,
            minlength: 1,
            trim: true
        },
        address: {
            type: String,
            required: false,
            minlength: 1,
            trim: true
        },
        birthday: {
            type: Number,
            required: false
        }
    });

    private readonly model = model<UserModel>('User', this.UserSchema);

    constructor() {
        this.UserSchema.pre('save', function (next: Function) {
            const user = <UserModel>this;
            user.registeredAt = new Date().getTime();
            next();
        })
    }

    get Model() {
        return this.model;
    }
}