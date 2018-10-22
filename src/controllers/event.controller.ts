import {
    BaseHttpController,
    controller,
    httpDelete,
    httpGet,
    httpPost,
    httpPut,
    requestBody,
    requestParam
} from "inversify-express-utils";
import {inject} from "inversify";
import {EventService} from "../services/event.service";
import {IEvent} from "../shared/models";

@controller('/events')
export class EventController extends BaseHttpController {

    constructor(@inject('EventService') private eventService: EventService) {
        super();
    }

    @httpGet('/')
    private async getEvents() {
        try {
            return await this.eventService.getAllEvents();
        } catch (error) {
            return this.badRequest();
        }
    }

    @httpGet('/:id')
    private async getEventById(@requestParam('id') id: string) {
        try {
            const Event = await this.eventService.getEventById(id);
            return Event ? Event : this.notFound();
        } catch (error) {
            return this.badRequest();
        }
    }

    @httpPost('/')
    private async createEvent(@requestBody() event: IEvent) {
        try {
            return await this.eventService.createEvent(event);
        } catch (error) {
            console.log(error);
            return this.badRequest();
        }
    }

    @httpPut('/:id')
    private async updateEvent(@requestParam('id') id: string, @requestBody() event: IEvent) {
        try {
            const savedEvent = await this.eventService.updateEvent(id, event);
            return savedEvent ? savedEvent : this.notFound();
        } catch (error) {
            return this.badRequest();
        }
    }

    @httpDelete('/:id')
    private async deleteEvent(@requestParam('id') id: string) {
        try {
            const Event = await this.eventService.deleteEvent(id);
            return Event ? Event : this.notFound();
        } catch (error) {
            return this.badRequest();
        }
    }
}