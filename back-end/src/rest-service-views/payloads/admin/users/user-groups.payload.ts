import { IPayload } from '../../payload.interface';
import { InternalRequest } from '../../../../utilities/internal.request';

export class UserGroupsPayload implements IPayload {
    private readonly userId: number;
    private readonly groupIds: Array<number>;
    private readonly displayGroupId: number;

    constructor (
        userId: number,
        groupIds: Array<number>,
        displayGroupId: number
    ) {
        this.userId = userId;
        this.groupIds = groupIds;
        this.displayGroupId = displayGroupId;
    }

    getUserId (): number {
        return this.userId;
    }

    getGroupIds (): Array<number> {
        return this.groupIds;
    }

    getDisplayGroupId (): number {
        return this.displayGroupId;
    }

    static of (req: InternalRequest): UserGroupsPayload {
        return new UserGroupsPayload(
            req.body.userId,
            req.body.groupIds,
            req.body.displayGroupId
        );
    }
}
