import {inject, injectable} from "inversify";
import {Controller, HandlerMapping, SocketContext} from "../socket/types";
import {SocketActions} from "../shared/constants";
import {SocketService} from "../services/socket.service";
import {AckFn, IMessage} from "../shared/models";

@injectable()
export class ChatController implements Controller {

    constructor(@inject('SocketService') private socketService: SocketService) { }

    handlers = (): HandlerMapping => {
        return {
            [SocketActions.SEND_PRIVATE_MESSAGE]: this.onSendMessage,
            [SocketActions.DISCONNECT]: this.onDisconnect
        };
    };

    private onSendMessage = (socket: SocketContext, message: IMessage, ack: AckFn) => {
        try {
            const messageToSend = this.socketService.processMessage(message, socket.userSub!);
            const targetSocketId = this.socketService.getSocketId(messageToSend.to) || '';
            ack(null, messageToSend);
            socket.to(targetSocketId).emit(SocketActions.SEND_PRIVATE_MESSAGE, messageToSend);
        } catch (error) {
            ack(error.message);
        }
    };

    private onDisconnect = (socket: SocketContext) => {
        const newUserList = this.socketService.userLeft(socket.userSub!);
        socket.server.emit(SocketActions.SEND_USER_LIST, newUserList);
        console.log(`User with SUB: ${socket.userSub} has left the server.`);
    };
}