import {
    BaseHttpController,
    controller,
    httpGet,
    httpPost,
    request,
    requestParam
} from "inversify-express-utils";
import {inject} from "inversify";
import {ChatService} from "../services/chat.service";
import {RequestWithUser} from "../shared/models";

@controller('/chat')
export class ChatController extends BaseHttpController {

    constructor(@inject('ChatService') private chatService: ChatService) {
        super();
    }

    @httpGet('/conversations')
    private async getConversations() {
        try {
            return await this.chatService.getAllConversations();
        } catch (error) {
            return this.badRequest(JSON.stringify(error, undefined, 4));
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