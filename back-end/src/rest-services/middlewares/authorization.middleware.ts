import { NextFunction, Response } from 'express';
import { UNAUTHORIZED } from 'http-status-codes';
import { InternalRequest } from '../../utilities/internal.request';

export const AUTHORIZATION_MIDDLEWARE = async (req: InternalRequest, res: Response, next: NextFunction) => {
    const entity = await req.serviceConfig.tokenRepository.getTokenFromRequest(req);

    if (!entity) {
        res.status(UNAUTHORIZED).json({
            isTokenExisting: false
        });
        return;
    }
    if (!req.serviceConfig.tokenRepository.isAccessTokenAlive(entity)) {
        res.status(UNAUTHORIZED).json({
            isTokenExisting: true
        });
        return;
    }
    next();
};
