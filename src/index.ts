import * as http from 'http';
import { connect } from "mongoose";
import "reflect-metadata";
import { InversifyExpressServer } from "inversify-express-utils";
import "./controllers/user.controller";
import "./controllers/event.controller";
import "./controllers/chat.controller";
import {SocketServer} from "./socket/socket-server";
import {AuthService} from "./services/auth.service";
import {SocketController} from "./controllers/socket.controller";
import {Container} from "inversify";
import applyMiddlewares from "./middlewares";

const port = process.env.PORT || 8080;

const container = new Container({
    defaultScope: "Singleton",
    autoBindInjectable: true
});

const server = new InversifyExpressServer(container);
server.setConfig(applyMiddlewares(container));

const app = server.build();
const httpServer = http.createServer(app);
const socketServer = new SocketServer(
    httpServer,
    [ container.get(SocketController) ],
    container.get(AuthService)
);

socketServer.init();

connect(process.env.MONGODB_URI!, { useNewUrlParser: true })
    .then(() => {
        httpServer.listen(port, () => console.log(`Server is running on port ${port}...`));
    })
    .catch((error) => {
        console.log(`Could not connect to MongoDB.\nReason: ${error.stack}`);
        process.exit(1);
    });