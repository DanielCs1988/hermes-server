import { injectable } from "inversify";

@injectable()
export class SocketService {
    private readonly users = new Map<string, string>();

    get Users() {
        return [...this.users.keys()];
    }

    getSocketId = (userId: string) => {
        return this.users.get(userId);
    };

    userJoined = (userId: string, id: string) => {

    };

    userLeft = (userId: string) => {
        this.users.delete(userId);
        return this.Users;
    }
}