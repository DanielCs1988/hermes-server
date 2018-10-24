import { injectable } from "inversify";

@injectable()
export class SocketService {
    private readonly users = new Map<string, string>();

    get Users() {
        return [...this.users.keys()];
    }

    getSocketId = (userSub: string) => {
        return this.users.get(userSub);
    };

    userJoined = (userSub: string, id: string) => {
        this.users.set(userSub, id);
    };

    userLeft = (userSub: string) => {
        this.users.delete(userSub);
        return this.Users;
    };
}