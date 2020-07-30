import { Controller, Middleware, Post } from '@overnightjs/core';
import { Request, Response } from 'express';
import { RegisterPayload } from '../../rest-service-views/payloads/auth/register.payload';
import { ValidationValidators } from '../../validation/validation.validators';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from 'http-status-codes';
import { UserRepository } from '../../persistance/repositories/user/user.repository';
import { TokenRepository } from '../../persistance/repositories/user/token.repository';
import { UserEntity } from '../../persistance/entities/user/user.entity';
import { HasherUtility } from '../../utilities/hasher.utility';
import { LoginPayload } from '../../rest-service-views/payloads/auth/login.payload';
import { ValidationError } from '../../validation/validation.error';
import { ErrorCodes } from '../../validation/error.codes';
import { AUTHORIZATION_MIDDLEWARE } from '../middlewares/authorization.middleware';

@Controller('api/auth')
export class AuthenticationController {
    private readonly userRepository: UserRepository;
    private readonly tokenRepository: TokenRepository;

    constructor ();
    constructor (userRepository?: UserRepository, tokenRepository?: TokenRepository) {
        this.userRepository = userRepository || new UserRepository();
        this.tokenRepository = tokenRepository || new TokenRepository();
    }

    @Post('login')
    private async doLogin (req: Request, res: Response): Promise<void> {
        const payload = LoginPayload.of(req);
        const payloadErrors = await ValidationValidators.validatePayload(payload);
        if (payloadErrors.length > 0) {
            res.status(BAD_REQUEST).json(payloadErrors);
            return;
        }

        const user = await this.userRepository.getUserWithUsername(payload.getUsername());
        const isCorrectPassword = await HasherUtility.compare(payload.getPassword(), user.password);
        if (!isCorrectPassword) {
            res.status(NOT_FOUND).json([
                ValidationError.newBuilder()
                    .withCode(ErrorCodes.FAILED_LOGIN.code)
                    .withMessage(ErrorCodes.FAILED_LOGIN.description)
                    .withField(null)
                    .build()
            ]);
            return;
        }

        res.status(OK).json(await this.tokenRepository.getToken(user, req.ip));
    }

    @Post('logout')
    @Middleware([ AUTHORIZATION_MIDDLEWARE ])
    private async doLogout (req: Request, res: Response): Promise<void> {
        const token = await this.tokenRepository.getTokenFromRequest(req);
        if (!token) {
            res.status(OK).json();
            return;
        }
        await this.tokenRepository.delete(token);
        res.status(OK).json();
    }

    @Post('token-refresh')
    private async doTokenRefresh (req: Request, res: Response): Promise<void> {
        const refreshToken = req.body.refreshToken;
        const entity = await this.tokenRepository.getTokenWithIPAndRefreshToken(req.ip, refreshToken);
        if (!entity) {
            res.status(401).json({ isTokenExisting: false });
            return;
        }
        if (!this.tokenRepository.isRefreshTokenAlive(entity)) {
            res.status(401).json(ValidationError.newBuilder()
                .withCode(ErrorCodes.INVALID_REFRESH_TOKEN.code)
                .withField('refreshToken')
                .withMessage(ErrorCodes.INVALID_REFRESH_TOKEN.description)
                .build());
            return;
        }

        const user = await this.userRepository.getUserById(entity.userId);
        const token = await this.tokenRepository.getToken(user, req.ip);
        res.status(OK).json(token);
    }

    @Post('register')
    private async doRegister (req: Request, res: Response): Promise<void> {
        const payload = RegisterPayload.of(req);
        const payloadErrors = await ValidationValidators.validatePayload(payload);
        if (payloadErrors.length > 0) {
            res.status(BAD_REQUEST).json(payloadErrors);
            return;
        }

        const user = UserEntity.newBuilder()
            .withUsername(payload.getUsername())
            .withPassword(await HasherUtility.hash(payload.getPassword()))
            .withHabbo(payload.getHabbo())
            .build();
        const entityErrors = await ValidationValidators.validateEntity(user);
        if (entityErrors.length > 0) {
            res.status(BAD_REQUEST).json(entityErrors);
            return;
        }

        let status = OK;
        let response = '';
        await this.userRepository.save(user).catch(reason => {
            status = INTERNAL_SERVER_ERROR;
            response = reason;
        });

        res.status(status).json(response);
    }
}
