import * as cors from "cors";
import {validateJwt} from "./jwt-validator";
import {json} from "body-parser";
import {handleErrors} from "./error-handler";
import {Application} from "express";
import {interfaces} from "inversify";
import {Authenticator} from "./authenticator";

const applyMiddlewares = (container: interfaces.Container) => (app: Application) => {
    app.use(cors());
    app.use(validateJwt);
    app.use(container.get(Authenticator).getUserFromRequest);
    app.use(json());
    app.use(handleErrors);
};

export default applyMiddlewares;