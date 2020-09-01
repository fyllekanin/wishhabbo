import { ValidationError } from '../../validation.error';
import { IPayload } from '../../../rest-service-views/payloads/payload.interface';
import { ServiceConfig } from '../../../utilities/internal.request';
import { PayloadValidator } from '../payload-validator.interface';
import { UserEntity } from '../../../persistance/entities/user/user.entity';
import { GroupView } from '../../../rest-service-views/group.view';
import { GroupRepository } from '../../../persistance/repositories/group.repository';

export class GroupPayloadValidator implements PayloadValidator<GroupView> {

    async validate (payload: IPayload, serviceConfig: ServiceConfig, user: UserEntity): Promise<Array<ValidationError>> {
        const groupView = payload as GroupView;
        const errors: Array<ValidationError> = [];

        return errors;
    }

    isValidEntity (payload: IPayload): boolean {
        return payload instanceof GroupView;
    }

    private async validateUniqueName (groupView: GroupView, groupRepository: GroupRepository,
                                      errors: Array<ValidationError>): Promise<void> {

    }

    private async validateUniqueDisplayName (groupView: GroupView, groupRepository: GroupRepository,
                                             errors: Array<ValidationError>): Promise<void> {

    }

    private async validateImmunity (groupView: GroupView, groupRepository: GroupRepository,
                                    errors: Array<ValidationError>): Promise<void> {

    }

    private validateNameColor (groupView: GroupView, errors: Array<ValidationError>): void {

    }

    private async validateAdminPermissions (groupView: GroupView, groupRepository: GroupRepository,
                                            errors: Array<ValidationError>): Promise<void> {

    }

    private async validateStaffPermissions (groupView: GroupView, groupRepository: GroupRepository,
                                            errors: Array<ValidationError>): Promise<void> {

    }
}
