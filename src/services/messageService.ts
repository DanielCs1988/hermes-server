import {inject, injectable} from "inversify";
import {SocketService} from "./socket.service";

@injectable()
export class MessageService {

    constructor(@inject('SocketService') private socketService: SocketService) { }

    sendMessage = (message) => {
        return {};
    };

    disconnectUser = (userId: string) => {
        console.log(`User ${userId} has left the server.`);
        return this.socketService.userLeft(userId);
    }
}