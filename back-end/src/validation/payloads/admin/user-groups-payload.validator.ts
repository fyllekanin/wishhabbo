import { ValidationError } from '../../validation.error';
import { IPayload } from '../../../rest-service-views/payloads/payload.interface';
import { InternalUser, ServiceConfig } from '../../../utilities/internal.request';
import { PayloadValidator } from '../payload-validator.interface';
import { UserGroupsPayload } from '../../../rest-service-views/payloads/admin/users/user-groups.payload';
import { ErrorCodes } from '../../error.codes';

export class UserGroupsPayloadValidator implements PayloadValidator<UserGroupsPayload> {

    async validate (payload: IPayload, serviceConfig: ServiceConfig, user: InternalUser): Promise<Array<ValidationError>> {
        const userGroupsPayload = payload as UserGroupsPayload;
        const errors: Array<ValidationError> = [];

        await this.validateGroupsAdded(userGroupsPayload, serviceConfig, user, errors);
        await this.validateDisplayGroupId(userGroupsPayload, errors);

        return errors;
    }

    isValidEntity (payload: IPayload): boolean {
        return payload instanceof UserGroupsPayload;
    }

    private async validateGroupsAdded (payload: UserGroupsPayload, serviceConfig: ServiceConfig,
                                       user: InternalUser, errors: Array<ValidationError>): Promise<void> {
        const immunity = await serviceConfig.groupRepository.getUserIdImmunity(user.userId);
        for (const groupId of payload.getGroupIds()) {
            const group = await serviceConfig.groupRepository.getGroupById(groupId);
            if (group.immunity >= immunity) {
                errors.push(ValidationError.newBuilder()
                    .withCode(ErrorCodes.INVALID_GROUP_TO_ADD.code)
                    .withField('groupId')
                    .withMessage(ErrorCodes.INVALID_GROUP_TO_ADD.description)
                    .build());
                break;
            }
        }
    }

    private async validateDisplayGroupId (payload: UserGroupsPayload, errors: Array<ValidationError>): Promise<void> {
        if (payload.getDisplayGroupId() && payload.getGroupIds().every(groupId => groupId !== payload.getDisplayGroupId())) {
            errors.push(ValidationError.newBuilder()
                .withCode(ErrorCodes.INVALID_DISPLAY_GROUP.code)
                .withField('displayGroupId')
                .withMessage(ErrorCodes.INVALID_DISPLAY_GROUP.description)
                .build());
        }
    }
}
