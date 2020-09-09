import { SettingKey } from '../setting.entity';

export interface StaffListEntry {
    groupId: number;
    displayOrder: number;
}

export class StaffListModel {
    private readonly entries: Array<StaffListEntry>;

    constructor (builder: Builder) {
        this.entries = [ ...builder.entries ];
    }

    getEntries (): Array<StaffListEntry> {
        return [ ...this.entries ];
    }

    static getKey (): SettingKey {
        return SettingKey.STAFF_LIST;
    }

    static newBuilder (): Builder {
        return new Builder();
    }
}

class Builder {
    entries: Array<StaffListEntry> = [];

    constructor (entry?: StaffListModel) {
        if (!entry) {
            return;
        }
        this.entries = entry.getEntries();
    }

    withEntries (entries: Array<StaffListEntry>): Builder {
        this.entries = entries;
        return this;
    }

    build (): StaffListModel {
        return new StaffListModel(this);
    }
}
