import {NextFunction, Response} from "express";
import {inject, injectable} from "inversify";
import {UserService} from "../services/user.service";
import {RequestWithUser} from "../shared/models";

@injectable()
export class Authenticator {

    constructor(@inject('UserService') private userService: UserService) { }

    getUserFromSub = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const sub = req.user.sub;
            req.user = {
                id: '5bcdc1482e37332310bedb15',
                sub,
                givenName: 'John',
                familyName: 'Smith',
                profilePicture: 'kek',
                registeredAt: 123
            };
            next();
        } catch (e) {
            res.status(401).json({ error: e.message });
        }
    }
}