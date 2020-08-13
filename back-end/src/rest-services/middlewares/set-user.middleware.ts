import { NextFunction, Response } from 'express';
import { TokenRepository } from '../../persistance/repositories/user/token.repository';
import { InternalRequest } from '../../utilities/internal.request';
import { UserRepository } from '../../persistance/repositories/user/user.repository';

export const SET_USER_MIDDLEWARE = async (req: InternalRequest, res: Response, next: NextFunction) => {
    const tokenRepository = new TokenRepository();
    const userRepository = new UserRepository();
    const entity = await tokenRepository.getTokenFromRequest(req);

    if (!entity) {
        next();
        return;
    }
    if (!tokenRepository.isAccessTokenAlive(entity)) {
        next();
        return;
    }
    req.user = await userRepository.getUserById(entity.userId);
    next();
};
