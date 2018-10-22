import {Types} from "mongoose";
import {Request} from "express";
import {UserModel} from "../repository/user.repository";

export interface RequestWithUser extends Request {
    user: UserModel;
}

export interface IUser {
    sub: string;
    givenName: string;
    familyName: string;
    profilePicture: string;
    registeredAt?: number;
    email?: string;
    phone?: string;
    address?: string;
    birthday?: number;
}

export interface IMessage {
    id?: string;
    content: string;
    from?: string;
    to: string;
    createdAt?: number;
}

export interface Location {
    name: string;
    latitude: number;
    longitude: number;
}

export interface IEvent {
    title: string;
    image: string;
    from: number;
    to: number;
    createdAt: number;
    participants: Types.ObjectId[];
    organizer: Types.ObjectId;
    description?: string;
    location: Location;
}

export type AckFn = (error: string | null, response?: any) => void;