import { Request, Response, NextFunction } from "express";

export const handleErrors = (err, req: Request, res: Response, next: NextFunction) => {
    console.log(`ERROR: ${err.message}`);
    res.status(err.status).send(err.message);
};