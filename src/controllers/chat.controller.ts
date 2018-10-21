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
            [SocketActions.SEND_PRIVATE_MESSAGE]: this.onMessage,
            [SocketActions.DISCONNECT]: this.onDisconnect
        };
    };

    private onMessage = (socket: SocketContext, message: IMessage, ack: AckFn) => {
        const userId = socket.credentials.userId;
        // validate target: they must be valid and ONLINE
        ack(null, message);
        socket.to(message.to).emit(SocketActions.SEND_PRIVATE_MESSAGE, message);
    };

    private onDisconnect = (socket: SocketContext) => {
        const userId = socket.credentials.userId;
        const newUserList = this.socketService.userLeft(userId);
        socket.server.emit(SocketActions.SEND_USER_LIST, newUserList);
    };
}