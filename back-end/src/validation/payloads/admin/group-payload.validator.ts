import { ValidationError } from '../../validation.error';
import { IPayload } from '../../../rest-service-views/payloads/payload.interface';
import { InternalUser, ServiceConfig } from '../../../utilities/internal.request';
import { PayloadValidator } from '../payload-validator.interface';
import { GroupView } from '../../../rest-service-views/two-way/admin/group.view';
import { GroupRepository } from '../../../persistance/repositories/group/group.repository';
import { ErrorCodes } from '../../error.codes';
import { StringKeyValue } from '../../../utilities/object.interface';
import { PermissionHelper } from '../../../helpers/permission.helper';
import { Permissions } from '../../../constants/permissions.constant';
import { UserGroupOrchestrator } from '../../../persistance/repositories/group/user-group.orchestrator';

export class GroupPayloadValidator implements PayloadValidator<GroupView> {
    private static readonly VALID_HEX = /#([a-zA-Z0-9]{6}|[a-zA-Z0-9]{3})/;

    async validate (payload: IPayload, serviceConfig: ServiceConfig, user: InternalUser): Promise<Array<ValidationError>> {
        const groupView = payload as GroupView;
        const errors: Array<ValidationError> = [];

        await this.validateUniqueName(groupView, serviceConfig.groupRepository, errors);
        await this.validateUniqueDisplayName(groupView, serviceConfig.groupRepository, errors);
        await this.validateImmunity(groupView, serviceConfig, errors, user);
        await this.validateNameColor(groupView, errors);
        await this.validateAdminPermissions(groupView, serviceConfig, errors, user);
        await this.validateStaffPermissions(groupView, serviceConfig, errors, user);

        return errors;
    }

    isValidEntity (payload: IPayload): boolean {
        return payload instanceof GroupView;
    }

    private async validateUniqueName (groupView: GroupView, groupRepository: GroupRepository,
                                      errors: Array<ValidationError>): Promise<void> {
        const items = await groupRepository.getGroups();
        if (!groupView.getName() ||
            items.some(item => item.name.toLowerCase() === groupView.getName().toLowerCase() && item.groupId !== groupView.getGroupId())) {
            errors.push(ValidationError.newBuilder()
                .withField('name')
                .withMessage(ErrorCodes.GROUP_NAME_EXISTS.description)
                .withCode(ErrorCodes.GROUP_NAME_EXISTS.code)
                .build());
        }
    }

    private async validateUniqueDisplayName (groupView: GroupView, groupRepository: GroupRepository,
                                             errors: Array<ValidationError>): Promise<void> {
        const items = await groupRepository.getGroups();
        if (!groupView.getName() ||
            items.some(item => item.displayName.toLowerCase() === groupView.getDisplayName().toLowerCase() &&
                item.groupId !== groupView.getGroupId())) {
            errors.push(ValidationError.newBuilder()
                .withField('displayName')
                .withMessage(ErrorCodes.GROUP_DISPLAY_NAME_EXISTS.description)
                .withCode(ErrorCodes.GROUP_DISPLAY_NAME_EXISTS.code)
                .build());
        }
    }

    private async validateImmunity (groupView: GroupView, serviceConfig: ServiceConfig,
                                    errors: Array<ValidationError>, user: InternalUser): Promise<void> {
        const immunity = await UserGroupOrchestrator.getImmunityByUserId(serviceConfig, user.userId);
        if (immunity <= groupView.getImmunity()) {
            errors.push(ValidationError.newBuilder()
                .withField('immunity')
                .withMessage(ErrorCodes.IMMUNITY.description)
                .withCode(ErrorCodes.IMMUNITY.code)
                .build());
        }
    }

    private validateNameColor (groupView: GroupView, errors: Array<ValidationError>): void {
        if (groupView.getNameColor() && !groupView.getNameColor().match(GroupPayloadValidator.VALID_HEX)) {
            errors.push(ValidationError.newBuilder()
                .withField('immunity')
                .withMessage(ErrorCodes.INVALID_HEX_COLOR.description)
                .withCode(ErrorCodes.INVALID_HEX_COLOR.code)
                .build());
        }
    }

    private async validateAdminPermissions (groupView: GroupView, serviceConfig: ServiceConfig,
                                            errors: Array<ValidationError>, user: InternalUser): Promise<void> {
        const existingGroup = await serviceConfig.groupRepository.getGroupById(groupView.getGroupId());
        const existingPerms = existingGroup ?
            <StringKeyValue<boolean>><unknown>PermissionHelper.getConvertedAdminPermissionsToUI(existingGroup)
            : {};

        let isInvalid = false;
        for (const key of Object.keys(groupView.getAdminPermissions())) {
            const perms = <StringKeyValue<boolean>><unknown>groupView.getAdminPermissions();
            const permission = Permissions.ADMIN[key];
            const value = perms[key];
            const havePermission = await UserGroupOrchestrator.doUserHaveAdminPermission(serviceConfig, user.userId, permission);
            if (value && !existingPerms[key] && !havePermission) {
                isInvalid = true;
                break;
            } else if (!value && existingPerms[key] && !havePermission) {
                isInvalid = true;
                break;
            }
        }

        if (isInvalid) {
            errors.push(ValidationError.newBuilder()
                .withField('adminPermissions')
                .withMessage(ErrorCodes.CAN_NOT_MODIFY_PERMISSION.description)
                .withCode(ErrorCodes.CAN_NOT_MODIFY_PERMISSION.code)
                .build());
        }
    }

    private async validateStaffPermissions (groupView: GroupView, serviceConfig: ServiceConfig,
                                            errors: Array<ValidationError>, user: InternalUser): Promise<void> {
        const existingGroup = await serviceConfig.groupRepository.getGroupById(groupView.getGroupId());
        const existingPerms = existingGroup ?
            <StringKeyValue<boolean>><unknown>PermissionHelper.getConvertedStaffPermissionsToUI(existingGroup)
            : {};

        let isInvalid = false;
        for (const key of Object.keys(groupView.getStaffPermissions())) {
            const perms = <StringKeyValue<boolean>><unknown>groupView.getStaffPermissions();
            const permission = Permissions.STAFF[key];
            const value = perms[key];
            const havePermission = await UserGroupOrchestrator.doUserHaveStaffPermission(serviceConfig, user.userId, permission);
            if (value && !existingPerms[key] && !havePermission) {
                isInvalid = true;
                break;
            } else if (!value && existingPerms[key] && !havePermission) {
                isInvalid = true;
                break;
            }
        }

        if (isInvalid) {
            errors.push(ValidationError.newBuilder()
                .withField('staffPermissions')
                .withMessage(ErrorCodes.CAN_NOT_MODIFY_PERMISSION.description)
                .withCode(ErrorCodes.CAN_NOT_MODIFY_PERMISSION.code)
                .build());
        }
    }
}
