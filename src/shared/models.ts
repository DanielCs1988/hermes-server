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

export interface IConversation {
    users: string[];
    history: IMessage[];
}

export interface IMessage {
    from: string;
    to: string;
    content: string;
    createdAt: number;
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
    participants: string[];
    organizer: string;
    description?: string;
    location: Location;
}

export type AckFn = (error: string | null, response?: any) => void;