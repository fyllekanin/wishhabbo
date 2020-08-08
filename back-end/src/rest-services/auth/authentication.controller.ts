import { Controller, Get, Middleware, Post } from '@overnightjs/core';
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
import {
    AdminPermissions,
    AuthUserView,
    StaffPermissions
} from '../../rest-service-views/respond-views/user/auth-user.view';
import { InitialView } from '../../rest-service-views/respond-views/user/initial.view';
import { GroupRepository } from '../../persistance/repositories/group.repository';
import { Permissions } from '../../constants/permissions.constant';

@Controller('api/auth')
export class AuthenticationController {

    @Get('initial')
    private async getInitial (req: Request, res: Response): Promise<void> {
        const userRepository = new UserRepository();
        const tokenRepository = new TokenRepository();
        const builder = InitialView.newBuilder();

        const token = await tokenRepository.getTokenFromRequest(req);
        const user = tokenRepository.isAccessTokenAlive(token) || tokenRepository.isRefreshTokenAlive(token) ?
            await userRepository.getUserById(token.userId) : null;

        if (user) {
            builder.withAuthUser(AuthUserView.newBuilder()
                .withUserId(user.userId)
                .withUsername(user.username)
                .withHabbo(user.habbo)
                .withAccessToken(token.access)
                .withRefreshToken(token.refresh)
                .build());
        }

        res.status(OK).json(builder.build());
    }

    @Post('login')
    private async doLogin (req: Request, res: Response): Promise<void> {
        const userRepository = new UserRepository();
        const tokenRepository = new TokenRepository();
        const groupRepository = new GroupRepository();

        const payload = LoginPayload.of(req);
        const payloadErrors = await ValidationValidators.validatePayload(payload);
        if (payloadErrors.length > 0) {
            res.status(BAD_REQUEST).json(payloadErrors);
            return;
        }

        const user = await userRepository.getUserWithUsername(payload.getUsername());
        const isCorrectPassword = user && await HasherUtility.compare(payload.getPassword(), user.password);
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

        const token = await tokenRepository.getToken(user);
        res.status(OK).json(AuthUserView.newBuilder()
            .withUserId(user.userId)
            .withUsername(user.username)
            .withHabbo(user.habbo)
            .withAccessToken(token.access)
            .withRefreshToken(token.refresh)
            .withStaffPermissions(await this.getStaffPermissions(user, groupRepository))
            .withAdminPermissions(await this.getAdminPermissions(user, groupRepository))
            .build());
    }

    private async getStaffPermissions (user: UserEntity, groupRepository: GroupRepository): Promise<StaffPermissions> {
        return {
            canBookRadio: await groupRepository.haveStaffPermission(user.userId, Permissions.STAFF.CAN_BOOK_RADIO),
            canBookEvents: await groupRepository.haveStaffPermission(user.userId, Permissions.STAFF.CAN_BOOK_EVENTS),
            canUnbookOthersRadio: await groupRepository.haveStaffPermission(user.userId, Permissions.STAFF.CAN_UNBOOK_OTHERS_RADIO),
            canUnbookOthersEvents: await groupRepository.haveStaffPermission(user.userId, Permissions.STAFF.CAN_UNBOOK_OTHERS_EVENTS),
            canWriteArticles: await groupRepository.haveStaffPermission(user.userId, Permissions.STAFF.CAN_WRITE_ARTICLES),
            canApproveArticles: await groupRepository.haveStaffPermission(user.userId, Permissions.STAFF.CAN_APPROVE_ARTICLES),
            canKickDjOffAir: await groupRepository.haveStaffPermission(user.userId, Permissions.STAFF.CAN_KICK_DJ_OFF_AIR)
        };
    }

    private async getAdminPermissions (user: UserEntity, groupRepository: GroupRepository): Promise<AdminPermissions> {
        return {
            canManageGroups: await groupRepository.haveAdminPermission(user.userId, Permissions.ADMIN.CAN_MANAGE_GROUPS),
            canManageUserBasics: await groupRepository.haveAdminPermission(user.userId, Permissions.ADMIN.CAN_MANAGE_USER_BASICS),
            canManageUserGroups: await groupRepository.haveAdminPermission(user.userId, Permissions.ADMIN.CAN_MANAGE_USER_GROUPS),
            canManageWebsiteSettings: await groupRepository.haveAdminPermission(user.userId, Permissions.ADMIN.CAN_MANAGE_WEBSITE_SETTINGS),
            canSeeLogs: await groupRepository.haveAdminPermission(user.userId, Permissions.ADMIN.CAN_SEE_LOGS),
            canUploadResources: await groupRepository.haveAdminPermission(user.userId, Permissions.ADMIN.CAN_UPLOAD_RESOURCES)
        };
    }

    @Post('logout')
    @Middleware([ AUTHORIZATION_MIDDLEWARE ])
    private async doLogout (req: Request, res: Response): Promise<void> {
        const tokenRepository = new TokenRepository();
        const token = await tokenRepository.getTokenFromRequest(req);
        if (!token) {
            res.status(OK).json();
            return;
        }
        await tokenRepository.delete(token);
        res.status(OK).json();
    }

    @Post('token-refresh')
    private async doTokenRefresh (req: Request, res: Response): Promise<void> {
        const userRepository = new UserRepository();
        const tokenRepository = new TokenRepository();
        const entity = await tokenRepository.getTokenWithAccessAndRefreshToken(req);
        if (!entity) {
            res.status(401).json({ isTokenExisting: false });
            return;
        }
        if (!tokenRepository.isRefreshTokenAlive(entity)) {
            res.status(401).json(ValidationError.newBuilder()
                .withCode(ErrorCodes.INVALID_REFRESH_TOKEN.code)
                .withField('refreshToken')
                .withMessage(ErrorCodes.INVALID_REFRESH_TOKEN.description)
                .build());
            return;
        }

        const user = await userRepository.getUserById(entity.userId);
        const token = await tokenRepository.getToken(user);
        res.status(OK).json(AuthUserView.newBuilder()
            .withUserId(user.userId)
            .withUsername(user.username)
            .withHabbo(user.habbo)
            .withAccessToken(token.access)
            .withRefreshToken(token.refresh)
            .build());
    }

    @Post('register')
    private async doRegister (req: Request, res: Response): Promise<void> {
        const userRepository = new UserRepository();
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
        await userRepository.save(user).catch(reason => {
            status = INTERNAL_SERVER_ERROR;
            response = reason;
        });

        res.status(status).json(response);
    }
}
