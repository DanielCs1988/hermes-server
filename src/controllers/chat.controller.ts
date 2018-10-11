import {inject, injectable} from "inversify";
import {MessageService} from "../services/messageService";
import {Controller, HandlerMapping, SocketContext} from "../socket/types";
import {SocketActions} from "../constants";

@injectable()
export class ChatController implements Controller {

    constructor(@inject('MessageService') private messageService: MessageService) { }

    handlers(): HandlerMapping {
        return {
            [SocketActions.DISCONNECT]: this.onDisconnect
        };
    }

    private onMessage = (socket: SocketContext, message, ack: Function) => {
        const userId = socket.credentials.userId;
        try {
            // validate target
            const savedMessage = this.messageService.sendMessage(message);
            ack(null, savedMessage);
            socket.to(savedMessage.to).emit(SocketActions.SEND_PRIVATE_MESSAGE, savedMessage);
        } catch (err) {
            ack(err.message);
        }
    };

    private onDisconnect = (socket: SocketContext) => {
        const userId = socket.credentials.userId;
        const newUserList = this.messageService.disconnectUser(userId);
        socket.server.emit(SocketActions.SEND_USER_LIST, newUserList);
    };
}