import { inject, injectable } from "inversify";
import { IEvent } from "../shared/models";
import { EventModel, EventRepository } from "../repository/event.repository";
import { Model } from "mongoose";
import { pick } from 'lodash';

@injectable()
export class EventService {
    private readonly eventRepository: Model<EventModel>;

    constructor(@inject('EventRepository') eventRepository: EventRepository) {
        this.eventRepository = eventRepository.Model;
    }

    readonly getAllEvents = () => {
        return this.eventRepository.find({});
    };

    readonly getEventById = (id: string) => {
        return this.eventRepository.findById(id);
    };

    readonly createEvent = (event: IEvent, userId: string) => {
        const { title, from, to, image, description, location: { name, longitude, latitude } } = event;
        const newEvent = new this.eventRepository({
            title, from, to, image, description,
            location: { name, longitude, latitude },
            organizer: userId,
            participants: [],
            createdAt: new Date().getTime()
        });
        return newEvent.save();
    };

    readonly updateEvent = async (id: string, event: IEvent, userId: string) => {
        const updatedFields = pick(event, ['title', 'from', 'to', 'image', 'description']);
        if (event.location) {
            updatedFields.location = pick(event.location, ['name', 'longitude', 'latitude']);
        }
        return this.eventRepository.findOneAndUpdate(
            { _id: id, organizer: userId },
            { $set: updatedFields },
            { new: true, upsert: true }
        );
    };

    readonly toggleEventParticipation = async (id: string, userId: string) => {
        const event = await this.eventRepository.findById(id);
        if (!event) {
            return event;
        }
        return event.participants.find(participant => participant.equals(userId)) ?
            this.eventRepository.findByIdAndUpdate(
                id,
                { $pull: { participants: userId } },
                { new: true }
            ) :
            this.eventRepository.findByIdAndUpdate(
                id,
                { $addToSet: { participants: userId } },
                { new: true }
            );
    };

    readonly deleteEvent = async (id: string, userId: string) => {
        return this.eventRepository.findOneAndDelete(
            { _id: id, organizer: userId }
        );
    };
}