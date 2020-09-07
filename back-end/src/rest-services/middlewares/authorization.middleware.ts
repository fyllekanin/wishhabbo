import { NextFunction, Response } from 'express';
import { InternalRequest } from '../../utilities/internal.request';
import { UNAUTHORIZED } from 'http-status-codes';

export const AUTHORIZATION_MIDDLEWARE = async (req: InternalRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.tokenEntity) {
        res.status(UNAUTHORIZED).json({
            isTokenExisting: false
        });
        return;
    }
    if (!req.serviceConfig.tokenRepository.isAccessTokenAlive(req.user.tokenEntity)) {
        res.status(UNAUTHORIZED).json({
            isTokenExisting: true
        });
        return;
    }
    next();
};
