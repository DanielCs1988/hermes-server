import * as http from 'http';
import * as socketIO from 'socket.io';
import {Socket} from "socket.io";
import {Authenticator, Controller, SocketContext} from "./types";
import {Application} from "express";

export class SocketServer {

    private io: socketIO.Server;

    constructor(
        private readonly app: Application,
        private readonly controllers: Controller[],
        private readonly authenticator?: Authenticator
    ) { }

    readonly init = () => {
        const server = http.createServer(this.app);
        this.io = socketIO(server);
        this.io.on('connection', this.registerHandlers);
    };

    private authenticateIfNeeded = async (socket: Socket) => {
        if (this.authenticator) {
            try {
                const credentials = await this.authenticator.authenticate(socket);
                this.registerHandlers(socket, credentials);
            } catch (err) {
                console.log('Unauthorized connection attempt:', err.message);
            }
        } else {
            this.registerHandlers(socket);
        }
    };

    registerHandlers = (socket: SocketContext, credentials?: any) => {
        if (credentials) {
            socket.credentials = credentials;
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