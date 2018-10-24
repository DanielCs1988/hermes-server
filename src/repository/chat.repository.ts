import { Document, model, Schema } from 'mongoose';
import { injectable } from "inversify";
import {IConversation, IMessage} from "../shared/models";

export interface ConversationModel extends Document, IConversation { }
export interface MessageModel extends Document, IMessage { }

@injectable()
export class ChatRepository {
    private readonly MessageSchema = new Schema({
        from: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        to: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        content: {
            type: String,
            required: true,
            minlength: 1,
            trim: true
        },
        createdAt: {
            type: Number,
            required: true
        }
    });

    private readonly ConversationSchema = new Schema({
        users: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        history: [{ type: this.MessageSchema }]
    });

    readonly conversationModel = model<ConversationModel>('Conversation', this.ConversationSchema);
    readonly messageModel = model<MessageModel>('Message', this.MessageSchema);

    constructor() {
        this.MessageSchema.set('toJSON', {
            virtuals: true,
            versionKey: false,
            transform(_, ret) { delete ret._id; }
        });
        this.ConversationSchema.set('toJSON', {
            virtuals: true,
            versionKey: false,
            transform(_, ret) { delete ret._id; }
        });
    }
}