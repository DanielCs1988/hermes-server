import * as http from 'http';
import * as socketIO from 'socket.io';
import {Socket} from "socket.io";
import {SocketAuthMiddleware, Controller, SocketContext} from "./types";
import {SocketActions} from "../shared/constants";
import {UserModel} from "../repository/user.repository";

export class SocketServer {

    private io: socketIO.Server;

    constructor(
        private readonly httpServer: http.Server,
        private readonly controllers: Controller[],
        private readonly authenticator?: SocketAuthMiddleware
    ) { }

    readonly init = () => {
        this.io = socketIO(this.httpServer);
        this.io.on(SocketActions.CONNECTION, this.authenticateIfNeeded);
    };

    private authenticateIfNeeded = async (socket: Socket) => {
        if (this.authenticator) {
            try {
                const user = await this.authenticator.authenticate(socket);
                this.registerHandlers(socket, user);
            } catch (err) {
                console.log('Unauthorized connection attempt:', err.message);
            }
        } else {
            this.registerHandlers(socket);
        }
    };

    registerHandlers = (socket: SocketContext, user?: UserModel) => {
        if (user) {
            socket.user = user;
        }
        for (let controller of this.controllers) {
            const mapping = controller.handlers();
            for (let route in mapping) {
                socket.on(route, (...args: any[]) => {
                    mapping[route](socket, ...args);
                });
            }
        }
    };
}