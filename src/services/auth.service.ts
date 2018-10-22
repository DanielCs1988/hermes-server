import * as jwks from "jwks-rsa";
import {verify} from "jsonwebtoken";
import {Socket} from "socket.io";
import {Authenticator} from "../socket/types";
import {SocketActions} from "../shared/constants";
import {inject, injectable} from "inversify";
import {SocketService} from "./socket.service";
import {Request} from "express";

@injectable()
export class AuthService implements Authenticator {

    constructor(@inject('SocketService') private socketService: SocketService) { }

     readonly authenticate = (socket: Socket): Promise<any> => {
        return new Promise<any>((resolve, reject) => {
            socket.on(SocketActions.AUTHENTICATE, async (token: string, ack: Function) => {
                try {
                    const userId = await this.getAuthIdFromToken(token);
                    ack();
                    this.userJoined(socket, userId);
                    resolve({ userId, token });
                } catch (error) {
                    ack(error);
                    socket.disconnect();
                    reject(error);
                }
            });
        });
    };

    private userJoined = (socket: Socket, userId: string) => {
        this.socketService.userJoined(userId, socket.id);
        socket.server.emit(SocketActions.SEND_USER_LIST, this.socketService.Users);
        console.log(`User ${userId} joined the server.`);
    };

    private readonly jwksClient = jwks({
        jwksUri: process.env.JWKS_URI!
    });

    private readonly options = {
        audience: process.env.JWT_AUDIENCE,
        issuer: process.env.JWT_ISSUER,
        algorithms: ['RS256']
    };

    private readonly keyResolver = (header, callback: Function) => {
        this.jwksClient.getSigningKey(header.kid, (err, key) => {
            if (!key) {
                callback('Could not decipher JWT claims!', null);
            } else {
                const signingKey = key.publicKey || key.rsaPublicKey;
                callback(null, signingKey);
            }
        });
    };

    private readonly getAuthIdFromToken = (token: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            verify(token, this.keyResolver as any, this.options, (err, claims: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(claims.sub);
                }
            });
        });
    }
}