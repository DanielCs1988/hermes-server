import {
    BaseHttpController,
    controller,
    httpDelete,
    httpGet,
    httpPost,
    httpPut,
    request,
    requestBody,
    requestParam
} from "inversify-express-utils";
import {inject} from "inversify";
import {EventService} from "../services/event.service";
import {IEvent, RequestWithUser} from "../shared/models";

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
    private async createEvent(@requestBody() event: IEvent, @request() req: RequestWithUser) {
        try {
            return await this.eventService.createEvent(event, req.user.id);
        } catch (error) {
            console.log(error);
            return this.badRequest();
        }
    }

    @httpPut('/:id')
    private async updateEvent(
        @requestParam('id') id: string,
        @requestBody() event: IEvent,
        @request() req: RequestWithUser
    ) {
        try {
            const savedEvent = await this.eventService.updateEvent(id, event, req.user.id);
            return savedEvent ? savedEvent : this.notFound();
        } catch (error) {
            return this.badRequest();
        }
    }

    @httpPost('/:id')
    private async toggleEventParticipation(@requestParam('id') id: string, @request() req: RequestWithUser) {
        try {
            const event = await this.eventService.toggleEventParticipation(id, req.user.id);
            return event ? event : this.notFound();
        } catch (error) {
            return this.badRequest();
        }
    }

    @httpDelete('/:id')
    private async deleteEvent(@requestParam('id') id: string, @request() req: RequestWithUser) {
        try {
            const Event = await this.eventService.deleteEvent(id, req.user.id);
            return Event ? Event : this.notFound();
        } catch (error) {
            return this.badRequest();
        }
    }
}