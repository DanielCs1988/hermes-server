import { json } from "body-parser";
import { Container } from "inversify";
import "reflect-metadata";
import { InversifyExpressServer } from "inversify-express-utils";
import "./controllers/user.controller";
import {SocketServer} from "./socket/socket-server";
import {SocketService} from "./services/socket.service";
import {AuthGuard} from "./middleware/authenticator";
import {ChatController} from "./controllers/chat.controller";
import {UserService} from "./services/user.service";
import {UserRepository} from "./repository/user.repository";

const port = process.env.PORT || 8080;

const container = new Container();

container.bind<AuthGuard>('AuthGuard').to(AuthGuard).inSingletonScope();
container.bind<SocketService>('SocketService').to(SocketService).inSingletonScope();
container.bind<ChatController>('ChatController').to(ChatController).inSingletonScope();

container.bind<UserRepository>('UserRepository').to(UserRepository).inSingletonScope();
container.bind<UserService>('UserService').to(UserService).inSingletonScope();

const server = new InversifyExpressServer(container);
server.setConfig(app => {
    app.use(json());
});

const app = server.build();
const socketServer = new SocketServer(app, [], container.get('AuthGuard'));

socketServer.init();
app.listen(port, () => console.log(`Server is running on port ${port}...`));