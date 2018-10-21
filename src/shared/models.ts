export interface IUser {
    givenName: string;
    familyName: string;
    profilePicture: string;
    registeredAt: number;
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
    description?: string;
    image?: string;
    location: Location;
    organizer: string;
    createdAt: number;
    from: number;
    to: number;
    participants: string[];
}

export type AckFn = (error: string | null, response?: any) => void;