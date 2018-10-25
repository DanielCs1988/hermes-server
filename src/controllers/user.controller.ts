import {
    BaseHttpController,
    controller,
    httpGet,
    httpPut,
    request,
    requestBody,
    requestParam
} from "inversify-express-utils";
import {UserService} from "../services/user.service";
import {IUser, RequestWithUser} from "../shared/models";

@controller('/users')
export class UserController extends BaseHttpController {

    constructor(private userService: UserService) {
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

    @httpGet('/current')
    private async getCurrentUser(@request() req: RequestWithUser) {
        return req.user;
    }

    @httpGet('/:id')
    private async getProfile(@requestParam('id') id: string) {
        try {
            const user = await this.userService.getUserById(id);
            return user ? user : this.notFound();
        } catch (error) {
            return this.badRequest();
        }
    }

    @httpPut('/')
    private async updateProfile(@requestBody() profile: IUser, @request() req: RequestWithUser) {
        try {
            const updatedProfile = await this.userService.updateUser(req.user.id, profile);
            return updatedProfile ? updatedProfile : this.notFound();
        } catch (error) {
            return this.badRequest();
        }
    }
}