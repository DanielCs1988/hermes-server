import * as jwt from "express-jwt";
import * as jwks from "jwks-rsa";

export const validateJwt = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: process.env.JWKS_URI!
    }),
    credentialsRequired: true,
    audience: process.env.JWT_AUDIENCE!,
    issuer: process.env.JWT_ISSUER,
    algorithms: ['RS256']
});