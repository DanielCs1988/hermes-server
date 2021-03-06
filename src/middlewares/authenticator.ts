import {NextFunction, Response} from "express";
import {injectable} from "inversify";
import {UserService} from "../services/user.service";
import {RequestWithUser} from "../shared/models";
import axios from 'axios';

@injectable()
export class Authenticator {

    constructor(private userService: UserService) { }

    readonly getUserFromRequest = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        if (req.user) {
            const sub = req.user.sub;
            const authHeader = req.header('Authorization');
            req.user = await this.createOrFetchUser(sub, authHeader!);
        }
        next();
    };

    readonly createOrFetchUser = async (sub: string, authHeader: string) => {
        let user = await this.userService.getUserBySub(sub);
        if (!user) {
            const { data: profile } = await axios.get(process.env.USERINFO_ENDPOINT!, {
                headers: { Authorization: authHeader }
            });
            user = await this.userService.createUser({
                sub: profile.sub,
                givenName: profile.given_name,
                familyName: profile.family_name,
                profilePicture: profile.picture
            });
        }
        return user;
    };
}