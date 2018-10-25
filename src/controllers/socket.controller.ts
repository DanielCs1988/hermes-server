import {injectable} from "inversify";
import {Controller, HandlerMapping, SocketContext} from "../socket/types";
import {SocketActions} from "../shared/constants";
import {SocketService} from "../services/socket.service";
import {AckFn, IMessage} from "../shared/models";
import {ChatService} from "../services/chat.service";

@injectable()
export class SocketController implements Controller {

    constructor(private socketService: SocketService, private chatService: ChatService) { }

    handlers = (): HandlerMapping => {
        return {
            [SocketActions.SEND_PRIVATE_MESSAGE]: this.onSendMessage,
            [SocketActions.DISCONNECT]: this.onDisconnect
        };
    };

    private onSendMessage = async (socket: SocketContext, message: IMessage, ack: AckFn) => {
        try {
            const messageToSend = await this.chatService.saveMessage(message, socket.user!.id);
            ack(null, messageToSend);
            const targetSocketId = this.socketService.getSocketId(messageToSend.to);
            if (targetSocketId) {
                socket.to(targetSocketId).emit(SocketActions.SEND_PRIVATE_MESSAGE, messageToSend);
            }
        } catch (error) {
            ack(error.message);
        }
    };

    private onDisconnect = (socket: SocketContext) => {
        const user = socket.user!;
        const newUserList = this.socketService.userLeft(user.id);
        socket.server.emit(SocketActions.SEND_USER_LIST, newUserList);
        console.log(`${user.givenName} ${user.familyName} has left the server.`);
    };
}