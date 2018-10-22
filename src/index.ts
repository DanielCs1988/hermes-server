import { json } from "body-parser";
import * as cors from 'cors';
import { connect } from "mongoose";
import { Container } from "inversify";
import "reflect-metadata";
import { InversifyExpressServer } from "inversify-express-utils";
import "./controllers/user.controller";
import "./controllers/event.controller";
import {SocketServer} from "./socket/socket-server";
import {SocketService} from "./services/socket.service";
import {AuthGuard} from "./middleware/authenticator";
import {ChatController} from "./controllers/chat.controller";
import {UserService} from "./services/user.service";
import {UserRepository} from "./repository/user.repository";
import {EventRepository} from "./repository/event.repository";
import {EventService} from "./services/event.service";

const port = process.env.PORT || 8080;

const container = new Container();

container.bind<AuthGuard>('AuthGuard').to(AuthGuard).inSingletonScope();
container.bind<SocketService>('SocketService').to(SocketService).inSingletonScope();
container.bind<ChatController>('ChatController').to(ChatController).inSingletonScope();

container.bind<UserRepository>('UserRepository').to(UserRepository).inSingletonScope();
container.bind<UserService>('UserService').to(UserService).inSingletonScope();

container.bind<EventRepository>('EventRepository').to(EventRepository).inSingletonScope();
container.bind<EventService>('EventService').to(EventService).inSingletonScope();

const server = new InversifyExpressServer(container);
server.setConfig(app => {
    app.use(cors());
    app.use(json());
});

const app = server.build();
const socketServer = new SocketServer(app, [], container.get('AuthGuard'));

socketServer.init();

connect(process.env.MONGODB_URI!, { useNewUrlParser: true })
    .then(() => {
        app.listen(port, () => console.log(`Server is running on port ${port}...`));
    })
    .catch((error) => {
        console.log(`Could not connect to MongoDB.\nReason: ${error.stack}`);
        process.exit(1);
    });