import { Document, model, Schema } from 'mongoose';
import { injectable } from "inversify";
import { IUser } from "../shared/models";

export interface UserModel extends Document, IUser { }

@injectable()
export class UserRepository {
    private readonly UserSchema = new Schema({
        sub: {
            type: String,
            required: true,
            unique: true
        },
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
        this.UserSchema.set('toJSON', {
            virtuals: true,
            versionKey: false,
            transform(_, ret) { delete ret._id; }
        });
    }

    get Model() {
        return this.model;
    }
}