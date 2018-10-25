import { BaseHttpController, controller, httpGet, request, requestParam } from "inversify-express-utils";
import {ChatService} from "../services/chat.service";
import {RequestWithUser} from "../shared/models";

@controller('/chat')
export class ChatController extends BaseHttpController {

    constructor(private chatService: ChatService) {
        super();
    }

    @httpGet('/conversations')
    private async getConversations(@request() req: RequestWithUser) {
        try {
            return await this.chatService.getAllConversations(req.user.id);
        } catch (error) {
            return this.badRequest('Database error!');
        }
    }

    @httpGet('/history/:target')
    private async getChatHistory(@requestParam('target') target: string, @request() req: RequestWithUser) {
        try {
            return await this.chatService.getAllMessages(target, req.user.id);
        } catch (error) {
            return error.message === 'Target user does not exist!' ?
                this.badRequest(error.message) :
                this.badRequest('Database error!');
        }
    }
}