import { inject, injectable } from "inversify";
import {IMessage} from "../shared/models";
import {ChatRepository, ConversationModel, MessageModel} from "../repository/chat.repository";
import { Model } from "mongoose";
import { pick } from 'lodash';

@injectable()
export class ChatService {
    private readonly messageModel: Model<MessageModel>;
    private readonly conversationModel: Model<ConversationModel>;

    constructor(@inject('ChatRepository') chatRepository: ChatRepository) {
        this.messageModel = chatRepository.messageModel;
        this.conversationModel = chatRepository.conversationModel;
    }

    readonly getAllConversations = () => {
        return this.conversationModel.find({}, {
            history: { $arrayElemAt: -1 }
        });
    };

    readonly startConversation = (currentUser: string, target: string) => {
        const newConversation = new this.conversationModel({
            users: [currentUser, target],
            history: []
        });
        return newConversation.save();
    };

    readonly getAllMessages = async (currentUser: string, target: string) => {
        let conversation = await this.conversationModel.findOne(
            { users: { $all: [currentUser, target] } },
            { _id: 0, from: 0, to: 0 }
        );
        if (!conversation) {
           conversation = await this.startConversation(currentUser, target);
        }
        return conversation.history;
    };

    readonly saveMessage = (message: IMessage) => {
        const newMessage = new this.messageModel(message);
        this.conversationModel.findOneAndUpdate(
            { users: { $all: [message.to, message.from] } },
            { history: { $push: newMessage } }
        );
        return newMessage._id;
    };
}