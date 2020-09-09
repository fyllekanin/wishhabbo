import { ValidationError } from '../../validation.error';
import { IPayload } from '../../../rest-service-views/payloads/payload.interface';
import { InternalUser, ServiceConfig } from '../../../utilities/internal.request';
import { PayloadValidator } from '../payload-validator.interface';
import { StaffListView } from '../../../rest-service-views/two-way/admin/staff-list.view';
import { GroupRepository } from '../../../persistance/repositories/group.repository';
import { ErrorCodes } from '../../error.codes';

export class StaffListPayloadValidator implements PayloadValidator<StaffListView> {

    async validate (payload: IPayload, serviceConfig: ServiceConfig, user: InternalUser): Promise<Array<ValidationError>> {
        const staffListPayload = payload as StaffListView;
        const errors: Array<ValidationError> = [];

        await this.validateValidGroups(staffListPayload, serviceConfig.groupRepository, errors);

        return errors;
    }

    isValidEntity (payload: IPayload): boolean {
        return payload instanceof StaffListView;
    }

    private async validateValidGroups (payload: StaffListView, groupRepository: GroupRepository,
                                       errors: Array<ValidationError>): Promise<void> {
        for (const group of payload.getSelectedGroups()) {
            const item = await groupRepository.getGroupById(group.groupId);
            if (!item) {
                errors.push(ValidationError.newBuilder()
                    .withCode(ErrorCodes.GROUP_DO_NOT_EXIST.code)
                    .withField('groupId')
                    .withMessage(ErrorCodes.GROUP_DO_NOT_EXIST.description)
                    .build());
                break;
            }
        }
    }
}
