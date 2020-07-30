import { NextFunction, Request, Response } from 'express';
import { TokenRepository } from '../../persistance/repositories/user/token.repository';
import { UNAUTHORIZED } from 'http-status-codes';

export const AUTHORIZATION_MIDDLEWARE = async (req: Request, res: Response, next: NextFunction) => {
    const tokenRepository = new TokenRepository();
    const entity = await tokenRepository.getTokenFromRequest(req);

    if (!entity) {
        res.status(UNAUTHORIZED).json({
            isTokenExisting: false
        });
        return;
    }
    if (!tokenRepository.isAccessTokenAlive(entity)) {
        res.status(UNAUTHORIZED).json({
            isTokenExisting: true
        });
        return;
    }
    next();
};
