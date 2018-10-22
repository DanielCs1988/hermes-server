import {Document, model, Schema} from 'mongoose';
import { injectable } from "inversify";
import { IEvent } from "../shared/models";

export interface EventModel extends Document, IEvent { }

@injectable()
export class EventRepository {
    private readonly EventSchema = new Schema({
        title: {
            type: String,
            required: true,
            minlength: 1,
            trim: true
        },
        image: {
            type: String,
            required: true,
            minlength: 1,
            trim: true
        },
        from: {
            type: Number,
            required: true
        },
        to: {
            type: Number,
            required: true
        },
        createdAt: {
            type: Number,
            required: true
        },
        organizer: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        participants: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        description: {
            type: String,
            required: false,
            minlength: 1,
            trim: true
        },
        location: {
            name: {
                type: String,
                required: true,
                minlength: 1,
                trim: true
            },
            latitude: {
                type: Number,
                required: true
            },
            longitude: {
                type: Number,
                required: true
            }
        }
    });

    private readonly model = model<EventModel>('Event', this.EventSchema);

    constructor() {
        this.EventSchema.set('toJSON', {
            virtuals: true,
            versionKey: false,
            transform(_, ret) { delete ret._id; }
        });
    }

    get Model() {
        return this.model;
    }
}