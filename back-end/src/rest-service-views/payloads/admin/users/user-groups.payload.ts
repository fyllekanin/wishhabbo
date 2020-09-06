import { IPayload } from '../../payload.interface';
import { InternalRequest } from '../../../../utilities/internal.request';

export class UserGroupsPayload implements IPayload {
    private readonly groupIds: Array<number>;
    private readonly displayGroupId: number;

    constructor (
        groupIds: Array<number>,
        displayGroupId: number
    ) {
        this.groupIds = groupIds;
        this.displayGroupId = displayGroupId;
    }

    getGroupIds (): Array<number> {
        return this.groupIds;
    }

    getDisplayGroupId (): number {
        return this.displayGroupId;
    }

    static of (req: InternalRequest): UserGroupsPayload {
        return new UserGroupsPayload(
            req.body.groupIds,
            req.body.displayGroupId
        );
    }
}
