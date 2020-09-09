import { InternalRequest } from '../../../utilities/internal.request';
import { IPayload } from '../../payloads/payload.interface';

export interface StaffListViewEntry {
    groupId: number;
    name: string;
    displayOrder: number;
    nameColor: string;
    isSelected: boolean;
}

export class StaffListView implements IPayload {
    private readonly groups: Array<StaffListViewEntry>;

    constructor (builder: Builder) {
        this.groups = [ ...builder.groups ];
    }

    getSelectedGroups (): Array<StaffListViewEntry> {
        return this.groups.filter(group => group.isSelected);
    }

    static of (req: InternalRequest): StaffListView {
        return this.newBuilder()
            .withGroups(req.body.groups)
            .build();
    }

    static newBuilder (): Builder {
        return new Builder();
    }
}

class Builder {
    groups: Array<StaffListViewEntry>;

    withGroups (groups: Array<StaffListViewEntry>): Builder {
        this.groups = [ ...groups ];
        return this;
    }

    build (): StaffListView {
        return new StaffListView(this);
    }
}
