import * as jwks from "jwks-rsa";
import {verify} from "jsonwebtoken";
import {Socket} from "socket.io";
import {SocketAuthMiddleware} from "../socket/types";
import {SocketActions} from "../shared/constants";
import {injectable} from "inversify";
import {SocketService} from "./socket.service";
import {Authenticator} from "../middlewares/authenticator";
import {UserModel} from "../repository/user.repository";

@injectable()
export class AuthService implements SocketAuthMiddleware {

    constructor(private socketService: SocketService, private authenticator: Authenticator) { }

     readonly authenticate = (socket: Socket): Promise<UserModel> => {
        return new Promise<any>((resolve, reject) => {
            socket.on(SocketActions.AUTHENTICATE, async (token: string, ack: Function) => {
                try {
                    const userSub = await this.getSubFromToken(token);
                    const user = await this.authenticator.createOrFetchUser(userSub, `Bearer ${token}`);
                    ack();
                    this.userJoined(socket, user);
                    resolve(user);
                } catch (error) {
                    ack(error);
                    socket.disconnect();
                    reject(error);
                }
            });
        });
    };

    private userJoined = (socket: Socket, user: UserModel) => {
        this.socketService.userJoined(user.id, socket.id);
        socket.server.emit(SocketActions.SEND_USER_LIST, this.socketService.Users);
        console.log(`${user.givenName} ${user.familyName} joined the server.`);
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

    private readonly getSubFromToken = (token: string): Promise<string> => {
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