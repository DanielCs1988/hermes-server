import { json } from "body-parser";
import { Container } from "inversify";
import "reflect-metadata";
import { InversifyExpressServer } from "inversify-express-utils";
import {SocketServer} from "./socket/socket-server";
import {SocketService} from "./services/socket.service";
import {AuthGuard} from "./middleware/authenticator";
import {MessageService} from "./services/messageService";
import {ChatController} from "./controllers/chat.controller";

const port = process.env.PORT || 8080;

const container = new Container();
container.bind<SocketService>('SocketService').to(SocketService).inSingletonScope();
container.bind<AuthGuard>('AuthGuard').to(AuthGuard).inSingletonScope();
container.bind<MessageService>('MessageService').to(MessageService).inSingletonScope();
container.bind<ChatController>('ChatController').to(ChatController).inSingletonScope();

const server = new InversifyExpressServer(container);
server.setConfig(app => {
    app.use(json());
});

const app = server.build();
const socketServer = new SocketServer(app, [], container.get('AuthGuard'));

socketServer.init();
app.listen(port, () => console.log(`Server is running on port ${port}...`));