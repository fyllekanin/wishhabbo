import { Controller, Get, Post } from '@overnightjs/core';
import { Response } from 'express';
import { RegisterPayload } from '../../rest-service-views/payloads/auth/register.payload';
import { ValidationValidators } from '../../validation/validation.validators';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, OK } from 'http-status-codes';
import { UserEntity } from '../../persistance/entities/user/user.entity';
import { HasherUtility } from '../../utilities/hasher.utility';
import { LoginPayload } from '../../rest-service-views/payloads/auth/login.payload';
import { ValidationError } from '../../validation/validation.error';
import { ErrorCodes } from '../../validation/error.codes';
import {
    AdminPermissions,
    AuthUserView,
    StaffPermissions
} from '../../rest-service-views/respond-views/user/auth-user.view';
import { InitialView } from '../../rest-service-views/respond-views/user/initial.view';
import { GroupRepository } from '../../persistance/repositories/group.repository';
import { Permissions } from '../../constants/permissions.constant';
import { InternalRequest } from '../../utilities/internal.request';

@Controller('api/auth')
export class AuthenticationController {

    @Get('initial')
    private async getInitial (req: InternalRequest, res: Response): Promise<void> {
        const builder = InitialView.newBuilder();

        const token = await req.serviceConfig.tokenRepository.getTokenFromRequest(req);
        const user = req.serviceConfig.tokenRepository.isAccessTokenAlive(token) ||
        req.serviceConfig.tokenRepository.isRefreshTokenAlive(token) ?
            await req.serviceConfig.userRepository.getUserById(token.userId) : null;

        if (user) {
            builder.withAuthUser(AuthUserView.newBuilder()
                .withUserId(user.userId)
                .withUsername(user.username)
                .withHabbo(user.habbo)
                .withAccessToken(token.access)
                .withRefreshToken(token.refresh)
                .withStaffPermissions(await this.getStaffPermissions(user, req.serviceConfig.groupRepository))
                .withAdminPermissions(await this.getAdminPermissions(user, req.serviceConfig.groupRepository))
                .build());
            res.status(OK).json(builder.build());
        } else {
            res.status(OK).json();
        }
    }

    @Post('login')
    private async doLogin (req: InternalRequest, res: Response): Promise<void> {
        const payload = LoginPayload.of(req.fields);
        const payloadErrors = await ValidationValidators.validatePayload(payload, req.serviceConfig, req);
        if (payloadErrors.length > 0) {
            res.status(BAD_REQUEST).json(payloadErrors);
            return;
        }

        const user = await req.serviceConfig.userRepository.getUserWithUsername(payload.getUsername());
        const isCorrectPassword = user && await HasherUtility.compare(payload.getPassword(), user.password);
        if (!isCorrectPassword) {
            res.status(BAD_REQUEST).json([
                ValidationError.newBuilder()
                    .withCode(ErrorCodes.FAILED_LOGIN.code)
                    .withMessage(ErrorCodes.FAILED_LOGIN.description)
                    .withField(null)
                    .build()
            ]);
            return;
        }

        const token = await req.serviceConfig.tokenRepository.getToken(user);
        res.status(OK).json(AuthUserView.newBuilder()
            .withUserId(user.userId)
            .withUsername(user.username)
            .withHabbo(user.habbo)
            .withAccessToken(token.access)
            .withRefreshToken(token.refresh)
            .withStaffPermissions(await this.getStaffPermissions(user, req.serviceConfig.groupRepository))
            .withAdminPermissions(await this.getAdminPermissions(user, req.serviceConfig.groupRepository))
            .build());
    }

    @Post('logout')
    private async doLogout (req: InternalRequest, res: Response): Promise<void> {
        const token = await req.serviceConfig.tokenRepository.getTokenFromRequest(req);
        if (!token) {
            res.status(OK).json();
            return;
        }
        await req.serviceConfig.tokenRepository.delete(token);
        res.status(OK).json();
    }

    @Post('token-refresh')
    private async doTokenRefresh (req: InternalRequest, res: Response): Promise<void> {
        const entity = await req.serviceConfig.tokenRepository.getTokenWithAccessAndRefreshToken(req);
        if (!entity) {
            res.status(401).json({ isTokenExisting: false });
            return;
        }
        if (!req.serviceConfig.tokenRepository.isRefreshTokenAlive(entity)) {
            res.status(401).json(ValidationError.newBuilder()
                .withCode(ErrorCodes.INVALID_REFRESH_TOKEN.code)
                .withField('refreshToken')
                .withMessage(ErrorCodes.INVALID_REFRESH_TOKEN.description)
                .build());
            return;
        }

        const user = await req.serviceConfig.userRepository.getUserById(entity.userId);
        const token = await req.serviceConfig.tokenRepository.getToken(user);
        res.status(OK).json(AuthUserView.newBuilder()
            .withUserId(user.userId)
            .withUsername(user.username)
            .withHabbo(user.habbo)
            .withAccessToken(token.access)
            .withRefreshToken(token.refresh)
            .build());
    }

    @Post('register')
    private async doRegister (req: InternalRequest, res: Response): Promise<void> {
        const payload = RegisterPayload.of(req.fields);
        const payloadErrors = await ValidationValidators.validatePayload(payload, req.serviceConfig, req);
        if (payloadErrors.length > 0) {
            res.status(BAD_REQUEST).json(payloadErrors);
            return;
        }

        const user = UserEntity.newBuilder()
            .withUsername(payload.getUsername())
            .withPassword(await HasherUtility.hash(payload.getPassword()))
            .withHabbo(payload.getHabbo())
            .build();
        const entityErrors = await ValidationValidators.validateEntity(user, req.serviceConfig, req);
        if (entityErrors.length > 0) {
            res.status(BAD_REQUEST).json(entityErrors);
            return;
        }

        let status = OK;
        let response = '';
        await req.serviceConfig.userRepository.save(user).catch(reason => {
            status = INTERNAL_SERVER_ERROR;
            response = reason;
        });

        res.status(status).json(response);
    }

    private async getStaffPermissions (user: UserEntity, groupRepository: GroupRepository): Promise<StaffPermissions> {
        return {
            canBookRadio: await groupRepository.haveStaffPermission(user.userId, Permissions.STAFF.CAN_BOOK_RADIO),
            canBookEvents: await groupRepository.haveStaffPermission(user.userId, Permissions.STAFF.CAN_BOOK_EVENTS),
            canUnbookOthersRadio: await groupRepository.haveStaffPermission(user.userId, Permissions.STAFF.CAN_UNBOOK_OTHERS_RADIO),
            canUnbookOthersEvents: await groupRepository.haveStaffPermission(user.userId, Permissions.STAFF.CAN_UNBOOK_OTHERS_EVENTS),
            canWriteArticles: await groupRepository.haveStaffPermission(user.userId, Permissions.STAFF.CAN_WRITE_ARTICLES),
            canApproveArticles: await groupRepository.haveStaffPermission(user.userId, Permissions.STAFF.CAN_MANAGE_ARTICLES),
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
}
