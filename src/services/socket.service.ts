import { injectable } from "inversify";
import {IMessage} from "../shared/models";
import * as uuid from "uuid/v1";

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

    processMessage = (message: IMessage, userSub: string): IMessage => {
        const { content, to } = message;
        this.checkMessageValidity(content, to);
        return {
            content, to,
            from: userSub,
            createdAt: new Date().getTime(),
            id: uuid()
        };
    };

    private checkMessageValidity = (content: string, to: string) => {
        if (!content || content.length < 1) {
            throw new Error('Message must have a content of at least length 1!');
        }
        if (!to) {
            throw new Error('Message must have a target!');
        }
        if (!this.users.has(to)) {
            throw new Error('Target user is not online!');
        }
    };
}