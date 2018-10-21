import {BaseHttpController, controller, httpGet, httpPut, requestBody, requestParam} from "inversify-express-utils";
import {inject} from "inversify";
import {UserService} from "../services/user.service";
import {IUser} from "../shared/models";

@controller('/users')
export class UserController extends BaseHttpController {

    constructor(@inject('UserService') private userService: UserService) {
        super();
    }

    @httpGet('/')
    private async getProfiles() {
        try {
            return await this.userService.getAllUsers();
        } catch (error) {
            return this.badRequest();
        }
    }

    @httpPut('/:id')
    private async updateProfile(@requestParam('id') id: string, @requestBody() profile: IUser) {
        try {
            const updatedProfile = await this.userService.updateUser(id, profile);
            return updatedProfile ? updatedProfile : this.notFound();
        } catch (error) {
            return this.badRequest();
        }
    }

    // TODO: extract userId from token and getUserId from Service
}