import { injectable } from "inversify";

@injectable()
export class SocketService {
    private readonly users: { [key: string]: string } = {};

    get Users() {
        return Object.keys(this.users);
    }

    getSocketId = (userId: string) => {
        return this.users[userId];
    };

    userJoined = (userId: string, socketId: string) => {
        this.users[userId] = socketId;
    };

    userLeft = (userId: string) => {
        delete this.users[userId];
        return this.Users;
    };
}