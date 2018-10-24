import * as http from 'http';
import { json } from "body-parser";
import * as cors from 'cors';
import { connect } from "mongoose";
import "reflect-metadata";
import { InversifyExpressServer } from "inversify-express-utils";
import "./controllers/user.controller";
import "./controllers/event.controller";
import "./controllers/chat.controller";
import {SocketServer} from "./socket/socket-server";
import {AuthService} from "./services/auth.service";
import {Authenticator} from "./middleware/authenticator";
import {validateJwt} from "./middleware/jwt-validator";
import {handleErrors} from "./middleware/error-handler";
import container from "./shared/container";

const port = process.env.PORT || 8080;

const server = new InversifyExpressServer(container);

const authenticator = container.get<Authenticator>('Authenticator');

server.setConfig(app => {
    app.use(cors());
    app.use(validateJwt);
    app.use(authenticator.getUserFromRequest);
    app.use(json());
    app.use(handleErrors);
});

const app = server.build();
const httpServer = http.createServer(app);
const socketServer = new SocketServer(
    httpServer,
    [container.get('ChatController')],
    container.get('AuthService'));

socketServer.init();

connect(process.env.MONGODB_URI!, { useNewUrlParser: true })
    .then(() => {
        httpServer.listen(port, () => console.log(`Server is running on port ${port}...`));
    })
    .catch((error) => {
        console.log(`Could not connect to MongoDB.\nReason: ${error.stack}`);
        process.exit(1);
    });