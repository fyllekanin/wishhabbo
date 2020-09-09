import { IPayload } from '../../payloads/payload.interface';
import { InternalRequest } from '../../../utilities/internal.request';

export interface UserGroupsViewGroup {
    name: string;
    groupId: number;
    isSelected: boolean;
}

export class UserGroupsView implements IPayload {
    private readonly username: string;
    private readonly userId: number;
    private readonly groups: Array<UserGroupsViewGroup>;
    private readonly displayGroupId: number;

    constructor (builder: Builder) {
        this.username = builder.username;
        this.userId = builder.userId;
        this.groups = [ ...builder.groups ];
        this.displayGroupId = builder.displayGroupId;
    }

    getUsername (): string {
        return this.username;
    }

    getUserId (): number {
        return this.userId;
    }

    getGroups (): Array<{ name: string, groupId: number }> {
        return [ ...this.groups ];
    }

    getSelectedGroupIds (): Array<number> {
        return this.groups.filter(group => group.isSelected).map(group => group.groupId);
    }

    getDisplayGroupId (): number {
        return this.displayGroupId;
    }

    static newBuilder (): Builder {
        return new Builder();
    }

    static of (req: InternalRequest): UserGroupsView {
        return UserGroupsView.newBuilder()
            .withUserId(req.body.userId)
            .withGroups(req.body.groups)
            .withDisplayGroupId(req.body.displayGroupId)
            .build();
    }
}

class Builder {
    username: string;
    userId: number;
    groups: Array<UserGroupsViewGroup>;
    displayGroupId: number;

    withUsername (username: string): Builder {
        this.username = username;
        return this;
    }

    withUserId (userId: number): Builder {
        this.userId = userId;
        return this;
    }

    withGroups (groups: Array<UserGroupsViewGroup>): Builder {
        this.groups = groups;
        return this;
    }

    withDisplayGroupId (displayGroupId: number): Builder {
        this.displayGroupId = displayGroupId;
        return this;
    }

    build (): UserGroupsView {
        return new UserGroupsView(this);
    }
}
