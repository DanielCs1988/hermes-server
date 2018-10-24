import {Container} from "inversify";
import {AuthService} from "../services/auth.service";
import {SocketService} from "../services/socket.service";
import {SocketController} from "../controllers/socket.controller";
import {Authenticator} from "../middleware/authenticator";
import {UserRepository} from "../repository/user.repository";
import {UserService} from "../services/user.service";
import {EventRepository} from "../repository/event.repository";
import {EventService} from "../services/event.service";
import {ChatService} from "../services/chat.service";
import {ChatRepository} from "../repository/chat.repository";

const container = new Container();

container.bind<AuthService>('AuthService').to(AuthService).inSingletonScope();
container.bind<Authenticator>('Authenticator').to(Authenticator).inSingletonScope();
container.bind<SocketService>('SocketService').to(SocketService).inSingletonScope();

container.bind<ChatRepository>('ChatRepository').to(ChatRepository).inSingletonScope();
container.bind<ChatService>('ChatService').to(ChatService).inSingletonScope();
container.bind<SocketController>('ChatController').to(SocketController).inSingletonScope();

container.bind<UserRepository>('UserRepository').to(UserRepository).inSingletonScope();
container.bind<UserService>('UserService').to(UserService).inSingletonScope();

container.bind<EventRepository>('EventRepository').to(EventRepository).inSingletonScope();
container.bind<EventService>('EventService').to(EventService).inSingletonScope();

export default container;