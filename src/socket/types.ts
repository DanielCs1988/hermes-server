import { Socket } from "socket.io";
import {UserModel} from "../repository/user.repository";

export interface SocketContext extends Socket {
    user?: UserModel;
}

export type HandlerMapping = { [event: string]: (socket: SocketContext, ...args: any[]) => void };

export interface Controller {
    handlers(): HandlerMapping;
}

export interface SocketAuthMiddleware {
    authenticate(socket: Socket): Promise<any>;
}