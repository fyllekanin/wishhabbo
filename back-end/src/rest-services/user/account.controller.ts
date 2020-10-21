import { Controller, Middleware, Put } from '@overnightjs/core';
import { InternalRequest } from '../../utilities/internal.request';
import { Response } from 'express';
import { ChangePasswordPayload } from '../../rest-service-views/payloads/user/change-password.payload';
import { ValidationValidators } from '../../validation/validation.validators';
import { BAD_REQUEST, OK } from 'http-status-codes';
import { AUTHORIZATION_MIDDLEWARE } from '../middlewares/authorization.middleware';
import { HasherUtility } from '../../utilities/hasher.utility';
import { RequestUtility } from '../../utilities/request.utility';
import { Logger } from '../../logging/log.logger';
import { LogTypes } from '../../logging/log.types';
import { ChangeHabboPayload } from '../../rest-service-views/payloads/user/change-habbo.payload';

@Controller('api/user/account')
export class AccountController {

    @Put('change-habbo')
    async updateHabbo (req: InternalRequest, res: Response): Promise<void> {
        const payload = ChangeHabboPayload.of(req);
        const errors = await ValidationValidators.validatePayload(payload, req.serviceConfig, req.user);
        if (errors.length > 0) {
            res.status(BAD_REQUEST).json(errors);
            return;
        }

        const user = await req.serviceConfig.userRepository.getUserById(req.user.userId);
        const oldHabbo = user.habbo;
        user.habbo = payload.getHabbo();
        await req.serviceConfig.userRepository.save(user);

        await Logger.createUserLog(req, {
            id: LogTypes.CHANGED_HABBO,
            contentId: req.user.userId,
            userId: req.user.userId,
            beforeChange: JSON.stringify({ habbo: oldHabbo }),
            afterChange: JSON.stringify({ habbo: payload.getHabbo() })
        });
        res.status(OK).json();
    }

    @Put('change-password')
    @Middleware([AUTHORIZATION_MIDDLEWARE])
    async updatePassword (req: InternalRequest, res: Response): Promise<void> {
        const payload = ChangePasswordPayload.of(req);
        const errors = await ValidationValidators.validatePayload(payload, req.serviceConfig, req.user);
        if (errors.length > 0) {
            res.status(BAD_REQUEST).json(errors);
            return;
        }

        const user = await req.serviceConfig.userRepository.getUserById(req.user.userId);
        user.password = await HasherUtility.hash(payload.getPassword());
        await req.serviceConfig.userRepository.save(user);

        if (payload.getShouldDeleteTokens()) {
            const token = RequestUtility.getAccessToken(req);
            await req.serviceConfig.tokenRepository.deleteTokensForUserIdExcept(req.user.userId, token);
        }

        await Logger.createUserLog(req, {
            id: LogTypes.CHANGED_PASSWORD,
            contentId: req.user.userId,
            userId: req.user.userId,
            beforeChange: null,
            afterChange: null
        });
        res.status(OK).json();
    }
}
