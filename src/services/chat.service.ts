import { injectable } from "inversify";
import {IMessage} from "../shared/models";
import {ChatRepository, ConversationModel, MessageModel} from "../repository/chat.repository";
import {Model, Schema} from "mongoose";
import { pick } from 'lodash';
import {UserModel, UserRepository} from "../repository/user.repository";
import {ObjectId} from "bson";

@injectable()
export class ChatService {
    private readonly messageModel: Model<MessageModel>;
    private readonly conversationModel: Model<ConversationModel>;
    private readonly userRepository: Model<UserModel>;

    constructor(chatRepository: ChatRepository, userRepository: UserRepository) {
        this.messageModel = chatRepository.messageModel;
        this.conversationModel = chatRepository.conversationModel;
        this.userRepository = userRepository.Model;
    }

    readonly getAllConversations = async (currentUser: string) => {
        const conversations = await this.conversationModel.aggregate([
            {
                $match: { users: new ObjectId(currentUser) }
            },
            {
                $project: {
                    id: "$_id",
                    _id: 0,
                    users: 1,
                    lastMessage: { $arrayElemAt: [ "$history", -1 ] }
                }
            }
        ]);
        return conversations.map(conversation => {
            const { _id, ...message } = conversation.lastMessage;
            message.id = _id;
            return {
                ...conversation,
                lastMessage: message
            }
        });
    };

    readonly getAllMessages = async (target: string, currentUser: string) => {
        let conversation = await this.conversationModel.findOne(
            { users: { $all: [currentUser, target] } },
            { _id: 0, from: 0, to: 0 }
        );
        if (!conversation) {
           conversation = await this.startConversation(target, currentUser);
        }
        return conversation.history;
    };

    readonly startConversation = async (target: string, currentUser: string) => {
        const targetUser = await this.userRepository.findOne({ _id: target });
        if (!targetUser) {
            throw new Error('Target user does not exist!');
        }
        const newConversation = new this.conversationModel({
            users: [currentUser, target],
            history: []
        });
        return newConversation.save();
    };

    readonly saveMessage = async (message: IMessage, currentUser: string) => {
        const { content, to } = message;
        const newMessage = new this.messageModel({
            content, to,
            from: currentUser,
            createdAt: new Date().getTime()
        });
        const conversation = await this.conversationModel.findOneAndUpdate(
            { users: { $all: [message.to, currentUser] } },
            { $push: { history: newMessage } }
        );
        if (!conversation) {
            throw new Error('Target user does not exist or no conversation has been initialized!');
        }
        return newMessage;
    };
}